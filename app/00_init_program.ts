import { AnchorProvider, Program, Wallet, web3 } from "@project-serum/anchor";
import wallet from "../.wallets/renext.json";
import buyer1 from "../.wallets/buyer1.json";
import ben from "../.wallets/ben.json";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as dotenv from "dotenv";
import idl from "./artifacts/renext_program.json";
import { RenextProgram } from "./artifacts/renext_program";
import { findSystemInfoAccount } from "./utils";
dotenv.config();

export const EXPLORER_URL = "https://explorer.renec.foundation/";
export const NETWORK = "testnet";
export const DEFAULT_RPC_ENDPOINT = "https://api-testnet.renec.foundation:8899/";
const SIGNER_WALLET = Keypair.fromSecretKey(new Uint8Array(wallet));
export const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID);
export const TOKEN_MINT_DECIMALS = 9;
export const TOKEN_MINT = new PublicKey(process.env.TOKEN_MINT);
export const REUSD_MINT = new PublicKey(process.env.REUSD_MINT);
export const FEE_RECEIVER = new PublicKey(process.env.FEE_RECEIVER);

console.log("Wallet: ", SIGNER_WALLET.publicKey.toBase58());

const connection = new web3.Connection(DEFAULT_RPC_ENDPOINT, "confirmed");
const masterWallet = new Wallet(SIGNER_WALLET);
const buyer1Wallet = new Wallet(Keypair.fromSecretKey(new Uint8Array(buyer1)));
const benWallet = new Wallet(Keypair.fromSecretKey(new Uint8Array(ben)));
const provider = new AnchorProvider(connection, masterWallet, {
    preflightCommitment: "confirmed",
});

const program = new Program(
    idl as unknown as RenextProgram,
    PROGRAM_ID,
    provider
);
console.log("Program loaded", program.programId.toBase58());
console.log("Master wallet: ", masterWallet.publicKey.toBase58());
console.log('********************************')

export async function initSystemInfo(creator: Wallet, fee_receiver: PublicKey, fee_in_percent: number) {
    const [systemInfoAccount,] = findSystemInfoAccount(program.programId);
    const tx = await program.methods
        .initSystem(fee_receiver, fee_in_percent)
        .accounts({
            systemInfo: systemInfoAccount,
            authority: creator.publicKey,
            systemProgram: web3.SystemProgram.programId,
            rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([creator.payer]).rpc();

    console.log("Init system info in tx: ", '\n', tx)
}

export async function updateSystemInfoFee(creator: Wallet, fee_in_percent: number) {
    const [systemInfoAccount,] = findSystemInfoAccount(program.programId);
    const tx = await program.methods
        .updateFeeInPercent(fee_in_percent)
        .accounts({
            systemInfo: systemInfoAccount,
            authority: creator.publicKey,
        })
        .signers([creator.payer]).rpc();

    console.log("Updated fee info in tx: ", '\n', tx)
}

export async function updateFeeReceiver(creator: Wallet, fee_receiver: PublicKey) {
    const [systemInfoAccount,] = findSystemInfoAccount(program.programId);
    const tx = await program.methods
        .updateFeeRecevier(fee_receiver)
        .accounts({
            systemInfo: systemInfoAccount,
            authority: creator.publicKey,
        })
        .signers([creator.payer]).rpc();

    console.log("Updated fee receiver in tx: ", '\n', tx)
}

export {
    masterWallet,
    buyer1Wallet,
    benWallet,
    connection,
    program,
}