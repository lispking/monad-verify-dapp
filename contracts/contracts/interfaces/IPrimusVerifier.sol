// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IPrimusVerifier
 * @dev Interface for interacting with Primus zkTLS verification contracts
 * @notice This interface defines the methods for verifying zkTLS attestations
 */
interface IPrimusVerifier {
    /**
     * @dev Struct representing an attestation
     */
    struct Attestation {
        bytes proof;                    // Zero-knowledge proof
        bytes publicSignals;           // Public signals from the proof
        bytes attestationData;         // Raw attestation data
        uint256 timestamp;             // Attestation timestamp
        address attester;              // Address of the attester
    }

    /**
     * @dev Struct for verification result
     */
    struct VerificationResult {
        bool isValid;                  // Whether the attestation is valid
        string dataHash;               // Hash of the verified data
        uint256 verificationTime;     // Time when verification was performed
        address verifier;              // Address that performed verification
    }

    /**
     * @dev Event emitted when an attestation is verified
     * @param attestationHash Hash of the attestation
     * @param isValid Whether the attestation is valid
     * @param verifier Address that performed the verification
     */
    event AttestationVerified(
        bytes32 indexed attestationHash,
        bool isValid,
        address indexed verifier
    );

    /**
     * @dev Event emitted when verification parameters are updated
     * @param parameter Name of the parameter
     * @param oldValue Old value
     * @param newValue New value
     */
    event VerificationParameterUpdated(
        string parameter,
        bytes32 oldValue,
        bytes32 newValue
    );

    /**
     * @dev Verify a zkTLS attestation
     * @param attestationData The attestation data to verify
     * @return isValid Whether the attestation is valid
     */
    function verifyAttestation(bytes calldata attestationData) external returns (bool isValid);

    /**
     * @dev Verify a zkTLS attestation with detailed result
     * @param attestationData The attestation data to verify
     * @return result Detailed verification result
     */
    function verifyAttestationDetailed(
        bytes calldata attestationData
    ) external returns (VerificationResult memory result);

    /**
     * @dev Batch verify multiple attestations
     * @param attestationsData Array of attestation data to verify
     * @return results Array of verification results
     */
    function batchVerifyAttestations(
        bytes[] calldata attestationsData
    ) external returns (bool[] memory results);

    /**
     * @dev Verify attestation with specific template
     * @param attestationData The attestation data to verify
     * @param templateId The template ID to use for verification
     * @return isValid Whether the attestation is valid
     */
    function verifyAttestationWithTemplate(
        bytes calldata attestationData,
        bytes32 templateId
    ) external returns (bool isValid);

    /**
     * @dev Get verification status of an attestation
     * @param attestationHash Hash of the attestation
     * @return result Verification result if exists
     */
    function getVerificationResult(
        bytes32 attestationHash
    ) external view returns (VerificationResult memory result);

    /**
     * @dev Check if an attestation has been verified
     * @param attestationHash Hash of the attestation
     * @return isVerified Whether the attestation has been verified
     */
    function isAttestationVerified(bytes32 attestationHash) external view returns (bool isVerified);

    /**
     * @dev Get the hash of attestation data
     * @param attestationData The attestation data
     * @return hash Hash of the attestation data
     */
    function getAttestationHash(bytes calldata attestationData) external pure returns (bytes32 hash);

    /**
     * @dev Get supported verification modes
     * @return modes Array of supported mode identifiers
     */
    function getSupportedModes() external view returns (string[] memory modes);

    /**
     * @dev Check if a verification mode is supported
     * @param mode The mode to check
     * @return isSupported Whether the mode is supported
     */
    function isModeSupported(string calldata mode) external view returns (bool isSupported);

    /**
     * @dev Get verification fee for a specific mode
     * @param mode The verification mode
     * @return fee The verification fee
     */
    function getVerificationFee(string calldata mode) external view returns (uint256 fee);

    /**
     * @dev Get total number of verifications performed
     * @return count Total verification count
     */
    function getTotalVerifications() external view returns (uint256 count);

    /**
     * @dev Get verification statistics
     * @return totalVerifications Total number of verifications
     * @return successfulVerifications Number of successful verifications
     * @return failedVerifications Number of failed verifications
     */
    function getVerificationStats() external view returns (
        uint256 totalVerifications,
        uint256 successfulVerifications,
        uint256 failedVerifications
    );
}
