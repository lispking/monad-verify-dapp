import { Routes, Route } from 'react-router-dom'
import { useAccount } from 'wagmi'

// Components
import Layout from './components/Layout'
import { NetworkEnforcer } from './components/NetworkEnforcer'

// Hooks
import { useNetworkSwitch } from './hooks/useNetworkSwitch'
import HomePage from './components/pages/HomePage'
import DashboardPage from './components/pages/DashboardPage'
import VerifyPage from './components/pages/VerifyPage'
import ProfilePage from './components/pages/ProfilePage'
import AboutPage from './components/pages/AboutPage'
import NotFoundPage from './components/pages/NotFoundPage'

function App() {
  const { isConnected } = useAccount()

  // Auto-switch to Monad Testnet when wallet connects
  useNetworkSwitch()

  return (
    <NetworkEnforcer>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Protected Routes - require wallet connection */}
          <Route 
            path="/dashboard" 
            element={isConnected ? <DashboardPage /> : <HomePage />} 
          />
          <Route 
            path="/verify" 
            element={isConnected ? <VerifyPage /> : <HomePage />} 
          />
          <Route 
            path="/profile" 
            element={isConnected ? <ProfilePage /> : <HomePage />} 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Layout>
      </div>
    </NetworkEnforcer>
  )
}

export default App
