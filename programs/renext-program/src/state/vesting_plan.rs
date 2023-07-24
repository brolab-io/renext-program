use crate::{
    constants::{DISCRIMINATOR_SIZE, I64_SIZE, PUBKEY_SIZE, U64_SIZE, VECTOR_OVERHEAD_SIZE},
    errors::MyError,
};
use anchor_lang::prelude::*;
#[account]
pub struct VestingPlan {
    pub launch_pool: Pubkey,
    pub schedule: Vec<VestingSchedule>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct VestingSchedule {
    pub release_time: i64,
    pub amount: u64,
}

impl VestingSchedule {
    pub const LEN: usize = I64_SIZE + U64_SIZE;
}

impl VestingPlan {
    pub const LEN: usize = DISCRIMINATOR_SIZE + PUBKEY_SIZE + VECTOR_OVERHEAD_SIZE;

    pub fn calculate_size(size: u8) -> usize {
        VestingPlan::LEN + ((size as usize) * VestingSchedule::LEN)
    }

    pub fn calculate_amount_can_claim(
        &self,
        pool_size: u64,
        amount_user_buy: u64,
        amount_user_claimed: u64,
    ) -> Result<u64, ProgramError> {
        let total: u64 = 0;
        for schedule in self.schedule.iter() {
            if schedule.release_time <= Clock::get()?.unix_timestamp {
                total.checked_add(schedule.amount).unwrap();
            }
        }

        if total == 0 {
            return Ok(0);
        }

        Ok(total
            .checked_mul(amount_user_buy)
            .unwrap()
            .checked_div(pool_size)
            .unwrap()
            .checked_sub(amount_user_claimed)
            .ok_or(MyError::Overflow)?)
    }
}
