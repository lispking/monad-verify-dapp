import type { VercelRequest, VercelResponse } from '@vercel/node'

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST method is allowed',
      code: 'METHOD_NOT_ALLOWED'
    })
  }

  try {
    const { type, data } = req.body

    console.log(`📝 Verification request received:`, {
      type,
      data: data?.substring(0, 50) + (data?.length > 50 ? '...' : ''),
      timestamp: new Date().toISOString()
    })

    // Validate request
    if (!type || !data) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Both type and data are required',
        code: 'INVALID_REQUEST'
      })
    }

    // Simulate processing time (1-3 seconds)
    const processingTime = Math.random() * 2000 + 1000
    await delay(processingTime)

    // Generate verification result
    const result = generateVerificationResult(type, data)

    console.log(`✅ Verification completed:`, {
      verificationId: result.verificationId,
      type: result.type,
      verified: result.verified,
      confidence: result.data.confidence,
      processingTime: `${Math.round(processingTime)}ms`
    })

    return res.status(200).json(result)

  } catch (error) {
    console.error('❌ Verification error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process verification request',
      code: 'PROCESSING_ERROR'
    })
  }
}
