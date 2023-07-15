import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import wallet from "../.wallets/renext.json";
import buyer1 from "../.wallets/buyer1.json";
import idl from "./artifacts/renext_program.json";
import { RenextProgram } from "./artifacts/renext_program";
import {
  AnchorProvider,
  BN,
  Program,
  Wallet,
  web3,
} from "@project-serum/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  Token,
} from "@solana/spl-token";
import dayjs from "dayjs";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { associatedAddress } from "@project-serum/anchor/dist/cjs/utils/token";

import * as dotenv from "dotenv";
dotenv.config();

const EXPLORER_URL = "https://explorer.renec.foundation/";
const NETWORK = "testnet";
const DEFAULT_RPC_ENDPOINT = "https://api-testnet.renec.foundation:8899/";
const SIGNER_WALLET = Keypair.fromSecretKey(new Uint8Array(wallet));
const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID);
const TOKEN_MINT_DECIMALS = 9;
const TOKEN_MINT = new PublicKey(process.env.TOKEN_MINT);
const REUSD_MINT = new PublicKey(process.env.REUSD_MINT);

console.log("Wallet: ", SIGNER_WALLET.publicKey.toBase58());

const connection = new web3.Connection(DEFAULT_RPC_ENDPOINT, "confirmed");
const anchorWallet = new Wallet(SIGNER_WALLET);
const buyer1Wallet = new Wallet(Keypair.fromSecretKey(new Uint8Array(buyer1)));
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
  const mint = await Token.createMint(
    connection,
    anchorWallet.payer,
    anchorWallet.publicKey,
    null,
    TOKEN_MINT_DECIMALS,
    TOKEN_PROGRAM_ID
  );

  console.log("Mint created: ", mint.publicKey.toBase58());

  //   const tokenAccount = await mint.createAccount(anchorWallet.publicKey);
  const tokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    anchorWallet.publicKey
  );

  await mint.mintTo(
    tokenAccount.address,
    anchorWallet.payer,
    [],
    1000000 * LAMPORTS_PER_SOL
  );

  console.log(`Token minted to ${tokenAccount.address.toBase58()}`);

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

async function createLaunchPool(currency = 0, mint?: PublicKey) {
  const unlock_date = new BN(dayjs().add(1, "day").unix());
  const pool_size = new BN(100 * LAMPORTS_PER_SOL);
  const minimum_token_amount = new BN(1 * LAMPORTS_PER_SOL);
  const maximum_token_amount = new BN(2 * LAMPORTS_PER_SOL);
  const pool_type = 0;
  const launch_pool = findLaunchPoolAccount(
    anchorWallet.publicKey,
    mint || TOKEN_MINT
  );
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

  console.log(
    "Create a new launchpool in tx: ",
    `${EXPLORER_URL}tx/${tx}?cluster=${NETWORK}`
  );
}

async function startLaunchPool(mint?: PublicKey) {
  const launch_pool = findLaunchPoolAccount(
    anchorWallet.publicKey,
    mint || TOKEN_MINT
  );
  const source_token_account = await findMintTokenAccount(
    anchorWallet.publicKey,
    mint || TOKEN_MINT
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
  const tx = await program.methods
    .startLaunchPool()
    .accounts({
      launchPool: launch_pool,
      tokenMint: mint || TOKEN_MINT,
      sourceTokenAccount: source_token_account,
      treasurer: treasurer,
      treasury: treasury,
      authority: anchorWallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([anchorWallet.payer])
    .rpc();
  console.log(
    "Start launch pool in tx: ",
    `${EXPLORER_URL}tx/${tx}?cluster=${NETWORK}`
  );
}

function findUserPoolAccount(
  user: PublicKey,
  pool: PublicKey,
  mint = TOKEN_MINT
) {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("userpool"),
      user.toBuffer(),
      pool.toBuffer(),
      mint.toBuffer(),
    ],
    program.programId
  );
  return pda;
}

async function buyWithRenec(amount, mint = TOKEN_MINT) {
  const launch_pool = findLaunchPoolAccount(anchorWallet.publicKey, mint);
  const treasurer = findTreasurerAccount(launch_pool, mint);

  const user_pool = findUserPoolAccount(
    buyer1Wallet.publicKey,
    launch_pool,
    mint
  );

  const tx = await program.methods
    .buyTokenWithNative(
      anchorWallet.publicKey,
      new BN(amount * LAMPORTS_PER_SOL)
    )
    .accounts({
      launchPool: launch_pool,
      treasurer: treasurer,
      userPool: user_pool,
      user: buyer1Wallet.publicKey,
      tokenMint: TOKEN_MINT,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
    })
    .signers([buyer1Wallet.payer])
    .rpc();

  console.log("Buy with renec in tx: ", tx);

  const data = await program.account.userPool.fetch(user_pool);
  console.log("User pool account: ", data.amount.toNumber());
}

async function buyWithReUSD(amount, mint = TOKEN_MINT) {
  const launch_pool = findLaunchPoolAccount(anchorWallet.publicKey, mint);
  const treasurer = findTreasurerAccount(launch_pool, mint);

  const user_pool = findUserPoolAccount(
    buyer1Wallet.publicKey,
    launch_pool,
    mint
  );

  const userTokenAccount = await findMintTokenAccount(
    buyer1Wallet.publicKey,
    REUSD_MINT
  )

  const launchPoolTokenAccount = await findMintTokenAccount(
    launch_pool,
    REUSD_MINT
  )

  console.log({
    launch_pool: launch_pool.toBase58(),
    user_pool: user_pool.toBase58(),
    treasurer: treasurer.toBase58(),
    userTokenAccount: userTokenAccount.toBase58(),
    launchPoolTokenAccount: launchPoolTokenAccount.toBase58(),
  });

  const tx = await program.methods
    .buyTokenWithToken(
      anchorWallet.publicKey,
      new BN(amount * LAMPORTS_PER_SOL)
    )
    .accounts({
      launchPool: launch_pool,
      treasurer: treasurer,
      userPool: user_pool,
      user: buyer1Wallet.publicKey,
      userTokenAccount,
      launchPoolTokenAccount,
      tokenMint: TOKEN_MINT,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
    })
    .signers([buyer1Wallet.payer])
    .rpc();

  console.log("Buy with ReUSD in tx: ", tx);

  const data = await program.account.userPool.fetch(user_pool);
  console.log("User pool account: ", data.amount.toNumber());
}

const mintToBuyer = async (to: PublicKey, mint: PublicKey, amount: number) => {
  const token = new Token(
    connection,
    mint,
    TOKEN_PROGRAM_ID,
    anchorWallet.payer
  );

  const tokenAccount = await token.getOrCreateAssociatedAccountInfo(
    to
  );

  await token.mintTo(
    tokenAccount.address,
    anchorWallet.payer,
    [],
    amount * LAMPORTS_PER_SOL
  );

  console.log(`Token minted to ${tokenAccount.address.toBase58()}`);
}

(async () => {

  // const mint = await createTokenMint();
  const mint = TOKEN_MINT;
  //   await createLaunchPool(0,mint);
  // await createLaunchPool(1, mint);
  // await startLaunchPool(mint);
  // await buyWithRenec(1, mint); 

  // await mintToBuyer(buyer1Wallet.publicKey, REUSD_MINT, 1000);
  await buyWithReUSD(1, mint);
  // const accounts = await program.account.launchPool.all();
  // console.log("Accounts: ", accounts[0].account.currency);
})();
