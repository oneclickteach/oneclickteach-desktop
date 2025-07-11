import { BrowserWindow, ipcMain, shell, safeStorage, nativeTheme } from 'electron'
import os from 'os'
import { Storage } from '../storage'
import { MizbanCloud } from '../services'
import { STORAGE_SERVER_CONFIG_KEY } from '../constants'

const storage = new Storage()

const handleIPC = (channel: string, handler: (...args: any[]) => void) => {
  ipcMain.handle(channel, handler)
}

const getCloudClient = async () => {
  let mizbanCloudApiKey = ''

  try {
    const encryptedData = await storage.getItem(STORAGE_SERVER_CONFIG_KEY)
    if (encryptedData) {
      const decryptedData = safeStorage.decryptString(Buffer.from(encryptedData, 'base64'))
      const data = JSON.parse(decryptedData)

      mizbanCloudApiKey = data.mizbanCloudApiKey || ''
    }
  } catch (error) {
    //
  }

  return new MizbanCloud({
    apiKey: mizbanCloudApiKey,
  })
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

  handleIPC('get-system-theme', () => {
    return nativeTheme.shouldUseDarkColors
  })

  // Storage IPC handlers
  handleIPC('storage-set', async (_e, key: string, value: any) => {
    // Serialize the value to JSON
    const data = JSON.stringify(value)

    // Encrypt the data
    const encryptedData = await safeStorage.encryptString(data)

    // Store the encrypted data in storage
    await storage.setItem(key, encryptedData.toString('base64'))
  })
  handleIPC('storage-get', async (_e, key: string) => {
    // Get the encrypted data
    const encryptedData = await storage.getItem(key)
    if (!encryptedData) return null

    // Decrypt the data
    const decryptedData = safeStorage.decryptString(Buffer.from(encryptedData, 'base64'))

    // Try to parse as JSON if it's an object
    return JSON.parse(decryptedData)
  })
  handleIPC('storage-remove', async (_e, key: string) => {
    return storage.removeItem(key)
  })
  handleIPC('storage-clear', async () => {
    return storage.clear()
  })
  handleIPC('storage-list', async () => {
    const items = await storage.getAllItems()
    return items
  })

  // Mizban Cloud IPC handlers
  handleIPC('invoke-mizban-cloud', async (_e, cmd: string, ...args) => {
    let data
    const cloudClient = await getCloudClient()

    switch (cmd) {
      case 'get-datacenter-list': {
        const response = await cloudClient.staticService.listDataCenters()
        data = response.data || []
        break
      }
      case 'get-operating-system-list': {
        const response = await cloudClient.staticService.listOperatingSystems()
        data = response.data || []
        break
      }
      case 'create-server': {
        const response = await cloudClient.serverService.createServer(args[0])
        data = response.data || {}
        break
      }
      case 'get-server-list': {
        const response = await cloudClient.serverService.listServers()
        data = response.data || []
        break
      }
      case 'get-server': {
        const response = await cloudClient.serverService.getServer(args[0])
        data = response.data || {}
        break
      }
      case 'delete-server': {
        const response = await cloudClient.serverService.deleteServer(args[0])
        data = response.data || {}
        break
      }
    }

    return data
  })
}
