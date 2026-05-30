import { ElectronAPI } from '@electron-toolkit/preload'

export type SheetMeta = {
  id: string
  title: string
  order: number
  icon?: string
}

export type Api = {
  sheetsList: () => Promise<SheetMeta[]>
  sheetsGet: (id: string) => Promise<{ id: string; markdown: string } | null>
  windowGetAlwaysOnTop: () => Promise<{ on: boolean }>
  windowSetAlwaysOnTop: (on: boolean) => Promise<{ on: boolean }>
  windowHide: () => Promise<void>
  stateGetLastTab: () => Promise<{ id: string | null }>
  stateSetLastTab: (id: string | null) => Promise<void>
  onHotkeyConflict: (cb: (accelerator: string) => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
