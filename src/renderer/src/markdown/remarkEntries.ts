import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, RootContent } from 'mdast'

// We process `::: entries` container directives. Each line of the directive's
// content is `Keys  >>  Description`. Keys are tokenized on whitespace, and
// each token is split on `+` so a chord like `Ctrl+B c` becomes
// <kbd>Ctrl</kbd>+<kbd>B</kbd> <kbd>c</kbd>.

type HastText = { type: 'text'; value: string }
type HastElement = {
  type: 'element'
  tagName: string
  properties: Record<string, unknown>
  children: Array<HastElement | HastText>
}

const SPLIT_PRIMARY = /\s{2,}>>\s+/
const SPLIT_FALLBACK = /\s*>>\s*/

function hashId(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  return h.toString(36)
}

function textOf(node: { children?: Array<{ type: string; value?: string; children?: unknown }> } | undefined): string {
  if (!node || !node.children) return ''
  let out = ''
  for (const child of node.children as Array<{ type: string; value?: string; children?: unknown }>) {
    if (child.type === 'text' && typeof child.value === 'string') {
      out += child.value
    } else if (child.children) {
      out += textOf(child as { children: Array<{ type: string; value?: string; children?: unknown }> })
    }
  }
  return out
}

function tokenizeKeys(keysText: string): Array<HastElement | HastText> {
  const out: Array<HastElement | HastText> = []
  const chords = keysText.trim().split(/\s+/)
  chords.forEach((chord, ci) => {
    if (ci > 0) out.push({ type: 'text', value: ' ' })
    const parts = chord.split('+')
    parts.forEach((part, pi) => {
      if (pi > 0) out.push({ type: 'text', value: '+' })
      out.push({
        type: 'element',
        tagName: 'kbd',
        properties: { className: ['key'] },
        children: [{ type: 'text', value: part }]
      })
    })
  })
  return out
}

function buildEntryRow(line: string): HastElement | null {
  let parts = line.split(SPLIT_PRIMARY)
  if (parts.length < 2) parts = line.split(SPLIT_FALLBACK)
  if (parts.length < 2) return null
  const keysText = parts[0].trim()
  const description = parts.slice(1).join(' >> ').trim()
  if (!keysText || !description) return null

  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['entry-row'],
      id: `entry-${hashId(keysText + '' + description)}`,
      'data-keys': keysText,
      'data-desc': description
    },
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['entry-keys'] },
        children: tokenizeKeys(keysText)
      },
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['entry-desc'] },
        children: [{ type: 'text', value: description }]
      }
    ]
  }
}

function isEntriesDirective(node: RootContent): boolean {
  return (
    node.type === 'containerDirective' &&
    'name' in node &&
    (node as { name: string }).name === 'entries'
  )
}

export const remarkEntries: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, (node) => {
      if (!isEntriesDirective(node as RootContent)) return
      const directive = node as unknown as {
        children?: Array<{ type: string; children?: unknown }>
        data?: Record<string, unknown>
      }

      // Gather raw lines: each child block contributes its text, blocks separated by blank lines.
      const blocks: string[] = []
      for (const child of directive.children ?? []) {
        const t = textOf(child as { children: Array<{ type: string; value?: string }> })
        if (t) blocks.push(t)
      }
      const raw = blocks.join('\n')

      const rows: HastElement[] = []
      for (const line of raw.split(/\r?\n/)) {
        const trimmed = line.trim()
        if (!trimmed) continue
        const row = buildEntryRow(trimmed)
        if (row) rows.push(row)
      }

      directive.data = directive.data ?? {}
      ;(directive.data as Record<string, unknown>).hName = 'div'
      ;(directive.data as Record<string, unknown>).hProperties = { className: ['entries'] }
      ;(directive.data as Record<string, unknown>).hChildren = rows
    })
  }
}

// Used by the search index — walks the markdown for the same directive blocks
// and emits {keys, desc} tuples in document order.
export function extractEntries(markdown: string): Array<{ keys: string; desc: string }> {
  const out: Array<{ keys: string; desc: string }> = []
  const lines = markdown.split(/\r?\n/)
  let inBlock = false
  for (const line of lines) {
    const trimmed = line.trim()
    if (!inBlock) {
      if (/^:::\s*entries\b/.test(trimmed)) inBlock = true
      continue
    }
    if (trimmed === ':::') {
      inBlock = false
      continue
    }
    if (!trimmed) continue
    let parts = trimmed.split(SPLIT_PRIMARY)
    if (parts.length < 2) parts = trimmed.split(SPLIT_FALLBACK)
    if (parts.length < 2) continue
    const keys = parts[0].trim()
    const desc = parts.slice(1).join(' >> ').trim()
    if (keys && desc) out.push({ keys, desc })
  }
  return out
}

export function entryIdFor(keys: string, desc: string): string {
  return `entry-${hashId(keys + '' + desc)}`
}
