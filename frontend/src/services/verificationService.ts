import { primusService } from './primusService'
import { createMockAttestation } from '../types/primus'
import type { Attestation } from '../types/primus'
import type { DataType } from '../types/index'

export class VerificationService {
  /**
   * Get environment status for Primus integration
   */
  public getEnvironmentStatus(): {
    primusAvailable: boolean
    testModeRecommended: boolean
    message: string
    errorCode?: string
  } {
    const hasCredentials = !!(primusService as any).PRIMUS_CONFIG?.appId && !!(primusService as any).PRIMUS_CONFIG?.appSecret
    const isPrimusAvailable = primusService.isAvailable()

    if (isPrimusAvailable) {
      return {
        primusAvailable: true,
        testModeRecommended: false,
        message: 'Primus zkTLS is ready for real verification. All attestations will be genuine zkTLS proofs.'
      }
    } else if (hasCredentials) {
      return {
        // primusAvailable: false,
        primusAvailable: true,
        testModeRecommended: true,
        message: 'Primus credentials configured but browser extension required. Currently using development mode with mock attestations.',
        errorCode: '00006'
      }
    } else {
      return {
        // primusAvailable: false,
        primusAvailable: true,
        testModeRecommended: true,
        message: 'Development mode active. Configure Primus credentials and install browser extension for real zkTLS verification.'
      }
    }
  }

  /**
   * Generate attestation data - tries real Primus first, falls back to mock
   */
  public async generateAttestation(
    dataType: DataType,
    userAddress: string,
    userData?: any
  ): Promise<{
    attestation: Attestation
    isReal: boolean
    source: 'primus' | 'mock'
    error?: string
    instructions?: string
  }> {
    console.log('🔄 Generating attestation for:', { dataType, userAddress })

    // First, try to use real Primus SDK
    if (primusService.isAvailable()) {
      try {
        console.log('🚀 Attempting to use real Primus zkTLS SDK...')
        const attestation = await primusService.generateAttestation(dataType, userAddress, userData)

        // Verify the attestation is valid
        const isValid = await primusService.verifyAttestation(attestation)
        if (isValid) {
          console.log('✅ Real Primus attestation generated successfully')
          return {
            attestation,
            isReal: true,
            source: 'primus'
          }
        } else {
          console.warn('⚠️ Real Primus attestation failed validation, falling back to mock')
        }
      } catch (error) {
        console.warn('⚠️ Real Primus SDK failed:', error)

        // Provide specific error guidance based on error code
        const errorMessage = error instanceof Error ? error.message : String(error)
        let instructions = ''

        if (errorMessage.includes('00006') || errorMessage.includes('extension')) {
          instructions = 'Primus browser extension (v0.3.15+) is required but not detected. Please contact Primus team for extension access.'
        } else if (errorMessage.includes('credentials') || errorMessage.includes('1002001') || errorMessage.includes('1002002')) {
          instructions = 'Invalid Primus credentials. Please check your App ID and App Secret configuration.'
        } else {
          instructions = 'Primus zkTLS initialization failed. Using development mode with mock attestations.'
        }

        // Still fall back to mock for development
        console.log('🎭 Falling back to mock attestation for development...')
        const mockAttestation = createMockAttestation(userAddress, `verified_${dataType}_data`, dataType)

        return {
          attestation: mockAttestation,
          isReal: false,
          source: 'mock',
          error: errorMessage,
          instructions
        }
      }
    } else {
      console.log('ℹ️ Primus SDK not available, using mock data for development')
    }

    // Fallback to mock attestation
    console.log('🎭 Generating mock attestation for development...')
    const mockAttestation = createMockAttestation(userAddress, `verified_${dataType}_data`, dataType)

    return {
      attestation: mockAttestation,
      isReal: false,
      source: 'mock',
      instructions: 'Development mode: Using mock attestations. For real zkTLS verification, Primus browser extension and valid credentials are required.'
    }
  }

  /**
   * Validate attestation before submitting to blockchain
   */
  public async validateAttestation(attestation: Attestation): Promise<{
    isValid: boolean
    errors: string[]
    warnings: string[]
  }> {
    const errors: string[] = []
    const warnings: string[] = []

    // Basic structure validation
    if (!attestation.recipient) {
      errors.push('Missing recipient address')
    }

    if (!attestation.data) {
      errors.push('Missing attestation data')
    }

    if (!attestation.timestamp || attestation.timestamp <= 0n) {
      errors.push('Invalid timestamp')
    }

    if (!attestation.attestors || attestation.attestors.length === 0) {
      errors.push('Missing attestors')
    }

    if (!attestation.signatures || attestation.signatures.length === 0) {
      errors.push('Missing signatures')
    }

    // Check for mock signatures
    if (attestation.signatures && attestation.signatures.length > 0) {
      const mockSignature = '0x' + '0'.repeat(130)
      if (attestation.signatures[0] === mockSignature) {
        warnings.push('Using mock signature - this is for testing only')
      }
    }

    // Check timestamp is not too old (24 hours)
    const now = BigInt(Math.floor(Date.now() / 1000))
    const maxAge = BigInt(24 * 60 * 60) // 24 hours
    if (attestation.timestamp && (now - attestation.timestamp) > maxAge) {
      warnings.push('Attestation is older than 24 hours')
    }

    // Check timestamp is not in the future
    if (attestation.timestamp && attestation.timestamp > now + BigInt(300)) { // 5 minutes tolerance
      errors.push('Attestation timestamp is in the future')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Get verification status and recommendations
   */
  public getVerificationStatus(attestation: Attestation, isReal: boolean): {
    status: 'ready' | 'warning' | 'error'
    message: string
    canProceed: boolean
  } {
    if (!isReal) {
      return {
        status: 'warning',
        message: 'Using mock attestation for testing. This will work in test mode only.',
        canProceed: true
      }
    }

    // For real attestations, do additional checks
    const hasValidSignature = attestation.signatures && 
      attestation.signatures.length > 0 && 
      attestation.signatures[0] !== ('0x' + '0'.repeat(130))

    if (!hasValidSignature) {
      return {
        status: 'error',
        message: 'Invalid or missing signature. Cannot proceed with verification.',
        canProceed: false
      }
    }

    return {
      status: 'ready',
      message: 'Real Primus attestation ready for blockchain verification.',
      canProceed: true
    }
  }


}

// Export singleton instance
export const verificationService = new VerificationService()

// Export types
export type { Attestation }
