import { app, safeStorage } from 'electron'
import * as fs from 'fs/promises'
import * as path from 'path'

interface StorageItem {
  id: string
  data: string
  timestamp: number
}

export class Storage {
  private readonly storagePath: string

  constructor() {
    this.storagePath = path.join(app.getPath('userData'), 'config.json')
  }

  private async loadStorage(): Promise<StorageItem[]> {
    try {
      const data = await fs.readFile(this.storagePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      return []
    }
  }

  private async saveStorage(items: StorageItem[]): Promise<void> {
    await fs.writeFile(this.storagePath, JSON.stringify(items, null, 2))
  }

  async setItem(key: string, value: any): Promise<void> {
    const items = await this.loadStorage()
    const timestamp = Date.now()
    // Serialize the value to JSON
    const data = JSON.stringify(value)
    // Encrypt the data
    const encryptedData = await safeStorage.encryptString(data)

    // Create the item
    const item: StorageItem = { id: key, data: encryptedData.toString('base64'), timestamp }

    const existingIndex = items.findIndex((i) => i.id === key)
    if (existingIndex !== -1) {
      items[existingIndex] = item
    } else {
      items.push(item)
    }

    await this.saveStorage(items)
  }

  async getItem(key: string): Promise<any | null> {
    const items = await this.loadStorage()
    const item = items.find((i) => i.id === key)

    // Check data
    if (!item?.data) return null

    // Decrypt the data
    const decryptedDataItem = safeStorage.decryptString(Buffer.from(item.data, 'base64'))

    return JSON.parse(decryptedDataItem)
  }

  async removeItem(key: string): Promise<void> {
    const items = await this.loadStorage()
    const filteredItems = items.filter((i) => i.id !== key)
    await this.saveStorage(filteredItems)
  }

  async clear(): Promise<void> {
    await this.saveStorage([])
  }

  async getAllItems(): Promise<StorageItem[]> {
    return this.loadStorage()
  }
}
