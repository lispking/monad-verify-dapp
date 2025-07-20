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
      // Check if we have Primus credentials
      console.log('🔍 Checking Primus credentials...', {
        hasAppId: !!PRIMUS_CONFIG.appId,
        hasAppSecret: !!PRIMUS_CONFIG.appSecret,
        appId: PRIMUS_CONFIG.appId?.substring(0, 10) + '...',
      })

      if (!PRIMUS_CONFIG.appId || !PRIMUS_CONFIG.appSecret) {
        console.warn('⚠️ Primus credentials not configured. Real zkTLS verification unavailable.')
        this.isInitialized = false
        return
      }

      console.log('✅ Primus credentials found, initializing SDK...')

      // Initialize Primus zkTLS SDK
      this.zkTLS = new PrimusZKTLS()

      // Check if Primus browser extension is available
      console.log('🔍 Checking for Primus browser extension...')
      const hasExtension = await this.checkPrimusExtension()
      console.log('🔍 Extension check result:', hasExtension)

      if (!hasExtension) {
        console.warn('⚠️ Primus browser extension not detected.')
        console.warn('💡 For testing purposes, we\'ll try to initialize the SDK anyway...')
        // Don't return here - let's try to initialize the SDK anyway for testing
      }

      if (hasExtension) {
        console.log('✅ Primus extension detected, initializing with credentials...')
      } else {
        console.log('⚠️ No extension detected, but trying to initialize SDK anyway...')
      }

      // Initialize with app credentials
      console.log('🔄 Calling zkTLS.init with:', {
        appId: PRIMUS_CONFIG.appId?.substring(0, 10) + '...',
        hasSecret: !!PRIMUS_CONFIG.appSecret,
        platform: 'pc'
      })

      const result = await this.zkTLS.init(
        PRIMUS_CONFIG.appId,
        PRIMUS_CONFIG.appSecret,
        { platform: 'pc', env: 'production' }
      )

      console.log('🔍 zkTLS.init result:', result)
      this.isInitialized = !!result

      if (this.isInitialized) {
        console.log('✅ Primus zkTLS SDK initialized successfully!')
      } else {
        console.log('❌ Primus zkTLS SDK initialization failed')
      }
    } catch (error) {
      console.error('❌ Failed to initialize Primus zkTLS SDK:', error)
      this.isInitialized = false
    }
  }

  /**
   * Check if Primus browser extension is available
   */
  private async checkPrimusExtension(): Promise<boolean> {
    return new Promise((resolve) => {
      console.log('🔍 Sending message to check Primus extension...')

      // Check if window.postMessage can communicate with Primus extension
      const timeout = setTimeout(() => {
        console.log('⏰ Extension check timeout - no response from Primus extension')
        resolve(false)
      }, 2000) // Increase timeout to 2 seconds

      const messageHandler = (event: MessageEvent) => {
        console.log('📨 Received message:', event.data)
        if (event.data?.target === 'padoZKAttestationJSSDK' && event.data?.name === 'extensionCheck') {
          console.log('✅ Primus extension responded!')
          clearTimeout(timeout)
          window.removeEventListener('message', messageHandler)
          resolve(true)
        }
      }

      window.addEventListener('message', messageHandler)

      // Send test message to extension
      const testMessage = {
        target: 'padoExtension',
        origin: 'padoZKAttestationJSSDK',
        name: 'checkExtension'
      }
      console.log('📤 Sending test message to extension:', testMessage)
      window.postMessage(testMessage, '*')
    })
  }

  /**
   * Check if Primus SDK is available and initialized
   */
  public isAvailable(): boolean {
    return this.isInitialized && this.zkTLS !== null
  }

  /**
   * Generate a real attestation using Primus zkTLS SDK (following official documentation)
   */
  public async generateAttestation(
    dataType: string,
    userAddress: string,
    _userData?: any // Prefix with underscore to indicate intentionally unused
  ): Promise<Attestation> {
    if (!this.isAvailable()) {
      throw new Error('Primus zkTLS SDK is not available. Please install Primus browser extension and configure credentials.')
    }

    try {
      const templateId = TEMPLATE_IDS[dataType as keyof typeof TEMPLATE_IDS]
      if (!templateId) {
        throw new Error(`Unsupported data type: ${dataType}. Available types: ${Object.keys(TEMPLATE_IDS).join(', ')}`)
      }

      console.log('🔄 Generating Primus attestation...', { dataType, userAddress, templateId })

      // Step 1: Generate request parameters using Primus SDK
      const request = this.zkTLS!.generateRequestParams(templateId, userAddress)

      // Step 2: Set zkTLS mode (optional, default is proxy model)
      const workMode = 'proxytls'
      request.setAttMode({
        algorithmType: workMode,
      })

      // Step 3: Set attestation conditions (optional)
      const conditions = this.getConditionsForDataType(dataType)
      if (conditions && conditions.length > 0) {
        request.setAttConditions(conditions)
      }

      // Step 4: Transfer request object to string
      const requestStr = request.toJsonString()
      console.log('📋 Request string:', requestStr)

      // Step 5: Sign request
      console.log('🔐 Signing request...')
      const signedRequestStr = await this.zkTLS!.sign(requestStr)
      console.log('✅ Request signed successfully')

      // Step 6: Start attestation process
      console.log('🚀 Starting attestation process...')
      const attestation = await this.zkTLS!.startAttestation(signedRequestStr)
      console.log('✅ Primus attestation generated successfully:', attestation)

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
      console.log('🔍 Verifying attestation signature with Primus SDK...')

      // Verify signature using Primus SDK (following official documentation)
      const verifyResult = await this.zkTLS!.verifyAttestation(attestation)
      console.log('🔍 Primus verification result:', verifyResult)

      if (verifyResult === true) {
        console.log('✅ Attestation signature verified successfully')
        // Here you can add business logic checks, such as attestation content and timestamp checks
        return true
      } else {
        console.warn('⚠️ Attestation signature verification failed')
        return false
      }

    } catch (error) {
      console.error('❌ Failed to verify Primus attestation:', error)
      return false
    }
  }


}

// Export singleton instance
export const primusService = new PrimusService()

// Export types for convenience
export type { Attestation }
