use anchor_lang::prelude::*;

use crate::{
    constants::{DISCRIMINATOR_SIZE, PUBKEY_SIZE, U8_SIZE},
    errors::MyError,
};

#[account]
pub struct SystemInfo {
    pub admin: Pubkey,
    pub fee_receiver: Pubkey,
    pub fee_in_percent: u8,
}

impl SystemInfo {
    pub const LEN: usize = DISCRIMINATOR_SIZE + PUBKEY_SIZE + PUBKEY_SIZE + U8_SIZE;

    pub fn initialize(&mut self, admin: Pubkey, fee_receiver: Pubkey, fee_in_percent: u8) {
        self.admin = admin;
        self.fee_receiver = fee_receiver;
        self.fee_in_percent = fee_in_percent;
    }

    pub fn is_initialized(&self) -> bool {
        self.admin != Pubkey::default()
    }

    pub fn is_admin(&self, admin: &Pubkey) -> bool {
        self.admin == *admin
    }

    pub fn is_fee_receiver(&self, fee_receiver: &Pubkey) -> bool {
        self.fee_receiver == *fee_receiver
    }

    pub fn update_fee_in_percent(&mut self, fee_in_percent: u8) -> ProgramResult {
        require!(fee_in_percent <= 100, MyError::InvalidFeeValue);
        self.fee_in_percent = fee_in_percent;
        Ok(())
    }

    pub fn update_fee_receiver(&mut self, fee_receiver: Pubkey) -> ProgramResult {
        require!(fee_receiver != Pubkey::default(), MyError::InvalidAccount);
        self.fee_receiver = fee_receiver;
        Ok(())
    }

    pub fn calculate_fee(&self, amount: u64) -> (u64, u64) {
        if amount == 0 {
            return (0, 0);
        }
        let fee = amount
            .checked_mul(self.fee_in_percent as u64)
            .unwrap()
            .checked_div(100_u64)
            .unwrap();
        (amount.checked_sub(fee).unwrap(), fee)
    }
}
