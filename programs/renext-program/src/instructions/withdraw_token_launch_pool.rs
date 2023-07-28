use anchor_lang::prelude::*;
use anchor_spl::{associated_token, token};

use crate::{state::LaunchPool, utils::pool};

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
    let amount = launch_pool.vault_amount;
    msg!(
        "Authority: {} withdraw {} to {}",
        ctx.accounts.authority.key(),
        amount,
        ctx.accounts.beneficiary.key()
    );

    Ok(pool::withdraw_token(
        ctx.program_id,
        &ctx.accounts.authority,
        launch_pool,
        &mut ctx.accounts.launch_pool_token_account,
        &mut ctx.accounts.user_token_account,
        &ctx.accounts.token_program,
    )?)
}
