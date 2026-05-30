import { useEffect, useMemo, useRef, useState, type JSX, type KeyboardEvent } from 'react'
import { useSheetsStore } from '../state/sheetsStore'
import { buildIndex, type EntryDoc } from '../search/buildIndex'

const MAX_RESULTS = 50

type Result = EntryDoc & { score: number }

export function SearchOverlay(): JSX.Element {
  const sheets = useSheetsStore((s) => s.sheets)
  const setActive = useSheetsStore((s) => s.setActive)
  const setSearchOpen = useSheetsStore((s) => s.setSearchOpen)
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const { index } = useMemo(() => buildIndex(sheets), [sheets])

  const results = useMemo<Result[]>(() => {
    if (!query.trim()) return []
    const hits = index.search(query)
    return hits.slice(0, MAX_RESULTS) as unknown as Result[]
  }, [index, query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setCursor(0)
  }, [query])

  const choose = (r: Result): void => {
    setActive(r.sheetId)
    setSearchOpen(false)
    // Defer scroll until the tab content has rendered.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(r.entryId)
        if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
        el?.classList.add('entry-flash')
        setTimeout(() => el?.classList.remove('entry-flash'), 1200)
      })
    })
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(results.length - 1, c + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(0, c - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const pick = results[cursor]
      if (pick) choose(pick)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setSearchOpen(false)
    }
  }

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search cheat sheets">
      <div className="search-backdrop" onClick={() => setSearchOpen(false)} />
      <div className="search-panel">
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          placeholder="Search commands and descriptions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
        />
        <div className="search-results">
          {results.length === 0 && query.trim() && (
            <div className="search-empty">No matches.</div>
          )}
          {results.map((r, i) => (
            <button
              key={r.id}
              type="button"
              className={`search-result${i === cursor ? ' search-result-active' : ''}`}
              onMouseEnter={() => setCursor(i)}
              onClick={() => choose(r)}
            >
              <span className="search-sheet">{r.sheetTitle}</span>
              <span className="search-keys">{r.keys}</span>
              <span className="search-desc">{r.desc}</span>
            </button>
          ))}
        </div>
        <div className="search-hint">
          <kbd className="key">↑</kbd>
          <kbd className="key">↓</kbd> navigate &nbsp;
          <kbd className="key">Enter</kbd> open &nbsp;
          <kbd className="key">Esc</kbd> close
        </div>
      </div>
    </div>
  )
}
