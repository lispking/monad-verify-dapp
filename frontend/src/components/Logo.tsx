import { Link } from 'react-router-dom'
import { clsx } from 'clsx'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showText?: boolean
}

export default function Logo({ size = 'md', className, showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  }

  return (
    <Link to="/" className={clsx('flex items-center space-x-2', className)}>
      {/* Logo Icon */}
      <div className={clsx(
        'rounded-lg bg-gradient-to-br from-primary-500 to-monad-600 p-1.5 shadow-lg',
        sizeClasses[size]
      )}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-full w-full text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield with checkmark - representing verification */}
          <path
            d="M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 12L11 14L15 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={clsx(
            'font-bold gradient-text leading-none',
            textSizeClasses[size]
          )}>
            MonadVerify
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-slate-500 dark:text-slate-400 leading-none">
              Secure Data Verification
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
