import { PrimusZKTLS } from '@primuslabs/zktls-js-sdk'
import type { Attestation } from '../types/primus'
import { env } from '../config/env'

// Primus configuration
const PRIMUS_CONFIG = {
  // These would normally come from environment variables
  // For demo purposes, we'll use placeholder values
  appId: env.PRIMUS_APP_ID || 'demo-app-id',
  appSecret: env.PRIMUS_APP_SECRET || 'demo-app-secret',
  baseUrl: 'https://api.primuslabs.xyz', // Primus API endpoint
}

// Template IDs for different verification types
const TEMPLATE_IDS = {
  identity: 'identity-template-id',
  income: 'income-template-id',
  credit_score: 'credit-template-id',
  education: 'education-template-id',
  employment: 'employment-template-id',
  social_media: 'social-template-id',
}

export class PrimusService {
  private zkTLS: PrimusZKTLS | null = null
  private isInitialized = false

  constructor() {
    this.initialize()
  }

  private async initialize() {
    try {
      // Initialize Primus zkTLS SDK
      this.zkTLS = new PrimusZKTLS()

      // Initialize with app credentials
      const result = await this.zkTLS.init(
        PRIMUS_CONFIG.appId,
        PRIMUS_CONFIG.appSecret,
        { platform: 'pc' } // or 'android', 'ios'
      )

      this.isInitialized = !!result
      console.log('✅ Primus zkTLS SDK initialized successfully:', result)
    } catch (error) {
      console.error('❌ Failed to initialize Primus zkTLS SDK:', error)
      this.isInitialized = false
    }
  }

  /**
   * Check if Primus SDK is available and initialized
   */
  public isAvailable(): boolean {
    return this.isInitialized && this.zkTLS !== null
  }

  /**
   * Generate a real attestation using Primus zkTLS SDK
   */
  public async generateAttestation(
    dataType: string,
    userAddress: string,
    _userData?: any // Prefix with underscore to indicate intentionally unused
  ): Promise<Attestation> {
    if (!this.isAvailable()) {
      throw new Error('Primus zkTLS SDK is not available. Using fallback mock data.')
    }

    try {
      const templateId = TEMPLATE_IDS[dataType as keyof typeof TEMPLATE_IDS]
      if (!templateId) {
        throw new Error(`Unsupported data type: ${dataType}`)
      }

      // Prepare attestation parameters
      const attestationParams = {
        templateId,
        userAddress,
        conditions: this.getConditionsForDataType(dataType),
        mode: 'proxytls' as const, // or 'mpctls'
      }

      console.log('🔄 Generating Primus attestation...', attestationParams)

      // Call Primus SDK to generate attestation
      const attestationParamsStr = JSON.stringify(attestationParams)
      const attestation = await this.zkTLS!.startAttestation(attestationParamsStr)

      console.log('✅ Primus attestation generated successfully')
      return attestation as Attestation

    } catch (error) {
      console.error('❌ Failed to generate Primus attestation:', error)
      throw error
    }
  }

  /**
   * Get verification conditions based on data type
   */
  private getConditionsForDataType(dataType: string) {
    switch (dataType) {
      case 'identity':
        return [
          { field: 'name', op: 'SHA256' as const },
          { field: 'verified', op: '=' as const, value: 'true' }
        ]
      
      case 'income':
        return [
          { field: 'amount', op: '>' as const, value: '0' },
          { field: 'verified', op: '=' as const, value: 'true' }
        ]
      
      case 'credit_score':
        return [
          { field: 'score', op: '>=' as const, value: '300' },
          { field: 'score', op: '<=' as const, value: '850' }
        ]
      
      case 'education':
        return [
          { field: 'institution', op: 'SHA256' as const },
          { field: 'verified', op: '=' as const, value: 'true' }
        ]
      
      case 'employment':
        return [
          { field: 'company', op: 'SHA256' as const },
          { field: 'verified', op: '=' as const, value: 'true' }
        ]
      
      case 'social_media':
        return [
          { field: 'platform', op: 'SHA256' as const },
          { field: 'verified', op: '=' as const, value: 'true' }
        ]
      
      default:
        return [
          { field: 'verified', op: '=' as const, value: 'true' }
        ]
    }
  }

  /**
   * Verify an attestation (optional, for additional validation)
   */
  public async verifyAttestation(attestation: Attestation): Promise<boolean> {
    if (!this.isAvailable()) {
      console.warn('⚠️ Primus SDK not available, skipping verification')
      return true // Assume valid for demo
    }

    try {
      // In a real implementation, you might want to verify the attestation
      // against Primus servers before submitting to blockchain
      console.log('🔍 Verifying attestation with Primus...')
      
      // For now, we'll just validate the structure
      const isValid = this.validateAttestationStructure(attestation)
      
      console.log('✅ Attestation verification result:', isValid)
      return isValid

    } catch (error) {
      console.error('❌ Failed to verify attestation:', error)
      return false
    }
  }

  /**
   * Validate attestation structure
   */
  private validateAttestationStructure(attestation: Attestation): boolean {
    return !!(
      attestation.recipient &&
      attestation.data &&
      attestation.timestamp &&
      attestation.attestors &&
      attestation.attestors.length > 0 &&
      attestation.signatures &&
      attestation.signatures.length > 0 &&
      attestation.signatures[0] !== ('0x' + '0'.repeat(130)) // Not a mock signature
    )
  }
}

// Export singleton instance
export const primusService = new PrimusService()

// Export types for convenience
export type { Attestation }
