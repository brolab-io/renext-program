use anchor_lang::prelude::*;

declare_id!("HdDnMfViPvhZpfQp3NkKkLRcNScNnbFmMBfZgHKtk5wm");

#[program]
pub mod renext_program {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
