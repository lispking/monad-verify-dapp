import { useAccount, useChainId } from 'wagmi'
import { clsx } from 'clsx'
import { CheckCircleIcon, ExclamationTriangleIcon, SignalIcon } from '@heroicons/react/24/outline'
import { monadTestnet, monadMainnet, isSupportedChain } from '../config/wagmi'

interface NetworkIndicatorProps {
  className?: string
  showLabel?: boolean
}

export default function NetworkIndicator({ className, showLabel = true }: NetworkIndicatorProps) {
  const { isConnected } = useAccount()
  const chainId = useChainId()

  if (!isConnected) {
    return null
  }

  const getNetworkInfo = () => {
    switch (chainId) {
      case monadTestnet.id:
        return {
          name: 'Monad Testnet',
          status: 'supported',
          icon: CheckCircleIcon,
          color: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
        }
      case monadMainnet.id:
        return {
          name: 'Monad Mainnet',
          status: 'supported',
          icon: CheckCircleIcon,
          color: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
        }
      default:
        if (isSupportedChain(chainId)) {
          return {
            name: 'Supported Network',
            status: 'supported',
            icon: CheckCircleIcon,
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            borderColor: 'border-green-200 dark:border-green-800',
          }
        } else {
          return {
            name: 'Unsupported Network',
            status: 'unsupported',
            icon: ExclamationTriangleIcon,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            borderColor: 'border-yellow-200 dark:border-yellow-800',
          }
        }
    }
  }

  const networkInfo = getNetworkInfo()
  const Icon = networkInfo.icon

  return (
    <div
      className={clsx(
        'inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium border',
        networkInfo.bgColor,
        networkInfo.borderColor,
        className
      )}
    >
      <Icon className={clsx('h-3 w-3', networkInfo.color)} />
      {showLabel && (
        <span className={clsx('ml-1.5', networkInfo.color)}>
          {networkInfo.name}
        </span>
      )}
    </div>
  )
}

// Network status badge for header
export function NetworkStatusBadge() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <SignalIcon className="h-3 w-3 text-slate-400" />
        <span className="ml-1.5 text-slate-500 dark:text-slate-400">
          Not Connected
        </span>
      </div>
    )
  }

  return <NetworkIndicator className="text-xs" />
}
