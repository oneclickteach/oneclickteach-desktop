import { useState, useEffect } from 'react'
import { ServerConfigInterface } from '@/lib/interfaces'
import { STORAGE_SERVER_CONFIG_KEY } from '@/lib/constants/storeage-key.constant'
import { useTranslation } from 'react-i18next'

export default function Server() {
  const { t } = useTranslation()
  const [host, setHost] = useState('')
  const [port, setPort] = useState('22')
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [storedConfig, setStoredConfig] = useState<ServerConfigInterface | null>(null)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await window.api.invoke('storage-get', STORAGE_SERVER_CONFIG_KEY)
        if (config) {
          setStoredConfig(config)
          setHost(config.host)
          setPort(config.port.toString())
          setUser(config.user)
          setPassword(config.password)
        }
      } catch (err) {
        console.error('Error loading config:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const config: ServerConfigInterface = {
        host,
        port: parseInt(port),
        user,
        password,
      }

      await window.api.invoke('storage-set', STORAGE_SERVER_CONFIG_KEY, config)
    } catch (err) {
      console.error('Error saving configuration:', err)
      setError('Failed to save configuration. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold mb-4">{t('serverConfiguration.title')}</h1>
      {isLoading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="host" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {t('serverConfiguration.serverHost')}
            </label>
            <input
              type="text"
              id="host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="example.com"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="port" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {t('serverConfiguration.serverPort')}
            </label>
            <input
              type="number"
              id="port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="22"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="user" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {t('serverConfiguration.serverUsername')}
            </label>
            <input
              type="text"
              id="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="username"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {t('serverConfiguration.serverPassword')}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>

        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

        <button
          type="submit"
          disabled={isSaving}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? t('common.saving') : t('common.button.save')}
        </button>
      </form>
    </div>
  )
}
