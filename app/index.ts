

import * as dotenv from "dotenv";
import { createNativeFairlaunchPool } from "./01_1_create_native_fairlaunch_pool";
import { FEE_RECEIVER, TOKEN_MINT, benWallet, buyer1Wallet, initSystemInfo, masterWallet, program, updateFeeReceiver, updateSystemInfoFee } from "./00_init_program";
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
import { claimTokenVesting } from "./05_claim_token_vesting";
import { collectRemainToken } from "./08_collect_remain_token";
import { cancelLaunchPool } from "./09_cancel_launch_pool";
dotenv.config();

const POOL_SIZE = 1000000;
const MAX_BUY_SIZE = 800000;
const MIN_BUY_SIZE = 100;
const RATE = new BN(100000)
const BUY_AMOUNT = 450000;

const flowNativeFairlaunchPool = async () => {
  const mint = await createTokenMint(masterWallet, masterWallet.publicKey, 1000000);

  await createNativeFairlaunchPool(masterWallet, mint, POOL_SIZE, MAX_BUY_SIZE, MIN_BUY_SIZE, RATE);
  await startLaunchPool(masterWallet, mint);
  await buyWithRenec(masterWallet.publicKey, mint, buyer1Wallet, BUY_AMOUNT);

  await completeLaunchPool(masterWallet, mint);
  await withdrawNativePool(masterWallet, masterWallet.publicKey, mint, benWallet.publicKey, FEE_RECEIVER);

  await delay(6000);
  await claimToken(masterWallet.publicKey, mint, buyer1Wallet);

  await delay(1000);
  await collectRemainToken(masterWallet, mint);
}

const flowTokenFairlaunchPool = async () => {
  const mint = await createTokenMint(masterWallet, masterWallet.publicKey, 1000000);

  await createTokenFairlaunchPool(masterWallet, mint, POOL_SIZE, MAX_BUY_SIZE, MIN_BUY_SIZE, RATE);
  await startLaunchPool(masterWallet, mint);
  await buyWithReUSD(masterWallet.publicKey, mint, buyer1Wallet, BUY_AMOUNT);

  await completeLaunchPool(masterWallet, mint);
  await withdrawTokenPool(masterWallet, masterWallet.publicKey, mint, benWallet.publicKey, FEE_RECEIVER);

  await delay(6000);
  await claimToken(masterWallet.publicKey, mint, buyer1Wallet);

  await delay(1000);
  await collectRemainToken(masterWallet, mint);
}

const flowNativeWhitelistPool = async () => {
  const mint = await createTokenMint(masterWallet, masterWallet.publicKey, 1000000);

  await createNativeWhitelistPool(masterWallet, mint, POOL_SIZE, MAX_BUY_SIZE, MIN_BUY_SIZE, RATE);
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

  // await removeWalletsToWhitelist(masterWallet, mint, removeWallets);

  await buyWithRenecAndWhitelist(masterWallet.publicKey, mint, buyer1Wallet, BUY_AMOUNT);

  await completeLaunchPool(masterWallet, mint);
  await withdrawNativePool(masterWallet, masterWallet.publicKey, mint, benWallet.publicKey, FEE_RECEIVER);

  await delay(6000);
  await claimToken(masterWallet.publicKey, mint, buyer1Wallet);

  await delay(1000);
  await collectRemainToken(masterWallet, mint);

}

const flowTokenWhitelistPool = async () => {
  const mint = await createTokenMint(masterWallet, masterWallet.publicKey, 1000000);

  await createTokenWhitelistPool(masterWallet, mint, POOL_SIZE, MAX_BUY_SIZE, MIN_BUY_SIZE, RATE);
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

  // await removeWalletsToWhitelist(masterWallet, mint, removeWallets);

  await buyWithReUSDAnWhitelist(masterWallet.publicKey, mint, buyer1Wallet, BUY_AMOUNT);

  await completeLaunchPool(masterWallet, mint);
  await withdrawTokenPool(masterWallet, masterWallet.publicKey, mint, benWallet.publicKey, FEE_RECEIVER);

  await delay(6000);
  await claimToken(masterWallet.publicKey, mint, buyer1Wallet);

  await delay(1000);
  await collectRemainToken(masterWallet, mint);
}


