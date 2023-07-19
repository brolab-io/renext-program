

import * as dotenv from "dotenv";
import { createNativeFairlaunchPool } from "./01_1_create_native_fairlaunch_pool";
import { TOKEN_MINT, benWallet, buyer1Wallet, masterWallet, program } from "./00_init_program";
import { createTokenMint, delay } from "./utils";
import { startLaunchPool } from "./02_start_launch_pool";
import { completeLaunchPool } from "./04_complete_launch_pool";
import { withdrawNativePool } from "./06_1_withdraw_native_pool";
import { buyWithRenec } from "./03_1_buy_native_pool";
import { claimToken } from "./05_claim_token";
import { createTokenFairlaunchPool } from "./01_2_create_token_fairlaunch_pool";
import { buyWithReUSD } from "./03_2_buy_token_pool";
import { withdrawTokenPool } from "./06_2_withdraw_token_pool";
import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
dotenv.config();


const flowNativeFairlaunchPool = async () => {
  const mint = await createTokenMint(masterWallet, masterWallet.publicKey, 1000000);

  await createNativeFairlaunchPool(masterWallet, mint);
  await startLaunchPool(masterWallet, mint);
  await buyWithRenec(masterWallet.publicKey, mint, buyer1Wallet, 10);

  await completeLaunchPool(masterWallet, mint);
  await withdrawNativePool(masterWallet, masterWallet.publicKey, mint, benWallet.publicKey);

  await delay(6000);
  await claimToken(masterWallet.publicKey, mint, buyer1Wallet);
}

const flowTokenFairlaunchPool = async () => {
  const mint = await createTokenMint(masterWallet, masterWallet.publicKey, 1000000);

  await createTokenFairlaunchPool(masterWallet, mint, 20, 5, new BN(1000));
  await startLaunchPool(masterWallet, mint);
  await buyWithReUSD(masterWallet.publicKey, mint, buyer1Wallet, 20);

  await completeLaunchPool(masterWallet, mint);
  await withdrawTokenPool(masterWallet, masterWallet.publicKey, mint, benWallet.publicKey);

  await delay(6000);
  await claimToken(masterWallet.publicKey, mint, buyer1Wallet);
}

(async () => {
  await flowNativeFairlaunchPool();
  await flowTokenFairlaunchPool();
})();
