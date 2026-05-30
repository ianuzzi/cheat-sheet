import type { JSX } from 'react'
import { RenderMarkdown } from '../markdown/renderMarkdown'
import { useSheetsStore } from '../state/sheetsStore'

export function SheetView(): JSX.Element {
  const activeId = useSheetsStore((s) => s.activeId)
  const sheet = useSheetsStore((s) => (activeId ? s.byId[activeId] : null))

  if (!sheet) {
    return <div className="sheet-empty">No sheet selected.</div>
  }

  return (
    <div className="sheet-view" data-sheet-id={sheet.meta.id}>
      <RenderMarkdown markdown={sheet.markdown} />
    </div>
  )
}
