import { useEffect } from 'react'
import { useSwitchChain, useChainId, useAccount } from 'wagmi'
import { monadTestnet } from '../config/wagmi'
import { switchToNetwork } from '../utils/addNetwork'
import toast from 'react-hot-toast'

export function useNetworkSwitch() {
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const chainId = useChainId()
  const { isConnected } = useAccount()

  // Auto-switch to Monad Testnet when wallet connects
  useEffect(() => {
    if (isConnected && chainId !== monadTestnet.id) {
      console.log('Wallet connected to wrong network:', {
        currentChainId: chainId,
        requiredChainId: monadTestnet.id,
        currentNetwork: chainId === 1 ? 'Ethereum Mainnet' : `Chain ${chainId}`,
        requiredNetwork: 'Monad Testnet'
      })

      // Immediate attempt to switch
      switchToMonadTestnet()

      // Also try again after a delay in case the first attempt fails
      const timer = setTimeout(() => {
        if (chainId !== monadTestnet.id) {
          console.log('Retrying network switch...')
          switchToMonadTestnet()
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isConnected, chainId])

  const switchToMonadTestnet = async () => {
    try {
      console.log('Switching to Monad Testnet:', {
        chainId: monadTestnet.id,
        name: monadTestnet.name,
        rpcUrl: monadTestnet.rpcUrls.default.http[0]
      })

      // Try using our custom network switching first
      await switchToNetwork(monadTestnet.id)
      toast.success('Switched to Monad Testnet')
    } catch (error: any) {
      console.error('Failed to switch network with custom method:', error)

      // Fallback to wagmi switchChain if available
      if (switchChain) {
        try {
          await switchChain({ chainId: monadTestnet.id })
          toast.success('Switched to Monad Testnet')
        } catch (wagmiError: any) {
          console.error('Wagmi switch also failed:', wagmiError)
          toast.error(error.message || 'Failed to switch to Monad Testnet')
        }
      } else {
        toast.error(error.message || 'Network switching not supported by this wallet')
      }
    }
  }



  const manualSwitchToMonadTestnet = () => {
    switchToMonadTestnet()
  }

  return {
    switchToMonadTestnet: manualSwitchToMonadTestnet,
    isSwitching,
    isOnMonadTestnet: chainId === monadTestnet.id,
    currentChainId: chainId,
  }
}
