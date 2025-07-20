# MonadVerify DApp

A beautiful and secure DApp built on Monad blockchain, leveraging Primus Labs' zkTLS technology for privacy-preserving data verification.

## 🌟 Features

- **Secure Data Verification**: Utilize Primus zkTLS to verify Web2 data without revealing sensitive information
- **Monad Integration**: Built specifically for Monad's high-performance blockchain
- **Privacy-First**: Zero-knowledge proofs ensure data privacy while maintaining verifiability
- **User-Friendly**: Modern React interface with seamless Web3 integration
- **Multi-Mode Support**: Support for both MPC and Proxy zkTLS modes

## 🏗️ Architecture

```
monad-verify-dapp/
├── contracts/          # Smart contracts for Monad blockchain (Hardhat)
│   ├── contracts/      # Solidity contracts
│   ├── test/          # Contract tests
│   ├── scripts/       # Deployment scripts
│   ├── typechain-types/ # Generated TypeScript types
│   └── hardhat.config.ts
├── frontend/           # React + Vite frontend application
│   ├── src/
│   ├── public/
│   └── dist/
└── docs/              # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd monad-verify-dapp

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Development

```bash
# Run frontend development server
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Deploy to Monad testnet
pnpm deploy:testnet
```

## 🔧 Configuration

### Primus Integration

1. Visit [Primus Developer Hub](https://dev.primuslabs.xyz)
2. Create a new project and obtain your `appId` and `appSecret`
3. Configure the credentials in your environment variables

### Monad Network

The DApp is configured to work with:
- Monad Testnet: `0x1Ad7fD53206fDc3979C672C0466A1c48AF47B431`
- Monad Mainnet: (Coming soon)

## 📚 Documentation

- [Primus Labs Documentation](https://docs.primuslabs.xyz/)
- [Monad Documentation](https://docs.monad.xyz/)
- [Project Architecture](./docs/architecture.md)
- [API Reference](./docs/api.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔗 Links

- [Primus Labs](https://primuslabs.xyz/)
- [Monad](https://monad.xyz/)
- [Discord Community](https://discord.gg/AYGSqCkZTz)
