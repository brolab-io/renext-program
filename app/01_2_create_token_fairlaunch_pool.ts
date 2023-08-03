import { BN, Wallet, web3 } from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import dayjs from "dayjs";
import { findLaunchPoolAccount, findMintTokenAccount, findTreasurerAccount, getExplorerTxUrl } from "./utils";

import { REUSD_MINT, TOKEN_MINT_DECIMALS, program } from './00_init_program'
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function createTokenFairlaunchPool(creator: Wallet, mint: PublicKey, max = 10, min = 5, rate = new BN(500)) {

    const unlock_date = new BN(dayjs().add(5, "s").unix());
    const pool_size = new BN(100000 * LAMPORTS_PER_SOL);
    const minimum_token_amount = new BN(min * LAMPORTS_PER_SOL);
    const maximum_token_amount = new BN(max * LAMPORTS_PER_SOL);
    const [launch_pool] = findLaunchPoolAccount(
        creator.publicKey,
        mint,
        program.programId
    );

    const launchPoolTokenAccount = await findMintTokenAccount(
        launch_pool,
        REUSD_MINT
    );
    console.log(`launch_pool: ${launch_pool.toBase58()} creator: ${creator.publicKey.toBase58()} currency ReUSD ${REUSD_MINT} with mint: ${mint.toBase58()} creating ....`)
    console.log('--------------------------------------')


    const [treasurer] = findTreasurerAccount(launch_pool, mint, program.programId);
    const treasury = await findMintTokenAccount(treasurer, mint);

    const tx = await program.methods
        .createTokenPool(
            unlock_date,
            pool_size,
            minimum_token_amount,
            maximum_token_amount,
            rate,
            TOKEN_MINT_DECIMALS,
            0
        )
        .accounts({
            launchPool: launch_pool,
            authority: creator.publicKey,
            tokenMint: mint,
            treasurer: treasurer,
            treasury: treasury,
            currencyMint: REUSD_MINT,
            launchPoolTokenAccount: launchPoolTokenAccount,
            rent: web3.SYSVAR_RENT_PUBKEY,
            systemProgram: web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([creator.payer])

        .rpc();

    console.log(
        "Create a new launchpool in tx: ", '\n',
        getExplorerTxUrl(tx)
    );
    console.log('********************************')
}
