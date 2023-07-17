import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { associatedAddress } from "@project-serum/anchor/dist/cjs/utils/token";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { EXPLORER_URL, NETWORK, TOKEN_MINT_DECIMALS } from "./00_init_program";
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { Wallet } from "@project-serum/anchor";
import { connection } from './00_init_program'

export function findLaunchPoolAccount(creator: PublicKey, mint: PublicKey, programId: PublicKey) {
    return findProgramAddressSync(
        [Buffer.from("launchpool"), creator.toBuffer(), mint.toBuffer()],
        programId
    );

}

export function findTreasurerAccount(pool: PublicKey, mint: PublicKey, programId: PublicKey) {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("treasurer"), pool.toBuffer(), mint.toBuffer()],
        programId
    );

}

export async function findMintTokenAccount(owner: PublicKey, mint: PublicKey) {
    const token_account = await associatedAddress({
        mint,
        owner,
    });
    return token_account;
}

export function findVaultAccount(pool: PublicKey, creator: PublicKey, programId: PublicKey) {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), pool.toBuffer(), creator.toBuffer()],
        programId
    );

}

export function getExplorerTxUrl(tx: string) {
    return `${EXPLORER_URL}tx/${tx}?cluster=${NETWORK}`;
}


export async function createTokenMint(creator: Wallet, to: PublicKey, amount = 1000000) {
    const mint = await Token.createMint(
        connection,
        creator.payer,
        creator.publicKey,
        null,
        TOKEN_MINT_DECIMALS,
        TOKEN_PROGRAM_ID
    );

    console.log("Mint created: ", mint.publicKey.toBase58());

    //   const tokenAccount = await mint.createAccount(anchorWallet.publicKey);
    const tokenAccount = await mint.getOrCreateAssociatedAccountInfo(
        to
    );

    await mint.mintTo(
        tokenAccount.address,
        creator.payer,
        [],
        amount * LAMPORTS_PER_SOL
    );

    console.log(`Token minted to ${tokenAccount.address.toBase58()}`);

    return mint.publicKey;
}

export function findUserPoolAccount(
    user: PublicKey,
    pool: PublicKey,
    mint: PublicKey,
    programId: PublicKey
) {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("userpool"),
            user.toBuffer(),
            pool.toBuffer(),
            mint.toBuffer(),
        ],
        programId
    );

}