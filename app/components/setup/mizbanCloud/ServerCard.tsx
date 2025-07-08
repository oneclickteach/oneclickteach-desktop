import { ServerMC } from '@/lib/services'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ServerCardProps {
  server: ServerMC
  onServerDeleted: () => void
}

export default function ServerCard({ server, onServerDeleted }: ServerCardProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteServer = async () => {
    try {
      setLoading(true)
      setError(null)
      onServerDeleted()
    } catch (err) {
      setError('Failed to delete server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg shadow-md p-6 border-2 border-gray-300 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{t('cloud.mizbanCloud.server.serverDetail.title')}</h3>
        <button
          onClick={handleDeleteServer}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Deleting...' : t('cloud.mizbanCloud.server.serverDetail.actions.deleteButton')}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="font-medium">{t('cloud.mizbanCloud.server.serverDetail.id')} :</span>
          <span>{server.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">{t('cloud.mizbanCloud.server.serverDetail.name')} :</span>
          <span>{server.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">{t('cloud.mizbanCloud.server.serverDetail.status')} :</span>
          <span
            className={`font-medium ${
              server.status === 'ON'
                ? 'text-green-500'
                : server.status === 'BUILD'
                  ? 'text-yellow-500'
                  : 'text-red-500'
            }`}
          >
            {server.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">{t('cloud.mizbanCloud.server.serverDetail.ipAddress')} :</span>
          <span>{server.interfaces?.length ? server.interfaces[0]?.ip_address : ''}</span>
        </div>
      </div>
    </div>
  )
}
