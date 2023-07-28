import { Wallet } from "@project-serum/anchor";
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import { findLaunchPoolAccount, findVestingPlanAccount, getExplorerTxUrl } from "./utils";
import { program } from "./00_init_program";

export async function updateVestingPlan(
    creator: Wallet, mint: PublicKey, schedules: {
        releaseTime: number,
        amount: number
    }[]
) {
    const [launch_pool] = findLaunchPoolAccount(
        creator.publicKey,
        mint, program.programId
    );

    const [vesting_plan] = findVestingPlanAccount(launch_pool, program.programId);

    console.log('--------------------------------------');

    const tx = await program.methods.setVestingPlan(
        schedules.length,
        schedules
    ).accounts({
        vestingPlan: vesting_plan,
        launchPool: launch_pool,
        authority: creator.publicKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
    }).signers([creator.payer]).rpc();

    console.log(
        "Update vesting plan in tx: ", '\n',
        getExplorerTxUrl(tx)
    );
    console.log('********************************')

}