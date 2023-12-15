use anchor_lang::prelude::*;

use crate::{constants::SYSTEM_INFO_SEED, errors::MyError, state::SystemInfo};

#[derive(Accounts)]
pub struct UpdateSystemInfo<'info> {
    #[account(
        mut,
        seeds = [SYSTEM_INFO_SEED.as_ref()],
        bump,
        constraint = system_info.admin == authority.key(),
    )]
    pub system_info: Account<'info, SystemInfo>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn update_fee_in_percent(ctx: Context<UpdateSystemInfo>, fee_in_percent: u8) -> ProgramResult {
    let system_info = &mut ctx.accounts.system_info;
    require!(system_info.is_initialized(), MyError::NotInitialized);

    system_info.update_fee_in_percent(fee_in_percent)?;

    Ok(())
}

pub fn update_fee_receiver(ctx: Context<UpdateSystemInfo>, fee_receiver: Pubkey) -> ProgramResult {
    let system_info = &mut ctx.accounts.system_info;
    require!(system_info.is_initialized(), MyError::NotInitialized);

    system_info.update_fee_receiver(fee_receiver)?;

    Ok(())
}
