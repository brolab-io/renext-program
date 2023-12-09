use anchor_lang::prelude::*;
use anchor_spl::{associated_token, token};

use crate::{
    constants::{TREASURER_SEED, VESTING_PLAN_SEED, LAUNCH_POOL_SEED, USER_POOL_SEED},
    errors::MyError,
    state::{LaunchPool, LaunchPoolState, Treasurer, UserPool, VestingPlan},
    events::ClaimTokenEvent,
};

#[derive(Accounts)]
pub struct ClaimTokenVesting<'info> {
    #[account(
        mut, 
        seeds = [LAUNCH_POOL_SEED.as_ref(), launch_pool.authority.as_ref(), token_mint.key().as_ref()], 
        bump,
    )]
    pub launch_pool: Account<'info, LaunchPool>,
    #[account(
        address = launch_pool.token_mint,
    )]
    pub token_mint: Box<Account<'info, token::Mint>>,
    #[account(
        mut,
        seeds = [TREASURER_SEED.as_ref(), launch_pool.key().as_ref(), token_mint.key().as_ref()],
        bump,

    )]
    pub treasurer: Box<Account<'info, Treasurer>>,
    #[account(
         mut,
         associated_token::mint = token_mint,
         associated_token::authority = treasurer
    )]
    pub treasury: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        seeds = [USER_POOL_SEED.as_ref(), user.key().as_ref(), launch_pool.key().as_ref(), token_mint.key().as_ref()],
        bump
    )]
    pub user_pool: Box<Account<'info, UserPool>>,
    #[account(init_if_needed,
        payer = user,
        associated_token::mint = token_mint,
        associated_token::authority = user
    )]
    pub user_token_account: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        seeds = [VESTING_PLAN_SEED.as_ref(), launch_pool.key().as_ref()],
        bump,
        constraint = vesting_plan.launch_pool == launch_pool.key()
    )]
    pub vesting_plan: Box<Account<'info, VestingPlan>>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<ClaimTokenVesting>) -> ProgramResult {
    let launch_pool = &ctx.accounts.launch_pool;
    let user_pool = &mut ctx.accounts.user_pool;

    let (treasurer_pda, tbump) = Pubkey::find_program_address(
        &[
            TREASURER_SEED.as_ref(),
            launch_pool.key().as_ref(),
            ctx.accounts.token_mint.key().as_ref(),
        ],
        ctx.program_id,
    );

    require!(
        treasurer_pda.eq(&*ctx.accounts.treasurer.to_account_info().key),
        MyError::InvalidTreasurer
    );

    require!(
        LaunchPoolState::Completed.eq(&launch_pool.status),
        MyError::InvalidLaunchPoolStatus
    );

    require!(
        Clock::get()?.unix_timestamp.ge(&launch_pool.unlock_date),
        MyError::TimeLockNotExpired
    );

    require!(user_pool.amount.gt(&0), MyError::InvalidAmount);

    let vesting_plan = &ctx.accounts.vesting_plan;

    let user_token_amount = vesting_plan.calculate_amount_can_claim(
        launch_pool.pool_size,
        user_pool.amount,
        user_pool.claimed,
        launch_pool.token_mint_decimals,
    )?;

    require!(user_token_amount.gt(&0), MyError::InvalidAmount);

    let lp_key = launch_pool.key();
    let token_mint = ctx.accounts.token_mint.key();

    let signer_seeds = [
        &TREASURER_SEED.as_ref()[..],
        lp_key.as_ref(),
        token_mint.as_ref(),
        &[tbump],
    ];

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.treasury.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.treasurer.to_account_info(),
            },
            &[&signer_seeds],
        ),
        user_token_amount,
    )?;

    user_pool.claimed = user_pool.claimed.checked_add(user_token_amount).unwrap();

    emit!(ClaimTokenEvent {
        user: *ctx.accounts.user.key,
        amount: user_token_amount,
    });

    Ok(())
}
