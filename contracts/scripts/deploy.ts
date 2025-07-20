import { ethers } from "hardhat";
import { Contract } from "ethers";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Starting MonadVerify deployment...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "Chain ID:", network.chainId.toString());

  // Check minimum balance
  const minBalance = ethers.parseEther("0.1");
  if (balance < minBalance) {
    throw new Error(`Insufficient balance. Need at least ${ethers.formatEther(minBalance)} ETH`);
  }

  // Configuration
  const VERIFICATION_FEE = ethers.parseEther("0.01"); // 0.01 ETH
  const PRIMUS_CONTRACT_ADDRESS = process.env.PRIMUS_CONTRACT_ADDRESS || "";

  let primusContract: Contract;
  
  // Deploy or use existing Primus contract
  if (PRIMUS_CONTRACT_ADDRESS && PRIMUS_CONTRACT_ADDRESS !== "") {
    console.log("🔗 Using existing Primus contract at:", PRIMUS_CONTRACT_ADDRESS);
    // For existing Primus contracts, we'll use the MockPrimusVerifier interface for compatibility
    primusContract = await ethers.getContractAt("MockPrimusVerifier", PRIMUS_CONTRACT_ADDRESS);
  } else {
    console.log("🏗️  Deploying MockPrimusVerifier...");
    const MockPrimusVerifier = await ethers.getContractFactory("MockPrimusVerifier");
    primusContract = await MockPrimusVerifier.deploy();
    await primusContract.waitForDeployment();
    console.log("✅ MockPrimusVerifier deployed to:", await primusContract.getAddress());
  }

  // Deploy MonadVerify contract
  console.log("🏗️  Deploying MonadVerify...");
  const MonadVerify = await ethers.getContractFactory("MonadVerify");
  const monadVerify = await MonadVerify.deploy(
    await primusContract.getAddress(),
    VERIFICATION_FEE
  );
  
  await monadVerify.waitForDeployment();
  const monadVerifyAddress = await monadVerify.getAddress();
  
  console.log("✅ MonadVerify deployed to:", monadVerifyAddress);
  console.log("⚙️  Verification fee set to:", ethers.formatEther(VERIFICATION_FEE), "ETH");

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  
  try {
    const owner = await monadVerify.owner();
    const verificationFee = await monadVerify.verificationFee();
    const primusAddress = await monadVerify.primusContract();
    
    console.log("👤 Contract owner:", owner);
    console.log("💵 Verification fee:", ethers.formatEther(verificationFee), "ETH");
    console.log("🔗 Primus contract:", primusAddress);
    
    // Test basic functionality
    const isIdentitySupported = await monadVerify.supportedDataTypes("identity");
    const isIncomeSupported = await monadVerify.supportedDataTypes("income");
    
    console.log("✅ Identity verification supported:", isIdentitySupported);
    console.log("✅ Income verification supported:", isIncomeSupported);
    
  } catch (error) {
    console.error("❌ Verification failed:", error);
  }

  // Save deployment info
  const deploymentInfo = {
    network: {
      name: network.name,
      chainId: network.chainId.toString(),
    },
    deployer: deployer.address,
    contracts: {
      MonadVerify: monadVerifyAddress,
      PrimusVerifier: await primusContract.getAddress(),
    },
    configuration: {
      verificationFee: ethers.formatEther(VERIFICATION_FEE),
    },
    timestamp: new Date().toISOString(),
  };

  // Save to file
  const deploymentPath = path.join(__dirname, `../deployments/deployment-${network.chainId}.json`);
  const deploymentsDir = path.dirname(deploymentPath);

  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to:", deploymentPath);

  console.log("\n📋 Deployment Summary:");
  console.log("=".repeat(50));
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log("=".repeat(50));

  // Instructions for frontend integration
  console.log("\n📱 Frontend Integration:");
  console.log("Add these addresses to your .env file:");
  console.log(`VITE_MONAD_VERIFY_CONTRACT=${monadVerifyAddress}`);
  console.log(`VITE_PRIMUS_CONTRACT=${await primusContract.getAddress()}`);
  
  console.log("\n🎉 Deployment completed successfully!");
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
