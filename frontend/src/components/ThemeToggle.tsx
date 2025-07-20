import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../hooks/useTheme'
import { clsx } from 'clsx'

interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function ThemeToggle({ className, size = 'md' }: ThemeToggleProps) {
  const { themePreference, toggleTheme } = useTheme()

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
  }

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        'rounded-lg bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300',
        'border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800',
        buttonSizeClasses[size],
        className
      )}
      aria-label={`Current: ${themePreference} theme. Click to cycle themes.`}
      title={`Current: ${themePreference} theme. Click to cycle: light → dark → system`}
    >
      {themePreference === 'light' ? (
        <SunIcon className={clsx(sizeClasses[size], 'transition-transform duration-200 hover:rotate-12')} />
      ) : themePreference === 'dark' ? (
        <MoonIcon className={clsx(sizeClasses[size], 'transition-transform duration-200 hover:-rotate-12')} />
      ) : (
        <ComputerDesktopIcon className={clsx(sizeClasses[size], 'transition-transform duration-200 hover:scale-110')} />
      )}
    </button>
  )
}
