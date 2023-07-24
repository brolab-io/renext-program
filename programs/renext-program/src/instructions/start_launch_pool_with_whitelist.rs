use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::{
    constants::WHITELIST_SEED,
    errors::MyError,
    state::{LaunchPool, Treasurer, Whitelist,LaunchPoolType},
    utils::pool,
};



#[derive(Accounts)]
#[instruction(max_size: u8)]
pub struct StartLaunchPoolWithWhitelist<'info> {
    #[account(mut)]
    pub launch_pool: Account<'info, LaunchPool>,
    pub token_mint: Box<Account<'info, token::Mint>>,
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = authority,
    )]
    pub source_token_account: Account<'info, token::TokenAccount>,
    #[account(mut)]
    pub treasurer: Box<Account<'info, Treasurer>>,
    #[account(
        mut, 
        constraint = treasury.mint == launch_pool.token_mint,
        associated_token::mint = token_mint,
        associated_token::authority = treasurer,
    )]
    pub treasury: Box<Account<'info, token::TokenAccount>>,
    #[account(
        init,
        seeds = [WHITELIST_SEED.as_ref(), launch_pool.key().as_ref()],
        bump,
        payer = authority,
        space = Whitelist::calculate_size(max_size),
    )]
    pub whitelist: Box<Account<'info, Whitelist>>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, token::Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<StartLaunchPoolWithWhitelist>, max_size: u8, wallets: Vec<Pubkey>) -> ProgramResult {
    let launch_pool = &mut ctx.accounts.launch_pool;
    let treasurer = &mut ctx.accounts.treasurer;
    let whitelist = &mut ctx.accounts.whitelist;
    let source_token_account = &mut ctx.accounts.source_token_account;
    let treasury = &mut ctx.accounts.treasury;

    require!(
        launch_pool.pool_type == LaunchPoolType::WhiteList,
        MyError::InvalidLaunchPoolType
    );

    require!(
        wallets.len() > 0,
        MyError::InvalidWhitelist
    );

    whitelist.initialize(
        *ctx.accounts.authority.key,
        launch_pool.key(),
        max_size,
        wallets,
    );

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
