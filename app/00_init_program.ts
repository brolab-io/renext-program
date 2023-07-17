import { AnchorProvider, Program, Wallet, web3 } from "@project-serum/anchor";
import wallet from "../.wallets/renext.json";
import buyer1 from "../.wallets/buyer1.json";
import ben from "../.wallets/ben.json";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as dotenv from "dotenv";
import idl from "./artifacts/renext_program.json";
import { RenextProgram } from "./artifacts/renext_program";
dotenv.config();

export const EXPLORER_URL = "https://explorer.renec.foundation/";
export const NETWORK = "testnet";
export const DEFAULT_RPC_ENDPOINT = "https://api-testnet.renec.foundation:8899/";
const SIGNER_WALLET = Keypair.fromSecretKey(new Uint8Array(wallet));
export const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID);
export const TOKEN_MINT_DECIMALS = 9;
export const TOKEN_MINT = new PublicKey(process.env.TOKEN_MINT);
export const REUSD_MINT = new PublicKey(process.env.REUSD_MINT);

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

export {
    masterWallet,
    buyer1Wallet,
    benWallet,
    connection,
    program,
}