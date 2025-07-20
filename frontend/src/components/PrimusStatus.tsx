import { useState, useEffect } from 'react'
import { ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { verificationService } from '../services/verificationService'

interface PrimusStatusProps {
  className?: string
}

export function PrimusStatus({ className = '' }: PrimusStatusProps) {
  const [status, setStatus] = useState<{
    primusAvailable: boolean
    testModeRecommended: boolean
    message: string
    errorCode?: string
  } | null>(null)

  useEffect(() => {
    const checkStatus = async () => {
      const envStatus = verificationService.getEnvironmentStatus()
      setStatus(envStatus)
    }

    checkStatus()
  }, [])

  if (!status) {
    return null
  }

  const getStatusIcon = () => {
    if (status.primusAvailable) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />
    } else if (status.testModeRecommended) {
      return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
    } else {
      return <InformationCircleIcon className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusColor = () => {
    if (status.primusAvailable) {
      return 'border-green-200 bg-green-50'
    } else if (status.testModeRecommended) {
      return 'border-yellow-200 bg-yellow-50'
    } else {
      return 'border-blue-200 bg-blue-50'
    }
  }

  return (
    <div className={`rounded-lg border p-4 ${getStatusColor()} ${className}`}>
      <div className="flex items-start space-x-3">
        {getStatusIcon()}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">
            {status.primusAvailable ? 'Primus zkTLS Ready' : 'Development Mode'}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {status.message}
          </p>
          
          {!status.primusAvailable && (
            <div className="mt-3 space-y-2">
              <h4 className="text-sm font-medium text-gray-900">
                {status.errorCode === '00006' ? 'Browser Extension Required' : 'To enable real zkTLS verification:'}
              </h4>

              {status.errorCode === '00006' ? (
                <div className="space-y-2">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                    <p className="text-sm text-amber-800">
                      <strong>Extension Required:</strong> Primus zkTLS requires a browser extension (v0.3.15+) that is not currently available publicly.
                    </p>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>
                      Contact{' '}
                      <a
                        href="https://primuslabs.xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Primus Labs
                      </a>
                      {' '}for browser extension access
                    </li>
                    <li>Request developer access to the zkTLS browser extension</li>
                    <li>Install the extension when provided</li>
                    <li>Restart the application</li>
                  </ol>
                </div>
              ) : (
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>
                    Create a project at{' '}
                    <a
                      href="https://dev.primuslabs.xyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Primus Developer Hub
                    </a>
                  </li>
                  <li>
                    Configure your app credentials in environment variables:
                    <div className="mt-1 p-2 bg-gray-100 rounded text-xs font-mono">
                      VITE_PRIMUS_APP_ID=your-app-id<br />
                      VITE_PRIMUS_APP_SECRET=your-app-secret
                    </div>
                  </li>
                  <li>Contact Primus Labs for browser extension access</li>
                  <li>Restart the application</li>
                </ol>
              )}

              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs text-blue-800">
                  <strong>Development Mode:</strong> Currently using mock attestations for testing and development.
                  All UI functionality works, but attestations are not real zkTLS proofs.
                  This is normal for development environments.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PrimusStatus
