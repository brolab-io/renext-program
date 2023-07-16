use crate::{
    errors::MyError,
    state::{LaunchPool, LaunchPoolState},
};
use anchor_lang::{prelude::*, solana_program};
use anchor_spl::token;

#[derive(Accounts)]
pub struct WithdrawNativeLaunchPool<'info> {
    #[account(mut, seeds = [b"launchpool", authority.key().as_ref(), token_mint.key().as_ref()], bump)]
    pub launch_pool: Account<'info, LaunchPool>,
    pub token_mint: Box<Account<'info, token::Mint>>,
    #[account(mut)]
    pub beneficiary: AccountInfo<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<WithdrawNativeLaunchPool>, amount: u64) -> ProgramResult {
    let launch_pool = &mut ctx.accounts.launch_pool;
    let token_mint = &ctx.accounts.token_mint;
    let beneficiary = &mut ctx.accounts.beneficiary;
    let authority = &mut ctx.accounts.authority;
    require!(
        launch_pool.status == LaunchPoolState::Completed,
        MyError::InvalidLaunchPoolStatus
    );

    require!(
        authority.key() == launch_pool.authority,
        MyError::InvalidAuthority
    );

    let ix = solana_program::system_instruction::transfer(
        &launch_pool.key(),
        &beneficiary.key(),
        amount,
    );

    let signers_seeds = [
        &b"launchpool"[..],
        authority.key.as_ref(),
        token_mint.key().as_ref(),
    ];

    solana_program::program::invoke_signed(
        &ix,
        &[
            launch_pool.to_account_info(),
            beneficiary.to_account_info(),
            launch_pool.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[&signers_seeds],
    )?;
    Ok(())
}
