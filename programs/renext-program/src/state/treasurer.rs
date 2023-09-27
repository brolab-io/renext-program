use anchor_lang::prelude::*;

use crate::{
    constants::{DISCRIMINATOR_SIZE, PUBKEY_SIZE, U64_SIZE},
    errors::MyError,
};

#[account]
#[derive(Default)]
pub struct Treasurer {
    pub authority: Pubkey,
    pub launch_pool: Pubkey,
    pub token_mint: Pubkey,
    pub amount: u64,
}

impl Treasurer {
    pub const LEN: usize = DISCRIMINATOR_SIZE + PUBKEY_SIZE + PUBKEY_SIZE + PUBKEY_SIZE + U64_SIZE;

    pub fn initialized(&self) -> bool {
        self.authority.ne(&Pubkey::default())
    }

    pub fn initialize(
        &mut self,
        authority: Pubkey,
        launch_pool: Pubkey,
        token_mint: Pubkey,
    ) -> ProgramResult {
        require!(
            self.authority == Pubkey::default(),
            MyError::AccountIsInitialized
        );

        self.authority = authority;
        self.launch_pool = launch_pool;
        self.token_mint = token_mint;
        self.amount = 0;
        Ok(())
    }
}
