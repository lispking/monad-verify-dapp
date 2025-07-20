import { createConfig, http } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

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

// Create wagmi config
export const wagmiConfig = createConfig({
  chains: [monadTestnet, monadMainnet, hardhat],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId,
      metadata: {
        name: 'MonadVerify',
        description: 'Secure data verification on Monad blockchain',
        url: 'https://monadverify.xyz',
        icons: ['https://monadverify.xyz/logo.png'],
      },
    }),
  ],
  transports: {
    [monadTestnet.id]: http(),
    [monadMainnet.id]: http(),
    [hardhat.id]: http(),
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
