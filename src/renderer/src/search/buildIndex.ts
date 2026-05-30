import MiniSearch from 'minisearch'
import { extractEntries, entryIdFor } from '../markdown/remarkEntries'

export type EntryDoc = {
  id: string
  sheetId: string
  sheetTitle: string
  entryId: string
  keys: string
  desc: string
}

export function buildIndex(
  sheets: Array<{ meta: { id: string; title: string }; markdown: string }>
): { index: MiniSearch<EntryDoc>; docs: EntryDoc[] } {
  const docs: EntryDoc[] = []
  for (const sheet of sheets) {
    const entries = extractEntries(sheet.markdown)
    for (const entry of entries) {
      const entryId = entryIdFor(entry.keys, entry.desc)
      docs.push({
        id: `${sheet.meta.id}::${entryId}`,
        sheetId: sheet.meta.id,
        sheetTitle: sheet.meta.title,
        entryId,
        keys: entry.keys,
        desc: entry.desc
      })
    }
  }

  const index = new MiniSearch<EntryDoc>({
    fields: ['keys', 'desc', 'sheetTitle'],
    storeFields: ['sheetId', 'sheetTitle', 'entryId', 'keys', 'desc'],
    searchOptions: {
      boost: { keys: 2, sheetTitle: 1.2 },
      prefix: true,
      fuzzy: 0.2,
      combineWith: 'AND'
    }
  })
  index.addAll(docs)
  return { index, docs }
}
