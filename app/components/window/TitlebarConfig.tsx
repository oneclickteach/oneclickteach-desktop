import { useState, useEffect } from 'react'
import { CommonConfigInterface } from '@/lib/interfaces'
import { STORAGE_LOCALE_KEY } from '@/lib/constants/storeage-key.constant'
import { Badge } from '../ui/badge'
import { Sun, Moon, Globe } from 'lucide-react'
import { DarkMode, DirectionMode } from '@/lib/enums'
import { useTranslation } from 'react-i18next'
import { LocalInterface } from '@/lib/interfaces'
import i18n from '@/lib/i18n'

export default function TitlebarConfig() {
  const { t } = useTranslation()
  const [local, setLocal] = useState<LocalInterface>({
    name: 'en',
    flag: 'en',
    code: 'en',
    direction: DirectionMode.LTR,
  })

  const [darkMode, setDarkMode] = useState<DarkMode>(DarkMode.SYSTEM)

  useEffect(() => {
    // Initialize i18n with current language
    i18n.changeLanguage(local.name)
  }, [local.name])

  useEffect(() => {
    loadConfig()
  }, [])

  const handleDarkMode = async () => {
    let newDarkMode = darkMode
    if (darkMode === DarkMode.DARK) {
      newDarkMode = DarkMode.LIGHT
      document.documentElement.classList.remove('dark')
    } else if (darkMode === DarkMode.LIGHT) {
      newDarkMode = DarkMode.SYSTEM
      const systemThemeIsDarkMode = await window.api.invoke('get-system-theme')
      if (systemThemeIsDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      newDarkMode = DarkMode.DARK
      document.documentElement.classList.add('dark')
    }

    setDarkMode(newDarkMode)
    saveConfig(local, newDarkMode)
  }

  const handleLanguageChange = () => {
    let newLocal = local
    if (local.name === 'en') {
      newLocal = { name: 'fa', flag: '🇮🇷', code: 'fa', direction: DirectionMode.RTL }
      document.documentElement.lang = 'fa'
      document.documentElement.dir = 'rtl'
    } else {
      newLocal = { name: 'en', flag: '🇺🇸', code: 'en', direction: DirectionMode.LTR }
      document.documentElement.lang = 'en'
      document.documentElement.dir = 'ltr'
    }

    setLocal(newLocal)
    saveConfig(newLocal, darkMode)
  }

  const loadConfig = async () => {
    try {
      const config = await window.api.invoke('storage-get', STORAGE_LOCALE_KEY)
      const systemThemeIsDarkMode = await window.api.invoke('get-system-theme')

      if (config) {
        setLocal(config.local)
        setDarkMode(config.darkMode)

        // Set document language
        document.documentElement.lang = config.local.name

        // Set document direction
        document.documentElement.dir = config.local.direction === DirectionMode.LTR ? 'ltr' : 'rtl'

        // Update i18n language
        i18n.changeLanguage(config.local.name)

        // Update translations
        document.title = t('common.title')

        // Set dark mode class
        if (config.darkMode === DarkMode.DARK || (config.darkMode === DarkMode.SYSTEM && systemThemeIsDarkMode)) {
          document.documentElement.classList.add('dark')
        } else if (
          config.darkMode === DarkMode.LIGHT ||
          (config.darkMode === DarkMode.SYSTEM && !systemThemeIsDarkMode)
        ) {
          document.documentElement.classList.remove('dark')
        }
      }
    } catch (err) {
      console.error('Error loading config:', err)
    }
  }

  const saveConfig = async (local: LocalInterface, darkMode: DarkMode) => {
    try {
      const config: CommonConfigInterface = {
        local,
        darkMode,
      }

      await window.api.invoke('storage-set', STORAGE_LOCALE_KEY, config)
    } catch (err) {
      console.error('Error saving configuration:', err)
    }
  }

  return (
    <div className="flex flex-row gap-2">
      <Badge variant="secondary" onClick={handleDarkMode} className="flex items-center gap-2 text-sm cursor-pointer">
        <span>
          {darkMode === DarkMode.DARK ? (
            <Moon className="w-4 h-4" />
          ) : darkMode === DarkMode.LIGHT ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
        </span>
        <span>
          {darkMode === DarkMode.DARK
            ? t('commonConfiguration.darkMode.dark')
            : darkMode === DarkMode.LIGHT
              ? t('commonConfiguration.darkMode.light')
              : t('commonConfiguration.darkMode.system')}
        </span>
      </Badge>
      <Badge
        variant="secondary"
        onClick={handleLanguageChange}
        className="flex items-center gap-2 text-sm cursor-pointer"
      >
        <span>{local.flag}</span>
        <span>{local.name === 'en' ? t('commonConfiguration.language.en') : t('commonConfiguration.language.fa')}</span>
      </Badge>
    </div>
  )
}
