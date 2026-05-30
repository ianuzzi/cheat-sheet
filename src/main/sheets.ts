import { readdir, readFile } from 'node:fs/promises'
import { join, basename, extname } from 'node:path'
import matter from 'gray-matter'
import { is } from '@electron-toolkit/utils'

export type SheetMeta = {
  id: string
  title: string
  order: number
  icon?: string
}

type CachedSheet = {
  meta: SheetMeta
  markdown: string
}

let cache: Map<string, CachedSheet> | null = null

function sheetsDir(): string {
  if (is.dev) {
    return join(__dirname, '../../resources/sheets')
  }
  return join(process.resourcesPath, 'sheets')
}

async function loadAll(): Promise<Map<string, CachedSheet>> {
  if (cache) return cache
  const dir = sheetsDir()
  const entries = await readdir(dir)
  const next = new Map<string, CachedSheet>()
  for (const name of entries) {
    if (extname(name).toLowerCase() !== '.md') continue
    const id = basename(name, '.md')
    const raw = await readFile(join(dir, name), 'utf8')
    const { data, content } = matter(raw)
    const meta: SheetMeta = {
      id,
      title: typeof data.title === 'string' ? data.title : id,
      order: typeof data.order === 'number' ? data.order : 999,
      icon: typeof data.icon === 'string' ? data.icon : undefined
    }
    next.set(id, { meta, markdown: content })
  }
  cache = next
  return cache
}

export async function listSheets(): Promise<SheetMeta[]> {
  const all = await loadAll()
  return [...all.values()]
    .map((s) => s.meta)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
}

export async function getSheet(id: string): Promise<{ id: string; markdown: string } | null> {
  const all = await loadAll()
  const found = all.get(id)
  if (!found) return null
  return { id, markdown: found.markdown }
}
