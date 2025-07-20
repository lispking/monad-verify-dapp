import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useVerificationHistory } from '../hooks/useVerificationHistory'

export default function RecentVerifications() {
  const { records } = useVerificationHistory()

  // Get the 3 most recent verifications
  const recentVerifications = records.slice(0, 3)
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Recent Verifications
      </h3>
      
      {recentVerifications.length > 0 ? (
        <div className="space-y-4">
          {recentVerifications.map((verification) => (
            <div
              key={verification.id}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {verification.status === 'verified' ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  ) : verification.status === 'failed' ? (
                    <XCircleIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <ClockIcon className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {verification.dataType.charAt(0).toUpperCase() + verification.dataType.slice(1)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {verification.requestId || 'No ID'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-medium ${
                  verification.status === 'verified'
                    ? 'text-green-600 dark:text-green-400'
                    : verification.status === 'failed'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {verification.status === 'verified' ? 'Verified' :
                   verification.status === 'failed' ? 'Failed' : 'Pending'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {verification.timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <ClockIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
            No verifications yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your verification history will appear here
          </p>
        </div>
      )}
    </div>
  )
}
