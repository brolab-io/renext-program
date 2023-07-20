use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::{
    constants::WHITELIST_SEED,
    errors::MyError,
    state::{LaunchPool, LaunchPoolState, Treasurer, Whitelist,LaunchPoolType},
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

    require!(
        launch_pool.status == LaunchPoolState::Pending,
        MyError::InvalidLaunchPoolStatus
    );
    require!(
        launch_pool.authority == *ctx.accounts.authority.key,
        MyError::InvalidAuthority
    );

    require!(
        launch_pool.pool_type == LaunchPoolType::WhiteList,
        MyError::InvalidLaunchPoolType
    );

    require!(
        ctx.accounts.token_mint.key() == launch_pool.token_mint,
        MyError::InvalidTokenMint
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

    let transfer_amount = launch_pool.pool_size;

    let cpi_context = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        token::Transfer {
            from: ctx.accounts.source_token_account.to_account_info(),
            to: ctx.accounts.treasury.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        },
    );
    token::transfer(cpi_context, transfer_amount)?;
    launch_pool.pool_size_remaining = transfer_amount;
    treasurer.amount = transfer_amount;
    msg!("Transfered {} tokens to treasury", transfer_amount);

    launch_pool.status = LaunchPoolState::Active;

    Ok(())
}
