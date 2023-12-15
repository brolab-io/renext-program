use anchor_lang::prelude::*;

use crate::{constants::SYSTEM_INFO_SEED, errors::MyError, state::SystemInfo};

#[derive(Accounts)]
pub struct InitSystem<'info> {
    #[account(
        init,
        seeds = [SYSTEM_INFO_SEED.as_ref()],
        bump,
        payer = authority,
        space = SystemInfo::LEN,
    )]
    pub system_info: Account<'info, SystemInfo>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<InitSystem>,
    fee_receiver: Pubkey,
    fee_in_percent: u8,
) -> ProgramResult {
    let system_info = &mut ctx.accounts.system_info;
    require!(!system_info.is_initialized(), MyError::Initialized);

    require!(fee_in_percent <= 100, MyError::InvalidFeeValue);

    system_info.initialize(
        *ctx.accounts.authority.to_account_info().key,
        fee_receiver,
        fee_in_percent,
    );

    Ok(())
}
