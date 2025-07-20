import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { 
  ShieldCheckIcon, 
  LockClosedIcon, 
  BoltIcon, 
  GlobeAltIcon,
  ArrowRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

// Components
import { RainbowConnectButton } from '../RainbowConnectButton'

const features = [
  {
    name: 'Privacy-First Verification',
    description: 'Verify your data without revealing sensitive information using zero-knowledge proofs.',
    icon: LockClosedIcon,
    color: 'text-primary-600 dark:text-primary-400',
  },
  {
    name: 'Lightning Fast',
    description: 'Built on Monad\'s high-performance blockchain for instant verification results.',
    icon: BoltIcon,
    color: 'text-monad-600 dark:text-monad-400',
  },
  {
    name: 'Secure & Trustless',
    description: 'Cryptographically secure verification without relying on centralized authorities.',
    icon: ShieldCheckIcon,
    color: 'text-green-600 dark:text-green-400',
  },
  {
    name: 'Universal Access',
    description: 'Verify data from any Web2 platform and bring it to the Web3 ecosystem.',
    icon: GlobeAltIcon,
    color: 'text-primus-600 dark:text-primus-400',
  },
]

const dataTypes = [
  'Identity Verification',
  'Income Statements',
  'Credit Scores',
  'Social Media Profiles',
  'Educational Credentials',
  'Employment History',
]

const stats = [
  { name: 'Verifications Completed', value: '10,000+' },
  { name: 'Data Types Supported', value: '15+' },
  { name: 'Privacy Preserved', value: '100%' },
  { name: 'Average Verification Time', value: '<30s' },
]

export default function HomePage() {
  const { isConnected } = useAccount()

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-monad-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl">
              Secure Data Verification
              <span className="block gradient-text">
                on Monad Blockchain
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
              Verify your Web2 data privately and securely using Primus zkTLS technology. 
              Bring your real-world credentials to the decentralized web without compromising privacy.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {isConnected ? (
                <Link
                  to="/verify"
                  className="btn btn-primary btn-lg group"
                >
                  Start Verification
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <RainbowConnectButton />
              )}
              <Link
                to="/about"
                className="btn btn-secondary btn-lg"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-slate-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl lg:max-w-none"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                Trusted by thousands of users
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
                Join the growing community of users who trust MonadVerify for secure data verification.
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col bg-slate-50 dark:bg-slate-700 p-8"
                >
                  <dt className="text-sm font-semibold leading-6 text-slate-600 dark:text-slate-400">
                    {stat.name}
                  </dt>
                  <dd className="order-first text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {stat.value}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Why Choose MonadVerify?
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Experience the future of data verification with cutting-edge technology and uncompromising security.
            </p>
          </motion.div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-slate-100">
                    <feature.icon className={`h-5 w-5 flex-none ${feature.color}`} aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Data Types Section */}
      <div className="bg-slate-50 dark:bg-slate-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Supported Data Types
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Verify a wide range of data types from various platforms and services.
            </p>
          </motion.div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {dataTypes.map((dataType, index) => (
              <motion.div
                key={dataType}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card flex items-center space-x-3"
              >
                <CheckIcon className="h-5 w-5 text-green-500" />
                <span className="text-slate-900 dark:text-slate-100 font-medium">
                  {dataType}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-monad-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to verify your data?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              Join thousands of users who trust MonadVerify for secure, private data verification.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {isConnected ? (
                <Link
                  to="/verify"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Start Verification
                </Link>
              ) : (
                <RainbowConnectButton />
              )}
              <Link
                to="/about"
                className="text-sm font-semibold leading-6 text-white hover:text-primary-100"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
