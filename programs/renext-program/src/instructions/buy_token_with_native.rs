use anchor_lang::{prelude::*, solana_program};
use anchor_spl::token;

use crate::{
    constants::{USER_POOL_SEED, VAULT_SEED, LAUNCH_POOL_SEED},
    errors::MyError,
    state::{CurrencyType, LaunchPool, LaunchPoolState, LaunchPoolType, UserPool},
    events::BuyTokenEvent,
};

#[derive(Accounts)]
pub struct BuyTokenWithNative<'info> {
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
        space = UserPool::LEN
    )]
    pub user_pool: Box<Account<'info, UserPool>>,
    /// CHECK: Create a new vault for the launch pool
    #[account(
        mut,
        seeds = [
            VAULT_SEED.as_ref(),
            launch_pool.key().as_ref(),
            launch_pool.authority.as_ref()
        ],
        bump ,
    )]
    pub vault: AccountInfo<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<BuyTokenWithNative>, amount: u64) -> ProgramResult {
    let launch_pool = &mut ctx.accounts.launch_pool;
    let user_pool = &mut ctx.accounts.user_pool;
    let vault = &mut ctx.accounts.vault;

    require!(amount.gt(&0), MyError::InvalidAmount);

    require!(
        launch_pool.status == LaunchPoolState::Active,
        MyError::InvalidLaunchPoolStatus
    );

    require!(
        launch_pool.pool_type == LaunchPoolType::FairLaunch,
        MyError::InvalidLaunchPoolType
    );
    require!(
        launch_pool.currency == CurrencyType::RENEC,
        MyError::InvalidCurrencyType
    );
    require!(
        launch_pool.pool_size_remaining.ge(&amount),
        MyError::PoolSizeRemainingNotEnough
    );

    require!(
        user_pool.amount.checked_add(amount).unwrap().ge(&launch_pool.minimum_token_amount),
        MyError::MinimumTokenAmountNotReached
    );

    require!(
        user_pool.amount.checked_add(amount).unwrap().le(&launch_pool.maximum_token_amount),
        MyError::MaximumTokenAmountReached
    );

    let user_must_pay = launch_pool.calculate_user_must_pay(amount);

    require!(user_must_pay.gt(&0), MyError::InvalidAmount);

    let ix = solana_program::system_instruction::transfer(
        &ctx.accounts.user.key(),
        &vault.key(),
        user_must_pay,
    );

    solana_program::program::invoke(
        &ix,
        &[
            ctx.accounts.user.to_account_info(),
            vault.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    user_pool.amount = user_pool.amount.checked_add(amount).unwrap();
    user_pool.currency_amount = user_pool.currency_amount.checked_add(user_must_pay).unwrap();
    launch_pool.pool_size_remaining = launch_pool.pool_size_remaining.checked_sub(amount).unwrap();
    launch_pool.vault_amount = launch_pool.vault_amount.checked_add(user_must_pay).unwrap();

    emit!(BuyTokenEvent {
        buyer: *ctx.accounts.user.key,
        amount,
        total_user_amount: user_pool.amount,
        vault_amount: launch_pool.vault_amount,
    });

    Ok(())
}
