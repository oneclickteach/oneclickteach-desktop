// import MizbanCloud from './mizbanCloud/MizbanCloud'
import MizbanCloud from './mizbanCloud/MizbanCloud'
import { ServerProviderSelector } from './vagrant/ServerProviderSelector'
import Vagrant from './vagrant/Vagrant'
// import Server from './Server'

export default function Setup() {
  return (
    <div className="flex flex-col gap-2">
      <ServerProviderSelector />
      <Vagrant />
      <MizbanCloud />
      {/* <hr className="mt-16 mb-4" /> */}
      {/* <Server /> */}
    </div>
  )
}
