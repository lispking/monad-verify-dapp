import { useQuery } from '@tanstack/react-query'
import { useReadContract, useChainId } from 'wagmi'
import type { Address } from 'viem'
import type { UserProfile, UserStats, UseUserProfileReturn, DataType } from '../types/index'
import { MONAD_VERIFY_ABI, getMonadVerifyAddress } from '../config/contracts'
import { monadTestnet } from '../config/wagmi'

export function useUserProfile(address?: Address): UseUserProfileReturn {
  const chainId = useChainId()

  // Get user profile from contract
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile
  } = useReadContract({
    address: chainId === monadTestnet.id ? getMonadVerifyAddress(chainId) : undefined,
    abi: MONAD_VERIFY_ABI,
    functionName: 'getUserProfile',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && chainId === monadTestnet.id,
    },
  })

  // Process profile data
  const profile: UserProfile | null = profileData ? {
    verificationCount: (profileData as any)[0] as bigint,
    lastVerificationTime: (profileData as any)[1] as bigint,
    isVerified: (profileData as any)[2] as boolean,
  } : null

  // Calculate stats from profile data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats', address, profile],
    queryFn: async (): Promise<UserStats | null> => {
      if (!profile || !address) return null

      // Calculate verification score based on profile
      let score = 0
      if (profile.isVerified) {
        score += 20 // Base score for being verified

        // Additional points for multiple verifications (max 50 points)
        const countBonus = Math.min(Number(profile.verificationCount) * 10, 50)
        score += countBonus

        // Recency bonus (max 30 points)
        const timeSinceLastVerification = Date.now() / 1000 - Number(profile.lastVerificationTime)
        const daysSince = timeSinceLastVerification / (24 * 60 * 60)

        if (daysSince < 30) {
          score += 30
        } else if (daysSince < 90) {
          score += 20
        } else if (daysSince < 180) {
          score += 10
        }
      }

      // Mock verified data types for now
      // In a real implementation, this would come from contract events or additional contract calls
      const verifiedDataTypes: DataType[] = profile.isVerified ? ['identity', 'income'] : []

      return {
        verificationCount: Number(profile.verificationCount),
        lastVerification: profile.lastVerificationTime > 0 ?
          new Date(Number(profile.lastVerificationTime) * 1000) :
          undefined,
        verifiedDataTypes,
        verificationScore: Math.min(score, 100),
      }
    },
    enabled: !!profile && !!address,
  })

  const refetch = () => {
    refetchProfile()
  }

  return {
    profile,
    stats: stats || null,
    isLoading: profileLoading || statsLoading,
    error: profileError?.message || null,
    refetch,
  }
}
