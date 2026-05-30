import { BrowserWindow, screen, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { store } from './store'

const DEFAULT_BOUNDS = { width: 1000, height: 720 }

function boundsAreVisible(b: { x?: number; y?: number; width: number; height: number }): boolean {
  if (b.x === undefined || b.y === undefined) return true
  for (const display of screen.getAllDisplays()) {
    const wa = display.workArea
    const inX = b.x >= wa.x && b.x + b.width <= wa.x + wa.width
    const inY = b.y >= wa.y && b.y + b.height <= wa.y + wa.height
    if (inX && inY) return true
  }
  return false
}

export function createMainWindow(): BrowserWindow {
  const saved = store.get('bounds')
  const usable = saved && boundsAreVisible(saved) ? saved : null

  const win = new BrowserWindow({
    width: usable?.width ?? DEFAULT_BOUNDS.width,
    height: usable?.height ?? DEFAULT_BOUNDS.height,
    x: usable?.x,
    y: usable?.y,
    show: false,
    autoHideMenuBar: true,
    title: 'Cheat Sheet',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Restore always-on-top.
  const aot = store.get('alwaysOnTop')
  if (aot) win.setAlwaysOnTop(true, 'floating')

  win.on('ready-to-show', () => {
    win.show()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const persistBounds = (): void => {
    if (win.isDestroyed() || win.isMinimized() || win.isMaximized()) return
    const b = win.getBounds()
    store.set('bounds', b)
  }
  win.on('resize', persistBounds)
  win.on('move', persistBounds)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return win
}

export function toggleAlwaysOnTop(win: BrowserWindow, on: boolean): boolean {
  win.setAlwaysOnTop(on, 'floating')
  store.set('alwaysOnTop', on)
  return on
}
