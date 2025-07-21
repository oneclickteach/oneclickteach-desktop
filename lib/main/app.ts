import { BrowserWindow, shell, app, protocol, net } from 'electron'
import { join } from 'path'
import {
  STORAGE_LOCALE_KEY,
  STORAGE_SERVER_CONFIG_KEY,
  STORAGE_WINDOW_SETTINGS_KEY,
} from '../constants/storage-key.constant'
import { registerWindowIPC } from '@/lib/window/ipcEvents'
import appIcon from '@/resources/build/icon.png?asset'
import { pathToFileURL } from 'url'
import { Storage } from '@/lib/storage'
import { WindowConfigInterface } from '../interfaces'
import { COMMON_CONFIG_DEFAULT, SERVER_CONFIG_DEFAULT, WINDOWS_CONFIG_DEFAULT } from '../constants'

export function createAppWindow(): void {
  // Register custom protocol for resources
  registerResourcesProtocol()

  // Storage instance
  const storage = new Storage()

  // Checking setting and load windows setting
  const checkingSettings = async (): Promise<WindowConfigInterface> => {
    try {
      const [windowsSetting, localSetting, serverConfigSetting] = await Promise.all([
        storage.getItem(STORAGE_WINDOW_SETTINGS_KEY),
        storage.getItem(STORAGE_LOCALE_KEY),
        storage.getItem(STORAGE_SERVER_CONFIG_KEY),
      ])

      if (!windowsSetting) {
        await storage.setItem(STORAGE_WINDOW_SETTINGS_KEY, WINDOWS_CONFIG_DEFAULT)
      }

      if (!localSetting) {
        await storage.setItem(STORAGE_LOCALE_KEY, COMMON_CONFIG_DEFAULT)
      }

      if (!serverConfigSetting) {
        await storage.setItem(STORAGE_SERVER_CONFIG_KEY, SERVER_CONFIG_DEFAULT)
      }

      return windowsSetting
    } catch (error) {
      console.error('Error checking settings:', error)
      return WINDOWS_CONFIG_DEFAULT
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
      await storage.setItem(STORAGE_WINDOW_SETTINGS_KEY, settings)
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
  checkingSettings().then((settings) => {
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
