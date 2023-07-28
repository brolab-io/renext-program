use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::{constants::VAULT_SEED, state::LaunchPool, utils::pool};

#[derive(Accounts)]
pub struct WithdrawNativeLaunchPool<'info> {
    #[account(
        mut,
        constraint = launch_pool.vault_amount > 0,
        constraint = launch_pool.authority == *authority.key,
    )]
    pub launch_pool: Box<Account<'info, LaunchPool>>,
    pub token_mint: Box<Account<'info, token::Mint>>,
    /// CHECK: Create a new vault for the launch pool
    #[account(
        mut,
        seeds = [
            VAULT_SEED.as_ref(),
            launch_pool.key().as_ref(),
            authority.key().as_ref()
        ],
        bump ,
    )]
    pub vault: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: Just a pure account
    pub beneficiary: AccountInfo<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, token::Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<WithdrawNativeLaunchPool>) -> ProgramResult {
    let launch_pool = &mut ctx.accounts.launch_pool;
    // let vault = &mut ctx.accounts.vault;
    let amount = launch_pool.vault_amount;
    msg!(
        "Authority: {} withdraw {} to {}",
        ctx.accounts.authority.key(),
        amount,
        ctx.accounts.beneficiary.key()
    );

    Ok(pool::withdraw_native(
        ctx.program_id,
        &ctx.accounts.authority,
        launch_pool,
        &mut ctx.accounts.vault,
        &mut ctx.accounts.beneficiary,
        &ctx.accounts.system_program,
    )?)
}
