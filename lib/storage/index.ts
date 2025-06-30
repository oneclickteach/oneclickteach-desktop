import { app } from 'electron'
import * as fs from 'fs/promises'
import * as path from 'path'

interface StorageItem {
  id: string;
  data: string;
  timestamp: number;
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

  async setItem(key: string, value: string): Promise<void> {
    const items = await this.loadStorage()
    const timestamp = Date.now()
    const item: StorageItem = { id: key, data: value, timestamp }
    
    const existingIndex = items.findIndex(i => i.id === key)
    if (existingIndex !== -1) {
      items[existingIndex] = item
    } else {
      items.push(item)
    }

    await this.saveStorage(items)
  }

  async getItem(key: string): Promise<string | null> {
    const items = await this.loadStorage()
    const item = items.find(i => i.id === key)
    return item ? item.data : null
  }

  async removeItem(key: string): Promise<void> {
    const items = await this.loadStorage()
    const filteredItems = items.filter(i => i.id !== key)
    await this.saveStorage(filteredItems)
  }

  async clear(): Promise<void> {
    await this.saveStorage([])
  }

  async getAllItems(): Promise<StorageItem[]> {
    return this.loadStorage()
  }
}