const flowNativeFairlaunchPoolWithVesting = async () => {
  const mint = await createTokenMint(masterWallet, masterWallet.publicKey, 1000000);

  await createNativeFairlaunchPool(masterWallet, mint, POOL_SIZE, MAX_BUY_SIZE, MIN_BUY_SIZE, RATE);
  await updateVestingPlan(masterWallet, mint, [{
    releaseTime: new BN(dayjs().add(1, 's').unix()),
    amount: new BN('200000').mul(new BN(10).pow(new BN(9))),
  }, {
    releaseTime: new BN(dayjs().add(15, 's').unix()),
    amount: new BN('500000').mul(new BN(10).pow(new BN(9))),
  }, {
    releaseTime: new BN(dayjs().add(30, 's').unix()),
    amount: new BN('300000').mul(new BN(10).pow(new BN(9))),
  }]);
  await startLaunchPool(masterWallet, mint);
  await buyWithRenec(masterWallet.publicKey, mint, buyer1Wallet, BUY_AMOUNT);

  await completeLaunchPool(masterWallet, mint);
  await withdrawNativePool(masterWallet, masterWallet.publicKey, mint, benWallet.publicKey, FEE_RECEIVER);

  await delay(1000);
  await collectRemainToken(masterWallet, mint);

  await delay(15000);
  await claimTokenVesting(masterWallet.publicKey, mint, buyer1Wallet);

  await delay(30000);
  await claimTokenVesting(masterWallet.publicKey, mint, buyer1Wallet);


}

const flowTokenFairlaunchPoolWithVesting = async () => {
  const mint = await createTokenMint(masterWallet, masterWallet.publicKey, 1000000);

  await createTokenFairlaunchPool(masterWallet, mint, POOL_SIZE, MAX_BUY_SIZE, MIN_BUY_SIZE, RATE);
  await updateVestingPlan(masterWallet, mint, [{
    releaseTime: new BN(dayjs().add(1, 's').unix()),
    amount: new BN('200000').mul(new BN(10).pow(new BN(9))),
  }, {
    releaseTime: new BN(dayjs().add(15, 's').unix()),
    amount: new BN('500000').mul(new BN(10).pow(new BN(9))),
  }, {
    releaseTime: new BN(dayjs().add(30, 's').unix()),
    amount: new BN('300000').mul(new BN(10).pow(new BN(9))),
  }]);
  await startLaunchPool(masterWallet, mint);
  await buyWithReUSD(masterWallet.publicKey, mint, buyer1Wallet, BUY_AMOUNT);

  await completeLaunchPool(masterWallet, mint);
  await withdrawTokenPool(masterWallet, masterWallet.publicKey, mint, benWallet.publicKey, FEE_RECEIVER);

  await delay(1000);
  await collectRemainToken(masterWallet, mint);

  await delay(15000);
  await claimTokenVesting(masterWallet.publicKey, mint, buyer1Wallet);

  await delay(30000);
  await claimTokenVesting(masterWallet.publicKey, mint, buyer1Wallet);


}


const flowCancelNativeFairlaunchPool = async () => {
  const mint = await createTokenMint(masterWallet, masterWallet.publicKey, 1000000);

  await createNativeFairlaunchPool(masterWallet, mint, POOL_SIZE, MAX_BUY_SIZE, MIN_BUY_SIZE, RATE);

  await startLaunchPool(masterWallet, mint);
  await delay(3000);

  await cancelLaunchPool(masterWallet, mint);
}

(async () => {
  // await initSystemInfo(masterWallet, FEE_RECEIVER, 10);
  // await updateSystemInfoFee(masterWallet, 1);
  // await updateFeeReceiver(masterWallet, FEE_RECEIVER);
  await flowNativeFairlaunchPool();
  await delay(1000);
  await flowTokenFairlaunchPool();
  await delay(1000);
  await flowNativeWhitelistPool();
  await delay(1000);
  await flowTokenWhitelistPool();
  await delay(1000);
  await flowNativeFairlaunchPoolWithVesting();
  await delay(1000);
  await flowTokenFairlaunchPoolWithVesting();
  await delay(1000);
  await flowCancelNativeFairlaunchPool();
})();
