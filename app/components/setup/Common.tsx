import { useState, useEffect } from 'react'
import { CommonConfigInterface } from '@/lib/interfaces'
import { STORAGE_LOCALE_KEY } from '@/lib/constants/storeage-key.constant'
import { Badge } from '../ui/badge'
import { DarkMode, DirectionMode } from '@/lib/enums'
import { useTranslation } from 'react-i18next'
import { LocalInterface } from '@/lib/interfaces'
import i18n from '@/lib/i18n'

export default function Common() {
  const { t } = useTranslation()
  const [local, setLocal] = useState<LocalInterface>({
    name: 'en',
    flag: 'en',
    code: 'en',
    direction: DirectionMode.LTR,
  })

  const [darkMode, setDarkMode] = useState<DarkMode>(DarkMode.SYSTEM)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize i18n with current language
    i18n.changeLanguage(local.name)
  }, [local.name])

  useEffect(() => {
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
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [])

  const handleDarkMode = async () => {
    if (darkMode === DarkMode.DARK) {
      setDarkMode(DarkMode.LIGHT)
      document.documentElement.classList.remove('dark')
    } else if (darkMode === DarkMode.LIGHT) {
      setDarkMode(DarkMode.SYSTEM)
      const systemThemeIsDarkMode = await window.api.invoke('get-system-theme')
      if (systemThemeIsDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      setDarkMode(DarkMode.DARK)
      document.documentElement.classList.add('dark')
    }
  }

  const handleLanguageChange = () => {
    if (local.name === 'en') {
      setLocal({ name: 'fa', flag: '🇮🇷', code: 'fa', direction: DirectionMode.RTL })
      document.documentElement.lang = 'fa'
      document.documentElement.dir = 'rtl'
    } else {
      setLocal({ name: 'en', flag: '🇺🇸', code: 'en', direction: DirectionMode.LTR })
      document.documentElement.lang = 'en'
      document.documentElement.dir = 'ltr'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const config: CommonConfigInterface = {
        local,
        darkMode,
      }

      const success = await window.api.invoke('storage-set', STORAGE_LOCALE_KEY, config)

      if (success) {
        console.log('Common configuration saved successfully')
        // TODO: Navigate to next step
      } else {
        throw new Error('Failed to save configuration')
      }
    } catch (err) {
      console.error('Error saving configuration:', err)
      setError('Failed to save configuration. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold mb-4">{t('commonConfiguration.title')}</h1>
      {isLoading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="text-sm cursor-pointer">
          <Badge variant="secondary" onClick={handleDarkMode}>
            {darkMode === DarkMode.DARK
              ? t('commonConfiguration.darkMode.dark')
              : darkMode === DarkMode.LIGHT
                ? t('commonConfiguration.darkMode.light')
                : t('commonConfiguration.darkMode.system')}
          </Badge>
        </div>
        <div className="text-sm cursor-pointer">
          <Badge variant="secondary" onClick={handleLanguageChange}>
            {local.name === 'en' ? t('commonConfiguration.language.en') : t('commonConfiguration.language.fa')}
          </Badge>
        </div>

        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

        <button
          type="submit"
          disabled={isSaving}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? t('common.saving') : t('common.button.save')}
        </button>
      </form>
    </div>
  )
}
