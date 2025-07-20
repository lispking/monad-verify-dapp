// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DataTypes
 * @dev Library containing data structures used throughout the MonadVerify protocol
 */
library DataTypes {
    /**
     * @dev Struct representing a user's verification profile
     */
    struct UserProfile {
        uint256 verificationCount;      // Number of successful verifications
        uint256 lastVerificationTime;   // Timestamp of last verification
        bool isVerified;                // Whether user has any successful verification
    }

    /**
     * @dev Struct representing a verification request
     */
    struct VerificationRequest {
        address user;                   // User requesting verification
        string dataType;               // Type of data being verified
        bytes attestationData;         // Primus zkTLS attestation data
        uint256 timestamp;             // Request timestamp
        bool isVerified;               // Whether verification was successful
        bool isCompleted;              // Whether verification process is completed
    }

    /**
     * @dev Struct for verification statistics
     */
    struct VerificationStats {
        uint256 totalRequests;         // Total verification requests
        uint256 successfulVerifications; // Successful verifications
        uint256 failedVerifications;   // Failed verifications
        mapping(string => uint256) dataTypeStats; // Stats per data type
    }

    /**
     * @dev Struct for Primus attestation result
     */
    struct AttestationResult {
        bool isValid;                  // Whether attestation is valid
        string dataHash;               // Hash of verified data (if applicable)
        uint256 timestamp;             // Verification timestamp
        address verifier;              // Address that performed verification
    }

    /**
     * @dev Enum for verification status
     */
    enum VerificationStatus {
        Pending,                       // Verification request submitted
        InProgress,                    // Verification in progress
        Completed,                     // Verification completed successfully
        Failed,                        // Verification failed
        Expired                        // Verification request expired
    }

    /**
     * @dev Struct for batch verification
     */
    struct BatchVerificationRequest {
        address[] users;               // Array of users
        string[] dataTypes;           // Array of data types
        bytes[] attestationData;      // Array of attestation data
        uint256 batchId;              // Unique batch identifier
        uint256 timestamp;            // Batch creation timestamp
    }

    // Events for library usage
    event ProfileUpdated(address indexed user, uint256 verificationCount);
    event RequestCreated(bytes32 indexed requestId, address indexed user);
    event AttestationVerified(bytes32 indexed requestId, bool isValid);

    /**
     * @dev Initialize a new user profile
     * @param profile Storage reference to user profile
     */
    function initializeProfile(UserProfile storage profile) internal {
        profile.verificationCount = 0;
        profile.lastVerificationTime = 0;
        profile.isVerified = false;
    }

    /**
     * @dev Update user profile after successful verification
     * @param profile Storage reference to user profile
     * @param dataType Type of data that was verified
     */
    function updateProfileAfterVerification(
        UserProfile storage profile,
        string memory dataType
    ) internal {
        profile.verificationCount++;
        profile.lastVerificationTime = block.timestamp;
        profile.isVerified = true;

        emit ProfileUpdated(msg.sender, profile.verificationCount);
    }

    /**
     * @dev Create a new verification request
     * @param user Address of the user
     * @param dataType Type of data to verify
     * @param attestationData Primus attestation data
     * @return requestId Unique identifier for the request
     */
    function createVerificationRequest(
        address user,
        string memory dataType,
        bytes memory attestationData
    ) internal returns (bytes32 requestId) {
        requestId = keccak256(
            abi.encodePacked(
                user,
                dataType,
                block.timestamp,
                block.number
            )
        );
        
        emit RequestCreated(requestId, user);
        return requestId;
    }

    /**
     * @dev Validate verification request parameters
     * @param user User address
     * @param dataType Data type
     * @param attestationData Attestation data
     * @return isValid Whether parameters are valid
     */
    function validateVerificationRequest(
        address user,
        string memory dataType,
        bytes memory attestationData
    ) internal pure returns (bool isValid) {
        return (
            user != address(0) &&
            bytes(dataType).length > 0 &&
            attestationData.length > 0
        );
    }



    /**
     * @dev Calculate verification score based on profile
     * @param profile User profile
     * @return score Verification score (0-100)
     */
    function calculateVerificationScore(
        UserProfile storage profile
    ) internal view returns (uint256 score) {
        if (!profile.isVerified) {
            return 0;
        }
        
        // Base score for being verified
        score = 20;
        
        // Additional points for multiple verifications (max 50 points)
        uint256 countBonus = profile.verificationCount * 10;
        if (countBonus > 50) {
            countBonus = 50;
        }
        score += countBonus;
        
        // Recency bonus (max 30 points)
        uint256 timeSinceLastVerification = block.timestamp - profile.lastVerificationTime;
        if (timeSinceLastVerification < 30 days) {
            score += 30;
        } else if (timeSinceLastVerification < 90 days) {
            score += 20;
        } else if (timeSinceLastVerification < 180 days) {
            score += 10;
        }
        
        // Cap at 100
        if (score > 100) {
            score = 100;
        }
        
        return score;
    }
}
