'use client'

import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/app/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/app/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { ServerConfigInterface } from '@/lib/interfaces'
import { STORAGE_SERVER_CONFIG_KEY } from '@/lib/constants'
import { ServerProvider } from '@/lib/enums'

const serverProviderOptions = Object.values(ServerProvider).map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}))

export function ServerProviderSelector() {
  const [serverConfig, setServerConfig] = useState<ServerConfigInterface | null>(null)
  const [serverProviderType, setServerProviderType] = useState(ServerProvider.VAGRANT)
  const [open, setOpen] = useState(false)

  const handleServerProviderSelect = async (currentValue: string) => {
    setServerProviderType(currentValue as ServerProvider)
    setOpen(false)

    try {
      const config = {
        ...serverConfig,
      }

      config.serverProviderType = currentValue as ServerProvider

      await window.api.invoke('storage-set', STORAGE_SERVER_CONFIG_KEY, config)
    } catch (err) {
      console.error('Error saving configuration:', err)
    }
  }

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await window.api.invoke('storage-get', STORAGE_SERVER_CONFIG_KEY)
        if (config) {
          setServerConfig(config)
          setServerProviderType(config.serverProviderType)
        }
      } catch (err) {
        console.error('Error loading configuration:', err)
      }
    }

    loadConfig()
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {serverProviderType
            ? serverProviderOptions.find((provider) => provider.value === serverProviderType)?.label
            : 'Select Server Provider...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search provider..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Provider found.</CommandEmpty>
            <CommandGroup>
              {serverProviderOptions.map((provider) => (
                <CommandItem key={provider.value} value={provider.value} onSelect={handleServerProviderSelect}>
                  {provider.label}
                  <Check className={cn('ml-auto', serverProviderType === provider.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
