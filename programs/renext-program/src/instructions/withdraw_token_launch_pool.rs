use anchor_lang::prelude::*;
use anchor_spl::{associated_token, token};

use crate::{
    constants::LAUNCH_POOL_SEED,
    errors::MyError,
    state::{LaunchPool, LaunchPoolState},
};

#[derive(Accounts)]
pub struct WithdrawTokenLaunchPool<'info> {
    #[account(mut)]
    pub launch_pool: Box<Account<'info, LaunchPool>>,
    pub currency_mint: Box<Account<'info, token::Mint>>,
    #[account(
        mut,
        associated_token::mint = currency_mint,
        associated_token::authority = launch_pool
    )]
    pub launch_pool_token_account: Account<'info, token::TokenAccount>,
    #[account(mut)]
    /// CHECK: Just a pure account
    pub beneficiary: AccountInfo<'info>,
    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = currency_mint,
        associated_token::authority = beneficiary
    )]
    pub user_token_account: Account<'info, token::TokenAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, token::Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<WithdrawTokenLaunchPool>) -> ProgramResult {
    let launch_pool = &mut ctx.accounts.launch_pool;

    require!(
        launch_pool.authority == *ctx.accounts.authority.key,
        MyError::InvalidAuthority
    );

    require!(
        launch_pool.status == LaunchPoolState::Completed,
        MyError::InvalidLaunchPoolStatus
    );

    let (lp_pda, lbump) = Pubkey::find_program_address(
        &[
            LAUNCH_POOL_SEED.as_ref(),
            ctx.accounts.authority.key.as_ref(),
            launch_pool.token_mint.as_ref(),
        ],
        ctx.program_id,
    );

    require!(lp_pda == launch_pool.key(), MyError::InvalidLaunchPool);

    let amount = launch_pool.vault_amount;

    let signer_seeds = [
        &LAUNCH_POOL_SEED.as_ref()[..],
        ctx.accounts.authority.key.as_ref(),
        launch_pool.token_mint.as_ref(),
        &[lbump],
    ];

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.launch_pool_token_account.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: launch_pool.to_account_info(),
            },
            &[&signer_seeds],
        ),
        amount,
    )?;

    launch_pool.vault_amount = 0;

    msg!(
        "Authority: {} withdraw {} to {}",
        ctx.accounts.authority.key(),
        amount,
        ctx.accounts.beneficiary.key()
    );

    Ok(())
}
