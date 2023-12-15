import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { associatedAddress } from "@project-serum/anchor/dist/cjs/utils/token";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { EXPLORER_URL, NETWORK, TOKEN_MINT_DECIMALS } from "./00_init_program";
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { BN, Wallet } from "@project-serum/anchor";
import { connection } from './00_init_program'

export function findSystemInfoAccount(programId: PublicKey) {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("renext-systeminfo")],
        programId
    );
}


export function findVestingPlanAccount(pool: PublicKey, programId: PublicKey) {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("vestingplan"), pool.toBuffer()],
        programId
    );
}

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

export function findWhitelistAccount(pool: PublicKey, programId: PublicKey) {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("whitelist"), pool.toBuffer()],
        programId
    );

}

export function getExplorerTxUrl(tx: string) {
    return `${EXPLORER_URL}tx/${tx}?cluster=${NETWORK}`;
}


export async function createTokenMint(creator: Wallet, to: PublicKey, amount = 1000000, decimal = 9) {
    const mint = await Token.createMint(
        connection,
        creator.payer,
        creator.publicKey,
        null,
        decimal,
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
        new BN(amount).mul(new BN(10).pow(new BN(decimal))).toNumber()
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

export function delay(ms: number): Promise<void> {
    console.log(`delaying ${ms} ms ...`)
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}