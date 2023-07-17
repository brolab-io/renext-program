import { Wallet } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { findLaunchPoolAccount } from "./utils";
import { program } from "./00_init_program";
export async function completeLaunchPool(
    creator: Wallet,
    mint: PublicKey,

) {
    const [launch_pool] = findLaunchPoolAccount(creator.publicKey, mint, program.programId);

    console.log(`launch pool ${launch_pool.toBase58()} run to completed by ${creator.publicKey.toBase58()} with mint ${mint.toBase58()}`)
    console.log('--------------------------------------')
    const tx = await program.methods.completeLaunchPool().accounts({
        launchPool: launch_pool,
        authority: creator.publicKey,
        tokenMint: mint,
    }).signers([creator.payer]).rpc();

    console.log("Complete launch pool in tx: ", tx);
    console.log('********************************')
}