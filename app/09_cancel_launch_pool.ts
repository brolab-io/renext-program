import { Wallet, web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { findLaunchPoolAccount, findMintTokenAccount, findTreasurerAccount, findUserPoolAccount, getExplorerTxUrl } from "./utils";
import { program } from "./00_init_program";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function cancelLaunchPool(
    creator: Wallet,
    mint: PublicKey,
) {
    const [launch_pool] = findLaunchPoolAccount(creator.publicKey, mint, program.programId);
    const [treasurer] = findTreasurerAccount(launch_pool, mint, program.programId);
    const treasury = await findMintTokenAccount(treasurer, mint);
    const des_token_account = await findMintTokenAccount(
        creator.publicKey,
        mint
    );

    const pool_info = await program.account.launchPool.fetch(launch_pool);

    console.log(`Creator ${creator.publicKey.toBase58()} want cancel pool and can withdraw ${pool_info.poolSizeRemaining.toNumber()} token ${mint.toBase58()} in pool ${launch_pool.toBase58()}`);
    console.log('--------------------------------------')

    const tx = await program.methods.cancelLaunchPool(
    ).accounts({
        launchPool: launch_pool,
        treasurer,
        treasury,
        tokenMint: mint,
        desTokenAccount: des_token_account,
        authority: creator.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    }).signers([creator.payer]).rpc();

    console.log("Cancel pool and collect remain token in tx: ", '\n', getExplorerTxUrl(tx));
    console.log('********************************')

}