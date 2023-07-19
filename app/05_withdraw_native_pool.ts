import { Wallet } from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { findLaunchPoolAccount, findVaultAccount, getExplorerTxUrl } from "./utils";
import { connection, program } from "./00_init_program";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function withdrawNativePool(payer: Wallet, creator: PublicKey, mint: PublicKey, beneficiary: PublicKey) {
    const [launch_pool] = findLaunchPoolAccount(creator, mint, program.programId);
    const [vault, vault_bump] = findVaultAccount(launch_pool, creator, program.programId);

    const accountInfo = await connection.getAccountInfo(vault);


    console.log(`User ${payer.publicKey.toBase58()} want withdraw ${accountInfo.lamports / LAMPORTS_PER_SOL} RENEC of launch pool ${launch_pool.toBase58()} with mint ${mint.toBase58()} from vault ${vault.toBase58()} to beneficiary ${beneficiary.toBase58()}`)
    console.log('--------------------------------------')
    const tx = await program.methods.withdrawNative(vault_bump).accounts({
        launchPool: launch_pool,
        vault,
        authority: creator,
        beneficiary,
        tokenMint: mint,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
    }).signers([payer.payer]).rpc();

    console.log("Withdraw native in tx: ", '\n', getExplorerTxUrl(tx));
    console.log('********************************')

}