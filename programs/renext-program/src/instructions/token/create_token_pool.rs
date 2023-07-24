use crate::state::*;
use crate::utils::pool;
use anchor_lang::prelude::*;

use super::CreateTokenPool;
pub fn handler(
    ctx: Context<CreateTokenPool>,
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

    msg!(
        "Creating a token {} fairlaunch pool {} of token mint {} by {} with treasurer {} and treasury {}",
        ctx.accounts.currency_mint.to_account_info().key(),
        launch_pool.to_account_info().key(),
        ctx.accounts.token_mint.to_account_info().key(),
        ctx.accounts.authority.key(),
        treasurer.to_account_info().key(),
        ctx.accounts.treasury.to_account_info().key()
    );
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
        CurrencyType::ReUSD,
        launch_pool_type,
    )?)
}
