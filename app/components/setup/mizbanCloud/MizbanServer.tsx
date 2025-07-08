import { useEffect, useState } from 'react'
import ServerCard from './ServerCard'
import { ServerMC } from '@/lib/services'
import { useTranslation } from 'react-i18next'

const SERVER_NAME = 'oneclickteachserver'

export default function MizbanServer() {
  const { t } = useTranslation()
  const [server, setServer] = useState<ServerMC | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadServers = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load Servers using the API
      const servers = await window.api.invoke('invoke-mizban-cloud', 'get-server-list')

      if (servers) {
        const server = servers.find((server: ServerMC) => server.name === SERVER_NAME)
        setServer(server)
      }
    } catch (err) {
      console.error('Error deleting server:', err)
      setError('Failed to delete server')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateServer = async () => {
    try {
      setLoading(true)
      setError(null)

      // Create server using the API
      const server = await window.api.invoke('invoke-mizban-cloud', 'create-server', {
        name: SERVER_NAME,
        datacenter_id: 12,
        ip_version: 'ipv4',
        os_id: 98,
        cpu: 1,
        ram: 1,
        storage: 25,
        storage_type: 'SSD',
        firewalls: [],
        autopilot: true,
      })

      if (server) {
        setServer(server)
      }
    } catch (err) {
      console.error('Error creating server:', err)
      setError('Failed to create server')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteServer = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!server?.id) {
        return
      }

      // Delete server using the API
      await window.api.invoke('invoke-mizban-cloud', 'delete-server', server.id)

      // Clear server state
      setServer(null)
    } catch (err) {
      console.error('Error deleting server:', err)
      setError('Failed to delete server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServers()
  }, [])

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{t('cloud.mizbanCloud.server.title')}</h2>

        <div className="flex gap-4">
          <button
            onClick={loadServers}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? t('cloud.mizbanCloud.server.actions.onRefreshingButton')
              : t('cloud.mizbanCloud.server.actions.refreshButton')}
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center text-gray-500">{t('common.loading')}</div>
      ) : server ? (
        <ServerCard server={server} onServerDeleted={handleDeleteServer} />
      ) : (
        <div className="text-center text-gray-500">{t('cloud.mizbanCloud.server.noServer')}</div>
      )}

      {server ? null : (
        <button
          onClick={handleCreateServer}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? t('cloud.mizbanCloud.server.actions.onCreatingButton')
            : t('cloud.mizbanCloud.server.actions.createButton')}
        </button>
      )}
    </div>
  )
}
