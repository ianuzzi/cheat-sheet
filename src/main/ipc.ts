import { BrowserWindow, ipcMain } from 'electron'
import { listSheets, getSheet } from './sheets'
import { toggleAlwaysOnTop } from './window'
import { store } from './store'

export function registerIpc(getWindow: () => BrowserWindow | null): void {
  ipcMain.handle('sheets:list', async () => {
    return listSheets()
  })

  ipcMain.handle('sheets:get', async (_e, payload: { id: string }) => {
    return getSheet(payload.id)
  })

  ipcMain.handle('window:getAlwaysOnTop', () => {
    return { on: store.get('alwaysOnTop') }
  })

  ipcMain.handle('window:setAlwaysOnTop', (_e, payload: { on: boolean }) => {
    const win = getWindow()
    if (!win) return { on: store.get('alwaysOnTop') }
    const on = toggleAlwaysOnTop(win, !!payload.on)
    return { on }
  })

  ipcMain.handle('window:hide', () => {
    const win = getWindow()
    if (win && !win.isDestroyed()) win.hide()
  })

  ipcMain.handle('state:getLastTab', () => {
    return { id: store.get('lastTabId') }
  })

  ipcMain.handle('state:setLastTab', (_e, payload: { id: string | null }) => {
    store.set('lastTabId', payload?.id ?? null)
  })
}
