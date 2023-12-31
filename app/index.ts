

import * as dotenv from "dotenv";
import { createNativeFairlaunchPool } from "./01_1_create_native_fairlaunch_pool";
import { TOKEN_MINT, benWallet, buyer1Wallet, masterWallet, program } from "./00_init_program";
import { createTokenMint, delay } from "./utils";
import { startLaunchPool } from "./02_1_start_launch_pool";
import { completeLaunchPool } from "./04_complete_launch_pool";
import { withdrawNativePool } from "./06_1_withdraw_native_pool";
import { buyWithRenec } from "./03_1_buy_native_pool";
import { claimToken } from "./05_claim_token";
import { createTokenFairlaunchPool } from "./01_2_create_token_fairlaunch_pool";
import { buyWithReUSD } from "./03_2_buy_token_pool";
import { withdrawTokenPool } from "./06_2_withdraw_token_pool";
import { BN } from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { createNativeWhitelistPool } from "./01_3_create_native_whitelist_pool";
import { startLaunchPoolWithWhitelist } from "./02_2_0_start_launch_pool_with_whitelist";
import { addWalletsToWhitelist } from "./02_2_1_add_wallets_to_whitelist";
import { removeWalletsToWhitelist } from "./02_2_2_remove_wallets_to_whitelist";
import { buyWithRenecAndWhitelist } from "./03_3_buy_native_pool_whitelist";
import { createTokenWhitelistPool } from "./01_4_create_token_whitelist_pool";
import { buyWithReUSDAnWhitelist } from "./03_4_buy_token_pool_whitelist";
import { updateVestingPlan } from "./07_update_vesting_plan";
import dayjs from "dayjs";
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

const flowNativeWhitelistPool = async () => {
  const mint = await createTokenMint(masterWallet, masterWallet.publicKey, 1000000);

  await createNativeWhitelistPool(masterWallet, mint, 20, 5, new BN(1000));
  const wallets: PublicKey[] = [
    Keypair.generate().publicKey,
    Keypair.generate().publicKey,
    Keypair.generate().publicKey,
    Keypair.generate().publicKey,
    Keypair.generate().publicKey,
  ];
  await startLaunchPoolWithWhitelist(masterWallet, mint, wallets);

  const wallets2: PublicKey[] = [
    Keypair.generate().publicKey,
    Keypair.generate().publicKey,
    buyer1Wallet.publicKey,
    Keypair.generate().publicKey,
    Keypair.generate().publicKey,
  ];

  await addWalletsToWhitelist(masterWallet, mint, wallets2);

  const removeWallets: PublicKey[] = [
    wallets[
    Math.floor(Math.random() * wallets.length)
    ],
    wallets[
    Math.floor(Math.random() * wallets.length)
    ],
    wallets2[
    Math.floor(Math.random() * wallets2.length)
    ],
  ];

  await removeWalletsToWhitelist(masterWallet, mint, removeWallets);

  await buyWithRenecAndWhitelist(masterWallet.publicKey, mint, buyer1Wallet, 10);

  await completeLaunchPool(masterWallet, mint);
  await withdrawNativePool(masterWallet, masterWallet.publicKey, mint, benWallet.publicKey);

  await delay(6000);
  await claimToken(masterWallet.publicKey, mint, buyer1Wallet);

}

const flowTokenWhitelistPool = async () => {
  const mint = await createTokenMint(masterWallet, masterWallet.publicKey, 1000000);

  await createTokenWhitelistPool(masterWallet, mint, 20, 5, new BN(1000));
  const wallets: PublicKey[] = [
    Keypair.generate().publicKey,
    Keypair.generate().publicKey,
    Keypair.generate().publicKey,
    Keypair.generate().publicKey,
    Keypair.generate().publicKey,
  ];
  await startLaunchPoolWithWhitelist(masterWallet, mint, wallets);

  const wallets2: PublicKey[] = [
    Keypair.generate().publicKey,
    Keypair.generate().publicKey,
    buyer1Wallet.publicKey,
    Keypair.generate().publicKey,
    Keypair.generate().publicKey,
  ];

  await addWalletsToWhitelist(masterWallet, mint, wallets2);

  const removeWallets: PublicKey[] = [
    wallets[
    Math.floor(Math.random() * wallets.length)
    ],
    wallets[
    Math.floor(Math.random() * wallets.length)
    ],
    wallets2[
    Math.floor(Math.random() * wallets2.length)
    ],
  ];

  await removeWalletsToWhitelist(masterWallet, mint, removeWallets);

  await buyWithReUSDAnWhitelist(masterWallet.publicKey, mint, buyer1Wallet, 10);

  await completeLaunchPool(masterWallet, mint);
  await withdrawTokenPool(masterWallet, masterWallet.publicKey, mint, benWallet.publicKey);

  await delay(6000);
  await claimToken(masterWallet.publicKey, mint, buyer1Wallet);

}


const flowNativeFairlaunchPoolWithVesting = async () => {
  const mint = await createTokenMint(masterWallet, masterWallet.publicKey, 1000000);

  await createNativeFairlaunchPool(masterWallet, mint);
  await updateVestingPlan(masterWallet, mint, [{
    releaseTime: new BN(dayjs().add(5, 'second').unix()),
    amount: new BN('150000'),
  }, {
    releaseTime: new BN(dayjs().add(10, 'second').unix()),
    amount: new BN('500000'),
  }, {
    releaseTime: new BN(dayjs().add(15, 'second').unix()),
    amount: new BN('250000'),
  }]);
  await startLaunchPool(masterWallet, mint);
  await buyWithRenec(masterWallet.publicKey, mint, buyer1Wallet, 10);

  await completeLaunchPool(masterWallet, mint);
  await withdrawNativePool(masterWallet, masterWallet.publicKey, mint, benWallet.publicKey);

  // await delay(6000);
  // await claimToken(masterWallet.publicKey, mint, buyer1Wallet);
}

(async () => {
  // await flowNativeFairlaunchPool();
  // await delay(1000);
  // await flowTokenFairlaunchPool();
  // await delay(1000);
  // await flowNativeWhitelistPool();
  // await delay(1000);
  // await flowTokenWhitelistPool();
  await delay(1000);
  await flowNativeFairlaunchPoolWithVesting();
})();
