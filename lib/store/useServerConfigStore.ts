import { create } from 'zustand'
import { ServerConfigInterface } from '../interfaces'
import { SERVER_CONFIG_DEFAULT, STORAGE_SERVER_CONFIG_KEY } from '../constants'
import { ServerProviderType } from '../enums'

export interface ServerConfigState {
  serverConfig: ServerConfigInterface
  loading: boolean
  error: string | null
  getServerConfig: () => Promise<void>
  updateServerProviderType: (serverProviderType: ServerProviderType) => Promise<boolean>
  updateMizbanCloudApiKey: (mizbanCloudApiKey: string) => Promise<boolean>
}

export const useServerConfigStore = create<ServerConfigState>((set) => ({
  serverConfig: SERVER_CONFIG_DEFAULT,
  loading: false,
  error: null,
  selectedLanguage: null,
  getServerConfig: async () => {
    try {
      set({ loading: true, error: null })
      const serverConfig = await window.api.invoke('storage-get', STORAGE_SERVER_CONFIG_KEY)
      set({ serverConfig, loading: false })
    } catch (error) {
      console.log(error)
      set({ loading: false, error: 'Failed to fetch serverConfig' })
    }
  },
  updateServerProviderType: async (serverProviderType: ServerProviderType) => {
    try {
      set({ loading: true, error: null })
      const config = await window.api.invoke('storage-get', STORAGE_SERVER_CONFIG_KEY)

      const serverConfig = {
        ...config,
        serverProviderType,
      }

      await window.api.invoke('storage-set', STORAGE_SERVER_CONFIG_KEY, serverConfig)
      set({ serverConfig, loading: false })
      return true
    } catch (error) {
      console.log(error)
      set({ loading: false, error: 'Failed to update settings' })
      return false
    }
  },
  updateMizbanCloudApiKey: async (mizbanCloudApiKey: string) => {
    try {
      set({ loading: true, error: null })
      const config = await window.api.invoke('storage-get', STORAGE_SERVER_CONFIG_KEY)

      const serverConfig = {
        ...config,
        mizbanCloudApiKey,
      }

      await window.api.invoke('storage-set', STORAGE_SERVER_CONFIG_KEY, serverConfig)
      set({ serverConfig, loading: false })
      return true
    } catch (error) {
      console.log(error)
      set({ loading: false, error: 'Failed to update settings' })
      return false
    }
  },
}))
