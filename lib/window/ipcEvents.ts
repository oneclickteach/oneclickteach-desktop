import { BrowserWindow, ipcMain, shell, safeStorage } from 'electron'
import os from 'os'
import { Storage } from '../storage'

const storage = new Storage()

const handleIPC = (channel: string, handler: (...args: any[]) => void) => {
  ipcMain.handle(channel, handler)
}

export const registerWindowIPC = (mainWindow: BrowserWindow) => {
  // Hide the menu bar
  mainWindow.setMenuBarVisibility(false)

  // Register window IPC
  handleIPC('init-window', () => {
    const { width, height } = mainWindow.getBounds()
    const minimizable = mainWindow.isMinimizable()
    const maximizable = mainWindow.isMaximizable()
    const platform = os.platform()

    return { width, height, minimizable, maximizable, platform }
  })

  handleIPC('is-window-minimizable', () => mainWindow.isMinimizable())
  handleIPC('is-window-maximizable', () => mainWindow.isMaximizable())
  handleIPC('window-minimize', () => mainWindow.minimize())
  handleIPC('window-maximize', () => mainWindow.maximize())
  handleIPC('window-close', () => mainWindow.close())
  handleIPC('window-maximize-toggle', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  const webContents = mainWindow.webContents
  handleIPC('web-undo', () => webContents.undo())
  handleIPC('web-redo', () => webContents.redo())
  handleIPC('web-cut', () => webContents.cut())
  handleIPC('web-copy', () => webContents.copy())
  handleIPC('web-paste', () => webContents.paste())
  handleIPC('web-delete', () => webContents.delete())
  handleIPC('web-select-all', () => webContents.selectAll())
  handleIPC('web-reload', () => webContents.reload())
  handleIPC('web-force-reload', () => webContents.reloadIgnoringCache())
  handleIPC('web-toggle-devtools', () => webContents.toggleDevTools())
  handleIPC('web-actual-size', () => webContents.setZoomLevel(0))
  handleIPC('web-zoom-in', () => webContents.setZoomLevel(webContents.zoomLevel + 0.5))
  handleIPC('web-zoom-out', () => webContents.setZoomLevel(webContents.zoomLevel - 0.5))
  handleIPC('web-toggle-fullscreen', () => mainWindow.setFullScreen(!mainWindow.fullScreen))
  handleIPC('web-open-url', (_e, url) => shell.openExternal(url))

  // Storage IPC handlers
  handleIPC('storage-set', async (_e, key: string, value: any) => {
    try {
      // Serialize the value to JSON
      const data = JSON.stringify(value)

      // Encrypt the data
      const encryptedData = await safeStorage.encryptString(data)
      
      // Store the encrypted data in storage
      await storage.setItem(key, encryptedData.toString('base64'))
      return true
    } catch (error) {
      console.error('Error setting storage:', error)
      return false
    }
  })
  handleIPC('storage-get', async (_e, key: string) => {
    try {
      // Get the encrypted data
      const encryptedData = await storage.getItem(key)
      if (!encryptedData) return null

      // Decrypt the data
      const decryptedData = safeStorage.decryptString(Buffer.from(encryptedData, 'base64'))

      // Try to parse as JSON if it's an object
      return JSON.parse(decryptedData)
    } catch (error) {
      console.error('Error getting storage:', error)
      return null
    }
  })
  handleIPC('storage-remove', async (_e, key: string) => {
    try {
      await storage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing storage:', error)
      return false
    }
  })
  handleIPC('storage-clear', async () => {
    try {
      await storage.clear()
      return true
    } catch (error) {
      console.error('Error clearing storage:', error)
      return false
    }
  })
  handleIPC('storage-list', async () => {
    try {
      const items = await storage.getAllItems()
      return items
    } catch (error) {
      console.error('Error listing storage:', error)
      return null
    }
  })
}
