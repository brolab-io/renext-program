use anchor_lang::prelude::*;
use anchor_spl::{associated_token, token};

use crate::constants::{LAUNCH_POOL_SEED, REUSD_MINT, TREASURER_SEED};
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
pub struct CreateTokenWhitelistPool<'info> {
    #[account(
        init,
        seeds = [LAUNCH_POOL_SEED.as_ref(), authority.key().as_ref(), token_mint.key().as_ref()],
        bump,
        payer = authority,
        space = LaunchPool::LEN
    )]
    pub launch_pool: Box<Account<'info, LaunchPool>>,
    pub token_mint: Box<Account<'info, token::Mint>>,
    #[account(
        init,
        seeds = [TREASURER_SEED.as_ref(), launch_pool.key().as_ref(), token_mint.key().as_ref()],
        bump ,
        payer = authority,
        space = Treasurer::LEN
    )]
    pub treasurer: Box<Account<'info, Treasurer>>,
    #[account(
        init,
        payer = authority,
        associated_token::mint = token_mint,
        associated_token::authority = treasurer
    )]
    pub treasury: Box<Account<'info, token::TokenAccount>>,
    #[account(address = REUSD_MINT)]
    pub currency_mint: Box<Account<'info, token::Mint>>,
    #[account(
        init,
        payer = authority,
        associated_token::mint = currency_mint,
        associated_token::authority = launch_pool,
        constraint = currency_mint.key() == REUSD_MINT
    )]
    pub launch_pool_token_account: Account<'info, token::TokenAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreateTokenWhitelistPool>,
    unlock_date: i64,
    pool_size: u64,
    minimum_token_amount: u64,
    maximum_token_amount: u64,
    rate: u64,
    token_mint_decimals: u8,
) -> ProgramResult {
    let launch_pool = &mut ctx.accounts.launch_pool;
    let treasurer = &mut ctx.accounts.treasurer;

    require!(
        unlock_date > 0 && unlock_date > Clock::get()?.unix_timestamp,
        MyError::InvalidUnlockDate
    );

    treasurer.initialize(
        *ctx.accounts.authority.key,
        *launch_pool.to_account_info().key,
        *ctx.accounts.token_mint.to_account_info().key,
    );

    msg!(
        "Creating a token {} whitelist pool {} of token mint {} by {} with treasurer {} and treasury {}",
        ctx.accounts.currency_mint.to_account_info().key(),
        launch_pool.to_account_info().key(),
        ctx.accounts.token_mint.to_account_info().key(),
        ctx.accounts.authority.key(),
        treasurer.to_account_info().key(),
        ctx.accounts.treasury.to_account_info().key()
    );

    Ok(launch_pool.initialize(
        unlock_date,
        pool_size,
        minimum_token_amount,
        maximum_token_amount,
        rate,
        token_mint_decimals,
        *ctx.accounts.token_mint.to_account_info().key,
        *ctx.accounts.authority.key,
        CurrencyType::ReUSD,
        LaunchPoolType::WhiteList,
    )?)
}
