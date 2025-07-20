import { useEffect } from 'react'
import { useChainId, useAccount } from 'wagmi'
import { monadTestnet } from '../config/wagmi'
import { useNetworkSwitch } from '../hooks/useNetworkSwitch'
import toast from 'react-hot-toast'

interface NetworkGuardProps {
  children: React.ReactNode
  showToast?: boolean
}

/**
 * NetworkGuard component ensures users are on Monad Testnet
 * before allowing interaction with contracts
 */
export function NetworkGuard({ children, showToast = true }: NetworkGuardProps) {
  const chainId = useChainId()
  const { isConnected } = useAccount()
  const { switchToMonadTestnet } = useNetworkSwitch()

  const isOnCorrectNetwork = chainId === monadTestnet.id

  useEffect(() => {
    if (isConnected && !isOnCorrectNetwork && showToast) {
      const toastId = toast.error(
        (t) => (
          <div className="flex flex-col gap-2">
            <div className="font-medium">Wrong Network</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Please switch to Monad Testnet to use this feature
            </div>
            <button
              onClick={() => {
                toast.dismiss(t.id)
                switchToMonadTestnet()
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Switch to Monad Testnet
            </button>
          </div>
        ),
        {
          duration: 8000,
          position: 'top-center',
        }
      )

      return () => toast.dismiss(toastId)
    }
  }, [isConnected, isOnCorrectNetwork, showToast, switchToMonadTestnet])

  // If not connected, show children (let wallet connection handle it)
  if (!isConnected) {
    return <>{children}</>
  }

  // If on wrong network, show disabled state
  if (!isOnCorrectNetwork) {
    return (
      <div className="relative">
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-lg">
          <div className="text-center p-4">
            <div className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Wrong Network
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Switch to Monad Testnet to continue
            </div>
            <button
              onClick={switchToMonadTestnet}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Switch Network
            </button>
          </div>
        </div>
      </div>
    )
  }

  // On correct network, show children normally
  return <>{children}</>
}

/**
 * Hook to check if user is on the correct network
 */
export function useNetworkGuard() {
  const chainId = useChainId()
  const { isConnected } = useAccount()
  
  const isOnCorrectNetwork = chainId === monadTestnet.id
  const canInteract = isConnected && isOnCorrectNetwork

  return {
    isOnCorrectNetwork,
    canInteract,
    requiredNetwork: monadTestnet,
    currentChainId: chainId,
  }
}
