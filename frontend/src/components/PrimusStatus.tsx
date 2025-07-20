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
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                    <p className="text-sm text-amber-800">
                      <strong>Extension Required:</strong> Primus zkTLS requires the Pado browser extension to function properly.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://chromewebstore.google.com/detail/pado/oeiomhmbaapihbilkfkhmlajkeegnjhe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Install Pado Extension
                    </a>

                    <button
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 4v6h6M23 20v-6h-6"/>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                      </svg>
                      Refresh Page
                    </button>
                  </div>

                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Click "Install Pado Extension" above to open the Chrome Web Store</li>
                    <li>Click "Add to Chrome" to install the extension</li>
                    <li>Click "Refresh Page" above or restart the application</li>
                    <li>The extension should now be detected automatically</li>
                  </ol>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> The Pado extension is the official browser extension for Primus zkTLS verification.
                      Make sure you install it from the official Chrome Web Store link above.
                    </p>
                  </div>
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
                  <li>Install the Pado browser extension from the Chrome Web Store</li>
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
