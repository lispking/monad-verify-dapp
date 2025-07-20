import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only GET method is allowed',
      code: 'METHOD_NOT_ALLOWED'
    })
  }

  return res.status(200).json({
    status: 'healthy',
    service: 'MonadVerify Mock API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: 'production',
    platform: 'vercel'
  })
}
