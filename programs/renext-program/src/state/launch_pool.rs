use anchor_lang::prelude::*;

use crate::constants::{DISCRIMINATOR_SIZE, I64_SIZE, PUBKEY_SIZE, U64_SIZE, U8_SIZE};

// struct for launchpad token pool
#[account]
pub struct LaunchPool {
    pub unlock_date: i64,
    pub pool_size: u64,
    pub minimum_token_amount: u64,
    pub maximum_token_amount: u64,
    pub rate: u64,
    pub pool_size_remaining: u64,
    pub token_mint: Pubkey,
    pub token_mint_decimals: u8,
    pub authority: Pubkey,
    pub currency: CurrencyType,
    pub pool_type: LaunchPoolType,
    pub status: LaunchPoolState,
}

// enum for currency token type
#[derive(AnchorDeserialize, AnchorSerialize, PartialEq, Eq, Clone, Copy)]
pub enum CurrencyType {
    RENEC,
    ReUSD,
}

impl From<u8> for CurrencyType {
    fn from(val: u8) -> Self {
        match val {
            0 => CurrencyType::RENEC,
            1 => CurrencyType::ReUSD,
            _ => panic!("Invalid CurrencyType"),
        }
    }
}

// enum for launchpad type
#[derive(AnchorDeserialize, AnchorSerialize, PartialEq, Eq, Clone, Copy)]
pub enum LaunchPoolType {
    FairLaunch,
    WhiteList,
}

impl From<u8> for LaunchPoolType {
    fn from(val: u8) -> Self {
        match val {
            0 => LaunchPoolType::FairLaunch,
            1 => LaunchPoolType::WhiteList,
            _ => panic!("Invalid LaunchPoolType"),
        }
    }
}

// enum for launchpad token pool status
#[derive(AnchorDeserialize, AnchorSerialize, PartialEq, Eq, Clone, Copy)]
pub enum LaunchPoolState {
    Pending,
    Active,
    Completed,
    Cancelled,
}

impl LaunchPool {
    pub const LEN: usize = DISCRIMINATOR_SIZE +
        I64_SIZE +
        U64_SIZE +
        U64_SIZE +
        U64_SIZE +
        U64_SIZE +
        U64_SIZE +
        PUBKEY_SIZE +
        U8_SIZE + // token_mint_decimals
        PUBKEY_SIZE +
        1 +
        1 + // enum CurrencyType
        1 +
        1 + // enum LaunchPoolType
        1 +
        1; // enum LaunchPoolState
}
