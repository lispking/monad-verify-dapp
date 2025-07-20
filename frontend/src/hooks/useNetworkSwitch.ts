import { useEffect } from 'react'
import { useSwitchChain, useChainId, useAccount } from 'wagmi'
import { monadTestnet } from '../config/wagmi'
import toast from 'react-hot-toast'

export function useNetworkSwitch() {
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const chainId = useChainId()
  const { isConnected } = useAccount()

  // Auto-switch to Monad Testnet when wallet connects
  useEffect(() => {
    if (isConnected && chainId !== monadTestnet.id) {
      // Small delay to ensure wallet is fully connected
      const timer = setTimeout(() => {
        switchToMonadTestnet()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isConnected, chainId])

  const switchToMonadTestnet = async () => {
    if (!switchChain) {
      toast.error('Network switching not supported by this wallet')
      return
    }

    try {
      await switchChain({ chainId: monadTestnet.id })
      toast.success('Switched to Monad Testnet')
    } catch (error: any) {
      console.error('Failed to switch network:', error)
      
      // Handle different error cases
      if (error.code === 4902) {
        // Network not added to wallet
        toast.error('Please add Monad Testnet to your wallet first')
        showNetworkAddInstructions()
      } else if (error.code === 4001) {
        // User rejected the request
        toast.error('Network switch cancelled by user')
      } else {
        toast.error('Failed to switch to Monad Testnet')
      }
    }
  }

  const showNetworkAddInstructions = () => {
    toast.error(
      'Please add Monad Testnet to your wallet:\n' +
      'Network Name: Monad Testnet\n' +
      'RPC URL: https://testnet-rpc.monad.xyz\n' +
      'Chain ID: 10143\n' +
      'Currency: MON',
      {
        duration: 8000,
        position: 'top-center',
      }
    )
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
