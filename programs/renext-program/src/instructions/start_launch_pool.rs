use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::{
    constants::{LAUNCH_POOL_SEED, TREASURER_SEED},
    state::{LaunchPool, Treasurer},
    utils::pool,
};

#[derive(Accounts)]
pub struct StartLaunchPool<'info> {
    #[account(mut, seeds = [LAUNCH_POOL_SEED.as_ref(), authority.key().as_ref(), token_mint.key().as_ref()], bump)]
    pub launch_pool: Account<'info, LaunchPool>,
    #[account(
        address = launch_pool.token_mint,
    )]
    pub token_mint: Box<Account<'info, token::Mint>>,
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = authority
    )]
    pub source_token_account: Account<'info, token::TokenAccount>,
    #[account(mut, seeds = [TREASURER_SEED.as_ref(), launch_pool.key().as_ref(), token_mint.key().as_ref()], bump)]
    pub treasurer: Box<Account<'info, Treasurer>>,
    #[account(
        mut, 
        constraint = treasury.mint == launch_pool.token_mint,
        associated_token::mint = treasury.mint,
        associated_token::authority = treasurer
    )]
    pub treasury: Box<Account<'info, token::TokenAccount>>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, token::Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<StartLaunchPool>) -> ProgramResult {
    let launch_pool = &mut ctx.accounts.launch_pool;
    let treasurer = &mut ctx.accounts.treasurer;
    let source_token_account = &mut ctx.accounts.source_token_account;
    let treasury = &mut ctx.accounts.treasury;

    Ok(pool::start_launch_pool(
        &ctx.accounts.authority,
        launch_pool,
        source_token_account,
        treasurer,
        &ctx.accounts.token_mint,
        treasury,
        &ctx.accounts.token_program,
    )?)
}
