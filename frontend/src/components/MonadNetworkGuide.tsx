import { useState } from 'react'
import { ExclamationTriangleIcon, CheckCircleIcon, ClipboardIcon } from '@heroicons/react/24/outline'
import { monadTestnet } from '../config/wagmi'
import toast from 'react-hot-toast'

interface MonadNetworkGuideProps {
  onClose?: () => void
}

export function MonadNetworkGuide({ onClose }: MonadNetworkGuideProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const networkConfig = {
    networkName: 'Monad Testnet',
    rpcUrl: monadTestnet.rpcUrls.default.http[0],
    chainId: '10143',
    currencySymbol: 'MON',
    blockExplorerUrl: 'https://testnet-explorer.monad.xyz'
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success(`${field} copied to clipboard!`)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const addToMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${parseInt(networkConfig.chainId).toString(16)}`,
            chainName: networkConfig.networkName,
            nativeCurrency: {
              name: 'Monad',
              symbol: networkConfig.currencySymbol,
              decimals: 18
            },
            rpcUrls: [networkConfig.rpcUrl],
            blockExplorerUrls: [networkConfig.blockExplorerUrl]
          }]
        })
        toast.success('Monad Testnet added to MetaMask!')
        if (onClose) onClose()
      } catch (error: any) {
        console.error('Failed to add network:', error)
        toast.error('Failed to add network to MetaMask')
      }
    } else {
      toast.error('MetaMask not detected. Please install MetaMask first.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Add Monad Testnet to MetaMask
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 mr-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                MonadVerify only works on Monad Testnet
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please add Monad Testnet to your MetaMask wallet to use this application.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white">Network Configuration:</h3>
            
            {Object.entries({
              'Network Name': networkConfig.networkName,
              'RPC URL': networkConfig.rpcUrl,
              'Chain ID': networkConfig.chainId,
              'Currency Symbol': networkConfig.currencySymbol,
              'Block Explorer': networkConfig.blockExplorerUrl
            }).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {label}
                  </div>
                  <div className="text-sm font-mono text-gray-900 dark:text-white break-all">
                    {value}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(value, label)}
                  className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title={`Copy ${label}`}
                >
                  {copiedField === label ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <ClipboardIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={addToMetaMask}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Add to MetaMask Automatically
            </button>
            
            <div className="text-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-2">Manual Setup:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Open MetaMask and click the network dropdown</li>
                <li>Click "Add Network" or "Custom RPC"</li>
                <li>Copy and paste the configuration above</li>
                <li>Save and switch to Monad Testnet</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

declare global {
  interface Window {
    ethereum?: any
  }
}
