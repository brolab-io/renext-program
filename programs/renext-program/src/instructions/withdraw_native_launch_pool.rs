use anchor_lang::{prelude::*, solana_program};
use anchor_spl::token;

use crate::{
    constants::{LAUNCH_POOL_SEED, VAULT_SEED},
    errors::MyError,
    state::{LaunchPool, LaunchPoolState},
};

#[derive(Accounts)]
pub struct WithdrawNativeLaunchPool<'info> {
    #[account(mut, seeds = [LAUNCH_POOL_SEED.as_ref(), authority.key().as_ref(), token_mint.key().as_ref()], bump)]
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

pub fn handler(ctx: Context<WithdrawNativeLaunchPool>, bump: u8) -> ProgramResult {
    let launch_pool = &mut ctx.accounts.launch_pool;
    let vault = &mut ctx.accounts.vault;
    require!(
        launch_pool.status == LaunchPoolState::Completed,
        MyError::InvalidLaunchPoolStatus
    );
    require!(
        launch_pool.authority == *ctx.accounts.authority.key,
        MyError::InvalidAuthority
    );

    let amount = launch_pool.vault_amount;
    let lp_key = launch_pool.key();

    let ix = solana_program::system_instruction::transfer(
        &vault.key(),
        &ctx.accounts.beneficiary.key(),
        amount,
    );

    let signer_seeds = [
        &VAULT_SEED.as_ref()[..],
        lp_key.as_ref(),
        ctx.accounts.authority.key.as_ref(),
        &[bump],
    ];

    solana_program::program::invoke_signed(
        &ix,
        &[
            vault.to_account_info(),
            ctx.accounts.beneficiary.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[&signer_seeds],
    )?;

    launch_pool.vault_amount = 0;

    Ok(())
}
