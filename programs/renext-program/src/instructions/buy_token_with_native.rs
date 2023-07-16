use anchor_lang::{prelude::*, solana_program};
use anchor_spl::token;

use crate::{
    errors::MyError,
    state::{CurrencyType, LaunchPool, LaunchPoolState, Treasurer, UserPool},
};

#[event]
pub struct BuyTokenWithNativeEvent {
    pub buyer: Pubkey,
    pub amount: u64,
    pub token_amount: u64,
}

#[derive(Accounts)]
#[instruction(creator: Pubkey)]
pub struct BuyTokenWithNative<'info> {
    #[account(mut, seeds = [b"launchpool", creator.as_ref(), token_mint.key().as_ref()], bump)]
    pub launch_pool: Box<Account<'info, LaunchPool>>,
    #[account(mut, seeds = [b"treasurer", launch_pool.key().as_ref(), token_mint.key().as_ref()], bump)]
    pub treasurer: Box<Account<'info, Treasurer>>,
    pub token_mint: Box<Account<'info, token::Mint>>,
    #[account(
        init_if_needed,
        seeds = [b"userpool", user.key().as_ref(), launch_pool.key().as_ref(),token_mint.key().as_ref()],
        bump,
        payer = user,
        space = UserPool::LEN
    )]
    pub user_pool: Box<Account<'info, UserPool>>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<BuyTokenWithNative>, creator: Pubkey, amount: u64) -> ProgramResult {
    let launch_pool = &mut ctx.accounts.launch_pool;
    let user_pool = &mut ctx.accounts.user_pool;
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
    // let cpi_context = CpiContext::new(
    //     ctx.accounts.system_program.to_account_info(),
    //     system_program::Transfer {
    //         from: ctx.accounts.user.to_account_info(),
    //         to: launch_pool.to_account_info(),
    //     },
    // );
    // system_program::transfer(cpi_context, user_must_pay)?;

    let ix = solana_program::system_instruction::transfer(
        &ctx.accounts.user.key(),
        &launch_pool.key(),
        user_must_pay,
    );

    solana_program::program::invoke(
        &ix,
        &[
            ctx.accounts.user.to_account_info(),
            launch_pool.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    msg!("Transfered {} tokens to treasury", user_must_pay);

    user_pool.amount = user_pool.amount.checked_add(amount).unwrap();
    launch_pool.pool_size_remaining = launch_pool.pool_size_remaining.checked_sub(amount).unwrap();

    emit!(BuyTokenWithNativeEvent {
        buyer: *ctx.accounts.user.key,
        amount,
        token_amount: user_pool.amount,
    });

    Ok(())
}