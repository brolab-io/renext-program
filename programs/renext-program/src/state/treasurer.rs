use anchor_lang::prelude::*;

use crate::constants::{DISCRIMINATOR_SIZE, PUBKEY_SIZE, U64_SIZE};

#[account]
pub struct Treasurer {
    pub authority: Pubkey,
    pub launch_pool: Pubkey,
    pub token_mint: Pubkey,
    pub amount: u64,
}

impl Treasurer {
    pub const LEN: usize = DISCRIMINATOR_SIZE + PUBKEY_SIZE + PUBKEY_SIZE + PUBKEY_SIZE + U64_SIZE;
}
