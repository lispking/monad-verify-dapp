import { useState, useEffect } from 'react'
import type { Theme } from '../types/index'

const THEME_KEY = 'monad-verify-theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize theme from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem(THEME_KEY) as Theme
    const initialTheme = (stored && ['light', 'dark', 'system'].includes(stored)) ? stored : 'system'

    setTheme(initialTheme)

    // Set initial resolved theme
    if (initialTheme === 'system') {
      setResolvedTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    } else {
      setResolvedTheme(initialTheme as 'light' | 'dark')
    }

    setIsInitialized(true)
  }, [])

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setResolvedTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  // Update resolved theme when theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setResolvedTheme(isDark ? 'dark' : 'light')
    } else {
      setResolvedTheme(theme as 'light' | 'dark')
    }
  }, [theme])

  // Save to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  // Apply theme to DOM
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized) return

    const root = document.documentElement
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [resolvedTheme, isInitialized])



  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'light') return 'dark'
      if (current === 'dark') return 'system'
      return 'light'
    })
  }

  return {
    theme: resolvedTheme,
    themePreference: theme,
    setTheme: setThemeValue,
    toggleTheme,
  }
}
