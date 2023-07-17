use anchor_lang::prelude::*;
use anchor_spl::{associated_token, token};

use crate::constants::{LAUNCH_POOL_SEED, TREASURER_SEED, VAULT_SEED};
use crate::errors::*;
use crate::state::*;

#[event]
pub struct CreateLaunchPoolEvent {
    pub creator: Pubkey,
    pub pool: Pubkey,
    pub token_mint: Pubkey,
    pub treasury: Pubkey,
    pub treasurer: Pubkey,
    pub currency_type: CurrencyType,
    pub launch_pool_type: LaunchPoolType,
    pub pool_size: u64,
    pub minimum_token_amount: u64,
    pub unlock_date: i64,
    pub status: LaunchPoolState,
}

#[derive(Accounts)]
#[instruction(bumps: LaunchPoolBumps)]
pub struct CreateLaunchPool<'info> {
    #[
        account(
            init,
            seeds = [LAUNCH_POOL_SEED.as_ref(), authority.key().as_ref(), token_mint.key().as_ref()],
            bump,
            payer = authority,
            space = LaunchPool::LEN
        )
    ]
    pub launch_pool: Box<Account<'info, LaunchPool>>,
    pub token_mint: Box<Account<'info, token::Mint>>,
    #[
        account(
            init,
            seeds = [TREASURER_SEED.as_ref(), launch_pool.key().as_ref(), token_mint.key().as_ref()],
            bump ,
            payer = authority,
            space = Treasurer::LEN
        )
    ]
    pub treasurer: Box<Account<'info, Treasurer>>,
    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = token_mint,
        associated_token::authority = treasurer
    )]
    pub treasury: Box<Account<'info, token::TokenAccount>>,
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
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreateLaunchPool>,
    unlock_date: i64,
    pool_size: u64,
    minimum_token_amount: u64,
    maximum_token_amount: u64,
    currency: u8,
    pool_type: u8,
    rate: u64,
    token_mint_decimals: u8,
    bumps: LaunchPoolBumps,
) -> ProgramResult {
    msg!("Create launch pool {}", bumps.launchpool_bump);

    let launch_pool = &mut ctx.accounts.launch_pool;
    let treasurer = &mut ctx.accounts.treasurer;

    require!(
        unlock_date > 0 && unlock_date > Clock::get()?.unix_timestamp,
        MyError::InvalidUnlockDate
    );

    treasurer.creator = *ctx.accounts.authority.key;
    treasurer.launch_pool = *launch_pool.to_account_info().key;
    treasurer.token_mint = *ctx.accounts.token_mint.to_account_info().key;

    launch_pool.unlock_date = unlock_date;
    launch_pool.pool_size = pool_size;
    launch_pool.minimum_token_amount = minimum_token_amount;
    launch_pool.maximum_token_amount = maximum_token_amount;
    launch_pool.token_mint = *ctx.accounts.token_mint.to_account_info().key;
    launch_pool.token_mint_decimals = token_mint_decimals;
    launch_pool.rate = rate;
    launch_pool.currency = CurrencyType::from(currency);
    launch_pool.pool_type = LaunchPoolType::from(pool_type);
    launch_pool.status = LaunchPoolState::Pending;
    launch_pool.authority = *ctx.accounts.authority.key;
    launch_pool.vault_amount = 0;

    msg!(
        "Creating launch pool {}",
        launch_pool.to_account_info().key()
    );

    emit!(CreateLaunchPoolEvent {
        creator: *ctx.accounts.authority.key,
        pool: launch_pool.to_account_info().key(),
        token_mint: *ctx.accounts.token_mint.to_account_info().key,
        treasury: *ctx.accounts.treasury.to_account_info().key,
        treasurer: *ctx.accounts.treasurer.to_account_info().key,
        currency_type: launch_pool.currency,
        launch_pool_type: launch_pool.pool_type,
        pool_size: launch_pool.pool_size,
        minimum_token_amount: launch_pool.minimum_token_amount,
        unlock_date: launch_pool.unlock_date,
        status: launch_pool.status,
    });

    Ok(())
}
