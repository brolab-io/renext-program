

import * as dotenv from "dotenv";
import { createLaunchPool } from "./01_1_create_native_pool";
import { TOKEN_MINT, benWallet, buyer1Wallet, masterWallet } from "./00_init_program";
import { createTokenMint } from "./utils";
import { startLaunchPool } from "./02_start_launch_pool";
import { completeLaunchPool } from "./04_complete_launch_pool";
import { withdrawNativePool } from "./04_withdraw_native_pool";
import { buyWithRenec } from "./03_1_buy_native_pool";
dotenv.config();

// const EXPLORER_URL = "https://explorer.renec.foundation/";
// const NETWORK = "testnet";
// const DEFAULT_RPC_ENDPOINT = "https://api-testnet.renec.foundation:8899/";
// const SIGNER_WALLET = Keypair.fromSecretKey(new Uint8Array(wallet));
// const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID);
// const TOKEN_MINT_DECIMALS = 9;
// const TOKEN_MINT = new PublicKey(process.env.TOKEN_MINT);
// const REUSD_MINT = new PublicKey(process.env.REUSD_MINT);

// console.log("Wallet: ", SIGNER_WALLET.publicKey.toBase58());

// const connection = new web3.Connection(DEFAULT_RPC_ENDPOINT, "confirmed");
// const anchorWallet = new Wallet(SIGNER_WALLET);
// const buyer1Wallet = new Wallet(Keypair.fromSecretKey(new Uint8Array(buyer1)));
// const provider = new AnchorProvider(connection, anchorWallet, {
//   preflightCommitment: "confirmed",
// });

// const program = new Program(
//   idl as unknown as RenextProgram,
//   PROGRAM_ID,
//   provider
// );
// console.log("Program loaded", program.programId.toBase58());



// function findLaunchPoolAccount(creator: PublicKey, tokenMint: PublicKey) {
//   const [pda] = findProgramAddressSync(
//     [Buffer.from("launchpool"), creator.toBuffer(), tokenMint.toBuffer()],
//     program.programId
//   );
//   return pda;
// }

// function findTreasurerAccount(pool: PublicKey, tokenMint: PublicKey) {
//   const [pda] = PublicKey.findProgramAddressSync(
//     [Buffer.from("treasurer"), pool.toBuffer(), tokenMint.toBuffer()],
//     program.programId
//   );
//   return pda;
// }
// function findTreasuryAccount(pool: PublicKey) {
//   const [pda] = PublicKey.findProgramAddressSync(
//     [Buffer.from("treasury"), pool.toBuffer(), TOKEN_MINT.toBuffer()],
//     program.programId
//   );
//   return pda;
// }

// async function findMintTokenAccount(owner: PublicKey, mint = TOKEN_MINT) {
//   const token_account = await associatedAddress({
//     mint,
//     owner,
//   });
//   return token_account;
// }

// async function createLaunchPoolxxxx(currency = 0, mint?: PublicKey) {
//   const unlock_date = new BN(dayjs().add(1, "day").unix());
//   const pool_size = new BN(100 * LAMPORTS_PER_SOL);
//   const minimum_token_amount = new BN(1 * LAMPORTS_PER_SOL);
//   const maximum_token_amount = new BN(2 * LAMPORTS_PER_SOL);
//   const pool_type = 0;
//   const launch_pool = findLaunchPoolAccount(
//     anchorWallet.publicKey,
//     mint || TOKEN_MINT
//   );
//   const treasurer = findTreasurerAccount(launch_pool, mint || TOKEN_MINT);
//   const treasury = await findMintTokenAccount(treasurer);
//   const rate = new BN(500);
//   const tx = await program.methods
//     .createLaunchPool(
//       unlock_date,
//       pool_size,
//       minimum_token_amount,
//       maximum_token_amount,
//       currency,
//       pool_type,
//       rate,
//       TOKEN_MINT_DECIMALS
//     )
//     .accounts({
//       launchPool: launch_pool,
//       authority: anchorWallet.publicKey,
//       tokenMint: TOKEN_MINT,
//       treasurer: treasurer,
//       treasury: treasury,
//       rent: web3.SYSVAR_RENT_PUBKEY,
//       systemProgram: web3.SystemProgram.programId,
//       tokenProgram: TOKEN_PROGRAM_ID,
//       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//     })
//     .signers([anchorWallet.payer])

