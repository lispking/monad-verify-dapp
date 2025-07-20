import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

// Mock data for recent verifications
const mockVerifications = [
  {
    id: '1',
    dataType: 'Identity',
    status: 'completed',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    requestId: '0x1234...5678',
  },
  {
    id: '2',
    dataType: 'Income',
    status: 'completed',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    requestId: '0x2345...6789',
  },
  {
    id: '3',
    dataType: 'Credit Score',
    status: 'pending',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    requestId: '0x3456...7890',
  },
]

export default function RecentVerifications() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Recent Verifications
      </h3>
      
      {mockVerifications.length > 0 ? (
        <div className="space-y-4">
          {mockVerifications.map((verification) => (
            <div
              key={verification.id}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {verification.status === 'completed' ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    <ClockIcon className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {verification.dataType}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {verification.requestId}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-medium ${
                  verification.status === 'completed' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {verification.status === 'completed' ? 'Verified' : 'Pending'}
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
