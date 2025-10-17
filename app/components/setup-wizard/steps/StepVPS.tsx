import { ServerProviderType } from '@/lib/enums'
import MizbanCloudComponent from '../../setup/mizbanCloud/MizbanCloudComponent'
import { ServerProviderSelector } from '../../setup/vagrant/ServerProviderSelector'
import Vagrant from '../../setup/vagrant/Vagrant'
import { useServerConfigStore } from '@/lib/store'

export default function StepVPS() {
  const { serverConfig } = useServerConfigStore((state) => state)

  return (
    <div className="flex flex-col gap-5">
      <ServerProviderSelector />
      {serverConfig?.serverProviderType === ServerProviderType.VAGRANT ? <Vagrant /> : <MizbanCloudComponent />}
    </div>
  )
}
