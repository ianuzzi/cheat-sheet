import * as Tabs from '@radix-ui/react-tabs'
import clsx from 'clsx'
import type { JSX } from 'react'
import { useSheetsStore } from '../state/sheetsStore'

export function TabBar(): JSX.Element {
  const sheets = useSheetsStore((s) => s.sheets)
  const activeId = useSheetsStore((s) => s.activeId)
  const alwaysOnTop = useSheetsStore((s) => s.alwaysOnTop)
  const setActive = useSheetsStore((s) => s.setActive)
  const setAlwaysOnTop = useSheetsStore((s) => s.setAlwaysOnTop)
  const setSearchOpen = useSheetsStore((s) => s.setSearchOpen)

  return (
    <div className="tabbar">
      <Tabs.List className="tabs-list" aria-label="Cheat sheets">
        {sheets.map((s) => (
          <Tabs.Trigger
            key={s.meta.id}
            value={s.meta.id}
            className={clsx('tab', activeId === s.meta.id && 'tab-active')}
            onClick={() => setActive(s.meta.id)}
          >
            {s.meta.title}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <div className="tabbar-actions">
        <button
          type="button"
          className="action"
          title="Search (Ctrl+F)"
          onClick={() => setSearchOpen(true)}
        >
          Search
        </button>
        <button
          type="button"
          className={clsx('action', alwaysOnTop && 'action-on')}
          title="Toggle always on top"
          onClick={() => setAlwaysOnTop(!alwaysOnTop)}
        >
          {alwaysOnTop ? 'Pinned' : 'Pin'}
        </button>
      </div>
    </div>
  )
}
