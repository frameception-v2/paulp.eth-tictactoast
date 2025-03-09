import { createPublicClient, getContract, http, createWalletClient } from "viem";
import { base } from "wagmi/chains";
import { USDC_MAINNET, SYSTEM_KEY } from "./constants";

// Configure public client for Base mainnet
export const usdcClient = createPublicClient({
  chain: base,
  transport: http(process.env.ALCHEMY_BASE_RPC_URL),
});

// Configure wallet client for USDC interactions
const walletClient = createWalletClient({
  chain: base,
  transport: http(process.env.ALCHEMY_BASE_RPC_URL),
});

// USDC ERC-20 ABI minimal interface
const usdcAbi = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
] as const;

// USDC contract instance
export const usdcContract = getContract({
  address: USDC_MAINNET,
  abi: usdcAbi,
  publicClient: usdcClient,
});

export async function checkUsdcBalance(address: `0x${string}`): Promise<number> {
  try {
    const balance = await usdcContract.read.balanceOf([address]);
    return Number(balance) / 1e6; // Convert from 6-decimal USDC format
  } catch (error) {
    console.error("Balance check failed:", error);
    throw new Error("Failed to check USDC balance");
  }
}

export async function approveUsdcSpend(spender: `0x${string}`, amount: number): Promise<`0x${string}`> {
  try {
    const { request } = await usdcContract.simulateContract.approve(
      [spender, BigInt(amount * 1e6)], // Convert to USDC 6-decimal format
      { account: spender }
    );
    
    const hash = await walletClient.writeContract(request);
    return hash;
  } catch (error) {
    console.error("USDC approval failed:", error);
    throw new Error("User rejected approval or insufficient balance");
  }
}
