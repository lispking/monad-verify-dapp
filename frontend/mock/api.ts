import { MockMethod } from 'vite-plugin-mock'

// Mock database for verification results
const verificationResults = new Map<string, any>()

// Helper function to simulate verification delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to generate mock verification result
function generateVerificationResult(type: string, data: string) {
  const baseResult = {
    verified: true,
    timestamp: new Date().toISOString(),
    verificationId: `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    provider: 'MonadVerify Mock API',
    version: '1.0.0'
  }

  switch (type) {
    case 'identity':
      return {
        ...baseResult,
        type: 'identity',
        data: {
          name: data,
          verified: true,
          confidence: 0.95,
          sources: ['government_id', 'biometric_match'],
          riskScore: 'low'
        }
      }

    case 'income':
      return {
        ...baseResult,
        type: 'income',
        data: {
          amount: parseFloat(data) || 50000,
          currency: 'USD',
          verified: true,
          confidence: 0.92,
          sources: ['bank_statements', 'tax_records'],
          period: 'annual'
        }
      }

    case 'education':
      return {
        ...baseResult,
        type: 'education',
        data: {
          institution: data,
          verified: true,
          confidence: 0.98,
          sources: ['diploma_verification', 'institution_records'],
          degree: 'Bachelor of Science',
          graduationYear: 2020
        }
      }

    case 'employment':
      return {
        ...baseResult,
        type: 'employment',
        data: {
          company: data,
          verified: true,
          confidence: 0.94,
          sources: ['hr_records', 'payroll_verification'],
          position: 'Software Engineer',
          startDate: '2021-01-15'
        }
      }

    case 'credit':
      return {
        ...baseResult,
        type: 'credit',
        data: {
          score: parseInt(data) || 750,
          verified: true,
          confidence: 0.96,
          sources: ['credit_bureau', 'payment_history'],
          rating: 'excellent',
          lastUpdated: new Date().toISOString()
        }
      }

    default:
      return {
        ...baseResult,
        type: 'unknown',
        data: {
          value: data,
          verified: false,
          confidence: 0.0,
          sources: [],
          error: 'Unsupported verification type'
        }
      }
  }
}

export default [
  // Main verification endpoint
  {
    url: '/api/verify',
    method: 'post',
    response: async ({ body }: { body: { type: string; data: string } }) => {
      const { type, data } = body

      console.log(`📝 Verification request received:`, {
        type,
        data: data?.substring(0, 50) + (data?.length > 50 ? '...' : ''),
        timestamp: new Date().toISOString()
      })

      // Validate request
      if (!type || !data) {
        return {
          error: 'Missing required fields',
          message: 'Both type and data are required',
          code: 'INVALID_REQUEST'
        }
      }

      // Simulate processing time (1-3 seconds)
      const processingTime = Math.random() * 2000 + 1000
      await delay(processingTime)

      // Generate verification result
      const result = generateVerificationResult(type, data)
      
      // Store result for later retrieval
      verificationResults.set(result.verificationId, result)

      console.log(`✅ Verification completed:`, {
        verificationId: result.verificationId,
        type: result.type,
        verified: result.verified,
        confidence: result.data.confidence,
        processingTime: `${Math.round(processingTime)}ms`
      })

      return result
    }
  },

  // Get verification result by ID
  {
    url: '/api/verify/:id',
    method: 'get',
    response: ({ query }: { query: { id: string } }) => {
      const { id } = query
      const result = verificationResults.get(id)

      if (!result) {
        return {
          error: 'Verification not found',
          message: `No verification found with ID: ${id}`,
          code: 'NOT_FOUND'
        }
      }

      return result
    }
  },

  // Health check endpoint
  {
    url: '/api/health',
    method: 'get',
    response: () => {
      return {
        status: 'healthy',
        service: 'MonadVerify Mock API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        totalVerifications: verificationResults.size
      }
    }
  },

  // List all verification types
  {
    url: '/api/types',
    method: 'get',
    response: () => {
      return {
        supportedTypes: [
          {
            type: 'identity',
            description: 'Identity verification using government documents',
            requiredData: 'Full name'
          },
          {
            type: 'income',
            description: 'Income verification using financial records',
            requiredData: 'Annual income amount'
          },
          {
            type: 'education',
            description: 'Education verification using institutional records',
            requiredData: 'Institution name'
          },
          {
            type: 'employment',
            description: 'Employment verification using HR records',
            requiredData: 'Company name'
          },
          {
            type: 'credit',
            description: 'Credit score verification using credit bureaus',
            requiredData: 'Expected credit score'
          }
        ]
      }
    }
  }
] as MockMethod[]
