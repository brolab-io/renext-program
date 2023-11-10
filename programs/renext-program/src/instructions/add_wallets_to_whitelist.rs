use anchor_lang::prelude::*;

use crate::{
    errors::MyError,
    state::{LaunchPool, LaunchPoolState, Whitelist},
};

#[derive(Accounts)]
pub struct AddWalletsToWhitelist<'info> {
    #[account(
        constraint = launch_pool.authority == *authority.key,
    )]
    pub launch_pool: Account<'info, LaunchPool>,
    #[account(
        mut,
        constraint = whitelist.authority == *authority.key,
        constraint = whitelist.launch_pool == launch_pool.key(),
    )]
    pub whitelist: Account<'info, Whitelist>,
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<AddWalletsToWhitelist>, wallets: Vec<Pubkey>) -> ProgramResult {
    let whitelist = &mut ctx.accounts.whitelist;

    require!(
        ctx.accounts.launch_pool.status != LaunchPoolState::Completed,
        MyError::LaunchPoolAlreadyCompleted
    );

    require!(wallets.len() > 0, MyError::WalletsMustNotBeEmpty);

    whitelist.add_list_pubkey(wallets)?;

    Ok(())
}
