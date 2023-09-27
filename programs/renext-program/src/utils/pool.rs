use crate::{
    constants::{LAUNCH_POOL_SEED, REUSD_MINT, VAULT_SEED},
    errors::MyError,
    state::{CurrencyType, LaunchPool, LaunchPoolState, LaunchPoolType, Treasurer},
};
use anchor_lang::{prelude::*, solana_program};
use anchor_spl::token;

pub fn init_launch_pool<'info>(
    authority: &Signer<'info>,
    launch_pool: &mut Account<'info, LaunchPool>,
    treasurer: &mut Account<'info, Treasurer>,
    token_mint: &Account<'info, token::Mint>,
    unlock_date: i64,
    pool_size: u64,
    minimum_token_amount: u64,
    maximum_token_amount: u64,
    rate: u64,
    token_mint_decimals: u8,
    currency_type: CurrencyType,
    launch_pool_type: LaunchPoolType,
) -> Result<(), ProgramError> {
    require!(
        unlock_date > 0 && unlock_date > Clock::get()?.unix_timestamp,
        MyError::InvalidUnlockDate
    );
    treasurer.initialize(
        *authority.to_account_info().key,
        *launch_pool.to_account_info().key,
        *token_mint.to_account_info().key,
    )?;
    Ok(launch_pool.initialize(
        unlock_date,
        pool_size,
        minimum_token_amount,
        maximum_token_amount,
        rate,
        token_mint_decimals,
        *token_mint.to_account_info().key,
        *authority.key,
        currency_type,
        launch_pool_type,
    )?)
}

pub fn start_launch_pool<'info>(
    authority: &Signer<'info>,
    launch_pool: &mut Account<'info, LaunchPool>,
    source_token_account: &mut Account<'info, token::TokenAccount>,
    treasurer: &mut Account<'info, Treasurer>,
    token_mint: &Account<'info, token::Mint>,
    treasury: &mut Account<'info, token::TokenAccount>,
    token_program: &Program<'info, token::Token>,
) -> Result<(), ProgramError> {
    require!(
        launch_pool.status == LaunchPoolState::Pending,
        MyError::InvalidLaunchPoolStatus
    );
    require!(
        launch_pool.authority == *authority.key,
        MyError::InvalidAuthority
    );

    require!(
        token_mint.to_account_info().key.eq(&launch_pool.token_mint),
        MyError::InvalidTokenMint
    );

    let transfer_amount = launch_pool.pool_size;
    launch_pool.pool_size_remaining = transfer_amount;
    launch_pool.status = LaunchPoolState::Active;
    treasurer.amount = transfer_amount;

    msg!("Transfering {} tokens to treasury", transfer_amount);

    let cpi_context = CpiContext::new(
        token_program.to_account_info(),
        token::Transfer {
            from: source_token_account.to_account_info(),
            to: treasury.to_account_info(),
            authority: authority.to_account_info(),
        },
    );
    Ok(token::transfer(cpi_context, transfer_amount)?)
}

pub fn withdraw_native<'info>(
    program_id: &Pubkey,
    authority: &Signer<'info>,
    launch_pool: &mut Account<'info, LaunchPool>,
    vault: &mut AccountInfo<'info>,
    beneficiary: &mut AccountInfo<'info>,
    system_program: &Program<'info, System>,
) -> Result<(), ProgramError> {
    require!(
        launch_pool.status == LaunchPoolState::Completed,
        MyError::InvalidLaunchPoolStatus
    );

    require!(
        launch_pool.authority == *authority.key,
        MyError::InvalidAuthority
    );
    require!(
        launch_pool.currency == CurrencyType::RENEC,
        MyError::InvalidCurrencyType
    );

    let (vault_pda, vbump) = Pubkey::find_program_address(
        &[
            VAULT_SEED.as_ref(),
            launch_pool.to_account_info().key.as_ref(),
            authority.to_account_info().key.as_ref(),
        ],
        program_id,
    );

    require!(vault_pda == *vault.key, MyError::InvalidVault);

    let amount = launch_pool.vault_amount;

    let ix = solana_program::system_instruction::transfer(
        &vault.to_account_info().key,
        &beneficiary.to_account_info().key,
        amount,
    );

    let signer_seeds = [
        &VAULT_SEED.as_ref()[..],
        launch_pool.to_account_info().key.as_ref(),
        authority.to_account_info().key.as_ref(),
        &[vbump],
    ];

    solana_program::program::invoke_signed(
        &ix,
        &[
            vault.to_account_info(),
            beneficiary.to_account_info(),
            system_program.to_account_info(),
        ],
        &[&signer_seeds],
    )?;

    launch_pool.vault_amount = 0;

    Ok(())
}

pub fn withdraw_token<'info>(
    program_id: &Pubkey,
    authority: &Signer<'info>,
    launch_pool: &mut Account<'info, LaunchPool>,
    launch_pool_token_account: &mut Account<'info, token::TokenAccount>,
    user_token_account: &mut Account<'info, token::TokenAccount>,
    token_program: &Program<'info, token::Token>,
) -> Result<(), ProgramError> {
    require!(
        authority.to_account_info().key.eq(&launch_pool.authority),
        MyError::InvalidAuthority
    );

    require!(
        LaunchPoolState::Completed.eq(&launch_pool.status),
        MyError::InvalidLaunchPoolStatus
    );

    require!(
        user_token_account.mint.eq(&REUSD_MINT) && launch_pool_token_account.mint.eq(&REUSD_MINT),
        MyError::InvalidTokenMint
    );

    let (lp_pda, lbump) = Pubkey::find_program_address(
        &[
            LAUNCH_POOL_SEED.as_ref(),
            authority.to_account_info().key.as_ref(),
            launch_pool.token_mint.as_ref(),
        ],
        program_id,
    );

    require!(
        lp_pda.eq(launch_pool.to_account_info().key),
        MyError::InvalidLaunchPool
    );

    let amount = launch_pool.vault_amount;

    let signer_seeds = [
        &LAUNCH_POOL_SEED.as_ref()[..],
        authority.to_account_info().key.as_ref(),
        launch_pool.token_mint.as_ref(),
        &[lbump],
    ];

    token::transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            token::Transfer {
                from: launch_pool_token_account.to_account_info(),
                to: user_token_account.to_account_info(),
                authority: launch_pool.to_account_info(),
            },
            &[&signer_seeds],
        ),
        amount,
    )?;

    launch_pool.vault_amount = 0;

    Ok(())
}
