import { useState } from 'react'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  CreditCardIcon,
  UserIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Components
import LoadingSpinner from '../LoadingSpinner'
import { NetworkGuard } from '../NetworkGuard'

// Hooks
import { useVerification } from '../../hooks/useVerification'

// Types
import type { DataType } from '../../types/index'

// Data types configuration
const dataTypes = [
  {
    id: 'identity' as DataType,
    name: 'Identity Verification',
    description: 'Verify your government-issued ID or passport',
    icon: UserIcon,
    category: 'personal',
    estimatedTime: '2-5 minutes',
    difficulty: 'easy',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    id: 'income' as DataType,
    name: 'Income Verification',
    description: 'Verify your salary or income statements',
    icon: DocumentTextIcon,
    category: 'financial',
    estimatedTime: '3-7 minutes',
    difficulty: 'medium',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    id: 'credit_score' as DataType,
    name: 'Credit Score',
    description: 'Verify your credit score from major bureaus',
    icon: CreditCardIcon,
    category: 'financial',
    estimatedTime: '2-4 minutes',
    difficulty: 'easy',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    id: 'social_media' as DataType,
    name: 'Social Media Profile',
    description: 'Verify your social media accounts and followers',
    icon: GlobeAltIcon,
    category: 'social',
    estimatedTime: '1-3 minutes',
    difficulty: 'easy',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
  },
  {
    id: 'education' as DataType,
    name: 'Educational Credentials',
    description: 'Verify your degrees and certifications',
    icon: AcademicCapIcon,
    category: 'professional',
    estimatedTime: '5-10 minutes',
    difficulty: 'hard',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
]

export default function VerifyPage() {
  const { isConnected } = useAccount()
  const [selectedDataType, setSelectedDataType] = useState<DataType | null>(null)
  const { state, requestVerification, reset } = useVerification()

  const handleStartVerification = async (dataType: DataType) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    setSelectedDataType(dataType)

    try {
      await requestVerification({
        dataType,
        userConsent: true,
        privacyMode: 'hashed',
      })
    } catch (error: any) {
      console.error('Verification failed:', error)
      toast.error(error.message || 'Verification failed. Please try again.')
    }
  }

  const resetVerification = () => {
    setSelectedDataType(null)
    reset()
  }

  const getStatusIcon = () => {
    switch (state.status) {
      case 'completed':
        return <CheckCircleIcon className="h-8 w-8 text-green-500" />
      case 'failed':
        return <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
      case 'requesting':
      case 'pending':
      case 'verifying':
        return <ClockIcon className="h-8 w-8 text-blue-500" />
      default:
        return <ShieldCheckIcon className="h-8 w-8 text-slate-400" />
    }
  }

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
            Connect Your Wallet
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Please connect your wallet to start the verification process
          </p>
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Data Verification
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Verify your data securely using Primus zkTLS technology
          </p>
        </div>

        {state.status === 'idle' ? (
          /* Data Type Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataTypes.map((dataType, index) => (
              <motion.div
                key={dataType.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card hover:shadow-xl transition-all duration-200 cursor-pointer group"
                onClick={() => handleStartVerification(dataType.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`rounded-lg p-3 ${dataType.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                    <dataType.icon className={`h-6 w-6 ${dataType.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {dataType.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {dataType.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {dataType.estimatedTime}
                      </span>
                      <span className={`badge ${
                        dataType.difficulty === 'easy' ? 'badge-success' :
                        dataType.difficulty === 'medium' ? 'badge-warning' : 'badge-error'
                      }`}>
                        {dataType.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Verification Process */
          <div className="max-w-2xl mx-auto">
            <div className="card text-center">
              <div className="mb-6">
                {getStatusIcon()}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {selectedDataType && dataTypes.find(dt => dt.id === selectedDataType)?.name}
              </h2>

              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {state.currentStep || (state.error && `Error: ${state.error}`)}
              </p>

              {/* Progress Bar */}
              {(state.status === 'requesting' || state.status === 'pending' || state.status === 'verifying') && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                    <span>Progress</span>
                    <span>{state.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-primary-500 to-monad-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${state.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}

              {/* Loading Spinner */}
              {(state.status === 'requesting' || state.status === 'verifying') && (
                <div className="mb-6">
                  <LoadingSpinner size="lg" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                {state.status === 'completed' || state.status === 'failed' ? (
                  <>
                    <button
                      onClick={resetVerification}
                      className="btn btn-secondary"
                    >
                      Verify Another
                    </button>
                    {state.status === 'completed' && (
                      <button
                        onClick={() => toast.success('Verification result saved!')}
                        className="btn btn-primary"
                      >
                        Save Result
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={resetVerification}
                    className="btn btn-secondary"
                    disabled={state.status === 'requesting'}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 dark:text-primary-400 font-bold">1</span>
              </div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                Select Data Type
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Choose the type of data you want to verify
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 dark:text-primary-400 font-bold">2</span>
              </div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                Secure Connection
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                We establish a secure connection to your data source
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 dark:text-primary-400 font-bold">3</span>
              </div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                Zero-Knowledge Proof
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Generate proof without revealing your sensitive data
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </NetworkGuard>
  )
}
