import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";


import wallet from "../.wallets/renext.json";
import idl from "../target/idl/renext_program.json";
import { RenextProgram } from "../target/types/renext_program";
import { AnchorProvider, BN, Program, Wallet, web3 } from "@project-serum/anchor";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import dayjs from "dayjs";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { associatedAddress } from "@project-serum/anchor/dist/cjs/utils/token";

const EXPLORER_URL = "https://explorer.renec.foundation/";
const NETWORK = "testnet";
const DEFAULT_RPC_ENDPOINT = "https://api-testnet.renec.foundation:8899/";
const SIGNER_WALLET = Keypair.fromSecretKey(new Uint8Array(wallet));
const PROGRAM_ID = new PublicKey("AAW7r9v5sEJ5pkxE8sX1fSLpSDLQSLyESQPCKdvT164S");
const TOKEN_MINT_DECIMALS = 9;
const TOKEN_MINT = new PublicKey(
    "FxJQtAQXH4SF5MYr7kWD6WaSPhYLrnYQcCFLvZwNH4db"
);
console.log("Program ID: ", PROGRAM_ID.toBase58());

console.log("Wallet: ", SIGNER_WALLET.publicKey.toBase58());

const connection = new web3.Connection(DEFAULT_RPC_ENDPOINT, "confirmed");
const anchorWallet = new Wallet(SIGNER_WALLET);
const provider = new AnchorProvider(connection, anchorWallet, {
    preflightCommitment: "confirmed",
});

const program = new Program(
    idl as unknown as RenextProgram,
    PROGRAM_ID,
    provider
);
console.log("Program loaded", program.programId.toBase58());

async function createTokenMint() {
    const mint = await Token.createMint(connection, anchorWallet.payer, anchorWallet.publicKey, null, TOKEN_MINT_DECIMALS, TOKEN_PROGRAM_ID);


    console.log("Mint created: ", mint.publicKey.toBase58());

    const tokenAccount = await mint.createAccount(anchorWallet.publicKey);
    // const tokenAccount = anchorWallet.publicKey;

    await mint.mintTo(tokenAccount, anchorWallet.payer, [], 10000 * LAMPORTS_PER_SOL);

    console.log(`Token minted to ${tokenAccount.toBase58()}`);

    return mint.publicKey;
}

function findLaunchPoolAccount(creator: PublicKey, tokenMint: PublicKey) {
    const [pda] = findProgramAddressSync(
        [Buffer.from("launchpool"), creator.toBuffer(), tokenMint.toBuffer()],
        program.programId
    );
    return pda;
}

function findTreasurerAccount(pool: PublicKey, tokenMint: PublicKey) {
    const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from("treasurer"), pool.toBuffer(), tokenMint.toBuffer()],
        program.programId
    );
    return pda;


}
function findTreasuryAccount(pool: PublicKey) {
    const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from("treasury"), pool.toBuffer(), TOKEN_MINT.toBuffer()],
        program.programId
    );
    return pda;
}

async function findMintTokenAccount(owner: PublicKey, mint = TOKEN_MINT) {
    const token_account = await associatedAddress({
        mint,
        owner,
    });
    return token_account;
}

async function createLaunchPool(mint?: PublicKey) {
    const unlock_date = new BN(dayjs().add(1, "day").unix());
    const pool_size = new BN(100 * LAMPORTS_PER_SOL);
    const minimum_token_amount = new BN(1 * LAMPORTS_PER_SOL);
    const maximum_token_amount = new BN(2 * LAMPORTS_PER_SOL);
    const currency = 0;
    const pool_type = 0;
    const launch_pool = findLaunchPoolAccount(anchorWallet.publicKey, mint || TOKEN_MINT);
    const treasurer = findTreasurerAccount(launch_pool, mint || TOKEN_MINT);
    const treasury = await findMintTokenAccount(treasurer);
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
            TOKEN_MINT_DECIMALS
        )
        .accounts({
            launchPool: launch_pool,
            authority: anchorWallet.publicKey,
            tokenMint: TOKEN_MINT,
            treasurer: treasurer,
            treasury: treasury,
            rent: web3.SYSVAR_RENT_PUBKEY,
            systemProgram: web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([anchorWallet.payer])

        .rpc();

    console.log("Create a new launchpool in tx: ", tx);
}


async function startLaunchPool(mint?: PublicKey) {
    const launch_pool = findLaunchPoolAccount(anchorWallet.publicKey, TOKEN_MINT);
    const source_token_account = await findMintTokenAccount(
        anchorWallet.publicKey
    );
    const treasurer = findTreasurerAccount(launch_pool, mint || TOKEN_MINT);
    const treasury = await findMintTokenAccount(treasurer);

    console.log({
        launch_pool: launch_pool.toBase58(),
        source_token_account: source_token_account.toBase58(),
        treasurer: treasurer.toBase58(),
        treasury: treasury.toBase58(),
    });
    // await initializeAccount(treasurer, TOKEN_MINT, treasurer, provider);
    // const tx = await program.methods
    //     .startLaunchPool()
    //     .accounts({
    //         launchPool: launch_pool,
    //         tokenMint: TOKEN_MINT,
    //         sourceTokenAccount: source_token_account,
    //         treasurer: treasurer,
    //         treasury: treasury,
    //         authority: anchorWallet.publicKey,
    //         tokenProgram: TOKEN_PROGRAM_ID,
    //         rent: web3.SYSVAR_RENT_PUBKEY,
    //         systemProgram: web3.SystemProgram.programId,
    //     })
    //     .signers([anchorWallet.payer])
    //     .rpc();
    // console.log("Start launch pool in tx: ", tx);
}

(async () => {
    const accounts = await program.account.launchPool.all();
    console.log("Accounts: ", accounts);
    const mint = await createTokenMint();
    // await createLaunchPool()
    // await startLaunchPool();
})();