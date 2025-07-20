import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  ShieldCheckIcon, 
  ClockIcon,
  DocumentCheckIcon 
} from '@heroicons/react/24/outline'

// Hooks
import { useUserProfile } from '../../hooks/useUserProfile'

// Components
import LoadingSpinner from '../LoadingSpinner'
import StatsCard from '../StatsCard'
import RecentVerifications from '../RecentVerifications'

export default function DashboardPage() {
  const { address } = useAccount()
  const { profile, stats, isLoading, error } = useUserProfile(address)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
          <div className="text-sm text-red-700 dark:text-red-400">
            Error loading dashboard: {error}
          </div>
        </div>
      </div>
    )
  }

  const dashboardStats = [
    {
      name: 'Total Verifications',
      value: stats?.verificationCount || 0,
      icon: DocumentCheckIcon,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      name: 'Verification Score',
      value: `${stats?.verificationScore || 0}/100`,
      icon: ChartBarIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      name: 'Data Types Verified',
      value: stats?.verifiedDataTypes.length || 0,
      icon: ShieldCheckIcon,
      color: 'text-monad-600 dark:text-monad-400',
      bgColor: 'bg-monad-50 dark:bg-monad-900/20',
    },
    {
      name: 'Last Verification',
      value: stats?.lastVerification ? 
        new Date(stats.lastVerification).toLocaleDateString() : 
        'Never',
      icon: ClockIcon,
      color: 'text-primus-600 dark:text-primus-400',
      bgColor: 'bg-primus-50 dark:bg-primus-900/20',
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Overview of your verification activity and status
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {dashboardStats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Verifications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <RecentVerifications />
          </motion.div>

          {/* Verification Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Verification Status
            </h3>
            
            {profile?.isVerified ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <ShieldCheckIcon className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Verified User
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Your account has been successfully verified
                    </p>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                    Verified Data Types
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {stats?.verifiedDataTypes.map((dataType) => (
                      <span
                        key={dataType}
                        className="badge badge-success"
                      >
                        {dataType}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ShieldCheckIcon className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                  No verifications yet
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Start by verifying your first data type
                </p>
                <div className="mt-6">
                  <a
                    href="/verify"
                    className="btn btn-primary"
                  >
                    Start Verification
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
