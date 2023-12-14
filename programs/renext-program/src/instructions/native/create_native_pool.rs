use crate::state::*;
use crate::utils::pool;
use crate::CreateNativePool;
use anchor_lang::prelude::*;

pub fn handler(
    ctx: Context<CreateNativePool>,
    unlock_date: i64,
    pool_size: u64,
    minimum_token_amount: u64,
    maximum_token_amount: u64,
    rate: u64,
    token_mint_decimals: u8,
    launch_pool_type: LaunchPoolType,
) -> ProgramResult {
    let launch_pool = &mut ctx.accounts.launch_pool;
    let treasurer = &mut ctx.accounts.treasurer;

    Ok(pool::init_launch_pool(
        &ctx.accounts.authority,
        launch_pool,
        treasurer,
        &ctx.accounts.token_mint,
        unlock_date,
        pool_size,
        minimum_token_amount,
        maximum_token_amount,
        rate,
        token_mint_decimals,
        CurrencyType::RENEC,
        launch_pool_type,
    )?)
}
