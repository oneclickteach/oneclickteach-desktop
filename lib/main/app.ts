import { BrowserWindow, shell, app, protocol, net } from 'electron'
import { join } from 'path'
import { STORAGE_WINDOW_SETTINGS_KEY } from '../constants/storage-key.constant'
import { registerWindowIPC } from '@/lib/window/ipcEvents'
import appIcon from '@/resources/build/icon.png?asset'
import { pathToFileURL } from 'url'
import { Storage } from '@/lib/storage'
import { WindowConfigInterface } from '../interfaces'

const defaultWindowConfig: WindowConfigInterface = {
  width: 1400,
  height: 900,
  x: undefined,
  y: undefined,
  maximized: false,
}

export function createAppWindow(): void {
  // Register custom protocol for resources
  registerResourcesProtocol()

  // Storage instance
  const storage = new Storage()

  // Load window settings from storage
  const loadWindowSettings = async (): Promise<WindowConfigInterface> => {
    try {
      const settings = await storage.getItem(STORAGE_WINDOW_SETTINGS_KEY)
      return settings ? JSON.parse(settings) : defaultWindowConfig
    } catch (error) {
      console.error('Error loading window settings:', error)
      return defaultWindowConfig
    }
  }

  // Save window settings to storage
  const saveWindowSettings = async (bounds: Electron.Rectangle) => {
    try {
      const settings: WindowConfigInterface = {
        width: bounds.width,
        height: bounds.height,
        x: bounds.x,
        y: bounds.y,
        maximized: mainWindow.isMaximized(),
      }
      await storage.setItem(STORAGE_WINDOW_SETTINGS_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error('Error saving window settings:', error)
    }
  }

  // Create the main window.
  const mainWindow = new BrowserWindow({
    show: false,
    backgroundColor: '#1c1c1c',
    icon: appIcon,
    frame: false,
    titleBarStyle: 'hiddenInset',
    title: 'One Click Teach',
    maximizable: true,
    resizable: true,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
    },
  })

  // Load window settings and apply them
  loadWindowSettings().then((settings) => {
    if (settings.maximized) {
      mainWindow.maximize()
    } else {
      mainWindow.setBounds({
        width: settings.width,
        height: settings.height,
        x: settings.x,
        y: settings.y,
      })
    }
  })

  // Save window settings when window is closed
  mainWindow.on('close', () => {
    saveWindowSettings(mainWindow.getBounds())
  })

  // Register IPC events for the main window.
  registerWindowIPC(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Register custom protocol for assets
function registerResourcesProtocol() {
  protocol.handle('res', async (request) => {
    try {
      const url = new URL(request.url)
      // Combine hostname and pathname to get the full path
      const fullPath = join(url.hostname, url.pathname.slice(1))
      const filePath = join(__dirname, '../../resources', fullPath)
      return net.fetch(pathToFileURL(filePath).toString())
    } catch (error) {
      console.error('Protocol error:', error)
      return new Response('Resource not found', { status: 404 })
    }
  })
}
