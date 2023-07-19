use crate::{
    constants::USER_POOL_SEED,
    errors::MyError,
    state::{CurrencyType, LaunchPool, LaunchPoolState, UserPool},
};
use anchor_lang::prelude::*;
use anchor_spl::{associated_token, token};

#[event]
pub struct BuyTokenWithTokenEvent {
    pub buyer: Pubkey,
    pub amount: u64,
    pub token_amount: u64,
}

#[derive(Accounts)]
pub struct BuyTokenWithToken<'info> {
    #[account(mut)]
    pub launch_pool: Box<Account<'info, LaunchPool>>,
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
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
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

    // 1 RENEC = 10 token
    let rate = launch_pool.rate;
    let user_must_pay = amount
        .checked_mul(rate)
        .unwrap()
        .checked_div(10000)
        .unwrap()
        .checked_mul(10_i32.pow(9) as u64)
        .unwrap()
        .checked_div(10_i32.pow(launch_pool.token_mint_decimals as u32) as u64)
        .unwrap();

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

    // let ix = solana_program::system_instruction::transfer(
    //     &ctx.accounts.user.key(),
    //     &launch_pool.key(),
    //     amount,
    // );

    // solana_program::program::invoke(
    //     &ix,
    //     &[
    //         ctx.accounts.user.to_account_info(),
    //         launch_pool.to_account_info(),
    //         ctx.accounts.system_program.to_account_info(),
    //     ],
    // );

    msg!("Transfered {} tokens to treasury", user_must_pay);

    user_pool.amount = user_pool.amount.checked_add(amount).unwrap();
    launch_pool.pool_size_remaining = launch_pool.pool_size_remaining.checked_sub(amount).unwrap();

    emit!(BuyTokenWithTokenEvent {
        buyer: *ctx.accounts.user.key,
        amount,
        token_amount: user_pool.amount,
    });

    Ok(())
}
