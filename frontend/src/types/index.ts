import { Address } from 'viem'

// User Profile Types
export interface UserProfile {
  verificationCount: bigint
  lastVerificationTime: bigint
  isVerified: boolean
}

// Verification Request Types
export interface VerificationRequest {
  user: Address
  dataType: string
  attestationData: `0x${string}`
  timestamp: bigint
  isVerified: boolean
  isCompleted: boolean
}

// Primus Types
export interface PrimusAttestation {
  proof: `0x${string}`
  publicSignals: `0x${string}`
  attestationData: `0x${string}`
  timestamp: bigint
  attester: Address
}

export interface PrimusVerificationResult {
  isValid: boolean
  dataHash: string
  verificationTime: bigint
  verifier: Address
}

// Data Types
export type DataType = 
  | 'identity'
  | 'income'
  | 'credit_score'
  | 'social_media'
  | 'education'

export interface DataTypeInfo {
  id: DataType
  name: string
  description: string
  icon: string
  category: 'personal' | 'financial' | 'social' | 'professional'
  estimatedTime: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// Verification Status
export type VerificationStatus = 
  | 'idle'
  | 'requesting'
  | 'pending'
  | 'verifying'
  | 'completed'
  | 'failed'

// UI State Types
export interface VerificationState {
  status: VerificationStatus
  requestId?: `0x${string}`
  error?: string
  progress: number
  currentStep: string
}

// Contract Events
export interface VerificationRequestedEvent {
  user: Address
  requestId: `0x${string}`
  dataType: string
  timestamp: bigint
}

export interface VerificationCompletedEvent {
  user: Address
  requestId: `0x${string}`
  success: boolean
  timestamp: bigint
}

export interface UserProfileUpdatedEvent {
  user: Address
  verificationCount: bigint
  timestamp: bigint
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Primus SDK Types
export interface PrimusConfig {
  appId: string
  appSecret: string
  templateId: string
  platform?: 'pc' | 'android' | 'ios'
}

export interface PrimusRequestParams {
  templateId: string
  userAddress: Address
  conditions?: PrimusCondition[]
  mode?: 'proxytls' | 'mpctls'
}

export interface PrimusCondition {
  field: string
  op: 'SHA256' | '>' | '<' | '=' | '!=' | '>=' | '<='
  value?: string
}

// Statistics Types
export interface ContractStats {
  totalUsers: bigint
  totalVerifications: bigint
  contractBalance: bigint
}

export interface UserStats {
  verificationCount: number
  lastVerification?: Date
  verifiedDataTypes: DataType[]
  verificationScore: number
}

// Navigation Types
export interface NavItem {
  name: string
  href: string
  icon?: string
  current?: boolean
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system'

// Wallet Types
export interface WalletInfo {
  address: Address
  chainId: number
  isConnected: boolean
  isConnecting: boolean
  isReconnecting: boolean
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: any
}

// Form Types
export interface VerificationFormData {
  dataType: DataType
  userConsent: boolean
  privacyMode: 'public' | 'hashed' | 'conditional'
  conditions?: PrimusCondition[]
}

// Component Props Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'monad' | 'primus'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface CardProps extends BaseComponentProps {
  title?: string
  description?: string
  footer?: React.ReactNode
}

// Hook Return Types
export interface UseVerificationReturn {
  state: VerificationState
  requestVerification: (data: VerificationFormData) => Promise<void>
  completeVerification: (requestId: `0x${string}`) => Promise<void>
  reset: () => void
}

export interface UseUserProfileReturn {
  profile: UserProfile | null
  stats: UserStats | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

// Utility Types
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>
