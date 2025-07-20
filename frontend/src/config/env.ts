// Environment configuration
export const env = {
  // Primus Configuration
  PRIMUS_APP_ID: import.meta.env.VITE_PRIMUS_APP_ID || '',
  PRIMUS_APP_SECRET: import.meta.env.VITE_PRIMUS_APP_SECRET || '',
  PRIMUS_TEMPLATE_ID: import.meta.env.VITE_PRIMUS_TEMPLATE_ID || '',

  // Network Configuration
  MONAD_TESTNET_RPC: import.meta.env.VITE_MONAD_TESTNET_RPC || 'https://testnet-rpc.monad.xyz',
  MONAD_MAINNET_RPC: import.meta.env.VITE_MONAD_MAINNET_RPC || 'https://rpc.monad.xyz',
  MONAD_TESTNET_CHAIN_ID: parseInt(import.meta.env.VITE_MONAD_TESTNET_CHAIN_ID || '10143'),
  MONAD_MAINNET_CHAIN_ID: parseInt(import.meta.env.VITE_MONAD_MAINNET_CHAIN_ID || '143'),

  // Contract Addresses
  PRIMUS_CONTRACT_TESTNET: import.meta.env.VITE_PRIMUS_CONTRACT_TESTNET || '0x1Ad7fD53206fDc3979C672C0466A1c48AF47B431',
  MONAD_VERIFY_CONTRACT_TESTNET: import.meta.env.VITE_MONAD_VERIFY_CONTRACT_TESTNET || '',
  PRIMUS_CONTRACT_MAINNET: import.meta.env.VITE_PRIMUS_CONTRACT_MAINNET || '',
  MONAD_VERIFY_CONTRACT_MAINNET: import.meta.env.VITE_MONAD_VERIFY_CONTRACT_MAINNET || '',

  // Development
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
  DEBUG: import.meta.env.VITE_DEBUG === 'true',

  // WalletConnect
  WALLETCONNECT_PROJECT_ID: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
} as const

// Validation
export function validateEnv() {
  const required = [
    'PRIMUS_APP_ID',
    'PRIMUS_TEMPLATE_ID',
  ] as const

  const missing = required.filter(key => !env[key])
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing)
    if (env.ENVIRONMENT === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
  }
}

// Helper functions
export function getContractAddress(contractName: 'primus' | 'monadVerify', chainId: number) {
  const isTestnet = chainId === env.MONAD_TESTNET_CHAIN_ID || chainId === 31337 // hardhat

  switch (contractName) {
    case 'primus':
      return isTestnet ? env.PRIMUS_CONTRACT_TESTNET : env.PRIMUS_CONTRACT_MAINNET
    case 'monadVerify':
      return isTestnet ? env.MONAD_VERIFY_CONTRACT_TESTNET : env.MONAD_VERIFY_CONTRACT_MAINNET
    default:
      throw new Error(`Unknown contract: ${contractName}`)
  }
}

export function isTestnet(chainId: number) {
  return chainId === env.MONAD_TESTNET_CHAIN_ID || chainId === 31337
}

export function isMainnet(chainId: number) {
  return chainId === env.MONAD_MAINNET_CHAIN_ID
}

// Initialize validation
if (typeof window !== 'undefined') {
  validateEnv()
}
