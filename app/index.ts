

import * as dotenv from "dotenv";
import { createNativeFairlaunchPool } from "./01_1_create_native_fairlaunch_pool";
import { TOKEN_MINT, benWallet, buyer1Wallet, masterWallet } from "./00_init_program";
import { createTokenMint, delay } from "./utils";
import { startLaunchPool } from "./02_start_launch_pool";
import { completeLaunchPool } from "./04_complete_launch_pool";
import { withdrawNativePool } from "./05_withdraw_native_pool";
import { buyWithRenec } from "./03_1_buy_native_pool";
import { claimToken } from "./05_claim_token";
dotenv.config();



(async () => {
  const mint = await createTokenMint(masterWallet, masterWallet.publicKey, 1000000);
  // const mint = TOKEN_MINT;
  await createNativeFairlaunchPool(masterWallet, mint, 0);
  // await createLaunchPool(1, mint);
  await startLaunchPool(masterWallet, mint);
  await buyWithRenec(masterWallet.publicKey, mint, buyer1Wallet, 10);

  await completeLaunchPool(masterWallet, mint);
  await withdrawNativePool(masterWallet, masterWallet.publicKey, mint, benWallet.publicKey);

  await delay(6000);
  await claimToken(masterWallet.publicKey, mint, buyer1Wallet);

  // await mintToBuyer(buyer1Wallet.publicKey, REUSD_MINT, 1000);
  // await buyWithReUSD(1, mint);
  // const accounts = await program.account.launchPool.all();
  // console.log("Accounts: ", accounts[0].account.currency);
})();
