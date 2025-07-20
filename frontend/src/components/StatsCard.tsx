import { clsx } from 'clsx'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  name: string
  value: string | number
  icon: any // React component
  color?: string
  bgColor?: string
  className?: string
  trend?: {
    value: number
    label: string
    direction: 'up' | 'down'
  }
}

export default function StatsCard({
  name,
  value,
  icon: Icon,
  color = 'text-primary-600 dark:text-primary-400',
  bgColor = 'bg-primary-50 dark:bg-primary-900/20',
  className,
  trend,
}: StatsCardProps) {
  return (
    <div className={clsx('card', className)}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={clsx('rounded-lg p-3', bgColor)}>
            <Icon className={clsx('h-6 w-6', color)} aria-hidden="true" />
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
              {name}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {value}
              </div>
              {trend && (
                <div className={clsx(
                  'ml-2 flex items-baseline text-sm font-semibold',
                  trend.direction === 'up' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                )}>
                  {trend.direction === 'up' ? '+' : '-'}{Math.abs(trend.value)}%
                  <span className="ml-1 text-slate-500 dark:text-slate-400 font-normal">
                    {trend.label}
                  </span>
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  )
}
