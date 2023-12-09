use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::{
    errors::MyError,
    state::{LaunchPool, LaunchPoolState},
    constants::LAUNCH_POOL_SEED,
    events::PoolCompletedEvent,
};

#[derive(Accounts)]
pub struct CompleteLaunchPool<'info> {
    #[account(
        mut, 
        seeds = [LAUNCH_POOL_SEED.as_ref(), authority.key().as_ref(), token_mint.key().as_ref()], 
        bump,
        constraint = launch_pool.authority == authority.key()
    )]
    pub launch_pool: Box<Account<'info, LaunchPool>>,
    #[account(
        address = launch_pool.token_mint,
    )]
    pub token_mint: Box<Account<'info, token::Mint>>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<CompleteLaunchPool>) -> ProgramResult {
    let launch_pool = &mut ctx.accounts.launch_pool;
    require!(
        launch_pool.status == LaunchPoolState::Active,
        MyError::InvalidLaunchPoolStatus
    );
    require!(
        launch_pool.authority == *ctx.accounts.authority.key,
        MyError::InvalidAuthority
    );

    launch_pool.status = LaunchPoolState::Completed;

    emit!(
        PoolCompletedEvent {
            launch_pool: launch_pool.key(),
            token_remaining: launch_pool.pool_size_remaining,
            vault_amount: launch_pool.vault_amount,
        }
    );

    Ok(())
}
