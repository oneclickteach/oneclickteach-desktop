import { useServerConfigStore } from '@/lib/store'
import MizbanCloudComponent from './mizbanCloud/MizbanCloudComponent'
import { ServerProviderSelector } from './vagrant/ServerProviderSelector'
import Vagrant from './vagrant/Vagrant'
import { ServerProviderType } from '@/lib/enums'

export default function Setup() {
  const { serverConfig } = useServerConfigStore((state) => state)

  return (
    <div className="flex flex-col gap-2">
      <ServerProviderSelector />
      {serverConfig?.serverProviderType === ServerProviderType.VAGRANT ? <Vagrant /> : <MizbanCloudComponent />}
      {/* <hr className="mt-16 mb-4" /> */}
    </div>
  )
}
