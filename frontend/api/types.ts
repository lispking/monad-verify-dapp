import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only GET method is allowed',
      code: 'METHOD_NOT_ALLOWED'
    })
  }

  return res.status(200).json({
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
  })
}
