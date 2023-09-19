use crate::constants::{DISCRIMINATOR_SIZE, PUBKEY_SIZE, U8_SIZE, VECTOR_OVERHEAD_SIZE};
use crate::errors::*;
use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Whitelist {
    pub authority: Pubkey,
    pub launch_pool: Pubkey,
    pub max_size: u8,
    pub wallets: Vec<Pubkey>,
}

impl Whitelist {
    pub const LEN: usize =
        DISCRIMINATOR_SIZE + PUBKEY_SIZE + PUBKEY_SIZE + U8_SIZE + VECTOR_OVERHEAD_SIZE;

    pub fn initialize(
        &mut self,
        authority: Pubkey,
        launch_pool: Pubkey,
        max_size: u8,
        wallets: Vec<Pubkey>,
    ) {
        self.authority = authority;
        self.launch_pool = launch_pool;
        self.max_size = max_size;
        self.wallets = wallets;
    }

    pub fn calculate_size(wallets: u8) -> usize {
        Whitelist::LEN + ((wallets as usize) * PUBKEY_SIZE)
    }

    pub fn add_pubkey(&mut self, pubkey: Pubkey) -> Result<()> {
        require!(
            (self.wallets.len() as u8) < self.max_size,
            MyError::WhitelistNotEnoughSpace
        );
        require!(
            self.is_pubkey_in_list(&pubkey) == false,
            MyError::WalletAlreadyAdded
        );
        self.wallets.push(pubkey);
        Ok(())
    }

    pub fn remove_pubkey(&mut self, pubkey: &Pubkey) -> Result<()> {
        require!(
            self.wallets.len() > 0 && self.is_pubkey_in_list(&pubkey) == true,
            MyError::WalletNotInList
        );
        self.wallets.retain(|&pk| pk != *pubkey);
        Ok(())
    }

    pub fn is_pubkey_in_list(&self, pubkey: &Pubkey) -> bool {
        self.wallets.iter().any(|&pk| pk == *pubkey)
    }

    pub fn get_white_list(&self) -> Vec<Pubkey> {
        self.wallets.clone()
    }

    pub fn get_whitelist_size(&self) -> usize {
        self.wallets.len()
    }

    pub fn add_list_pubkey(&mut self, wallets: Vec<Pubkey>) -> Result<()> {
        require!(
            self.wallets.len() + wallets.len() <= self.max_size as usize,
            MyError::WhitelistNotEnoughSpace
        );

        for wallet in wallets {
            self.add_pubkey(wallet)?;
            msg!("Added {} to whitelist", wallet);
        }
        Ok(())
    }

    pub fn remove_list_pubkey(&mut self, wallets: Vec<Pubkey>) -> Result<()> {
        for wallet in wallets {
            self.remove_pubkey(&wallet)?;
            msg!("Removed {} from whitelist", wallet);
        }
        Ok(())
    }
}
