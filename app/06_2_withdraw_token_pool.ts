import { Wallet } from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import { findLaunchPoolAccount, findMintTokenAccount, findVaultAccount, getExplorerTxUrl } from "./utils";
import { REUSD_MINT, connection, program } from "./00_init_program";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function withdrawTokenPool(payer: Wallet, creator: PublicKey, mint: PublicKey, beneficiary: PublicKey) {
    const [launch_pool] = findLaunchPoolAccount(creator, mint, program.programId);
    const launchPoolTokenAccount = await findMintTokenAccount(
        launch_pool,
        REUSD_MINT
    );

    const balance = await connection.getTokenAccountBalance(launchPoolTokenAccount);

    const beneficiaryTokenAccount = await findMintTokenAccount(
        beneficiary,
        REUSD_MINT
    );


    console.log(`User ${payer.publicKey.toBase58()} want withdraw ${balance.value.uiAmountString} ReUSD of launch pool ${launch_pool.toBase58()} with mint ${mint.toBase58()} from vault ${launchPoolTokenAccount.toBase58()} to beneficiary ${beneficiary.toBase58()}`)
    console.log('--------------------------------------')
    const tx = await program.methods.withdrawToken().accounts({
        launchPool: launch_pool,
        launchPoolTokenAccount,
        userTokenAccount: beneficiaryTokenAccount,
        authority: creator,
        beneficiary,
        currencyMint: REUSD_MINT,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
    }).signers([payer.payer]).rpc();

    console.log("Withdraw native in tx: ", '\n', getExplorerTxUrl(tx));
    console.log('********************************')

}