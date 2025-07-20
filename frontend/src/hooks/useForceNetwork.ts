import { useCallback } from 'react'
import { useChainId, useSwitchChain } from 'wagmi'
import { monadTestnet } from '../config/wagmi'
import { switchToNetwork } from '../utils/addNetwork'
import toast from 'react-hot-toast'

/**
 * Hook to force network switch before any transaction
 */
export function useForceNetwork() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const forceMonadTestnet = useCallback(async (): Promise<boolean> => {
    console.log('🔍 Checking network before transaction:', {
      currentChainId: chainId,
      requiredChainId: monadTestnet.id,
      isCorrectNetwork: chainId === monadTestnet.id
    })

    // If already on correct network, return true
    if (chainId === monadTestnet.id) {
      console.log('✅ Already on Monad Testnet')
      return true
    }

    console.log('🚨 Wrong network detected, forcing switch...')

    // Show persistent toast with manual instructions
    const switchToast = toast.error(
      `Wrong Network Detected!\n\n` +
      `Please switch to Monad Testnet in your wallet to continue.\n\n` +
      `Current: Chain ${chainId} (ID: ${chainId})\n` +
      `Required: Monad Testnet (ID: 10143)\n\n` +
      `Network Details:\n` +
      `• Name: Monad Testnet\n` +
      `• Chain ID: 10143\n` +
      `• RPC: monad-testnet.g.alchemy.com\n` +
      `• Currency: MON`,
      {
        duration: Infinity,
        position: 'top-center',
      }
    )

    const attemptNetworkSwitch = async () => {
      try {
        console.log('Attempting automatic network switch...')

        // Try wagmi switch first (more reliable)
        if (switchChain) {
          await switchChain({ chainId: monadTestnet.id })
          toast.dismiss(switchToast)
          toast.success('Successfully switched to Monad Testnet!')
          console.log('✅ Wagmi network switch successful')
          return true
        }

        // Fallback to custom method
        await switchToNetwork(monadTestnet.id)
        toast.dismiss(switchToast)
        toast.success('Successfully switched to Monad Testnet!')
        console.log('✅ Custom network switch successful')
        return true

      } catch (error: any) {
        console.error('Automatic switch failed:', error)
        toast.error('Automatic switch failed. Please switch manually in your wallet.')
        return false
      }
    }

    // Try automatic switch once
    return await attemptNetworkSwitch()
  }, [chainId, switchChain])

  const ensureCorrectNetwork = useCallback(async (): Promise<void> => {
    // If already on correct network, proceed
    if (chainId === monadTestnet.id) {
      return
    }

    // Show blocking error message
    throw new Error(
      `Wrong network detected! Please switch to Monad Testnet in your wallet.\n\n` +
      `Current Network: Chain ${chainId}\n` +
      `Required Network: Monad Testnet (Chain ID: 10143)\n\n` +
      `Network Details:\n` +
      `• Name: Monad Testnet\n` +
      `• Chain ID: 10143\n` +
      `• RPC: https://monad-testnet.g.alchemy.com/v2/qFKckE9UPoFOSQpPoXzXbjKYf3OeYMUH\n` +
      `• Currency: MON`
    )
  }, [chainId])

  return {
    forceMonadTestnet,
    ensureCorrectNetwork,
    isOnCorrectNetwork: chainId === monadTestnet.id,
    currentChainId: chainId,
    requiredChainId: monadTestnet.id,
  }
}

/**
 * Hook to wrap any async function with network enforcement
 */
export function useWithNetworkCheck() {
  const { ensureCorrectNetwork } = useForceNetwork()

  const withNetworkCheck = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      await ensureCorrectNetwork()
      return fn()
    },
    [ensureCorrectNetwork]
  )

  return withNetworkCheck
}
