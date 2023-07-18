use anchor_lang::{prelude::*, solana_program};
use anchor_spl::token;

use crate::{
    constants::{LAUNCH_POOL_SEED, USER_POOL_SEED, VAULT_SEED},
    errors::MyError,
    state::{CurrencyType, LaunchPool, LaunchPoolState, UserPool},
};

#[event]
pub struct BuyTokenWithNativeEvent {
    pub buyer: Pubkey,
    pub amount: u64,
    pub token_amount: u64,
    pub vault_amount: u64,
}

#[derive(Accounts)]
#[instruction(creator: Pubkey)]
pub struct BuyTokenWithNative<'info> {
    #[account(mut, seeds = [LAUNCH_POOL_SEED.as_ref(), creator.as_ref(), token_mint.key().as_ref()], bump)]
    pub launch_pool: Box<Account<'info, LaunchPool>>,
    pub token_mint: Box<Account<'info, token::Mint>>,
    #[account(
        init_if_needed,
        seeds = [USER_POOL_SEED.as_ref(), user.key().as_ref(), launch_pool.key().as_ref(),token_mint.key().as_ref()],
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
            creator.key().as_ref()
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

pub fn handler(ctx: Context<BuyTokenWithNative>, creator: Pubkey, amount: u64) -> ProgramResult {
    let launch_pool = &mut ctx.accounts.launch_pool;
    let user_pool = &mut ctx.accounts.user_pool;
    let vault = &mut ctx.accounts.vault;

    require!(launch_pool.authority == creator, MyError::InvalidCreator);
    require!(
        launch_pool.status == LaunchPoolState::Active,
        MyError::InvalidLaunchPoolStatus
    );
    require!(
        launch_pool.currency == CurrencyType::RENEC,
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

    msg!("Transfered {} tokens to vault", user_must_pay);

    user_pool.amount = user_pool.amount.checked_add(amount).unwrap();
    user_pool.currency_amount = user_must_pay;
    launch_pool.pool_size_remaining = launch_pool.pool_size_remaining.checked_sub(amount).unwrap();
    launch_pool.vault_amount = launch_pool.vault_amount.checked_add(user_must_pay).unwrap();

    emit!(BuyTokenWithNativeEvent {
        buyer: *ctx.accounts.user.key,
        amount,
        token_amount: user_pool.amount,
        vault_amount: launch_pool.vault_amount,
    });

    Ok(())
}
