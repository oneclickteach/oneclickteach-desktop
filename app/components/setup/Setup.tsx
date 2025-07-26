import MizbanCloudComponent from './mizbanCloud/MizbanCloudComponent'
import { ServerProviderSelector } from './vagrant/ServerProviderSelector'
import Vagrant from './vagrant/Vagrant'

export default function Setup() {
  return (
    <div className="flex flex-col gap-2">
      <ServerProviderSelector />
      <Vagrant />
      <MizbanCloudComponent />
      {/* <hr className="mt-16 mb-4" /> */}
    </div>
  )
}
