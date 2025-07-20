import { useState, useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useChainId, useAccount, usePublicClient } from 'wagmi'
import { parseEther, parseAbiItem } from 'viem'
import toast from 'react-hot-toast'

import type { DataType, VerificationStatus, UseVerificationReturn, VerificationFormData } from '../types/index'
import type { Attestation } from '../types/primus'
import { toContractAttestation } from '../types/contract'
import { verificationService } from '../services/verificationService'
import { MONAD_VERIFY_ABI, getMonadVerifyAddress } from '../config/contracts'
import { monadTestnet } from '../config/wagmi'
import { useForceNetwork } from './useForceNetwork'
import { useVerificationHistory } from './useVerificationHistory'

export function useVerification(): UseVerificationReturn {
  const { address } = useAccount()
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const [state, setState] = useState({
    status: 'idle' as VerificationStatus,
    requestId: undefined as `0x${string}` | undefined,
    error: undefined as string | undefined,
    progress: 0,
    currentStep: '',
  })

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()
  const { ensureCorrectNetwork } = useForceNetwork()
  const { refresh: refreshHistory } = useVerificationHistory()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Generate attestation data using verification service
  const generateAttestationData = useCallback(async (dataType: DataType, userAddress: string): Promise<{
    attestation: Attestation
    isReal: boolean
    source: 'primus' | 'mock'
  }> => {
    return await verificationService.generateAttestation(dataType, userAddress)
  }, [])

  const requestVerification = useCallback(async (data: VerificationFormData) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }



    try {
      // Force network switch before any transaction
      console.log('🔄 Ensuring correct network before verification request...')
      await ensureCorrectNetwork()
      setState(prev => ({
        ...prev,
        status: 'requesting',
        progress: 10,
        currentStep: 'Preparing verification request...',
        error: undefined,
      }))

      // Simulate Primus SDK integration
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setState(prev => ({
        ...prev,
        progress: 30,
        currentStep: 'Generating attestation data...',
      }))

      // Generate attestation data (real Primus or mock)
      const { attestation: attestationData, isReal, source } = await generateAttestationData(data.dataType, address)

      console.log(`📋 Generated ${source} attestation:`, { isReal, dataType: data.dataType })

      // Validate attestation
      const validation = await verificationService.validateAttestation(attestationData)
      if (!validation.isValid) {
        throw new Error(`Invalid attestation: ${validation.errors.join(', ')}`)
      }

      // Show warnings if any
      if (validation.warnings.length > 0) {
        console.warn('⚠️ Attestation warnings:', validation.warnings)
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setState(prev => ({
        ...prev,
        progress: 50,
        currentStep: 'Submitting to blockchain...',
      }))

      // Get verification fee
      const verificationFee = parseEther('0.01') // Mock fee

      // Submit verification request to contract
      const contractAttestation = toContractAttestation(attestationData)

      // Force use Monad Testnet address regardless of current chainId
      const monadVerifyAddress = getMonadVerifyAddress(monadTestnet.id)

      console.log('🔗 Submitting verification request:', {
        chainId: chainId,
        requiredChainId: monadTestnet.id,
        contractAddress: monadVerifyAddress,
        dataType: data.dataType
      })

      writeContract({
        address: monadVerifyAddress,
        abi: MONAD_VERIFY_ABI,
        functionName: 'requestVerification',
        args: [data.dataType, contractAttestation] as any,
        value: verificationFee,
        chainId: monadTestnet.id, // Explicitly specify chain ID
      })

      setState(prev => ({
        ...prev,
        progress: 70,
        currentStep: 'Waiting for transaction confirmation...',
      }))

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        status: 'failed',
        error: error.message || 'Failed to request verification',
        currentStep: 'Verification request failed',
      }))
      throw error
    }
  }, [address, chainId, writeContract, generateAttestationData])

  const completeVerification = useCallback(async (requestId: `0x${string}`) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    try {
      // Force network switch before any transaction
      console.log('🔄 Ensuring correct network before verification completion...')
      await ensureCorrectNetwork()
      setState(prev => ({
        ...prev,
        status: 'verifying',
        progress: 80,
        currentStep: 'Completing verification...',
        requestId,
      }))

      // Submit completion to contract
      const monadVerifyAddress = getMonadVerifyAddress(monadTestnet.id)

      console.log('🔗 Completing verification:', {
        chainId: chainId,
        requiredChainId: monadTestnet.id,
        contractAddress: monadVerifyAddress,
        requestId
      })

      writeContract({
        address: monadVerifyAddress,
        abi: MONAD_VERIFY_ABI,
        functionName: 'completeVerification',
        args: [requestId],
        chainId: monadTestnet.id, // Explicitly specify chain ID
      })

      setState(prev => ({
        ...prev,
        progress: 90,
        currentStep: 'Finalizing verification...',
      }))

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        status: 'failed',
        error: error.message || 'Failed to complete verification',
        currentStep: 'Verification completion failed',
      }))
      throw error
    }
  }, [address, chainId, writeContract])

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      requestId: undefined,
      error: undefined,
      progress: 0,
      currentStep: '',
    })
  }, [])

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && state.status === 'requesting' && hash) {
      // After requestVerification is confirmed, automatically call completeVerification
      setState(prev => ({
        ...prev,
        status: 'verifying',
        progress: 80,
        currentStep: 'Verification request confirmed. Completing verification...',
      }))

      // Auto-complete verification after a short delay
      setTimeout(async () => {
        try {
          if (!publicClient) {
            throw new Error('Public client not available')
          }

          // Get the transaction receipt to extract the requestId from VerificationRequested event
          const receipt = await publicClient.getTransactionReceipt({ hash })

          // Find the VerificationRequested event
          const contractAddress = getMonadVerifyAddress(monadTestnet.id)

          // Get VerificationRequested events from this transaction
          const verificationEvents = await publicClient.getLogs({
            address: contractAddress,
            event: parseAbiItem('event VerificationRequested(address indexed user, bytes32 indexed requestId, string dataType, uint256 timestamp)'),
            fromBlock: receipt.blockNumber,
            toBlock: receipt.blockNumber,
            args: {
              user: address
            }
          })

          const verificationEvent = verificationEvents.find(event => event.transactionHash === hash)

          if (!verificationEvent || !verificationEvent.args.requestId) {
            throw new Error('Could not find VerificationRequested event in transaction receipt')
          }

          // Extract requestId from the event args
          const requestId = verificationEvent.args.requestId

          console.log('🔍 Extracted requestId from transaction:', requestId)

          await completeVerification(requestId)
        } catch (error: any) {
          console.error('Auto-completion failed:', error)
          setState(prev => ({
            ...prev,
            status: 'failed',
            error: error.message || 'Failed to complete verification',
            currentStep: 'Verification completion failed',
          }))
          toast.error('Failed to complete verification: ' + error.message)
        }
      }, 2000) // 2 second delay to allow for network propagation

    } else if (isConfirmed && state.status === 'verifying') {
      // Refresh verification history to get the latest data from blockchain
      refreshHistory()

      setState(prev => ({
        ...prev,
        status: 'completed',
        progress: 100,
        currentStep: 'Verification completed successfully!',
      }))
      toast.success('Verification completed!')
    }
  }, [isConfirmed, state.status, hash, refreshHistory, completeVerification])

  // Handle transaction errors
  useEffect(() => {
    if (writeError) {
      setState(prev => ({
        ...prev,
        status: 'failed',
        error: writeError.message,
        currentStep: 'Transaction failed',
      }))
      toast.error('Transaction failed: ' + writeError.message)
    }
  }, [writeError])

  // Update loading state
  useEffect(() => {
    if (isPending || isConfirming) {
      setState(prev => ({
        ...prev,
        currentStep: isPending ? 'Waiting for wallet confirmation...' : 'Transaction confirming...',
      }))
    }
  }, [isPending, isConfirming])

  return {
    state,
    requestVerification,
    completeVerification,
    reset,
  }
}
