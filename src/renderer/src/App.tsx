import { useEffect, type JSX } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { useSheetsStore } from './state/sheetsStore'
import { TabBar } from './components/TabBar'
import { SheetView } from './components/SheetView'
import { SearchOverlay } from './components/SearchOverlay'

function App(): JSX.Element {
  const loaded = useSheetsStore((s) => s.loaded)
  const activeId = useSheetsStore((s) => s.activeId)
  const sheets = useSheetsStore((s) => s.sheets)
  const searchOpen = useSheetsStore((s) => s.searchOpen)
  const hotkeyConflict = useSheetsStore((s) => s.hotkeyConflict)
  const init = useSheetsStore((s) => s.init)
  const setSearchOpen = useSheetsStore((s) => s.setSearchOpen)
  const setActive = useSheetsStore((s) => s.setActive)
  const setHotkeyConflict = useSheetsStore((s) => s.setHotkeyConflict)

  useEffect(() => {
    init()
    const unsub = window.api.onHotkeyConflict((accel) => setHotkeyConflict(accel))
    return unsub
  }, [init, setHotkeyConflict])

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        setSearchOpen(true)
      } else if (e.key === 'Escape') {
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearchOpen])

  if (!loaded) {
    return <div className="loading">Loading sheets…</div>
  }

  if (sheets.length === 0) {
    return <div className="loading">No sheets found in resources/sheets.</div>
  }

  return (
    <Tabs.Root
      className="root"
      value={activeId ?? sheets[0].meta.id}
      onValueChange={setActive}
      orientation="horizontal"
    >
      {hotkeyConflict && (
        <div className="banner">
          Global hotkey <kbd className="key">{hotkeyConflict}</kbd> couldn’t be registered (in use
          by another app).
          <button
            type="button"
            className="banner-close"
            onClick={() => setHotkeyConflict(null)}
          >
            dismiss
          </button>
        </div>
      )}
      <TabBar />
      {sheets.map((s) => (
        <Tabs.Content key={s.meta.id} value={s.meta.id} className="sheet-content">
          {s.meta.id === activeId && <SheetView />}
        </Tabs.Content>
      ))}
      {searchOpen && <SearchOverlay />}
    </Tabs.Root>
  )
}

export default App
