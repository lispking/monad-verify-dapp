#!/usr/bin/env node

/**
 * Script to extract ABI from compiled contracts and update frontend ABI files
 * Usage: node scripts/update-abi.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths
const CONTRACTS_DIR = path.join(__dirname, '../../contracts')
const ARTIFACTS_DIR = path.join(CONTRACTS_DIR, 'artifacts/contracts')
const FRONTEND_CONTRACTS_DIR = path.join(__dirname, '../src/contracts')

// Contract artifacts to extract
const CONTRACTS = [
  {
    name: 'MonadVerify',
    artifactPath: path.join(ARTIFACTS_DIR, 'MonadVerify.sol/MonadVerify.json'),
    outputPath: path.join(FRONTEND_CONTRACTS_DIR, 'MonadVerifyABI.ts'),
    exportName: 'MONAD_VERIFY_ABI'
  },
  {
    name: 'MockPrimusVerifier',
    artifactPath: path.join(ARTIFACTS_DIR, 'MockPrimusVerifier.sol/MockPrimusVerifier.json'),
    outputPath: path.join(FRONTEND_CONTRACTS_DIR, 'PrimusVerifierABI.ts'),
    exportName: 'PRIMUS_VERIFIER_ABI'
  }
]

function extractABI(artifactPath) {
  try {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'))
    return artifact.abi
  } catch (error) {
    console.error(`Error reading artifact ${artifactPath}:`, error.message)
    return null
  }
}

function generateABIFile(contractName, abi, exportName) {
  const content = `// ${contractName} Contract ABI - Generated from compiled contract
// Last updated: ${new Date().toISOString()}

export const ${exportName} = ${JSON.stringify(abi, null, 2)} as const
`
  return content
}

function updateABIFiles() {
  console.log('🔄 Updating ABI files...')
  
  // Ensure output directory exists
  if (!fs.existsSync(FRONTEND_CONTRACTS_DIR)) {
    fs.mkdirSync(FRONTEND_CONTRACTS_DIR, { recursive: true })
  }

  let updatedCount = 0

  for (const contract of CONTRACTS) {
    console.log(`📄 Processing ${contract.name}...`)
    
    // Check if artifact exists
    if (!fs.existsSync(contract.artifactPath)) {
      console.warn(`⚠️  Artifact not found: ${contract.artifactPath}`)
      console.warn(`   Make sure contracts are compiled first: cd contracts && pnpm compile`)
      continue
    }

    // Extract ABI
    const abi = extractABI(contract.artifactPath)
    if (!abi) {
      console.error(`❌ Failed to extract ABI for ${contract.name}`)
      continue
    }

    // Generate TypeScript file
    const content = generateABIFile(contract.name, abi, contract.exportName)
    
    // Write file
    try {
      fs.writeFileSync(contract.outputPath, content, 'utf8')
      console.log(`✅ Updated ${contract.outputPath}`)
      updatedCount++
    } catch (error) {
      console.error(`❌ Failed to write ${contract.outputPath}:`, error.message)
    }
  }

  console.log(`\n🎉 Updated ${updatedCount}/${CONTRACTS.length} ABI files`)
  
  if (updatedCount > 0) {
    console.log('\n📝 Next steps:')
    console.log('1. Review the updated ABI files')
    console.log('2. Update contract addresses in frontend/src/config/contracts.ts if needed')
    console.log('3. Test the frontend application')
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  updateABIFiles()
}

export { updateABIFiles }
