import { useState, useEffect } from 'react'
import { CommonConfigInterface } from '@/lib/interfaces'
import { LOCAL_CONFIG_DEFAULT } from '@/lib/constants'
import { Badge } from '@/app/components/ui/badge'
import { Sun, Moon, Globe, Flag } from 'lucide-react'
import { DarkMode, DirectionMode } from '@/lib/enums'
import { useTranslation } from 'react-i18next'
import { LocalInterface } from '@/lib/interfaces'
import i18n from '@/lib/i18n'
import { useCommonConfigStore } from '@/lib/store'

export default function Common() {
  const { t } = useTranslation()
  const { commonConfig, getCommonConfig, updateCommonConfig } = useCommonConfigStore((state) => state)

  const [local, setLocal] = useState<LocalInterface>(commonConfig?.local || (LOCAL_CONFIG_DEFAULT as LocalInterface))
  const [darkMode, setDarkMode] = useState<DarkMode>(commonConfig?.darkMode || DarkMode.SYSTEM)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(!commonConfig)

  useEffect(() => {
    // Initialize i18n with current language
    i18n.changeLanguage(local.name)
  }, [local.name])

  useEffect(() => {
    const loadConfig = async () => {
      try {
        if (!commonConfig) {
          await getCommonConfig()
        } else {
          const { local: configLocal, darkMode: configDarkMode } = commonConfig

          setLocal(configLocal)
          setDarkMode(configDarkMode)

          // Set document language
          document.documentElement.lang = configLocal.name

          // Set document direction
          document.documentElement.dir = configLocal.direction === DirectionMode.LTR ? 'ltr' : 'rtl'

          // Update i18n language
          i18n.changeLanguage(configLocal.name)

          // Update translations
          document.title = t('common.title')

          // Set dark mode class
          if (
            configDarkMode === DarkMode.DARK ||
            (configDarkMode === DarkMode.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches)
          ) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      } catch (err) {
        console.error('Error loading config:', err)
        setError('Failed to load configuration')
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [commonConfig, getCommonConfig, t])

  const handleDarkMode = () => {
    let newDarkMode: DarkMode

    if (darkMode === DarkMode.DARK) {
      newDarkMode = DarkMode.LIGHT
      document.documentElement.classList.remove('dark')
    } else if (darkMode === DarkMode.LIGHT) {
      newDarkMode = DarkMode.SYSTEM
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      newDarkMode = DarkMode.DARK
      document.documentElement.classList.add('dark')
    }

    setDarkMode(newDarkMode)
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

      await updateCommonConfig(config)
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
          <Badge variant="secondary" onClick={handleDarkMode} className="flex items-center gap-2">
            {darkMode === DarkMode.DARK ? (
              <Moon className="w-4 h-4" />
            ) : darkMode === DarkMode.LIGHT ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
            {darkMode === DarkMode.DARK
              ? t('commonConfiguration.darkMode.dark')
              : darkMode === DarkMode.LIGHT
                ? t('commonConfiguration.darkMode.light')
                : t('commonConfiguration.darkMode.system')}
          </Badge>
        </div>
        <div className="text-sm cursor-pointer">
          <Badge variant="secondary" onClick={handleLanguageChange} className="flex items-center gap-2">
            <Flag className="w-4 h-4" />
            {local.name === 'en' ? (
              <span className="flex items-center gap-1">
                <span>{local.flag}</span>
                {t('commonConfiguration.language.en')}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span>{local.flag}</span>
                {t('commonConfiguration.language.fa')}
              </span>
            )}
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
