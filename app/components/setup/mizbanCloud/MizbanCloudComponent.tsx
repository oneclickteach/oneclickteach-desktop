import { useTranslation } from 'react-i18next'
import MizbanConfig from './MizbanConfig'
import MizbanServer from './MizbanServer'

export default function MizbanCloudComponent() {
  const { t } = useTranslation()

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 border-2 border-gray-300 rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">{t('cloud.mizbanCloud.title')}</h1>
      <h3 className="text-xl font-semibold mb-4">{t('cloud.mizbanCloud.description')}</h3>
      <div className="w-full h-full flex flex-col gap-6 p-6">
        <MizbanConfig />
        <MizbanServer />
      </div>
    </div>
  )
}
