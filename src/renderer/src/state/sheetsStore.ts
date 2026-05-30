import { create } from 'zustand'
import type { SheetMeta } from '../../../preload/index.d'

type Sheet = {
  meta: SheetMeta
  markdown: string
}

type SheetsState = {
  sheets: Sheet[]
  byId: Record<string, Sheet>
  activeId: string | null
  alwaysOnTop: boolean
  searchOpen: boolean
  hotkeyConflict: string | null
  loaded: boolean

  init: () => Promise<void>
  setActive: (id: string) => void
  setAlwaysOnTop: (on: boolean) => Promise<void>
  setSearchOpen: (on: boolean) => void
  setHotkeyConflict: (accel: string | null) => void
}

export const useSheetsStore = create<SheetsState>((set, get) => ({
  sheets: [],
  byId: {},
  activeId: null,
  alwaysOnTop: false,
  searchOpen: false,
  hotkeyConflict: null,
  loaded: false,

  init: async () => {
    const list = await window.api.sheetsList()
    const loaded: Sheet[] = []
    for (const meta of list) {
      const got = await window.api.sheetsGet(meta.id)
      if (got) loaded.push({ meta, markdown: got.markdown })
    }
    const byId: Record<string, Sheet> = {}
    for (const s of loaded) byId[s.meta.id] = s

    const [{ id: lastTab }, { on: aot }] = await Promise.all([
      window.api.stateGetLastTab(),
      window.api.windowGetAlwaysOnTop()
    ])

    const activeId =
      (lastTab && byId[lastTab] ? lastTab : null) ?? loaded[0]?.meta.id ?? null

    set({
      sheets: loaded,
      byId,
      activeId,
      alwaysOnTop: aot,
      loaded: true
    })
  },

  setActive: (id) => {
    if (!get().byId[id]) return
    set({ activeId: id })
    window.api.stateSetLastTab(id)
  },

  setAlwaysOnTop: async (on) => {
    const result = await window.api.windowSetAlwaysOnTop(on)
    set({ alwaysOnTop: result.on })
  },

  setSearchOpen: (on) => set({ searchOpen: on }),

  setHotkeyConflict: (accel) => set({ hotkeyConflict: accel })
}))
