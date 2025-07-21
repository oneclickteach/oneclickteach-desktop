import { useState, useEffect } from 'react'
import { ServerConfigInterface } from '@/lib/interfaces'
import { STORAGE_SERVER_CONFIG_KEY } from '@/lib/constants'
import { useTranslation } from 'react-i18next'

export default function MizbanConfig() {
  const { t } = useTranslation()
  const [serverConfig, setServerConfig] = useState<ServerConfigInterface | null>(null)
  const [mizbanCloudApiKey, setMizbanCloudApiKey] = useState('')
  const [host, setHost] = useState('')
  const [port, setPort] = useState('22')
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await window.api.invoke('storage-get', STORAGE_SERVER_CONFIG_KEY)
        if (config) {
          setServerConfig(config)
          setMizbanCloudApiKey(config.mizbanCloudApiKey)
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

    try {
      const config = {
        ...serverConfig,
      }

      config.mizbanCloudApiKey = mizbanCloudApiKey

      await window.api.invoke('storage-set', STORAGE_SERVER_CONFIG_KEY, config)
    } catch (err) {
      console.error('Error saving configuration:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      {isLoading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-row items-center gap-4">
        <label htmlFor="mizbanCloudApiKey" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {t('cloud.mizbanCloud.config.apiKey')}
        </label>
        <input
          type="password"
          id="mizbanCloudApiKey"
          value={mizbanCloudApiKey}
          onChange={(e) => setMizbanCloudApiKey(e.target.value)}
          placeholder="••••••••"
          required
          className="grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />

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
