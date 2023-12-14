use anchor_lang::prelude::*;

use crate::{
    constants::{DISCRIMINATOR_SIZE, PUBKEY_SIZE},
    errors::MyError,
};

#[account]
pub struct SystemInfo {
    pub admin: Pubkey,
    pub fee_treasury: Pubkey,
    pub fee_in_percent: u8,
}

impl SystemInfo {
    pub const LEN: usize = DISCRIMINATOR_SIZE + PUBKEY_SIZE + PUBKEY_SIZE + U8_SIZE;

    pub fn initialize(&mut self, admin: Pubkey, fee_treasury: Pubkey, fee_in_percent: u8) {
        self.admin = admin;
        self.fee_treasury = fee_treasury;
        self.fee_in_percent = fee_in_percent;
    }

    pub fn is_initialized(&self) -> bool {
        self.admin != Pubkey::default()
    }

    pub fn is_admin(&self, admin: &Pubkey) -> bool {
        self.admin == *admin
    }

    pub fn is_fee_treasury(&self, fee_treasury: &Pubkey) -> bool {
        self.fee_treasury == *fee_treasury
    }

    pub fn update_fee_in_percent(&mut self, fee_in_percent: u8) -> ProgramResult {
        require!(fee_in_percent <= 100, MyError::InvalidFeeValue);
        self.fee_in_percent = fee_in_percent;
        Ok(())
    }

    pub fn update_fee_treasury(&mut self, fee_treasury: Pubkey) -> ProgramResult {
        require!(fee_treasury != Pubkey::default(), MyError::InvalidAccount);
        self.fee_treasury = fee_treasury;
    }
}
