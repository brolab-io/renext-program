use anchor_lang::prelude::Pubkey;
use anchor_lang::prelude::*;
use solana_program::pubkey;
pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;
pub mod utils;

use instructions::*;
use state::{LaunchPoolType, VestingSchedule};

declare_id!("HwG2Z2ji5xuB7THHNrwEMhYAwKi1CHJDWnP3J4HU6Svp");

#[cfg(not(feature = "for-testnet"))]
#[constant]
pub const REUSD_MINT: Pubkey = pubkey!("4Q89182juiadeFgGw3fupnrwnnDmBhf7e7fHWxnUP3S3");

#[cfg(feature = "for-testnet")]
#[constant]
pub const REUSD_MINT: Pubkey = pubkey!("AJABAYSrSuFCgmRnxTVBY2zfSpYx9gXrWPCP5QZ16TNu");

#[program]
pub mod renext_program {

    use super::*;
    pub fn initialize(_ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }

    pub fn create_token_pool(
        ctx: Context<CreateTokenPool>,
        unlock_date: i64,
        pool_size: u64,
        minimum_token_amount: u64,
        maximum_token_amount: u64,
        rate: u64,
        token_mint_decimals: u8,
        launch_pool_type: u8,
    ) -> ProgramResult {
        instructions::token::create_token_pool::handler(
            ctx,
            unlock_date,
            pool_size,
            minimum_token_amount,
            maximum_token_amount,
            rate,
            token_mint_decimals,
            LaunchPoolType::from(launch_pool_type),
        )
    }

    pub fn create_native_pool(
        ctx: Context<CreateNativePool>,
        unlock_date: i64,
        pool_size: u64,
        minimum_token_amount: u64,
        maximum_token_amount: u64,
        rate: u64,
        token_mint_decimals: u8,
        launch_pool_type: u8,
    ) -> ProgramResult {
        instructions::native::create_native_pool::handler(
            ctx,
            unlock_date,
            pool_size,
            minimum_token_amount,
            maximum_token_amount,
            rate,
            token_mint_decimals,
            LaunchPoolType::from(launch_pool_type),
        )
    }

    pub fn start_launch_pool(ctx: Context<StartLaunchPool>) -> ProgramResult {
        instructions::start_launch_pool::handler(ctx)
    }

    pub fn start_launch_pool_with_whitelist(
        ctx: Context<StartLaunchPoolWithWhitelist>,
        max_size: u8,
        wallets: Vec<Pubkey>,
    ) -> ProgramResult {
        instructions::start_launch_pool_with_whitelist::handler(ctx, max_size, wallets)
    }

    pub fn add_wallets_to_whitelist(
        ctx: Context<AddWalletsToWhitelist>,
        wallets: Vec<Pubkey>,
    ) -> ProgramResult {
        instructions::add_wallets_to_whitelist::handler(ctx, wallets)
    }

    pub fn remove_wallets_from_whitelist(
        ctx: Context<RemoveWalletsFromWhitelist>,
        wallets: Vec<Pubkey>,
    ) -> ProgramResult {
        instructions::remove_wallets_from_whitelist::handler(ctx, wallets)
    }

    pub fn buy_token_with_native(ctx: Context<BuyTokenWithNative>, amount: u64) -> ProgramResult {
        instructions::buy_token_with_native::handler(ctx, amount)
    }

    pub fn buy_token_with_token(ctx: Context<BuyTokenWithToken>, amount: u64) -> ProgramResult {
        instructions::buy_token_with_token::handler(ctx, amount)
    }

    pub fn buy_token_with_native_whitelist(
        ctx: Context<BuyTokenWithNativeWhitelist>,
        amount: u64,
    ) -> ProgramResult {
        instructions::buy_token_with_native_whitelist::handler(ctx, amount)
    }

    pub fn buy_token_with_token_whitelist(
        ctx: Context<BuyTokenWithTokenWhitelist>,
        amount: u64,
    ) -> ProgramResult {
        instructions::buy_token_with_token_whitelist::handler(ctx, amount)
    }

    pub fn withdraw_native(ctx: Context<WithdrawNativeLaunchPool>) -> ProgramResult {
        instructions::withdraw_native_launch_pool::handler(ctx)
    }

    pub fn withdraw_token(ctx: Context<WithdrawTokenLaunchPool>) -> ProgramResult {
        instructions::withdraw_token_launch_pool::handler(ctx)
    }

    pub fn complete_launch_pool(ctx: Context<CompleteLaunchPool>) -> ProgramResult {
        instructions::complete_launch_pool::handler(ctx)
    }

    pub fn claim_token(ctx: Context<ClaimToken>) -> ProgramResult {
        instructions::claim_token::handler(ctx)
    }

    pub fn claim_token_vesting(ctx: Context<ClaimTokenVesting>) -> ProgramResult {
        instructions::claim_token_vesting::handler(ctx)
    }

    pub fn set_vesting_plan(
        ctx: Context<UpdateVestingPlan>,
        size: u8,
        schedule: Vec<VestingSchedule>,
    ) -> ProgramResult {
        instructions::update_vesting_plan::handler(ctx, size, schedule)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
