import { Address } from 'viem'
import { getContractAddress } from './env'

// MonadVerify Contract ABI (simplified for key functions)
export const MONAD_VERIFY_ABI = [
  // Read functions
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getUserProfile',
    outputs: [
      {
        components: [
          { name: 'verificationCount', type: 'uint256' },
          { name: 'lastVerificationTime', type: 'uint256' },
          { name: 'isVerified', type: 'bool' },
        ],
        name: 'profile',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'requestId', type: 'bytes32' }],
    name: 'getVerificationRequest',
    outputs: [
      {
        components: [
          { name: 'user', type: 'address' },
          { name: 'dataType', type: 'string' },
          { name: 'attestationData', type: 'bytes' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'isVerified', type: 'bool' },
          { name: 'isCompleted', type: 'bool' },
        ],
        name: 'request',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'isUserVerified',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'dataType', type: 'string' }],
    name: 'supportedDataTypes',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'verificationFee',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalVerifications',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getContractStats',
    outputs: [
      { name: 'totalUsers', type: 'uint256' },
      { name: 'totalVerifications', type: 'uint256' },
      { name: 'contractBalance', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  // Write functions
  {
    inputs: [
      { name: 'dataType', type: 'string' },
      { name: 'attestationData', type: 'bytes' },
    ],
    name: 'requestVerification',
    outputs: [{ name: 'requestId', type: 'bytes32' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'requestId', type: 'bytes32' }],
    name: 'completeVerification',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: true, name: 'requestId', type: 'bytes32' },
      { indexed: false, name: 'dataType', type: 'string' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'VerificationRequested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: true, name: 'requestId', type: 'bytes32' },
      { indexed: false, name: 'success', type: 'bool' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'VerificationCompleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: false, name: 'verificationCount', type: 'uint256' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'UserProfileUpdated',
    type: 'event',
  },
] as const

// Mock Primus Verifier ABI (simplified)
export const PRIMUS_VERIFIER_ABI = [
  {
    inputs: [{ name: 'attestationData', type: 'bytes' }],
    name: 'verifyAttestation',
    outputs: [{ name: 'isValid', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalVerifications',
    outputs: [{ name: 'count', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// Contract configuration
export function getMonadVerifyContract(chainId: number) {
  const address = getContractAddress('monadVerify', chainId)
  if (!address) {
    throw new Error(`MonadVerify contract not deployed on chain ${chainId}`)
  }
  
  return {
    address: address as Address,
    abi: MONAD_VERIFY_ABI,
  }
}

export function getPrimusVerifierContract(chainId: number) {
  const address = getContractAddress('primus', chainId)
  if (!address) {
    throw new Error(`Primus contract not found on chain ${chainId}`)
  }
  
  return {
    address: address as Address,
    abi: PRIMUS_VERIFIER_ABI,
  }
}

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Hardhat local network
  31337: {
    monadVerify: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    primusVerifier: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  },
  // Monad Testnet
  10143: {
    monadVerify: import.meta.env.VITE_MONAD_VERIFY_CONTRACT_TESTNET || '',
    primusVerifier: import.meta.env.VITE_PRIMUS_CONTRACT_TESTNET || '0x1Ad7fD53206fDc3979C672C0466A1c48AF47B431',
  },
  // Monad Mainnet
  143: {
    monadVerify: import.meta.env.VITE_MONAD_VERIFY_CONTRACT_MAINNET || '',
    primusVerifier: import.meta.env.VITE_PRIMUS_CONTRACT_MAINNET || '',
  },
} as const
