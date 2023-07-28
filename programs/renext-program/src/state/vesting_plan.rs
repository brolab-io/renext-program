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

    pub fn clear(&mut self) {
        self.schedule.clear();
    }

    pub fn set_schedule(&mut self, schedule: Vec<VestingSchedule>) {
        self.clear();
        self.schedule = schedule;
    }

    pub fn calculate_size(size: u8) -> usize {
        VestingPlan::LEN + ((size as usize) * VestingSchedule::LEN)
    }

    pub fn calculate_amount_can_claim(
        &self,
        pool_size: u64,
        amount_user_buy: u64,
        amount_user_claimed: u64,
        decimal: u8,
    ) -> Result<u64, ProgramError> {
        let mut total: u64 = 0;
        for schedule in self.schedule.iter() {
            if schedule.release_time.le(&Clock::get()?.unix_timestamp) {
                total = total
                    .checked_add(schedule.amount)
                    .ok_or(MyError::Overflow)?;
            }
        }

        if total == 0 {
            return Ok(0);
        }

        let normalized_total = total
            .checked_div(10_u64.pow(decimal.into()))
            .ok_or(MyError::Overflow)?;

        let normalized_amount_user_buy = amount_user_buy
            .checked_div(10_u64.pow(decimal.into()))
            .ok_or(MyError::Overflow)?;

        let normalized_amount_user_claimed = amount_user_claimed
            .checked_div(10_u64.pow(decimal.into()))
            .ok_or(MyError::Overflow)?;

        let normalized_pool_size = pool_size
            .checked_div(10_u64.pow(decimal.into()))
            .ok_or(MyError::Overflow)?;

        Ok(normalized_total
            .checked_mul(normalized_amount_user_buy)
            .unwrap()
            .checked_div(normalized_pool_size)
            .unwrap()
            .checked_sub(normalized_amount_user_claimed)
            .unwrap()
            .checked_mul(10_u64.pow(decimal.into()))
            .ok_or(MyError::Overflow)?)
    }
}
