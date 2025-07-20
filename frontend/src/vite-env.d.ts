/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MONAD_TESTNET_RPC: string
  readonly VITE_MONAD_MAINNET_RPC: string
  readonly VITE_MONAD_TESTNET_CHAIN_ID: string
  readonly VITE_MONAD_MAINNET_CHAIN_ID: string
  readonly VITE_PRIMUS_CONTRACT_TESTNET: string
  readonly VITE_MONAD_VERIFY_CONTRACT_TESTNET: string
  readonly VITE_PRIMUS_CONTRACT_MAINNET: string
  readonly VITE_MONAD_VERIFY_CONTRACT_MAINNET: string
  readonly VITE_ENVIRONMENT: string
  readonly VITE_DEBUG: string
  readonly VITE_WALLETCONNECT_PROJECT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
