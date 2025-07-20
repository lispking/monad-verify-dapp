import { useState, useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useChainId, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import toast from 'react-hot-toast'

import type { DataType, VerificationStatus, UseVerificationReturn, VerificationFormData, Attestation } from '../types/index'
import { createMockAttestation } from '../types/index'
import { toContractAttestation } from '../types/contract'
import { MONAD_VERIFY_ABI, getMonadVerifyAddress } from '../config/contracts'
import { monadTestnet } from '../config/wagmi'
import { useForceNetwork } from './useForceNetwork'

export function useVerification(): UseVerificationReturn {
  const { address } = useAccount()
  const chainId = useChainId()
  const [state, setState] = useState({
    status: 'idle' as VerificationStatus,
    requestId: undefined as `0x${string}` | undefined,
    error: undefined as string | undefined,
    progress: 0,
    currentStep: '',
  })

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()
  const { ensureCorrectNetwork } = useForceNetwork()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Generate mock attestation data for testing
  const generateMockAttestationData = useCallback((dataType: DataType, userAddress: string): Attestation => {
    // In a real implementation, this would come from Primus SDK
    return createMockAttestation(userAddress, `verified_${dataType}_data`, dataType)
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

      // Generate mock attestation data
      const attestationData = generateMockAttestationData(data.dataType, address)
      
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
  }, [address, chainId, writeContract, generateMockAttestationData])

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
    if (isConfirmed && state.status === 'requesting') {
      setState(prev => ({
        ...prev,
        status: 'completed',
        progress: 100,
        currentStep: 'Verification request submitted successfully!',
      }))
      toast.success('Verification request submitted!')
    } else if (isConfirmed && state.status === 'verifying') {
      setState(prev => ({
        ...prev,
        status: 'completed',
        progress: 100,
        currentStep: 'Verification completed successfully!',
      }))
      toast.success('Verification completed!')
    }
  }, [isConfirmed, state.status])

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
