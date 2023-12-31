import { Wallet, web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { findLaunchPoolAccount, findMintTokenAccount, findTreasurerAccount, findUserPoolAccount, getExplorerTxUrl } from "./utils";
import { program } from "./00_init_program";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function claimToken(
    creator: PublicKey,
    mint: PublicKey,
    buyer: Wallet
) {
    const [launch_pool] = findLaunchPoolAccount(creator, mint, program.programId);
    const [treasurer, treasurerBump] = findTreasurerAccount(launch_pool, mint, program.programId);
    const treasury = await findMintTokenAccount(treasurer, mint);
    const [user_pool] = findUserPoolAccount(
        buyer.publicKey,
        launch_pool,
        mint,
        program.programId
    );

    const userTokenAccount = await findMintTokenAccount(
        buyer.publicKey,
        mint
    );

    const data = await program.account.userPool.fetch(user_pool);
    console.log("User pool account: ", data.amount.toNumber());
    console.log("user payed: ", data.currencyAmount.toNumber());

    console.log(`buyer ${buyer.publicKey.toBase58()} want claim ${data.amount.toNumber()} token ${mint.toBase58()} at launch pool ${launch_pool.toBase58()}`);
    console.log('--------------------------------------')

    const tx = await program.methods.claimToken(

    ).accounts({
        launchPool: launch_pool,
        userPool: user_pool,
        treasurer,
        treasury,
        user: buyer.publicKey,
        userTokenAccount,
        tokenMint: mint,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,

    }).signers([buyer.payer]).rpc();

    console.log("Claim token in tx: ", '\n', getExplorerTxUrl(tx));
    console.log('********************************')

}