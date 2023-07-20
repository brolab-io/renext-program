import { Wallet } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { findLaunchPoolAccount, findWhitelistAccount, getExplorerTxUrl } from "./utils";
import { program } from "./00_init_program";

export async function removeWalletsToWhitelist(creator: Wallet, mint: PublicKey, wallets: PublicKey[]) {
    const [launch_pool] = findLaunchPoolAccount(
        creator.publicKey,
        mint, program.programId
    );

    const [whitelist] = findWhitelistAccount(launch_pool, program.programId);

    console.log(`launch_pool: ${launch_pool.toBase58()} creator: ${creator.publicKey.toBase58()} add wallets to whitelist starting ....`)
    console.log('--------------------------------------')
    const tx = await program.methods.removeWalletsFromWhitelist(
        wallets
    ).accounts({
        launchPool: launch_pool,
        authority: creator.publicKey,
        whitelist,
    }).signers([creator.payer]).rpc();
    console.log(
        "Add wallets to whitelist in tx: ", '\n',
        getExplorerTxUrl(tx)
    );

    console.log('********************************')

    const account = await program.account.whitelist.fetch(whitelist);
    console.log("whitelist: ", account);
}