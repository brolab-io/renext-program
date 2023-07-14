use anchor_lang::prelude::*;
pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;
pub mod util;

use instructions::*;

declare_id!("AAW7r9v5sEJ5pkxE8sX1fSLpSDLQSLyESQPCKdvT164S");

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
}

#[derive(Accounts)]
pub struct Initialize {}
