// MonadVerify Contract ABI - Generated from compiled contract
// Last updated: 2025-07-20T10:17:31.475Z

export const MONAD_VERIFY_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_primusContract",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_verificationFee",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "EnforcedPause",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ExpectedPause",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "oldContract",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newContract",
        "type": "address"
      }
    ],
    "name": "PrimusContractUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "verificationCount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "UserProfileUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "VerificationCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "dataType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "VerificationRequested",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "MAX_VERIFICATION_FEE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MIN_VERIFICATION_FEE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      }
    ],
    "name": "completeVerification",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractStats",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalUsers",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalVerifications_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "contractBalance",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserProfile",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "verificationCount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lastVerificationTime",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isVerified",
            "type": "bool"
          }
        ],
        "internalType": "struct DataTypes.UserProfile",
        "name": "profile",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      }
    ],
    "name": "getVerificationRequest",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "dataType",
            "type": "string"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "url",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "header",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "method",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "body",
                    "type": "string"
                  }
                ],
                "internalType": "struct AttNetworkRequest",
                "name": "request",
                "type": "tuple"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "keyName",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "parseType",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "parsePath",
                    "type": "string"
                  }
                ],
                "internalType": "struct AttNetworkResponseResolve[]",
                "name": "reponseResolve",
                "type": "tuple[]"
              },
              {
                "internalType": "string",
                "name": "data",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "attConditions",
                "type": "string"
              },
              {
                "internalType": "uint64",
                "name": "timestamp",
                "type": "uint64"
              },
              {
                "internalType": "string",
                "name": "additionParams",
                "type": "string"
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "attestorAddr",
                    "type": "address"
                  },
                  {
                    "internalType": "string",
                    "name": "url",
                    "type": "string"
                  }
                ],
                "internalType": "struct Attestor[]",
                "name": "attestors",
                "type": "tuple[]"
              },
              {
                "internalType": "bytes[]",
                "name": "signatures",
                "type": "bytes[]"
              }
            ],
            "internalType": "struct Attestation",
            "name": "attestation",
            "type": "tuple"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isVerified",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isCompleted",
            "type": "bool"
          }
        ],
        "internalType": "struct DataTypes.VerificationRequest",
        "name": "request",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "isUserVerified",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "primusContract",
    "outputs": [
      {
        "internalType": "contract IPrimusZKTLS",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "dataType",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "string",
                "name": "url",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "header",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "method",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "body",
                "type": "string"
              }
            ],
            "internalType": "struct AttNetworkRequest",
            "name": "request",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "string",
                "name": "keyName",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "parseType",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "parsePath",
                "type": "string"
              }
            ],
            "internalType": "struct AttNetworkResponseResolve[]",
            "name": "reponseResolve",
            "type": "tuple[]"
          },
          {
            "internalType": "string",
            "name": "data",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "attConditions",
            "type": "string"
          },
          {
            "internalType": "uint64",
            "name": "timestamp",
            "type": "uint64"
          },
          {
            "internalType": "string",
            "name": "additionParams",
            "type": "string"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "attestorAddr",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "url",
                "type": "string"
              }
            ],
            "internalType": "struct Attestor[]",
            "name": "attestors",
            "type": "tuple[]"
          },
          {
            "internalType": "bytes[]",
            "name": "signatures",
            "type": "bytes[]"
          }
        ],
        "internalType": "struct Attestation",
        "name": "attestation",
        "type": "tuple"
      }
    ],
    "name": "requestVerification",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "supportedDataTypes",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalVerifications",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newPrimusContract",
        "type": "address"
      }
    ],
    "name": "updatePrimusContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "dataType",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "supported",
        "type": "bool"
      }
    ],
    "name": "updateSupportedDataType",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newFee",
        "type": "uint256"
      }
    ],
    "name": "updateVerificationFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "userProfiles",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "verificationCount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastVerificationTime",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "verificationFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "verificationRequests",
    "outputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "dataType",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "string",
                "name": "url",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "header",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "method",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "body",
                "type": "string"
              }
            ],
            "internalType": "struct AttNetworkRequest",
            "name": "request",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "string",
                "name": "keyName",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "parseType",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "parsePath",
                "type": "string"
              }
            ],
            "internalType": "struct AttNetworkResponseResolve[]",
            "name": "reponseResolve",
            "type": "tuple[]"
          },
          {
            "internalType": "string",
            "name": "data",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "attConditions",
            "type": "string"
          },
          {
            "internalType": "uint64",
            "name": "timestamp",
            "type": "uint64"
          },
          {
            "internalType": "string",
            "name": "additionParams",
            "type": "string"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "attestorAddr",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "url",
                "type": "string"
              }
            ],
            "internalType": "struct Attestor[]",
            "name": "attestors",
            "type": "tuple[]"
          },
          {
            "internalType": "bytes[]",
            "name": "signatures",
            "type": "bytes[]"
          }
        ],
        "internalType": "struct Attestation",
        "name": "attestation",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isCompleted",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const
