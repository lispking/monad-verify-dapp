// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IPrimusZKTLS, Attestation } from "@primuslabs/zktls-contracts/src/IPrimusZKTLS.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockPrimusVerifier
 * @dev Mock implementation of Primus verifier for testing purposes
 * @notice This contract simulates the behavior of the actual Primus verifier
 */
contract MockPrimusVerifier is IPrimusZKTLS, Ownable {
    // State variables for testing
    mapping(bytes32 => bool) private forcedResults;
    bool private defaultResult = true;
    uint256 private totalVerifications;

    // Events
    event AttestationVerified(bytes32 indexed attestationHash, bool isValid);

    constructor() Ownable(msg.sender) {
        defaultResult = true;
    }

    /**
     * @dev Verify a zkTLS attestation (implements IPrimusZKTLS)
     * @param attestation The attestation data to verify
     */
    function verifyAttestation(Attestation calldata attestation) external view override {
        require(attestation.recipient != address(0), "Invalid recipient");
        require(bytes(attestation.data).length > 0, "Empty attestation data");
        require(attestation.timestamp > 0, "Invalid timestamp");

        bytes32 attestationHash = keccak256(abi.encode(attestation));

        // Check if result is forced for testing
        bool shouldRevert = false;
        if (forcedResults[attestationHash] == false) {
            shouldRevert = true;
        } else if (!defaultResult) {
            shouldRevert = true;
        }

        if (shouldRevert) {
            revert("Attestation verification failed");
        }

        // If we reach here, verification passed
    }

    // Testing utilities

    /**
     * @dev Set the default verification result for testing
     * @param result The default result to return
     */
    function setDefaultResult(bool result) external onlyOwner {
        defaultResult = result;
    }

    /**
     * @dev Force a specific result for a specific attestation hash
     * @param attestationHash The hash of the attestation
     * @param result The result to force
     */
    function setForcedResult(bytes32 attestationHash, bool result) external onlyOwner {
        forcedResults[attestationHash] = result;
    }

    /**
     * @dev Get the hash of an attestation for testing purposes
     * @param attestation The attestation to hash
     * @return The hash of the attestation
     */
    function getAttestationHash(Attestation calldata attestation) external pure returns (bytes32) {
        return keccak256(abi.encode(attestation));
    }

    /**
     * @dev Get total number of verifications performed
     * @return The total number of verifications
     */
    function getTotalVerifications() external view returns (uint256) {
        return totalVerifications;
    }

    /**
     * @dev Check if an attestation would pass verification (for testing)
     * @param attestation The attestation to check
     * @return Whether the attestation would pass
     */
    function wouldPass(Attestation calldata attestation) external view returns (bool) {
        if (attestation.recipient == address(0)) return false;
        if (bytes(attestation.data).length == 0) return false;
        if (attestation.timestamp == 0) return false;

        bytes32 attestationHash = keccak256(abi.encode(attestation));

        // Check forced results first
        if (forcedResults[attestationHash] != false) {
            return forcedResults[attestationHash];
        }

        return defaultResult;
    }
}