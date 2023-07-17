use anchor_lang::prelude::*;
pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;
pub mod util;

use crate::state::LaunchPoolBumps;
use instructions::*;

declare_id!("HHgVkhFDw5P4hobTrWePPrsZomMDJ4CqDRBaR49xEcBu");

#[program]
pub mod renext_program {
    use super::*;
    pub fn initialize(_ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }

    pub fn create_launch_pool(
        ctx: Context<CreateLaunchPool>,
        unlock_date: i64,
        pool_size: u64,
        minimum_token_amount: u64,
        maximum_token_amount: u64,
        currency: u8,
        pool_type: u8,
        rate: u64,
        token_mint_decimals: u8,
        bumps: LaunchPoolBumps,
    ) -> ProgramResult {
        instructions::create_native_launch_pool::handler(
            ctx,
            unlock_date,
            pool_size,
            minimum_token_amount,
            maximum_token_amount,
            currency,
            pool_type,
            rate,
            token_mint_decimals,
            bumps,
        )
    }

    pub fn start_launch_pool(ctx: Context<StartLaunchPool>) -> ProgramResult {
        instructions::start_launch_pool::handler(ctx)
    }

    pub fn buy_token_with_native(
        ctx: Context<BuyTokenWithNative>,
        creator: Pubkey,
        amount: u64,
    ) -> ProgramResult {
        instructions::buy_token_with_native::handler(ctx, creator, amount)
    }

    pub fn buy_token_with_token(
        ctx: Context<BuyTokenWithToken>,
        creator: Pubkey,
        amount: u64,
    ) -> ProgramResult {
        instructions::buy_token_with_token::handler(ctx, creator, amount)
    }

    pub fn withdraw_native(ctx: Context<WithdrawNativeLaunchPool>, bump: u8) -> ProgramResult {
        instructions::withdraw_native_launch_pool::handler(ctx, bump)
    }

    pub fn complete_launch_pool(ctx: Context<CompleteLaunchPool>) -> ProgramResult {
        instructions::complete_launch_pool::handler(ctx)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
