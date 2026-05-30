import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  sheetsList: () => ipcRenderer.invoke('sheets:list'),
  sheetsGet: (id: string) => ipcRenderer.invoke('sheets:get', { id }),
  windowGetAlwaysOnTop: () => ipcRenderer.invoke('window:getAlwaysOnTop'),
  windowSetAlwaysOnTop: (on: boolean) => ipcRenderer.invoke('window:setAlwaysOnTop', { on }),
  windowHide: () => ipcRenderer.invoke('window:hide'),
  stateGetLastTab: () => ipcRenderer.invoke('state:getLastTab'),
  stateSetLastTab: (id: string | null) => ipcRenderer.invoke('state:setLastTab', { id }),
  onHotkeyConflict: (cb: (accelerator: string) => void) => {
    const listener = (_e: unknown, payload: { accelerator: string }): void => {
      cb(payload.accelerator)
    }
    ipcRenderer.on('app:hotkeyConflict', listener)
    return () => ipcRenderer.off('app:hotkeyConflict', listener)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

export type Api = typeof api
