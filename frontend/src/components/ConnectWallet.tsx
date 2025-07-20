import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, WalletIcon } from '@heroicons/react/24/outline'
import { useConnect, useAccount } from 'wagmi'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

// Utils
import { isSupportedChain } from '../config/wagmi'

interface ConnectWalletProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function ConnectWallet({ className, size = 'md' }: ConnectWalletProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { connect, connectors, isPending } = useConnect()
  const { isConnected, chainId } = useAccount()

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector })
      setIsOpen(false)
      toast.success('Wallet connected successfully!')
    } catch (error: any) {
      console.error('Failed to connect wallet:', error)
      toast.error(error.message || 'Failed to connect wallet')
    }
  }

  // Show network warning if connected to unsupported chain
  if (isConnected && chainId && !isSupportedChain(chainId)) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          'btn btn-secondary border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100',
          'dark:border-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-300 dark:hover:bg-yellow-900/30',
          sizeClasses[size],
          className
        )}
      >
        <WalletIcon className="mr-2 h-4 w-4" />
        Wrong Network
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className={clsx(
          'btn btn-primary',
          sizeClasses[size],
          className
        )}
      >
        <WalletIcon className="mr-2 h-4 w-4" />
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-slate-900 dark:text-slate-100"
                    >
                      Connect Wallet
                    </Dialog.Title>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="rounded-md p-1 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {connectors.map((connector) => (
                      <button
                        key={connector.uid}
                        onClick={() => handleConnect(connector)}
                        disabled={isPending}
                        className={clsx(
                          'w-full flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-600 p-4',
                          'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600',
                          'transition-colors duration-200',
                          'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-monad-600 flex items-center justify-center">
                            <WalletIcon className="h-4 w-4 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-slate-900 dark:text-slate-100">
                              {connector.name}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {connector.type === 'injected' && 'Browser Extension'}
                              {connector.type === 'walletConnect' && 'Scan QR Code'}
                            </div>
                          </div>
                        </div>
                        {isPending && (
                          <div className="h-4 w-4 loading-spinner" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      By connecting a wallet, you agree to our{' '}
                      <a href="/terms" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                        Privacy Policy
                      </a>
                    </p>
                  </div>

                  {chainId && !isSupportedChain(chainId) && (
                    <div className="mt-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                            Unsupported Network
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                            <p>
                              Please switch to Monad Testnet or Mainnet to use this application.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
