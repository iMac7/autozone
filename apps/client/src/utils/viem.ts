import "viem/window";

import { chains } from "@lens-network/sdk/viem";
import { createWalletClient, custom, type WalletClient } from "viem";



// const address = (await window.ethereum!.request({
//   method: "eth_requestAccounts",
// })) as [Address];

// export const walletClient = createWalletClient({
//   account: address,
//   chain: chains.testnet,
//   transport: custom(window.ethereum!),
// });

export let walletClient: WalletClient

// Function to initialize the wallet client on demand
export async function initWalletClient(user_address: `0x${string}`) {
  if (!window.ethereum) throw new Error("Ethereum provider not found")

  // const [address] = await window.ethereum.request({ method: "eth_requestAccounts" })

  walletClient = createWalletClient({
    account: user_address,
    chain: chains.testnet,
    transport: custom(window.ethereum)
  })

  return walletClient
}






// const add = "0xA331802a9668CD744e603B8Cd901fa96c1800bB2"