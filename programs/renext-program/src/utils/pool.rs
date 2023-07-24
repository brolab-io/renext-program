use crate::{
    errors::MyError,
    state::{CurrencyType, LaunchPool, LaunchPoolType, Treasurer},
};
use anchor_lang::prelude::*;
use anchor_spl::token;

pub fn init_launch_pool<'info>(
    authority: &Signer<'info>,
    launch_pool: &mut Account<'info, LaunchPool>,
    treasurer: &mut Account<'info, Treasurer>,
    token_mint: &Account<'info, token::Mint>,
    unlock_date: i64,
    pool_size: u64,
    minimum_token_amount: u64,
    maximum_token_amount: u64,
    rate: u64,
    token_mint_decimals: u8,
    currency_type: CurrencyType,
    launch_pool_type: LaunchPoolType,
) -> Result<(), ProgramError> {
    require!(
        unlock_date > 0 && unlock_date > Clock::get()?.unix_timestamp,
        MyError::InvalidUnlockDate
    );
    treasurer.initialize(
        *authority.to_account_info().key,
        *launch_pool.to_account_info().key,
        *token_mint.to_account_info().key,
    );
    Ok(launch_pool.initialize(
        unlock_date,
        pool_size,
        minimum_token_amount,
        maximum_token_amount,
        rate,
        token_mint_decimals,
        *token_mint.to_account_info().key,
        *authority.key,
        currency_type,
        launch_pool_type,
    )?)
}
