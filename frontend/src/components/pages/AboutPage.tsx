import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  LockClosedIcon,
  BoltIcon,
  GlobeAltIcon,
  UserGroupIcon,
  CodeBracketIcon,
  AcademicCapIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Privacy-First Architecture',
    description: 'Built on zero-knowledge proofs to ensure your data remains private while being verifiable.',
    icon: LockClosedIcon,
    color: 'text-primary-600 dark:text-primary-400',
  },
  {
    name: 'Monad Integration',
    description: 'Leverages Monad\'s high-performance blockchain for lightning-fast verification.',
    icon: BoltIcon,
    color: 'text-monad-600 dark:text-monad-400',
  },
  {
    name: 'Primus zkTLS',
    description: 'Powered by Primus Labs\' cutting-edge zkTLS technology for secure data verification.',
    icon: ShieldCheckIcon,
    color: 'text-primus-600 dark:text-primus-400',
  },
  {
    name: 'Universal Compatibility',
    description: 'Works with any Web2 platform to bring your data to the Web3 ecosystem.',
    icon: GlobeAltIcon,
    color: 'text-green-600 dark:text-green-400',
  },
]

const team = [
  {
    name: 'MonadVerify Team',
    role: 'Core Development',
    description: 'Passionate developers building the future of data verification.',
    icon: CodeBracketIcon,
  },
  {
    name: 'Primus Labs',
    role: 'zkTLS Technology',
    description: 'Leading research and development in zero-knowledge TLS protocols.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Monad',
    role: 'Blockchain Infrastructure',
    description: 'High-performance blockchain platform enabling scalable verification.',
    icon: BoltIcon,
  },
  {
    name: 'Community',
    role: 'Users & Contributors',
    description: 'Growing community of users who trust MonadVerify for secure verification.',
    icon: UserGroupIcon,
  },
]

const stats = [
  { name: 'Lines of Code', value: '10,000+' },
  { name: 'Security Audits', value: '3' },
  { name: 'Supported Platforms', value: '15+' },
  { name: 'Community Members', value: '1,000+' },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 sm:text-5xl">
            About MonadVerify
          </h1>
          <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            We're building the future of data verification, where privacy and trust coexist
            through cutting-edge cryptographic technology.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="card">
            <div className="text-center mb-8">
              <HeartIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Our Mission
              </h2>
            </div>
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-slate-600 dark:text-slate-400 text-center">
                MonadVerify bridges the gap between Web2 and Web3 by enabling secure,
                privacy-preserving data verification. We believe that users should have
                full control over their data while being able to prove its authenticity
                without compromising privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Technology Stack
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Built on cutting-edge technologies for maximum security and performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              By the Numbers
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Our commitment to excellence in numbers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Built by Amazing Teams
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Collaboration between industry leaders and passionate developers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-monad-500 rounded-lg flex items-center justify-center">
                      <member.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">
                      {member.role}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {member.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              How MonadVerify Works
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              A simple yet powerful process for secure data verification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Connect & Select',
                description: 'Connect your wallet and choose the data type you want to verify',
                color: 'from-blue-500 to-blue-600',
              },
              {
                step: '2',
                title: 'Secure Verification',
                description: 'Our zkTLS technology securely verifies your data without exposing it',
                color: 'from-purple-500 to-purple-600',
              },
              {
                step: '3',
                title: 'On-Chain Proof',
                description: 'Receive a cryptographic proof that can be verified on Monad blockchain',
                color: 'from-green-500 to-green-600',
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Learn More
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Dive deeper into the technology and research behind MonadVerify
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="https://docs.primuslabs.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Primus Documentation
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Learn about zkTLS technology and implementation details
              </p>
            </a>

            <a
              href="https://docs.monad.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Monad Documentation
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Explore Monad's high-performance blockchain platform
              </p>
            </a>

            <a
              href="https://github.com/monad-verify"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                GitHub Repository
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                View the source code and contribute to the project
              </p>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
