export type RenextProgram = {
  "version": "0.1.0",
  "name": "renext_program",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "createTokenFairlaunchPool",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasurer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "launchPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "unlockDate",
          "type": "i64"
        },
        {
          "name": "poolSize",
          "type": "u64"
        },
        {
          "name": "minimumTokenAmount",
          "type": "u64"
        },
        {
          "name": "maximumTokenAmount",
          "type": "u64"
        },
        {
          "name": "rate",
          "type": "u64"
        },
        {
          "name": "tokenMintDecimals",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createNativeFairlaunchPool",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasurer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "unlockDate",
          "type": "i64"
        },
        {
          "name": "poolSize",
          "type": "u64"
        },
        {
          "name": "minimumTokenAmount",
          "type": "u64"
        },
        {
          "name": "maximumTokenAmount",
          "type": "u64"
        },
        {
          "name": "rate",
          "type": "u64"
        },
        {
          "name": "tokenMintDecimals",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createLaunchPool",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasurer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "unlockDate",
          "type": "i64"
        },
        {
          "name": "poolSize",
          "type": "u64"
        },
        {
          "name": "minimumTokenAmount",
          "type": "u64"
        },
        {
          "name": "maximumTokenAmount",
          "type": "u64"
        },
        {
          "name": "currency",
          "type": "u8"
        },
        {
          "name": "poolType",
          "type": "u8"
        },
        {
          "name": "rate",
          "type": "u64"
        },
        {
          "name": "tokenMintDecimals",
          "type": "u8"
        },
        {
          "name": "bumps",
          "type": {
            "defined": "LaunchPoolBumps"
          }
        }
      ]
    },
    {
      "name": "startLaunchPool",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sourceTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasurer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "buyTokenWithNative",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "creator",
          "type": "publicKey"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buyTokenWithToken",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasurer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "launchPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "creator",
          "type": "publicKey"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawNative",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "beneficiary",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "completeLaunchPool",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "claimToken",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasurer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "creator",
          "type": "publicKey"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "launchPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "unlockDate",
            "type": "i64"
          },
          {
            "name": "poolSize",
            "type": "u64"
          },
          {
            "name": "minimumTokenAmount",
            "type": "u64"
          },
          {
            "name": "maximumTokenAmount",
            "type": "u64"
          },
          {
            "name": "rate",
            "type": "u64"
          },
          {
            "name": "poolSizeRemaining",
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "tokenMintDecimals",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "vaultAmount",
            "type": "u64"
          },
          {
            "name": "currency",
            "type": {
              "defined": "CurrencyType"
            }
          },
          {
            "name": "poolType",
            "type": {
              "defined": "LaunchPoolType"
            }
          },
          {
            "name": "status",
            "type": {
              "defined": "LaunchPoolState"
            }
          }
        ]
      }
    },
    {
      "name": "treasurer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "launchPool",
            "type": "publicKey"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "currencyAmount",
            "type": "u64"
          },
          {
            "name": "claimed",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "LaunchPoolBumps",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "launchpoolBump",
            "type": "u8"
          },
          {
            "name": "treasurerBump",
            "type": "u8"
          },
          {
            "name": "vaultBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "CurrencyType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "RENEC"
          },
          {
            "name": "ReUSD"
          }
        ]
      }
    },
    {
      "name": "LaunchPoolType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "FairLaunch"
          },
          {
            "name": "WhiteList"
          }
        ]
      }
    },
    {
      "name": "LaunchPoolState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Pending"
          },
          {
            "name": "Active"
          },
          {
            "name": "Completed"
          },
          {
            "name": "Cancelled"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "BuyTokenWithNativeEvent",
      "fields": [
        {
          "name": "buyer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "vaultAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "BuyTokenWithTokenEvent",
      "fields": [
        {
          "name": "buyer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "CreateLaunchPoolEvent",
      "fields": [
        {
          "name": "creator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "treasury",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "treasurer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "currencyType",
          "type": {
            "defined": "CurrencyType"
          },
          "index": false
        },
        {
          "name": "launchPoolType",
          "type": {
            "defined": "LaunchPoolType"
          },
          "index": false
        },
        {
          "name": "poolSize",
          "type": "u64",
          "index": false
        },
        {
          "name": "minimumTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "unlockDate",
          "type": "i64",
          "index": false
        },
        {
          "name": "status",
          "type": {
            "defined": "LaunchPoolState"
          },
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MutationForbidden",
      "msg": "The authority is not authorized to initialize the program"
    },
    {
      "code": 6001,
      "name": "InvalidInstruction",
      "msg": "Invalid instruction"
    },
    {
      "code": 6002,
      "name": "InvalidUnlockDate",
      "msg": "Invalid unlock date"
    },
    {
      "code": 6003,
      "name": "InvalidAuthority",
      "msg": "Invalid authority"
    },
    {
      "code": 6004,
      "name": "InvalidTokenMint",
      "msg": "Invalid token mint"
    },
    {
      "code": 6005,
      "name": "InvalidLaunchPoolStatus",
      "msg": "Invalid launch pool status"
    },
    {
      "code": 6006,
      "name": "InvalidCurrencyType",
      "msg": "Invalid currency type"
    },
    {
      "code": 6007,
      "name": "PoolNotEnough",
      "msg": "Pool not enough to buy"
    },
    {
      "code": 6008,
      "name": "InvalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6009,
      "name": "MaximumTokenAmountReached",
      "msg": "Maximum token amount reached"
    },
    {
      "code": 6010,
      "name": "TimeLockNotExpired",
      "msg": "Time lock not expired"
    },
    {
      "code": 6011,
      "name": "NoBump",
      "msg": "Cannot find treasurer account"
    },
    {
      "code": 6012,
      "name": "MinimumTokenAmountNotReached",
      "msg": "Minimum token amount not reached"
    },
    {
      "code": 6013,
      "name": "InvalidCreator",
      "msg": "Invalid creator"
    },
    {
      "code": 6014,
      "name": "PoolSizeRemainingNotEnough",
      "msg": "Pool size remaining not enough"
    }
  ]
};

export const IDL: RenextProgram = {
  "version": "0.1.0",
  "name": "renext_program",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "createTokenFairlaunchPool",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasurer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "launchPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "unlockDate",
          "type": "i64"
        },
        {
          "name": "poolSize",
          "type": "u64"
        },
        {
          "name": "minimumTokenAmount",
          "type": "u64"
        },
        {
          "name": "maximumTokenAmount",
          "type": "u64"
        },
        {
          "name": "rate",
          "type": "u64"
        },
        {
          "name": "tokenMintDecimals",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createNativeFairlaunchPool",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasurer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "unlockDate",
          "type": "i64"
        },
        {
          "name": "poolSize",
          "type": "u64"
        },
        {
          "name": "minimumTokenAmount",
          "type": "u64"
        },
        {
          "name": "maximumTokenAmount",
          "type": "u64"
        },
        {
          "name": "rate",
          "type": "u64"
        },
        {
          "name": "tokenMintDecimals",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createLaunchPool",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasurer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "unlockDate",
          "type": "i64"
        },
        {
          "name": "poolSize",
          "type": "u64"
        },
        {
          "name": "minimumTokenAmount",
          "type": "u64"
        },
        {
          "name": "maximumTokenAmount",
          "type": "u64"
        },
        {
          "name": "currency",
          "type": "u8"
        },
        {
          "name": "poolType",
          "type": "u8"
        },
        {
          "name": "rate",
          "type": "u64"
        },
        {
          "name": "tokenMintDecimals",
          "type": "u8"
        },
        {
          "name": "bumps",
          "type": {
            "defined": "LaunchPoolBumps"
          }
        }
      ]
    },
    {
      "name": "startLaunchPool",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sourceTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasurer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "buyTokenWithNative",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "creator",
          "type": "publicKey"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buyTokenWithToken",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasurer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "launchPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "creator",
          "type": "publicKey"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawNative",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "beneficiary",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "completeLaunchPool",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "claimToken",
      "accounts": [
        {
          "name": "launchPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasurer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "creator",
          "type": "publicKey"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "launchPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "unlockDate",
            "type": "i64"
          },
          {
            "name": "poolSize",
            "type": "u64"
          },
          {
            "name": "minimumTokenAmount",
            "type": "u64"
          },
          {
            "name": "maximumTokenAmount",
            "type": "u64"
          },
          {
            "name": "rate",
            "type": "u64"
          },
          {
            "name": "poolSizeRemaining",
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "tokenMintDecimals",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "vaultAmount",
            "type": "u64"
          },
          {
            "name": "currency",
            "type": {
              "defined": "CurrencyType"
            }
          },
          {
            "name": "poolType",
            "type": {
              "defined": "LaunchPoolType"
            }
          },
          {
            "name": "status",
            "type": {
              "defined": "LaunchPoolState"
            }
          }
        ]
      }
    },
    {
      "name": "treasurer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "launchPool",
            "type": "publicKey"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "currencyAmount",
            "type": "u64"
          },
          {
            "name": "claimed",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "LaunchPoolBumps",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "launchpoolBump",
            "type": "u8"
          },
          {
            "name": "treasurerBump",
            "type": "u8"
          },
          {
            "name": "vaultBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "CurrencyType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "RENEC"
          },
          {
            "name": "ReUSD"
          }
        ]
      }
    },
    {
      "name": "LaunchPoolType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "FairLaunch"
          },
          {
            "name": "WhiteList"
          }
        ]
      }
    },
    {
      "name": "LaunchPoolState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Pending"
          },
          {
            "name": "Active"
          },
          {
            "name": "Completed"
          },
          {
            "name": "Cancelled"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "BuyTokenWithNativeEvent",
      "fields": [
        {
          "name": "buyer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "vaultAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "BuyTokenWithTokenEvent",
      "fields": [
        {
          "name": "buyer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "CreateLaunchPoolEvent",
      "fields": [
        {
          "name": "creator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "treasury",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "treasurer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "currencyType",
          "type": {
            "defined": "CurrencyType"
          },
          "index": false
        },
        {
          "name": "launchPoolType",
          "type": {
            "defined": "LaunchPoolType"
          },
          "index": false
        },
        {
          "name": "poolSize",
          "type": "u64",
          "index": false
        },
        {
          "name": "minimumTokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "unlockDate",
          "type": "i64",
          "index": false
        },
        {
          "name": "status",
          "type": {
            "defined": "LaunchPoolState"
          },
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MutationForbidden",
      "msg": "The authority is not authorized to initialize the program"
    },
    {
      "code": 6001,
      "name": "InvalidInstruction",
      "msg": "Invalid instruction"
    },
    {
      "code": 6002,
      "name": "InvalidUnlockDate",
      "msg": "Invalid unlock date"
    },
    {
      "code": 6003,
      "name": "InvalidAuthority",
      "msg": "Invalid authority"
    },
    {
      "code": 6004,
      "name": "InvalidTokenMint",
      "msg": "Invalid token mint"
    },
    {
      "code": 6005,
      "name": "InvalidLaunchPoolStatus",
      "msg": "Invalid launch pool status"
    },
    {
      "code": 6006,
      "name": "InvalidCurrencyType",
      "msg": "Invalid currency type"
    },
    {
      "code": 6007,
      "name": "PoolNotEnough",
      "msg": "Pool not enough to buy"
    },
    {
      "code": 6008,
      "name": "InvalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6009,
      "name": "MaximumTokenAmountReached",
      "msg": "Maximum token amount reached"
    },
    {
      "code": 6010,
      "name": "TimeLockNotExpired",
      "msg": "Time lock not expired"
    },
    {
      "code": 6011,
      "name": "NoBump",
      "msg": "Cannot find treasurer account"
    },
    {
      "code": 6012,
      "name": "MinimumTokenAmountNotReached",
      "msg": "Minimum token amount not reached"
    },
    {
      "code": 6013,
      "name": "InvalidCreator",
      "msg": "Invalid creator"
    },
    {
      "code": 6014,
      "name": "PoolSizeRemainingNotEnough",
      "msg": "Pool size remaining not enough"
    }
  ]
};
