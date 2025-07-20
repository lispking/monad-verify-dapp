import { useEffect, useState } from 'react'
import { useChainId, useAccount, useSwitchChain } from 'wagmi'
import { monadTestnet } from '../config/wagmi'
import { switchToNetwork } from '../utils/addNetwork'
import toast from 'react-hot-toast'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { MonadNetworkGuide } from './MonadNetworkGuide'

interface NetworkEnforcerProps {
  children: React.ReactNode
}

/**
 * NetworkEnforcer ensures users are ALWAYS on Monad Testnet
 * This component blocks the entire app until the user switches networks
 */
export function NetworkEnforcer({ children }: NetworkEnforcerProps) {
  const chainId = useChainId()
  const { isConnected } = useAccount()
  const { switchChain } = useSwitchChain()
  const [isSwitching, setIsSwitching] = useState(false)
  const [hasShownWarning, setHasShownWarning] = useState(false)
  const [showNetworkGuide, setShowNetworkGuide] = useState(false)

  const isOnCorrectNetwork = chainId === monadTestnet.id

  // Force network switch when wallet connects to wrong network
  useEffect(() => {
    if (isConnected && !isOnCorrectNetwork && !isSwitching) {
      console.log('🚨 Wrong network detected, forcing switch to Monad Testnet')
      forceNetworkSwitch()
    }
  }, [isConnected, isOnCorrectNetwork, isSwitching])

  // Show persistent warning
  useEffect(() => {
    if (isConnected && !isOnCorrectNetwork && !hasShownWarning) {
      setHasShownWarning(true)
      toast.error(
        'Wrong Network! MonadVerify only works on Monad Testnet. Please switch your network.',
        {
          duration: Infinity,
          position: 'top-center',
          id: 'network-warning'
        }
      )
    } else if (isOnCorrectNetwork && hasShownWarning) {
      toast.dismiss('network-warning')
      setHasShownWarning(false)
    }
  }, [isConnected, isOnCorrectNetwork, hasShownWarning])

  const forceNetworkSwitch = async () => {
    if (isSwitching) return
    
    setIsSwitching(true)
    
    try {
      console.log('Attempting to switch to Monad Testnet...')
      
      // Try custom network switch first
      await switchToNetwork(monadTestnet.id)
      
      console.log('✅ Successfully switched to Monad Testnet')
      toast.success('Switched to Monad Testnet!')
      
    } catch (error: any) {
      console.error('Custom switch failed, trying wagmi...', error)
      
      // Fallback to wagmi
      if (switchChain) {
        try {
          await switchChain({ chainId: monadTestnet.id })
          console.log('✅ Wagmi switch successful')
          toast.success('Switched to Monad Testnet!')
        } catch (wagmiError: any) {
          console.error('Both switch methods failed:', wagmiError)
          toast.error('Failed to switch network. Please manually switch to Monad Testnet in your wallet.')
        }
      } else {
        toast.error('Please manually switch to Monad Testnet in your wallet.')
      }
    } finally {
      setIsSwitching(false)
    }
  }

  // If not connected, show children normally
  if (!isConnected) {
    return <>{children}</>
  }

  // Allow connection but show warning for wrong network
  // Don't block the entire app, just show persistent warning
  if (!isOnCorrectNetwork) {
    return (
      <>
        {children}
        {/* Floating warning overlay */}
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Wrong Network
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Switch to Monad Testnet to use verification features
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={forceNetworkSwitch}
                    disabled={isSwitching}
                    className="text-sm bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-1 rounded transition-colors"
                  >
                    {isSwitching ? 'Switching...' : 'Auto Switch'}
                  </button>
                  <button
                    onClick={() => setShowNetworkGuide(true)}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                  >
                    Setup Guide
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // On correct network, show children normally
  return (
    <>
      {children}
      {showNetworkGuide && (
        <MonadNetworkGuide onClose={() => setShowNetworkGuide(false)} />
      )}
    </>
  )
}

/**
 * Hook to get network enforcement status
 */
export function useNetworkEnforcement() {
  const chainId = useChainId()
  const { isConnected } = useAccount()
  
  return {
    isOnCorrectNetwork: chainId === monadTestnet.id,
    isConnected,
    currentChainId: chainId,
    requiredChainId: monadTestnet.id,
    canUseApp: !isConnected || chainId === monadTestnet.id,
  }
}
