use anchor_lang::prelude::*;

use crate::constants::{DISCRIMINATOR_SIZE, PUBKEY_SIZE};

#[account]
pub struct Treasurer {
    pub creator: Pubkey,
    pub launch_pool: Pubkey,
    pub token_mint: Pubkey,
}

impl Treasurer {
    pub const LEN: usize = DISCRIMINATOR_SIZE + PUBKEY_SIZE + PUBKEY_SIZE + PUBKEY_SIZE;

    pub fn seeds(&self) -> [&[u8]; 3] {
        [
            &b"treasurer"[..],
            self.launch_pool.as_ref(),
            self.token_mint.as_ref(),
        ]
    }
}
