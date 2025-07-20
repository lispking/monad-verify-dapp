// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../interfaces/IPrimusVerifier.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockPrimusVerifier
 * @dev Mock implementation of Primus verifier for testing purposes
 * @notice This contract simulates the behavior of the actual Primus verifier
 */
contract MockPrimusVerifier is IPrimusVerifier, Ownable {
    // State variables
    mapping(bytes32 => VerificationResult) private verificationResults;
    mapping(string => bool) private supportedModes;
    mapping(string => uint256) private verificationFees;
    
    uint256 private totalVerifications;
    uint256 private successfulVerifications;
    uint256 private failedVerifications;
    
    // For testing purposes - control verification outcomes
    mapping(bytes32 => bool) private forcedResults;
    bool private defaultResult = true;

    constructor() Ownable(msg.sender) {
        // Initialize supported modes
        supportedModes["proxytls"] = true;
        supportedModes["mpctls"] = true;
        
        // Initialize verification fees
        verificationFees["proxytls"] = 0.001 ether;
        verificationFees["mpctls"] = 0.002 ether;
    }

    /**
     * @dev Verify a zkTLS attestation
     * @param attestationData The attestation data to verify
     * @return isValid Whether the attestation is valid
     */
    function verifyAttestation(bytes calldata attestationData) external override returns (bool isValid) {
        require(attestationData.length > 0, "Empty attestation data");
        
        bytes32 attestationHash = getAttestationHash(attestationData);
        
        // Check if result is forced for testing
        if (forcedResults[attestationHash] != false) {
            isValid = forcedResults[attestationHash];
        } else {
            // Use default result or simulate verification logic
            isValid = defaultResult && _simulateVerification(attestationData);
        }
        
        // Store verification result
        verificationResults[attestationHash] = VerificationResult({
            isValid: isValid,
            dataHash: isValid ? _generateDataHash(attestationData) : "",
            verificationTime: block.timestamp,
            verifier: msg.sender
        });
        
        // Update statistics
        totalVerifications++;
        if (isValid) {
            successfulVerifications++;
        } else {
            failedVerifications++;
        }
        
        emit AttestationVerified(attestationHash, isValid, msg.sender);
        
        return isValid;
    }

    /**
     * @dev Verify a zkTLS attestation with detailed result
     * @param attestationData The attestation data to verify
     * @return result Detailed verification result
     */
    function verifyAttestationDetailed(
        bytes calldata attestationData
    ) external override returns (VerificationResult memory result) {
        bool isValid = this.verifyAttestation(attestationData);
        bytes32 attestationHash = getAttestationHash(attestationData);
        return verificationResults[attestationHash];
    }

    /**
     * @dev Batch verify multiple attestations
     * @param attestationsData Array of attestation data to verify
     * @return results Array of verification results
     */
    function batchVerifyAttestations(
        bytes[] calldata attestationsData
    ) external override returns (bool[] memory results) {
        results = new bool[](attestationsData.length);
        
        for (uint256 i = 0; i < attestationsData.length; i++) {
            results[i] = this.verifyAttestation(attestationsData[i]);
        }
        
        return results;
    }

    /**
     * @dev Verify attestation with specific template
     * @param attestationData The attestation data to verify
     * @param templateId The template ID to use for verification
     * @return isValid Whether the attestation is valid
     */
    function verifyAttestationWithTemplate(
        bytes calldata attestationData,
        bytes32 templateId
    ) external override returns (bool isValid) {
        // For mock purposes, template verification behaves the same
        return this.verifyAttestation(attestationData);
    }

    /**
     * @dev Get verification status of an attestation
     * @param attestationHash Hash of the attestation
     * @return result Verification result if exists
     */
    function getVerificationResult(
        bytes32 attestationHash
    ) external view override returns (VerificationResult memory result) {
        return verificationResults[attestationHash];
    }

    /**
     * @dev Check if an attestation has been verified
     * @param attestationHash Hash of the attestation
     * @return isVerified Whether the attestation has been verified
     */
    function isAttestationVerified(bytes32 attestationHash) external view override returns (bool isVerified) {
        return verificationResults[attestationHash].verificationTime > 0;
    }

    /**
     * @dev Get the hash of attestation data
     * @param attestationData The attestation data
     * @return hash Hash of the attestation data
     */
    function getAttestationHash(bytes calldata attestationData) public pure override returns (bytes32 hash) {
        return keccak256(attestationData);
    }

    /**
     * @dev Get supported verification modes
     * @return modes Array of supported mode identifiers
     */
    function getSupportedModes() external view override returns (string[] memory modes) {
        modes = new string[](2);
        modes[0] = "proxytls";
        modes[1] = "mpctls";
        return modes;
    }

    /**
     * @dev Check if a verification mode is supported
     * @param mode The mode to check
     * @return isSupported Whether the mode is supported
     */
    function isModeSupported(string calldata mode) external view override returns (bool isSupported) {
        return supportedModes[mode];
    }

    /**
     * @dev Get verification fee for a specific mode
     * @param mode The verification mode
     * @return fee The verification fee
     */
    function getVerificationFee(string calldata mode) external view override returns (uint256 fee) {
        return verificationFees[mode];
    }

    /**
     * @dev Get total number of verifications performed
     * @return count Total verification count
     */
    function getTotalVerifications() external view override returns (uint256 count) {
        return totalVerifications;
    }

    /**
     * @dev Get verification statistics
     * @return totalVerifications_ Total number of verifications
     * @return successfulVerifications_ Number of successful verifications
     * @return failedVerifications_ Number of failed verifications
     */
    function getVerificationStats() external view override returns (
        uint256 totalVerifications_,
        uint256 successfulVerifications_,
        uint256 failedVerifications_
    ) {
        return (totalVerifications, successfulVerifications, failedVerifications);
    }

    // Testing utilities

    /**
     * @dev Force a specific result for an attestation (testing only)
     * @param attestationData The attestation data
     * @param result The result to force
     */
    function forceVerificationResult(bytes calldata attestationData, bool result) external onlyOwner {
        bytes32 attestationHash = getAttestationHash(attestationData);
        forcedResults[attestationHash] = result;
    }

    /**
     * @dev Set default verification result (testing only)
     * @param result The default result
     */
    function setDefaultResult(bool result) external onlyOwner {
        defaultResult = result;
    }

    /**
     * @dev Reset verification statistics (testing only)
     */
    function resetStats() external onlyOwner {
        totalVerifications = 0;
        successfulVerifications = 0;
        failedVerifications = 0;
    }

    // Internal functions

    /**
     * @dev Simulate verification logic
     * @param attestationData The attestation data
     * @return isValid Simulated verification result
     */
    function _simulateVerification(bytes calldata attestationData) internal pure returns (bool isValid) {
        // Simple simulation: verify if data length is sufficient and contains valid structure
        if (attestationData.length < 32) {
            return false;
        }
        
        // Check for some basic structure (mock validation)
        bytes32 dataHash = keccak256(attestationData);
        return uint256(dataHash) % 10 != 0; // 90% success rate for simulation
    }

    /**
     * @dev Generate data hash for verified attestation
     * @param attestationData The attestation data
     * @return dataHash Generated data hash
     */
    function _generateDataHash(bytes calldata attestationData) internal pure returns (string memory dataHash) {
        bytes32 hash = keccak256(abi.encodePacked("verified_", attestationData));
        return _bytes32ToString(hash);
    }

    /**
     * @dev Convert bytes32 to string
     * @param _bytes32 The bytes32 value
     * @return String representation
     */
    function _bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
}
