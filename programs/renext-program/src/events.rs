use anchor_lang::prelude::*;

use crate::state::vesting_plan::VestingSchedule;

#[event]
pub struct BuyTokenEvent {
    pub buyer: Pubkey,
    pub amount: u64,
    pub total_user_amount: u64,
    pub vault_amount: u64,
}

#[event]
pub struct ClaimTokenEvent {
    pub user: Pubkey,
    pub amount: u64,
}

#[event]
pub struct NewPoolCreatedEvent {}

#[event]
pub struct PoolCompletedEvent {
    pub launch_pool: Pubkey,
    pub token_remaining: u64,
    pub vault_amount: u64,
}

#[event]
pub struct PoolStartedEvent {
    pub launch_pool: Pubkey,
    pub treasurer: Pubkey,
    pub treasury: Pubkey,
    pub whitelist: Option<Pubkey>,
}

#[event]
pub struct VestingPlanUpdatedEvent {
    pub launch_pool: Pubkey,
    pub schedule: Vec<VestingSchedule>,
}

#[event]
pub struct RemainTokenCollectedEvent {
    pub launch_pool: Pubkey,
    pub amount: u64,
}

#[event]
pub struct PoolCancelledEvent {
    pub launch_pool: Pubkey,
}
