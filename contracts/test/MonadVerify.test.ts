import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("MonadVerify", function () {
  // Helper function for creating verification requests
  async function createVerificationRequest(monadVerify: Contract, user: Signer, verificationFee: bigint) {
    const dataType = "identity";
    const attestationData = ethers.toUtf8Bytes("mock_attestation_data");

    const tx = await monadVerify.connect(user).requestVerification(dataType, attestationData, {
      value: verificationFee,
    });

    const receipt = await tx.wait();
    const event = receipt?.logs.find((log: any) => {
      try {
        const parsed = monadVerify.interface.parseLog(log);
        return parsed?.name === "VerificationRequested";
      } catch {
        return false;
      }
    });

    if (!event) throw new Error("VerificationRequested event not found");

    const parsed = monadVerify.interface.parseLog(event);
    return parsed?.args.requestId;
  }

  // Fixtures
  async function deployMonadVerifyFixture() {
    const [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy MockPrimusVerifier
    const MockPrimusVerifier = await ethers.getContractFactory("MockPrimusVerifier");
    const primusVerifier = await MockPrimusVerifier.deploy();
    await primusVerifier.waitForDeployment();
    
    // Deploy MonadVerify
    const verificationFee = ethers.parseEther("0.01");
    const MonadVerify = await ethers.getContractFactory("MonadVerify");
    const monadVerify = await MonadVerify.deploy(
      await primusVerifier.getAddress(),
      verificationFee
    );
    await monadVerify.waitForDeployment();
    
    return {
      monadVerify,
      primusVerifier,
      owner,
      user1,
      user2,
      verificationFee,
    };
  }

  describe("Deployment", function () {
    it("Should deploy with correct initial values", async function () {
      const { monadVerify, primusVerifier, owner, verificationFee } = await loadFixture(
        deployMonadVerifyFixture
      );
      
      expect(await monadVerify.owner()).to.equal(owner.address);
      expect(await monadVerify.verificationFee()).to.equal(verificationFee);
      expect(await monadVerify.primusContract()).to.equal(await primusVerifier.getAddress());
      expect(await monadVerify.totalVerifications()).to.equal(0);
    });

    it("Should initialize supported data types", async function () {
      const { monadVerify } = await loadFixture(deployMonadVerifyFixture);
      
      expect(await monadVerify.supportedDataTypes("identity")).to.be.true;
      expect(await monadVerify.supportedDataTypes("income")).to.be.true;
      expect(await monadVerify.supportedDataTypes("credit_score")).to.be.true;
      expect(await monadVerify.supportedDataTypes("unsupported")).to.be.false;
    });

    it("Should revert with invalid constructor parameters", async function () {
      const MonadVerify = await ethers.getContractFactory("MonadVerify");
      const verificationFee = ethers.parseEther("0.01");
      
      // Invalid Primus contract address
      await expect(
        MonadVerify.deploy(ethers.ZeroAddress, verificationFee)
      ).to.be.revertedWith("Invalid Primus contract address");
      
      // Invalid verification fee (too low)
      const MockPrimusVerifier = await ethers.getContractFactory("MockPrimusVerifier");
      const primusVerifier = await MockPrimusVerifier.deploy();
      await primusVerifier.waitForDeployment();
      
      await expect(
        MonadVerify.deploy(await primusVerifier.getAddress(), ethers.parseEther("0.0001"))
      ).to.be.revertedWith("Invalid verification fee");
    });
  });

  describe("Verification Request", function () {
    it("Should create verification request successfully", async function () {
      const { monadVerify, user1, verificationFee } = await loadFixture(
        deployMonadVerifyFixture
      );
      
      const dataType = "identity";
      const attestationData = ethers.toUtf8Bytes("mock_attestation_data");
      
      await expect(
        monadVerify.connect(user1).requestVerification(dataType, attestationData, {
          value: verificationFee,
        })
      ).to.emit(monadVerify, "VerificationRequested");
    });

    it("Should revert with insufficient fee", async function () {
      const { monadVerify, user1 } = await loadFixture(deployMonadVerifyFixture);
      
      const dataType = "identity";
      const attestationData = ethers.toUtf8Bytes("mock_attestation_data");
      
      await expect(
        monadVerify.connect(user1).requestVerification(dataType, attestationData, {
          value: ethers.parseEther("0.005"), // Less than required fee
        })
      ).to.be.revertedWith("Insufficient verification fee");
    });

    it("Should revert with unsupported data type", async function () {
      const { monadVerify, user1, verificationFee } = await loadFixture(
        deployMonadVerifyFixture
      );
      
      const dataType = "unsupported_type";
      const attestationData = ethers.toUtf8Bytes("mock_attestation_data");
      
      await expect(
        monadVerify.connect(user1).requestVerification(dataType, attestationData, {
          value: verificationFee,
        })
      ).to.be.revertedWith("Unsupported data type");
    });

    it("Should revert with empty attestation data", async function () {
      const { monadVerify, user1, verificationFee } = await loadFixture(
        deployMonadVerifyFixture
      );
      
      const dataType = "identity";
      const attestationData = "0x";
      
      await expect(
        monadVerify.connect(user1).requestVerification(dataType, attestationData, {
          value: verificationFee,
        })
      ).to.be.revertedWith("Empty attestation data");
    });
  });

  describe("Verification Completion", function () {

    it("Should complete verification successfully", async function () {
      const { monadVerify, primusVerifier, user1, verificationFee } = await loadFixture(
        deployMonadVerifyFixture
      );

      // Force verification to succeed
      const dataType = "identity";
      const attestationData = ethers.toUtf8Bytes("mock_attestation_data");
      await primusVerifier.forceVerificationResult(attestationData, true);

      const requestId = await createVerificationRequest(monadVerify, user1, verificationFee);

      await expect(
        monadVerify.connect(user1).completeVerification(requestId)
      ).to.emit(monadVerify, "VerificationCompleted");

      // Check user profile was updated
      const profile = await monadVerify.getUserProfile(user1.address);
      expect(profile.verificationCount).to.equal(1);
      expect(profile.isVerified).to.be.true;
    });

    it("Should revert when unauthorized user tries to complete", async function () {
      const { monadVerify, user1, user2, verificationFee } = await loadFixture(
        deployMonadVerifyFixture
      );
      
      const requestId = await createVerificationRequest(monadVerify, user1, verificationFee);
      
      await expect(
        monadVerify.connect(user2).completeVerification(requestId)
      ).to.be.revertedWith("Unauthorized");
    });

    it("Should revert when trying to complete already completed verification", async function () {
      const { monadVerify, user1, verificationFee } = await loadFixture(
        deployMonadVerifyFixture
      );
      
      const requestId = await createVerificationRequest(monadVerify, user1, verificationFee);
      
      // Complete verification first time
      await monadVerify.connect(user1).completeVerification(requestId);
      
      // Try to complete again
      await expect(
        monadVerify.connect(user1).completeVerification(requestId)
      ).to.be.revertedWith("Verification already completed");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update verification fee", async function () {
      const { monadVerify, owner } = await loadFixture(deployMonadVerifyFixture);
      
      const newFee = ethers.parseEther("0.02");
      await monadVerify.connect(owner).updateVerificationFee(newFee);
      
      expect(await monadVerify.verificationFee()).to.equal(newFee);
    });

    it("Should revert when non-owner tries to update verification fee", async function () {
      const { monadVerify, user1 } = await loadFixture(deployMonadVerifyFixture);
      
      const newFee = ethers.parseEther("0.02");
      await expect(
        monadVerify.connect(user1).updateVerificationFee(newFee)
      ).to.be.revertedWithCustomError(monadVerify, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to update supported data types", async function () {
      const { monadVerify, owner } = await loadFixture(deployMonadVerifyFixture);
      
      await monadVerify.connect(owner).updateSupportedDataType("new_type", true);
      expect(await monadVerify.supportedDataTypes("new_type")).to.be.true;
      
      await monadVerify.connect(owner).updateSupportedDataType("new_type", false);
      expect(await monadVerify.supportedDataTypes("new_type")).to.be.false;
    });

    it("Should allow owner to pause and unpause contract", async function () {
      const { monadVerify, owner, user1, verificationFee } = await loadFixture(
        deployMonadVerifyFixture
      );
      
      // Pause contract
      await monadVerify.connect(owner).pause();
      
      // Try to create verification request while paused
      const dataType = "identity";
      const attestationData = ethers.toUtf8Bytes("mock_attestation_data");
      
      await expect(
        monadVerify.connect(user1).requestVerification(dataType, attestationData, {
          value: verificationFee,
        })
      ).to.be.revertedWithCustomError(monadVerify, "EnforcedPause");
      
      // Unpause contract
      await monadVerify.connect(owner).unpause();
      
      // Should work after unpause
      await expect(
        monadVerify.connect(user1).requestVerification(dataType, attestationData, {
          value: verificationFee,
        })
      ).to.emit(monadVerify, "VerificationRequested");
    });
  });

  describe("View Functions", function () {
    it("Should return correct user verification status", async function () {
      const { monadVerify, primusVerifier, user1, verificationFee } = await loadFixture(
        deployMonadVerifyFixture
      );

      // Initially not verified
      expect(await monadVerify.isUserVerified(user1.address)).to.be.false;

      // Force verification to succeed
      const dataType = "identity";
      const attestationData = ethers.toUtf8Bytes("mock_attestation_data");
      await primusVerifier.forceVerificationResult(attestationData, true);

      // Create and complete verification
      const requestId = await createVerificationRequest(monadVerify, user1, verificationFee);
      await monadVerify.connect(user1).completeVerification(requestId);

      // Should be verified now
      expect(await monadVerify.isUserVerified(user1.address)).to.be.true;
    });

    it("Should return correct contract statistics", async function () {
      const { monadVerify } = await loadFixture(deployMonadVerifyFixture);
      
      const [totalUsers, totalVerifications, contractBalance] = await monadVerify.getContractStats();
      
      expect(totalUsers).to.equal(0); // Note: totalUsers is not implemented in this version
      expect(totalVerifications).to.equal(0);
      expect(contractBalance).to.equal(0);
    });
  });
});
