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
import { ServerProviderType } from '@/lib/enums'
import { useServerConfigStore } from '@/lib/store/useServerConfigStore'

const serverProviderOptions = Object.values(ServerProviderType).map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}))

export function ServerProviderSelector() {
  const { serverConfig, getServerConfig, updateServerProviderType } = useServerConfigStore((state) => state)
  const [open, setOpen] = useState(false)

  const handleServerProviderSelect = async (currentValue: string) => {
    updateServerProviderType(currentValue as ServerProviderType)
    setOpen(false)
  }

  useEffect(() => {
    getServerConfig()
  }, [getServerConfig, updateServerProviderType])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {serverConfig.serverProviderType
            ? serverProviderOptions.find((provider) => provider.value === serverConfig.serverProviderType)?.label
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
                  <Check
                    className={cn(
                      'ml-auto',
                      serverConfig.serverProviderType === provider.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
