import { findLaunchPoolAccount, findMintTokenAccount, findTreasurerAccount, findWhitelistAccount, getExplorerTxUrl } from "./utils";
import { program } from "./00_init_program";
import { PublicKey } from "@solana/web3.js";
import { Wallet, web3 } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function startLaunchPoolWithWhitelist(creator: Wallet, mint: PublicKey, wallets: PublicKey[], max_size = 10) {
    const [launch_pool] = findLaunchPoolAccount(
        creator.publicKey,
        mint, program.programId
    );
    const source_token_account = await findMintTokenAccount(
        creator.publicKey,
        mint
    );
    const [treasurer] = findTreasurerAccount(launch_pool, mint, program.programId);
    const treasury = await findMintTokenAccount(treasurer, mint);
    const [whitelist] = findWhitelistAccount(launch_pool, program.programId);

    console.log(`launch_pool: ${launch_pool.toBase58()} creator: ${creator.publicKey.toBase58()} with mint: ${mint.toBase58()} starting ....`)
    console.log('--------------------------------------')
    const tx = await program.methods
        .startLaunchPoolWithWhitelist(
            max_size,
            wallets
        )
        .accounts({
            launchPool: launch_pool,
            tokenMint: mint,
            sourceTokenAccount: source_token_account,
            treasurer: treasurer,
            treasury: treasury,
            whitelist,
            authority: creator.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: web3.SYSVAR_RENT_PUBKEY,
            systemProgram: web3.SystemProgram.programId,
        })
        .signers([creator.payer])
        .rpc();
    console.log(
        "Start launch pool in tx: ", '\n',
        getExplorerTxUrl(tx)
    );
    console.log('********************************')

    const account = await program.account.whitelist.fetch(whitelist);
    console.log("whitelist: ", account);
}