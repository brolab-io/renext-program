import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { findLaunchPoolAccount, findTreasurerAccount, findUserPoolAccount, findVaultAccount, getExplorerTxUrl } from "./utils";
import { program } from "./00_init_program";
import { BN, Wallet, web3 } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function buyWithReUSD(creator: PublicKey, mint: PublicKey, buyer: Wallet, amount: number,) {
    const [launch_pool] = findLaunchPoolAccount(creator, mint, program.programId);

    const [user_pool] = findUserPoolAccount(
        buyer.publicKey,
        launch_pool,
        mint,
        program.programId
    );

    const [vault] = findVaultAccount(launch_pool, creator, program.programId);

    console.log(`buyer ${buyer.publicKey.toBase58()} want buy ${amount} token with renec at launch pool ${launch_pool.toBase58()}`);
    console.log('--------------------------------------')
    const tx = await program.methods
        .buyTokenWithToken(
            creator,
            new BN(amount * LAMPORTS_PER_SOL)
        )
        .accounts({
            launchPool: launch_pool,
            userPool: user_pool,
            user: buyer.publicKey,
            tokenMint: mint,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: web3.SystemProgram.programId,
            rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([buyer.payer])
        .rpc();

    console.log("Buy with renec in tx: ", getExplorerTxUrl(tx));

    const data = await program.account.userPool.fetch(user_pool);
    console.log("User pool account: ", data.amount.toNumber());
    console.log('********************************')
}