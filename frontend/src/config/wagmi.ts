import { http } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Define Monad chains
export const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_MONAD_TESTNET_RPC || 'https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Testnet Explorer',
      url: 'https://testnet-explorer.monad.xyz',
    },
  },
  testnet: true,
} as const

export const monadMainnet = {
  id: 143,
  name: 'Monad',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_MONAD_MAINNET_RPC || 'https://rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://explorer.monad.xyz',
    },
  },
  testnet: false,
} as const

// Get project ID for WalletConnect
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

// Create wagmi config with RainbowKit
export const wagmiConfig = getDefaultConfig({
  appName: 'MonadVerify',
  projectId,
  chains: [monadTestnet, monadMainnet, hardhat],
  transports: {
    [monadTestnet.id]: http(monadTestnet.rpcUrls.default.http[0]),
    [monadMainnet.id]: http(monadMainnet.rpcUrls.default.http[0]),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
})

// Export chain configurations
export const supportedChains = [monadTestnet, monadMainnet, hardhat]

// Helper function to get chain by ID
export function getChainById(chainId: number) {
  return supportedChains.find(chain => chain.id === chainId)
}

// Helper function to check if chain is supported
export function isSupportedChain(chainId: number) {
  return supportedChains.some(chain => chain.id === chainId)
}
