import { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { motion } from 'framer-motion'
import {
  UserCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  DocumentCheckIcon,
  CogIcon,
  LinkIcon,
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Hooks
import { useUserProfile } from '../../hooks/useUserProfile'

// Components
import LoadingSpinner from '../LoadingSpinner'
import { NetworkGuard } from '../NetworkGuard'

// Types
import type { DataType } from '../../types/index'

// Mock verification history
const mockVerificationHistory = [
  {
    id: '1',
    dataType: 'identity' as DataType,
    status: 'verified',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    requestId: '0x1234567890abcdef',
    platform: 'Government ID',
  },
  {
    id: '2',
    dataType: 'income' as DataType,
    status: 'verified',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    requestId: '0x2345678901bcdefg',
    platform: 'Bank Statement',
  },
  {
    id: '3',
    dataType: 'social_media' as DataType,
    status: 'pending',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    requestId: '0x3456789012cdefgh',
    platform: 'Twitter',
  },
]

export default function ProfilePage() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { profile, stats, isLoading, error } = useUserProfile(address)
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'settings'>('overview')

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-slate-400" />
    }
  }

  const handleExportData = () => {
    const data = {
      address,
      profile,
      stats,
      verificationHistory: mockVerificationHistory,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `monadverify-profile-${address?.slice(0, 8)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('Profile data exported successfully!')
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, this would call an API to delete the account
      toast.success('Account deletion request submitted')
      disconnect()
    }
  }

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <UserCircleIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
            Connect Your Wallet
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Please connect your wallet to view your profile
          </p>
        </div>
      </div>
    )
  }

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
            Error loading profile: {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <NetworkGuard>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-monad-500 rounded-full flex items-center justify-center">
              <UserCircleIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Your Profile
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {formatAddress(address!)}
              </p>
            </div>
          </div>

          {/* Verification Status Badge */}
          {profile?.isVerified ? (
            <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm">
              <ShieldCheckIcon className="h-4 w-4" />
              <span>Verified User</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full text-sm">
              <ClockIcon className="h-4 w-4" />
              <span>Unverified</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: UserCircleIcon },
              { id: 'history', name: 'Verification History', icon: DocumentCheckIcon },
              { id: 'settings', name: 'Settings', icon: CogIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Verification Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {stats?.verificationCount || 0}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Total Verifications
                    </div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats?.verificationScore || 0}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Verification Score
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Verified Data Types
                </h3>
                {stats?.verifiedDataTypes && stats.verifiedDataTypes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {stats.verifiedDataTypes.map((dataType) => (
                      <span
                        key={dataType}
                        className="badge badge-success"
                      >
                        {dataType.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">
                    No verified data types yet
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.href = '/verify'}
                    className="w-full btn btn-primary"
                  >
                    <DocumentCheckIcon className="mr-2 h-4 w-4" />
                    New Verification
                  </button>
                  <button
                    onClick={handleExportData}
                    className="w-full btn btn-secondary"
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Export Data
                  </button>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Account Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Address:</span>
                    <span className="font-mono">{formatAddress(address!)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Member Since:</span>
                    <span>
                      {stats?.lastVerification ?
                        new Date(stats.lastVerification).toLocaleDateString() :
                        'Recently'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Status:</span>
                    <span className={profile?.isVerified ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}>
                      {profile?.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
              Verification History
            </h3>

            {mockVerificationHistory.length > 0 ? (
              <div className="space-y-4">
                {mockVerificationHistory.map((verification) => (
                  <div
                    key={verification.id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(verification.status)}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">
                          {verification.dataType.replace('_', ' ')} Verification
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {verification.platform} • {verification.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        verification.status === 'verified' ? 'text-green-600 dark:text-green-400' :
                        verification.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {verification.status}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {verification.requestId.slice(0, 10)}...
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DocumentCheckIcon className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                  No verification history
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Your verification history will appear here
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Privacy Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">
                      Public Profile
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Allow others to see your verification status
                    </p>
                  </div>
                  <button className="btn btn-secondary">
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Edit
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">
                      Data Sharing
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Control how your verified data is shared
                    </p>
                  </div>
                  <button className="btn btn-secondary">
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Manage
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Account Actions
              </h3>
              <div className="space-y-4">
                <button
                  onClick={handleExportData}
                  className="w-full btn btn-secondary justify-start"
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Export Account Data
                </button>
                <button
                  onClick={() => disconnect()}
                  className="w-full btn btn-secondary justify-start"
                >
                  <XCircleIcon className="mr-2 h-4 w-4" />
                  Disconnect Wallet
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full btn bg-red-600 hover:bg-red-700 text-white justify-start"
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      </div>
    </NetworkGuard>
  )
}
