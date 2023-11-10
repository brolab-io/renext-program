use crate::{
    constants::{USER_POOL_SEED, LAUNCH_POOL_SEED},
    errors::MyError,
    state::{CurrencyType, LaunchPool, LaunchPoolState, LaunchPoolType, UserPool},
    REUSD_MINT
};
use anchor_lang::prelude::*;
use anchor_spl::{token};

#[event]
pub struct BuyTokenWithTokenEvent {
    pub buyer: Pubkey,
    pub amount: u64,
    pub token_amount: u64,
}

#[derive(Accounts)]
pub struct BuyTokenWithToken<'info> {
    #[account(
        mut, 
        seeds = [LAUNCH_POOL_SEED.as_ref(), launch_pool.authority.as_ref(), token_mint.key().as_ref()], 
        bump
    )]
    pub launch_pool: Box<Account<'info, LaunchPool>>,
    #[account(
        address = launch_pool.token_mint,
    )]
    pub token_mint: Box<Account<'info, token::Mint>>,
    #[account(
        init_if_needed,
        seeds = [USER_POOL_SEED.as_ref(), user.key().as_ref(), launch_pool.key().as_ref(), token_mint.key().as_ref()],
        bump,
        payer = user,
        space = UserPool::LEN,
        constraint = user_pool.amount <= launch_pool.maximum_token_amount
    )]
    pub user_pool: Box<Account<'info, UserPool>>,
    #[account(
        mut,
        associated_token::mint = currency_mint,
        associated_token::authority = user
    )]
    pub user_token_account: Account<'info, token::TokenAccount>,
    #[account(address = REUSD_MINT)]
    pub currency_mint: Box<Account<'info, token::Mint>>,
    #[account(
        mut,
        associated_token::mint = currency_mint,
        associated_token::authority = launch_pool
    )]
    pub launch_pool_token_account: Account<'info, token::TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<BuyTokenWithToken>, amount: u64) -> ProgramResult {
    let launch_pool = &mut ctx.accounts.launch_pool;
    let user_pool = &mut ctx.accounts.user_pool;

    require!(
        launch_pool.status == LaunchPoolState::Active,
        MyError::InvalidLaunchPoolStatus
    );
    require!(
        launch_pool.pool_type == LaunchPoolType::FairLaunch,
        MyError::InvalidLaunchPoolType
    );
    require!(
        launch_pool.currency == CurrencyType::ReUSD,
        MyError::InvalidCurrencyType
    );
    require!(
        launch_pool.pool_size_remaining > 0,
        MyError::PoolSizeRemainingNotEnough
    );

    require!(
        amount >= launch_pool.minimum_token_amount,
        MyError::MinimumTokenAmountNotReached
    );

    require!(
        user_pool.amount.checked_add(amount).unwrap() <= launch_pool.maximum_token_amount,
        MyError::MaximumTokenAmountReached
    );

    let pool_size_remaining = launch_pool.pool_size_remaining;
    require!(amount > 0, MyError::InvalidAmount);
    require!(pool_size_remaining >= amount, MyError::PoolNotEnough);

    let user_must_pay = launch_pool.calculate_user_must_pay(amount);

    require!(user_must_pay > 0, MyError::InvalidAmount);

    msg!("user_must_pay: {}", user_must_pay);
    let cpi_context = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        token::Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.launch_pool_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        },
    );
    token::transfer(cpi_context, user_must_pay)?;

    msg!(
        "User buy {} token {} with {}",
        amount,
        launch_pool.token_mint,
        user_must_pay
    );

    user_pool.amount = user_pool.amount.checked_add(amount).unwrap();
    user_pool.currency_amount = user_must_pay;
    launch_pool.pool_size_remaining = launch_pool.pool_size_remaining.checked_sub(amount).unwrap();
    launch_pool.vault_amount = launch_pool.vault_amount.checked_add(user_must_pay).unwrap();

    Ok(())
}
