import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { findLaunchPoolAccount, findMintTokenAccount, findTreasurerAccount, findUserPoolAccount, findVaultAccount, findWhitelistAccount, getExplorerTxUrl } from "./utils";
import { REUSD_MINT, program } from "./00_init_program";
import { BN, Wallet, web3 } from "@project-serum/anchor";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function buyWithReUSDAnWhitelist(creator: PublicKey, mint: PublicKey, buyer: Wallet, amount: number,) {
    const [launch_pool] = findLaunchPoolAccount(creator, mint, program.programId);

    const [user_pool] = findUserPoolAccount(
        buyer.publicKey,
        launch_pool,
        mint,
        program.programId
    );

    const userTokenAccount = await findMintTokenAccount(
        buyer.publicKey,
        REUSD_MINT
    );

    const launchPoolTokenAccount = await findMintTokenAccount(
        launch_pool,
        REUSD_MINT
    );

    const [whitelist] = findWhitelistAccount(launch_pool, program.programId);

    console.log(`buyer ${buyer.publicKey.toBase58()} want buy ${amount} token with ReUSD ${REUSD_MINT} at launch pool ${launch_pool.toBase58()}`);
    console.log('--------------------------------------')
    const tx = await program.methods
        .buyTokenWithTokenWhitelist(
            new BN(amount * LAMPORTS_PER_SOL)
        )
        .accounts({
            launchPool: launch_pool,
            userPool: user_pool,
            userTokenAccount: userTokenAccount,
            launchPoolTokenAccount: launchPoolTokenAccount,
            whitelist,
            currencyMint: REUSD_MINT,
            user: buyer.publicKey,
            tokenMint: mint,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: web3.SystemProgram.programId,
            rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([buyer.payer])
        .rpc();

    console.log("Buy with ReUSD in tx: ", '\n', getExplorerTxUrl(tx));

    const data = await program.account.userPool.fetch(user_pool);
    console.log("User pool account: ", data.amount.toNumber());
    console.log('********************************')
}