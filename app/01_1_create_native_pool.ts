import { BN, Wallet, web3 } from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import dayjs from "dayjs";
import { findLaunchPoolAccount, findMintTokenAccount, findTreasurerAccount, findVaultAccount, getExplorerTxUrl } from "./utils";

import { TOKEN_MINT_DECIMALS, masterWallet, program } from './00_init_program'
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function createLaunchPool(creator: Wallet, mint: PublicKey, currency = 0, max = 10, min = 5) {

    const unlock_date = new BN(dayjs().add(5, "s").unix());
    const pool_size = new BN(100 * LAMPORTS_PER_SOL);
    const minimum_token_amount = new BN(min * LAMPORTS_PER_SOL);
    const maximum_token_amount = new BN(max * LAMPORTS_PER_SOL);
    const pool_type = 0;
    const [launch_pool, launchpoolBump] = findLaunchPoolAccount(
        creator.publicKey,
        mint,
        program.programId
    );
    console.log(`launch_pool: ${launch_pool.toBase58()} creator: ${creator.publicKey.toBase58()} with mint: ${mint.toBase58()} creating ....`)
    console.log('--------------------------------------')

    const [vault, vaultBump] = findVaultAccount(launch_pool, creator.publicKey, program.programId)
    const [treasurer, treasurerBump] = findTreasurerAccount(launch_pool, mint, program.programId);
    const treasury = await findMintTokenAccount(treasurer, mint);
    const rate = new BN(500);
    const tx = await program.methods
        .createLaunchPool(
            unlock_date,
            pool_size,
            minimum_token_amount,
            maximum_token_amount,
            currency,
            pool_type,
            rate,
            TOKEN_MINT_DECIMALS,
            {
                launchpoolBump, treasurerBump, vaultBump
            }
        )
        .accounts({
            launchPool: launch_pool,
            authority: creator.publicKey,
            tokenMint: mint,
            treasurer: treasurer,
            treasury: treasury,
            vault: vault,
            rent: web3.SYSVAR_RENT_PUBKEY,
            systemProgram: web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([creator.payer])

        .rpc();

    console.log(
        "Create a new launchpool in tx: ",
        getExplorerTxUrl(tx)
    );
    console.log('********************************')
}
