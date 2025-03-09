import { createPublicClient, getContract, http } from "viem";
import { base } from "wagmi/chains";
import { USDC_MAINNET } from "./constants";

// Configure public client for Base mainnet
export const usdcClient = createPublicClient({
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
