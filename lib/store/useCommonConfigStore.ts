import { create } from 'zustand'
import { CommonConfigInterface } from '../interfaces'
import { COMMON_CONFIG_DEFAULT, STORAGE_LOCALE_KEY } from '../constants'

export interface CommonConfigState {
  commonConfig: CommonConfigInterface
  loading: boolean
  error: string | null
  getCommonConfig: () => Promise<void>
  updateCommonConfig: (config: CommonConfigInterface) => Promise<boolean>
}

export const useCommonConfigStore = create<CommonConfigState>((set) => ({
  commonConfig: COMMON_CONFIG_DEFAULT,
  loading: false,
  error: null,
  selectedLanguage: null,
  getCommonConfig: async () => {
    try {
      set({ loading: true, error: null })
      const commonConfig = await window.api.invoke('storage-get', STORAGE_LOCALE_KEY)
      set({ commonConfig, loading: false })
    } catch (error) {
      console.log(error)
      set({ loading: false, error: 'Failed to fetch commonConfig' })
    }
  },
  updateCommonConfig: async (configInput: CommonConfigInterface) => {
    try {
      set({ loading: true, error: null })
      const config = await window.api.invoke('storage-get', STORAGE_LOCALE_KEY)

      const commonConfig = {
        ...config,
        configInput,
      }

      await window.api.invoke('storage-set', STORAGE_LOCALE_KEY, commonConfig)
      set({ commonConfig, loading: false })
      return true
    } catch (error) {
      console.log(error)
      set({ loading: false, error: 'Failed to update settings' })
      return false
    }
  },
}))
