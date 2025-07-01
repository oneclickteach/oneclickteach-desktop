import { useState, useEffect } from 'react'
import { CommonConfigInterface, LocalInterface } from '@/lib/interfaces'
import { STORAGE_LOCALE_KEY } from '@/lib/constants/storeage-key.constant'
import { Badge } from '../ui/badge'
import { DarkMode } from '@/lib/enums'

export default function Common() {
  const [local, setLocal] = useState<LocalInterface>({
    name: '',
    flag: '',
    code: '',
  })
  const [darkMode, setDarkMode] = useState<DarkMode>(DarkMode.SYSTEM)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await window.api.invoke('storage-get', STORAGE_LOCALE_KEY)
        const systemThemeIsDarkMode = await window.api.invoke('get-system-theme')

        if (config) {
          setLocal(config.local)
          setDarkMode(config.darkMode)
          if (config.darkMode === DarkMode.DARK || (config.darkMode === DarkMode.SYSTEM && systemThemeIsDarkMode)) {
            document.documentElement.classList.add('dark')
          } else if (
            config.darkMode === DarkMode.LIGHT ||
            (config.darkMode === DarkMode.SYSTEM && !systemThemeIsDarkMode)
          ) {
            document.documentElement.classList.remove('dark')
          }
        }
      } catch (err) {
        console.error('Error loading config:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [])

  const handleDarkMode = async () => {
    if (darkMode === DarkMode.DARK) {
      setDarkMode(DarkMode.LIGHT)
      document.documentElement.classList.remove('dark')
    } else if (darkMode === DarkMode.LIGHT) {
      setDarkMode(DarkMode.SYSTEM)
      const systemThemeIsDarkMode = await window.api.invoke('get-system-theme')
      if (systemThemeIsDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      setDarkMode(DarkMode.DARK)
      document.documentElement.classList.add('dark')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const config: CommonConfigInterface = {
        local,
        darkMode,
      }

      const success = await window.api.invoke('storage-set', STORAGE_LOCALE_KEY, config)

      if (success) {
        console.log('Common configuration saved successfully')
        // TODO: Navigate to next step
      } else {
        throw new Error('Failed to save configuration')
      }
    } catch (err) {
      console.error('Error saving configuration:', err)
      setError('Failed to save configuration. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold mb-4">Common Configuration</h1>
      {isLoading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="local" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Local
            </label>
            <input
              type="text"
              id="local"
              value={local.name}
              onChange={(e) => setLocal({ ...local, name: e.target.value })}
              placeholder="en"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
        <div className="text-sm cursor-pointer">
          <Badge variant="secondary" onClick={handleDarkMode}>
            {darkMode === DarkMode.DARK ? 'Dark Mode' : darkMode === DarkMode.LIGHT ? 'Light Mode' : 'System Mode'}
          </Badge>
        </div>

        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

        <button
          type="submit"
          disabled={isSaving}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  )
}
