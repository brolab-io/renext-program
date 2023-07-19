use std::num::TryFromIntError;

use anchor_lang::error;
#[error]
#[derive(PartialEq)]
pub enum MyError {
    // code 0c17##
    #[msg("The authority is not authorized to initialize the program")]
    MutationForbidden,
    #[msg("Invalid instruction")]
    InvalidInstruction,
    #[msg("Invalid unlock date")]
    InvalidUnlockDate,
    #[msg("Invalid authority")]
    InvalidAuthority,
    #[msg("Invalid token mint")]
    InvalidTokenMint,
    #[msg("Invalid launch pool status")]
    InvalidLaunchPoolStatus,
    #[msg("Invalid currency type")]
    InvalidCurrencyType,
    #[msg("Pool not enough to buy")]
    PoolNotEnough,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Maximum token amount reached")]
    MaximumTokenAmountReached,
    #[msg("Time lock not expired")]
    TimeLockNotExpired,
    #[msg("Cannot find treasurer account")]
    NoBump,
    #[msg("Minimum token amount not reached")]
    MinimumTokenAmountNotReached,
    #[msg("Invalid creator")]
    InvalidCreator,
    #[msg("Pool size remaining not enough")]
    PoolSizeRemainingNotEnough,
    #[msg("Invalid treasurer")]
    InvalidTreasurer,
    #[msg("Invalid vault")]
    InvalidVault,
    #[msg("Invalid launch pool")]
    InvalidLaunchPool,
    #[msg("White list is full")]
    WhitelistFulled,
    #[msg("Wallet already added")]
    WalletAlreadyAdded,
    #[msg("Wallet not in list")]
    WalletNotInList,
    #[msg("Unable to cast number into BigInt")]
    NumberCastError,
    #[msg("Invalid whitelist")]
    InvalidWhitelist,
    #[msg("Invalid launch pool type")]
    InvalidLaunchPoolType,
    #[msg("Wallets must not be empty")]
    WalletsMustNotBeEmpty,
    #[msg("Whitelist not enough space")]
    WhitelistNotEnoughSpace,
}

impl From<TryFromIntError> for MyError {
    fn from(_: TryFromIntError) -> Self {
        MyError::NumberCastError
    }
}
