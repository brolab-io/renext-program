use anchor_lang::prelude::*;

use crate::{
    constants::{LAUNCH_POOL_SEED, VESTING_PLAN_SEED},
    errors::MyError,
    state::{LaunchPool, VestingPlan, VestingSchedule},
};

#[derive(Accounts)]
#[instruction(size: u8)]
pub struct UpdateVestingPlan<'info> {
    #[account(
        mut,
        seeds = [LAUNCH_POOL_SEED.as_ref(), authority.key().as_ref(), launch_pool.token_mint.as_ref()], bump,
        constraint = launch_pool.authority == *authority.key,
    )]
    pub launch_pool: Box<Account<'info, LaunchPool>>,
    #[account(
        init_if_needed,
        payer = authority,
        seeds = [VESTING_PLAN_SEED.as_ref(), launch_pool.key().as_ref()],
        bump,
        space = VestingPlan::calculate_size(size),
    )]
    pub vesting_plan: Box<Account<'info, VestingPlan>>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<UpdateVestingPlan>,
    size: u8,
    schedule: Vec<VestingSchedule>,
) -> ProgramResult {
    let vesting_plan = &mut ctx.accounts.vesting_plan;
    let launch_pool = &mut ctx.accounts.launch_pool;
    require!(
        schedule.len().eq(&(size as usize)),
        MyError::InvalidScheduleSize
    );
    launch_pool.is_vesting = true;
    vesting_plan.launch_pool = launch_pool.key();
    vesting_plan.set_schedule(schedule)?;

    Ok(())
}
