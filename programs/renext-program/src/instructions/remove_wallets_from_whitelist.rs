use anchor_lang::prelude::*;

use crate::{
    errors::MyError,
    state::{LaunchPool, LaunchPoolState, Whitelist},
};

#[derive(Accounts)]
pub struct RemoveWalletsFromWhitelist<'info> {
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

pub fn handler(ctx: Context<RemoveWalletsFromWhitelist>, wallets: Vec<Pubkey>) -> ProgramResult {
    let whitelist = &mut ctx.accounts.whitelist;

    require!(
        ctx.accounts.launch_pool.status != LaunchPoolState::Completed,
        MyError::LaunchPoolAlreadyCompleted
    );

    require!(wallets.len() > 0, MyError::WalletsMustNotBeEmpty);

    for wallet in wallets.iter() {
        require!(
            whitelist.is_pubkey_in_list(&wallet) == true,
            MyError::WalletAlreadyAdded
        );
    }

    whitelist.remove_list_pubkey(wallets)?;

    Ok(())
}
