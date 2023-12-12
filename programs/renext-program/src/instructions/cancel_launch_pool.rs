use crate::{
    constants::{LAUNCH_POOL_SEED, TREASURER_SEED},
    events::PoolCancelledEvent,
    state::{LaunchPool, LaunchPoolState, Treasurer},
};
use anchor_lang::prelude::*;
use anchor_spl::{associated_token, token};

#[derive(Accounts)]
pub struct CancelLaunchPool<'info> {
    #[account(
        mut,
        seeds = [LAUNCH_POOL_SEED.as_ref(), authority.key().as_ref(), token_mint.key().as_ref()], bump,
        constraint = launch_pool.pool_size_remaining > 0,
        constraint = launch_pool.authority == *authority.key,
        constraint = launch_pool.status == LaunchPoolState::Active,
        constraint = launch_pool.pool_size == launch_pool.pool_size_remaining,
    )]
    pub launch_pool: Box<Account<'info, LaunchPool>>,
    #[account(
        address = launch_pool.token_mint,
    )]
    pub token_mint: Box<Account<'info, token::Mint>>,
    #[account(
        mut,
        seeds = [TREASURER_SEED.as_ref(), launch_pool.key().as_ref(), token_mint.key().as_ref()],
        bump,
        close = authority,
    )]
    pub treasurer: Box<Account<'info, Treasurer>>,
    #[account(
         mut,
         associated_token::mint = token_mint,
         associated_token::authority = treasurer,
    )]
    pub treasury: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = authority
    )]
    pub des_token_account: Account<'info, token::TokenAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
}

pub fn handler(ctx: Context<CancelLaunchPool>) -> ProgramResult {
    let launch_pool = &mut ctx.accounts.launch_pool;

    let (_, tbump) = Pubkey::find_program_address(
        &[
            TREASURER_SEED.as_ref(),
            launch_pool.key().as_ref(),
            ctx.accounts.token_mint.key().as_ref(),
        ],
        ctx.program_id,
    );

    let lp_key = launch_pool.key();
    let token_mint = ctx.accounts.token_mint.key();

    let signer_seeds = [
        &TREASURER_SEED.as_ref()[..],
        lp_key.as_ref(),
        token_mint.as_ref(),
        &[tbump],
    ];

    let transfer_amount = launch_pool.pool_size_remaining;
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.treasury.to_account_info(),
                to: ctx.accounts.des_token_account.to_account_info(),
                authority: ctx.accounts.treasurer.to_account_info(),
            },
            &[&signer_seeds],
        ),
        transfer_amount,
    )?;

    launch_pool.pool_size_remaining = 0;

    launch_pool.status = LaunchPoolState::Cancelled;

    emit!(PoolCancelledEvent {
        launch_pool: launch_pool.key(),
    });

    Ok(())
}
