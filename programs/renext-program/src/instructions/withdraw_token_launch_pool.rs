use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::{
    constants::VAULT_SEED,
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
    #[account(
        mut,
        associated_token::mint = currency_mint,
    )]
    pub user_token_account: Account<'info, token::TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, token::Token>,
}
