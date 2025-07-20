import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'
import { useAccount, useDisconnect } from 'wagmi'
import { clsx } from 'clsx'

// Components
import ConnectWallet from './ConnectWallet'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'

// Types
import type { NavItem } from '../types/index'

const navigation: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Verify', href: '/verify' },
  { name: 'About', href: '/about' },
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="min-h-screen">
      <Disclosure as="nav" className="glass border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Logo />
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={clsx(
                          'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200',
                          location.pathname === item.href
                            ? 'border-primary-500 text-slate-900 dark:text-slate-100'
                            : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                  <ThemeToggle />
                  
                  {isConnected ? (
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
                          <span className="sr-only">Open user menu</span>
                          <div className="flex items-center space-x-2 px-3 py-2">
                            <UserCircleIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {formatAddress(address!)}
                            </span>
                          </div>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-slate-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/profile"
                                className={clsx(
                                  active ? 'bg-slate-100 dark:bg-slate-700' : '',
                                  'block px-4 py-2 text-sm text-slate-700 dark:text-slate-300'
                                )}
                              >
                                Your Profile
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/dashboard"
                                className={clsx(
                                  active ? 'bg-slate-100 dark:bg-slate-700' : '',
                                  'block px-4 py-2 text-sm text-slate-700 dark:text-slate-300'
                                )}
                              >
                                Dashboard
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => disconnect()}
                                className={clsx(
                                  active ? 'bg-slate-100 dark:bg-slate-700' : '',
                                  'block w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300'
                                )}
                              >
                                Disconnect
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <ConnectWallet />
                  )}
                </div>
                
                <div className="-mr-2 flex items-center sm:hidden">
                  <ThemeToggle />
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white dark:bg-slate-800 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={clsx(
                      'block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors duration-200',
                      location.pathname === item.href
                        ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                        : 'border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300'
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pb-3 pt-4">
                {isConnected ? (
                  <div className="space-y-1">
                    <div className="flex items-center px-4">
                      <div className="flex-shrink-0">
                        <UserCircleIcon className="h-8 w-8 text-slate-400" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {formatAddress(address!)}
                        </div>
                      </div>
                    </div>
                    <Disclosure.Button
                      as={Link}
                      to="/profile"
                      className="block px-4 py-2 text-base font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                    >
                      Your Profile
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      onClick={() => disconnect()}
                      className="block w-full px-4 py-2 text-left text-base font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                    >
                      Disconnect
                    </Disclosure.Button>
                  </div>
                ) : (
                  <div className="px-4">
                    <ConnectWallet />
                  </div>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="flex-1">
        {children}
      </main>
      
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Logo size="sm" />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                © 2025 MonadVerify. All rights reserved.
              </span>
            </div>
            <div className="flex space-x-6">
              <a
                href="https://docs.primuslabs.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              >
                Primus Docs
              </a>
              <a
                href="https://docs.monad.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              >
                Monad Docs
              </a>
              <a
                href="https://github.com/lispking/monad-verify-dapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
