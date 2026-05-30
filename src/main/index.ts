import { app, BrowserWindow, globalShortcut } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createMainWindow } from './window'
import { registerIpc } from './ipc'

const TOGGLE_ACCELERATOR = 'Control+Alt+/'

let mainWindow: BrowserWindow | null = null

function getMainWindow(): BrowserWindow | null {
  if (mainWindow && !mainWindow.isDestroyed()) return mainWindow
  return null
}

function toggleVisibility(): void {
  const win = getMainWindow()
  if (!win) return
  if (win.isVisible() && win.isFocused()) {
    win.hide()
  } else {
    if (!win.isVisible()) win.show()
    win.focus()
    win.moveTop()
  }
}

const singleInstance = app.requestSingleInstanceLock()
if (!singleInstance) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const win = getMainWindow()
    if (win) {
      if (win.isMinimized()) win.restore()
      win.show()
      win.focus()
    }
  })

  app.whenReady().then(() => {
    electronApp.setAppUserModelId('us.ianuzzi.cheatsheet')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    registerIpc(getMainWindow)

    mainWindow = createMainWindow()

    const registered = globalShortcut.register(TOGGLE_ACCELERATOR, toggleVisibility)
    if (!registered) {
      console.warn(`Failed to register global shortcut ${TOGGLE_ACCELERATOR}`)
      mainWindow.webContents.once('did-finish-load', () => {
        mainWindow?.webContents.send('app:hotkeyConflict', { accelerator: TOGGLE_ACCELERATOR })
      })
    }

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = createMainWindow()
      }
    })
  })

  app.on('will-quit', () => {
    globalShortcut.unregisterAll()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