//     .rpc();

//   console.log(
//     "Create a new launchpool in tx: ",
//     `${EXPLORER_URL}tx/${tx}?cluster=${NETWORK}`
//   );
// }







// async function buyWithReUSD(amount, mint = TOKEN_MINT) {
//   const launch_pool = findLaunchPoolAccount(anchorWallet.publicKey, mint);
//   const treasurer = findTreasurerAccount(launch_pool, mint);

//   const user_pool = findUserPoolAccount(
//     buyer1Wallet.publicKey,
//     launch_pool,
//     mint
//   );

//   const userTokenAccount = await findMintTokenAccount(
//     buyer1Wallet.publicKey,
//     REUSD_MINT
//   );

//   const launchPoolTokenAccount = await findMintTokenAccount(
//     launch_pool,
//     REUSD_MINT
//   );

//   console.log({
//     launch_pool: launch_pool.toBase58(),
//     user_pool: user_pool.toBase58(),
//     treasurer: treasurer.toBase58(),
//     userTokenAccount: userTokenAccount.toBase58(),
//     launchPoolTokenAccount: launchPoolTokenAccount.toBase58(),
//   });

//   const tx = await program.methods
//     .buyTokenWithToken(
//       anchorWallet.publicKey,
//       new BN(amount * LAMPORTS_PER_SOL)
//     )
//     .accounts({
//       launchPool: launch_pool,
//       treasurer: treasurer,
//       userPool: user_pool,
//       user: buyer1Wallet.publicKey,
//       currencyMint: REUSD_MINT,
//       userTokenAccount,
//       launchPoolTokenAccount,
//       tokenMint: TOKEN_MINT,
//       tokenProgram: TOKEN_PROGRAM_ID,
//       systemProgram: web3.SystemProgram.programId,
//       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//       rent: web3.SYSVAR_RENT_PUBKEY,
//     })
//     .signers([buyer1Wallet.payer])
//     .rpc();

//   console.log("Buy with ReUSD in tx: ", tx);

//   const data = await program.account.userPool.fetch(user_pool);
//   console.log("User pool account: ", data.amount.toNumber());
// }

// const mintToBuyer = async (to: PublicKey, mint: PublicKey, amount: number) => {
//   const token = new Token(
//     connection,
//     mint,
//     TOKEN_PROGRAM_ID,
//     anchorWallet.payer
//   );

//   const tokenAccount = await token.getOrCreateAssociatedAccountInfo(to);

//   await token.mintTo(
//     tokenAccount.address,
//     anchorWallet.payer,
//     [],
//     amount * LAMPORTS_PER_SOL
//   );

//   console.log(`Token minted to ${tokenAccount.address.toBase58()}`);
// };

(async () => {
  const mint = await createTokenMint(masterWallet, masterWallet.publicKey, 1000000);
  // const mint = TOKEN_MINT;
  await createLaunchPool(masterWallet, mint, 0);
  // await createLaunchPool(1, mint);
  await startLaunchPool(masterWallet, mint);
  await buyWithRenec(masterWallet.publicKey, mint, buyer1Wallet, 10);

  await completeLaunchPool(masterWallet, mint);
  await withdrawNativePool(buyer1Wallet, masterWallet.publicKey, mint, benWallet.publicKey);

  // await mintToBuyer(buyer1Wallet.publicKey, REUSD_MINT, 1000);
  // await buyWithReUSD(1, mint);
  // const accounts = await program.account.launchPool.all();
  // console.log("Accounts: ", accounts[0].account.currency);
})();
