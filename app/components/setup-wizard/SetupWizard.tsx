import { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { Button } from '@/app/components/ui/button'

import StepDomain from './steps/StepDomain'
import StepDNS from './steps/StepDNS'
import StepSSL from './steps/StepSSL'
import StepVPS from './steps/StepVPS'
import StepInstall from './steps/StepInstall'
import './styles.css'

const steps = [
  { id: 'vps', label: 'Server', isEnabled: true },
  { id: 'install', label: 'Install', isEnabled: true },
  { id: 'domain', label: 'Domain', isEnabled: true },
  { id: 'dns', label: 'DNS & CDN', isEnabled: true },
  { id: 'ssl', label: 'SSL', isEnabled: true },
]

export default function SetupWizard() {
  const [currentTab, setCurrentTab] = useState(steps[0].id)

  const currentIndex = steps.findIndex((step) => step.id === currentTab)

  const next = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentTab(steps[currentIndex + 1].id)
    }
  }

  const back = () => {
    if (currentIndex > 0) {
      setCurrentTab(steps[currentIndex - 1].id)
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-5 justify-between">
      <div className='wizard-content h-full overflow-y-auto'>
        <Tabs.Root value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <Tabs.List className="flex space-x-4 border-b border-muted pb-2">
            {steps.filter((step) => step.isEnabled).map((step) => (
              <Tabs.Trigger
                key={step.id}
                value={step.id}
                className={`px-4 py-2 text-sm font-medium rounded-t-md
                ${currentTab === step.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
              `}
              >
                {step.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value="domain" className="mt-4">
            <StepDomain />
          </Tabs.Content>
          <Tabs.Content value="dns" className="mt-4">
            <StepDNS />
          </Tabs.Content>
          <Tabs.Content value="ssl" className="mt-4">
            <StepSSL />
          </Tabs.Content>
          <Tabs.Content value="vps" className="mt-4">
            <StepVPS />
          </Tabs.Content>
          <Tabs.Content value="install" className="mt-4">
            <StepInstall />
          </Tabs.Content>
        </Tabs.Root>
      </div>
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={back} disabled={currentIndex === 0}>
          Back
        </Button>
        <Button onClick={next} disabled={currentIndex === steps.length - 1}>
          Next
        </Button>
      </div>
    </div>
  )
}
