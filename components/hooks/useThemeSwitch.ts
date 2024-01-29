import { useEffect, useState, Dispatch, SetStateAction } from 'react'

type Theme = 'light' | 'dark'

const useThemeSwitch = (): [Theme, Dispatch<SetStateAction<Theme>>] => {
  const prefersDarkQuery = '(prefers-color-scheme: dark)'
  const storageKey = 'theme'

  const toggleTheme = (theme: Theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    window.localStorage.setItem(storageKey, theme)
  }

  const getUserPreference = (): Theme => {
    if (typeof window !== 'undefined') {
      const userPreference = window.localStorage.getItem(storageKey)

      if (userPreference) {
        return userPreference as Theme
      }

      // Check if window.matchMedia is supported
      if (window.matchMedia) {
        return window.matchMedia(prefersDarkQuery).matches ? 'dark' : 'light'
      }
    }

    // Provide a default value or handle the absence of localStorage data and matchMedia
    return 'light'
  }

  const [mode, setMode] = useState<Theme>(() => getUserPreference())

  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersDarkQuery)

    const handleChange = () => {
      const newMode = getUserPreference()
      setMode(newMode)
      toggleTheme(newMode)
    }

    handleChange()

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    toggleTheme(mode)
  }, [mode])

  return [mode, setMode]
}

export { useThemeSwitch }
