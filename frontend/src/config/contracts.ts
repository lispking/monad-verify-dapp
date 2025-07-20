import { Address } from 'viem'
import { MONAD_VERIFY_ABI } from '../contracts/MonadVerifyABI'

// Export the ABI for external use
export { MONAD_VERIFY_ABI }

// Primus Verifier Contract ABI (simplified)
export const PRIMUS_VERIFIER_ABI = [
  {
    inputs: [{ name: 'attestationData', type: 'bytes' }],
    name: 'verifyAttestation',
    outputs: [{ name: 'isValid', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'dataType', type: 'string' },
      { name: 'data', type: 'bytes' },
    ],
    name: 'generateAttestation',
    outputs: [{ name: 'attestation', type: 'bytes' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Hardhat local network
  31337: {
    monadVerify: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    primusVerifier: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  },
  // Monad Testnet
  10143: {
    monadVerify: import.meta.env.VITE_MONAD_VERIFY_CONTRACT_TESTNET || '0xfA905Fc628b7219ddd2EE82f199683475d42Da38',
    primusVerifier: import.meta.env.VITE_PRIMUS_CONTRACT_TESTNET || '0x1Ad7fD53206fDc3979C672C0466A1c48AF47B431',
  },
  // Monad Mainnet
  143: {
    monadVerify: import.meta.env.VITE_MONAD_VERIFY_CONTRACT_MAINNET || '',
    primusVerifier: import.meta.env.VITE_PRIMUS_CONTRACT_MAINNET || '',
  },
} as const

// Helper function to get contract address for current network
export function getMonadVerifyAddress(chainId: number): Address {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!addresses?.monadVerify) {
    throw new Error(`MonadVerify contract not deployed on chain ${chainId}`)
  }
  return addresses.monadVerify as Address
}

export function getPrimusVerifierAddress(chainId: number): Address {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!addresses?.primusVerifier) {
    throw new Error(`PrimusVerifier contract not deployed on chain ${chainId}`)
  }
  return addresses.primusVerifier as Address
}

// Contract configuration
export const CONTRACT_CONFIG = {
  monadVerify: {
    abi: MONAD_VERIFY_ABI,
    getAddress: getMonadVerifyAddress,
  },
  primusVerifier: {
    abi: PRIMUS_VERIFIER_ABI,
    getAddress: getPrimusVerifierAddress,
  },
} as const

// Export types
export type ContractName = keyof typeof CONTRACT_CONFIG
export type ChainId = keyof typeof CONTRACT_ADDRESSES