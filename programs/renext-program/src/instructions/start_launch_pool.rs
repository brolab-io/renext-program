use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::{
    constants::{LAUNCH_POOL_SEED, TREASURER_SEED},
    errors::MyError,
    state::{LaunchPool, LaunchPoolState, Treasurer},
};

#[event]
pub struct StartLaunchPoolEvent {
    pub pool: Pubkey,
    pub creator: Pubkey,
    pub status: LaunchPoolState,
}

#[derive(Accounts)]
pub struct StartLaunchPool<'info> {
    #[account(mut, seeds = [LAUNCH_POOL_SEED.as_ref(), authority.key().as_ref(), token_mint.key().as_ref()], bump)]
    pub launch_pool: Account<'info, LaunchPool>,
    pub token_mint: Box<Account<'info, token::Mint>>,
    #[account(mut)]
    pub source_token_account: Account<'info, token::TokenAccount>,
    #[account(mut, seeds = [TREASURER_SEED.as_ref(), launch_pool.key().as_ref(), token_mint.key().as_ref()], bump)]
    pub treasurer: Box<Account<'info, Treasurer>>,
    #[account(mut, constraint = treasury.mint == launch_pool.token_mint)]
    pub treasury: Box<Account<'info, token::TokenAccount>>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, token::Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<StartLaunchPool>) -> ProgramResult {
    let launch_pool = &mut ctx.accounts.launch_pool;

    require!(
        launch_pool.status == LaunchPoolState::Pending,
        MyError::InvalidLaunchPoolStatus
    );
    require!(
        launch_pool.authority == *ctx.accounts.authority.key,
        MyError::InvalidAuthority
    );

    require!(
        ctx.accounts.token_mint.key() == launch_pool.token_mint,
        MyError::InvalidTokenMint
    );

    let cpi_context = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        token::Transfer {
            from: ctx.accounts.source_token_account.to_account_info(),
            to: ctx.accounts.treasury.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        },
    );
    token::transfer(cpi_context, launch_pool.pool_size)?;
    launch_pool.pool_size_remaining = launch_pool.pool_size;
    msg!("Transfered {} tokens to treasury", launch_pool.pool_size);

    launch_pool.status = LaunchPoolState::Active;

    emit!(StartLaunchPoolEvent {
        pool: launch_pool.key(),
        creator: *ctx.accounts.authority.key,
        status: launch_pool.status,
    });

    Ok(())
}
