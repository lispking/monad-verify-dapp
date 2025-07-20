// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./interfaces/IPrimusVerifier.sol";
import "./libraries/DataTypes.sol";

/**
 * @title MonadVerify
 * @dev Main contract for data verification using Primus zkTLS technology on Monad blockchain
 * @author MonadVerify Team
 */
contract MonadVerify is Ownable, ReentrancyGuard, Pausable {
    using DataTypes for DataTypes.VerificationRequest;
    using DataTypes for DataTypes.UserProfile;

    // Events
    event VerificationRequested(
        address indexed user,
        bytes32 indexed requestId,
        string dataType,
        uint256 timestamp
    );
    
    event VerificationCompleted(
        address indexed user,
        bytes32 indexed requestId,
        bool success,
        uint256 timestamp
    );
    
    event UserProfileUpdated(
        address indexed user,
        uint256 verificationCount,
        uint256 timestamp
    );
    
    event PrimusContractUpdated(
        address indexed oldContract,
        address indexed newContract
    );

    // State variables
    IPrimusVerifier public primusContract;
    
    mapping(address => DataTypes.UserProfile) public userProfiles;
    mapping(bytes32 => DataTypes.VerificationRequest) public verificationRequests;
    mapping(string => bool) public supportedDataTypes;
    
    uint256 public totalVerifications;
    uint256 public verificationFee;
    
    // Constants
    uint256 public constant MAX_VERIFICATION_FEE = 1 ether;
    uint256 public constant MIN_VERIFICATION_FEE = 0.001 ether;

    /**
     * @dev Constructor
     * @param _primusContract Address of the Primus verifier contract
     * @param _verificationFee Fee required for verification
     */
    constructor(
        address _primusContract,
        uint256 _verificationFee
    ) Ownable(msg.sender) {
        require(_primusContract != address(0), "Invalid Primus contract address");
        require(
            _verificationFee >= MIN_VERIFICATION_FEE && 
            _verificationFee <= MAX_VERIFICATION_FEE,
            "Invalid verification fee"
        );
        
        primusContract = IPrimusVerifier(_primusContract);
        verificationFee = _verificationFee;
        
        // Initialize supported data types
        supportedDataTypes["identity"] = true;
        supportedDataTypes["income"] = true;
        supportedDataTypes["credit_score"] = true;
        supportedDataTypes["social_media"] = true;
        supportedDataTypes["education"] = true;
    }

    /**
     * @dev Request data verification
     * @param dataType Type of data to verify
     * @param attestationData Attestation data from Primus zkTLS
     * @return requestId Unique identifier for the verification request
     */
    function requestVerification(
        string calldata dataType,
        bytes calldata attestationData
    ) external payable nonReentrant whenNotPaused returns (bytes32 requestId) {
        require(msg.value >= verificationFee, "Insufficient verification fee");
        require(supportedDataTypes[dataType], "Unsupported data type");
        require(attestationData.length > 0, "Empty attestation data");
        
        requestId = keccak256(
            abi.encodePacked(
                msg.sender,
                dataType,
                block.timestamp,
                block.number
            )
        );
        
        require(
            verificationRequests[requestId].user == address(0),
            "Request ID already exists"
        );
        
        // Create verification request
        verificationRequests[requestId] = DataTypes.VerificationRequest({
            user: msg.sender,
            dataType: dataType,
            attestationData: attestationData,
            timestamp: block.timestamp,
            isVerified: false,
            isCompleted: false
        });
        
        emit VerificationRequested(msg.sender, requestId, dataType, block.timestamp);
        
        return requestId;
    }

    /**
     * @dev Complete verification process
     * @param requestId The verification request ID
     */
    function completeVerification(
        bytes32 requestId
    ) external nonReentrant whenNotPaused {
        DataTypes.VerificationRequest storage request = verificationRequests[requestId];
        require(request.user == msg.sender, "Unauthorized");
        require(!request.isCompleted, "Verification already completed");
        
        // Verify attestation with Primus contract
        bool isValid = primusContract.verifyAttestation(request.attestationData);
        
        request.isVerified = isValid;
        request.isCompleted = true;
        
        if (isValid) {
            // Update user profile
            DataTypes.UserProfile storage profile = userProfiles[msg.sender];
            profile.verificationCount++;
            profile.lastVerificationTime = block.timestamp;
            profile.isVerified = true;
            
            // Update global stats
            totalVerifications++;
            
            emit UserProfileUpdated(
                msg.sender,
                profile.verificationCount,
                block.timestamp
            );
        }
        
        emit VerificationCompleted(msg.sender, requestId, isValid, block.timestamp);
    }

    /**
     * @dev Get user verification status
     * @param user Address of the user
     * @return profile User's verification profile
     */
    function getUserProfile(
        address user
    ) external view returns (DataTypes.UserProfile memory profile) {
        return userProfiles[user];
    }

    /**
     * @dev Get verification request details
     * @param requestId The verification request ID
     * @return request Verification request details
     */
    function getVerificationRequest(
        bytes32 requestId
    ) external view returns (DataTypes.VerificationRequest memory request) {
        return verificationRequests[requestId];
    }

    /**
     * @dev Check if user is verified
     * @param user Address of the user
     * @return True if user has at least one successful verification
     */
    function isUserVerified(address user) external view returns (bool) {
        return userProfiles[user].isVerified;
    }

    // Admin functions

    /**
     * @dev Update Primus contract address
     * @param _newPrimusContract New Primus contract address
     */
    function updatePrimusContract(
        address _newPrimusContract
    ) external onlyOwner {
        require(_newPrimusContract != address(0), "Invalid contract address");
        
        address oldContract = address(primusContract);
        primusContract = IPrimusVerifier(_newPrimusContract);
        
        emit PrimusContractUpdated(oldContract, _newPrimusContract);
    }

    /**
     * @dev Update verification fee
     * @param _newFee New verification fee
     */
    function updateVerificationFee(uint256 _newFee) external onlyOwner {
        require(
            _newFee >= MIN_VERIFICATION_FEE && 
            _newFee <= MAX_VERIFICATION_FEE,
            "Invalid verification fee"
        );
        verificationFee = _newFee;
    }

    /**
     * @dev Add or remove supported data type
     * @param dataType Data type to update
     * @param supported Whether the data type is supported
     */
    function updateSupportedDataType(
        string calldata dataType,
        bool supported
    ) external onlyOwner {
        supportedDataTypes[dataType] = supported;
    }

    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Get contract statistics
     * @return totalUsers Total number of users with profiles
     * @return totalVerifications_ Total number of successful verifications
     * @return contractBalance Current contract balance
     */
    function getContractStats() external view returns (
        uint256 totalUsers,
        uint256 totalVerifications_,
        uint256 contractBalance
    ) {
        // Note: totalUsers would need a separate counter in a real implementation
        return (0, totalVerifications, address(this).balance);
    }
}
