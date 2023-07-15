use anchor_lang::prelude::*;
pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;
pub mod util;

use instructions::*;

declare_id!("EMYWwdb9pf2mpsj5rSsR7SHvy37U2ajfw9BLE5TUK2et");

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
    ) -> ProgramResult {
        instructions::create_launch_pool::handler(
            ctx,
            unlock_date,
            pool_size,
            minimum_token_amount,
            maximum_token_amount,
            currency,
            pool_type,
            rate,
            token_mint_decimals,
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
}

#[derive(Accounts)]
pub struct Initialize {}
