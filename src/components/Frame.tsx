"use client";

import { useEffect, useCallback, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import type { FrameContext } from "@farcaster/frame-sdk";
import { Board } from "~/components/Board";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

import { config } from "~/lib/wagmi/config";
import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract } from "wagmi";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { USDC_MAINNET } from "~/lib/constants";

// USDC ERC-20 ABI fragment
const USDC_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ name: "remaining", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
] as const;
import { createStore } from "mipd/store";
import { Label } from "~/components/ui/label";
import { PurpleButton } from "~/components/ui/PurpleButton";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";
import { isValidMove, checkWinner, checkDraw } from "~/lib/game-logic";

function GameCard({ context }: { context?: FrameContext }) {
  const [board, setBoard] = useState<number[]>(Array(9).fill(0));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'draw' | 'timeout'>('playing');
  const [turnStartTime, setTurnStartTime] = useState(Date.now());
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  
  // Check USDC balance
  const { data: usdcBalance } = useReadContract({
    address: USDC_MAINNET,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!address }
  });

  // Check current allowance
  const { data: allowance } = useReadContract({
    address: USDC_MAINNET,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: [address!, context?.client?.walletAddress], // Allow frame to spend
    query: { enabled: !!address && !!context?.client?.walletAddress }
  });

  const handleApprove = useCallback(() => {
    if (!address || !context?.client?.walletAddress) return;
    
    try {
      writeContract({
        address: USDC_MAINNET,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [context.client.walletAddress, BigInt(1e6)], // 1 USDC (6 decimals)
      });
    } catch (error) {
      console.error("Approval failed:", error);
    }
  }, [address, context?.client.walletAddress, writeContract]);

  const handleCellPress = useCallback((cellIndex: number) => {
    if (gameStatus !== 'playing' || !isValidMove(board, cellIndex)) return;

    const newBoard = [...board];
    newBoard[cellIndex] = currentPlayer;
    
    const winner = checkWinner(newBoard);
    if (winner) {
      setGameStatus('won');
    } else if (checkDraw(newBoard)) {
      setGameStatus('draw');
    } else {
      setCurrentPlayer(prev => prev * -1); // Switch players (1 -> -1)
      setTurnStartTime(Date.now());
    }
    
    setBoard(newBoard);
  }, [board, currentPlayer, gameStatus]);

  // Handle turn timeout
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    
    const timer = setInterval(() => {
      if (Date.now() - turnStartTime > 5000) { // 5 second timeout
        setGameStatus('timeout');
        setTimeout(() => {
          setBoard(Array(9).fill(0));
          setGameStatus('playing');
          setCurrentPlayer(1);
          setTurnStartTime(Date.now());
        }, 3000); // Reset after 3 second message display
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus, turnStartTime]);

  return (
    <Card>
      {gameStatus === 'timeout' && (
        <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center text-white text-xl text-center p-4">
          Turn timed out! Resetting game...
        </div>
      )}
      <CardHeader>
        <CardTitle>{PROJECT_TITLE}</CardTitle>
        <CardDescription>{PROJECT_DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-square w-full">
          {address && (
            <div className="mb-4 space-y-2">
              <div className="text-sm">
                Balance: {usdcBalance ? `${Number(usdcBalance) / 1e6} USDC` : 'Loading...'}
              </div>
              {allowance !== undefined && allowance < BigInt(1e6) ? (
                <PurpleButton
                  onClick={handleApprove}
                  className="px-4 py-2 text-sm"
                >
                  Approve 1 USDC Wager
                </PurpleButton>
              ) : (
                <div className="text-sm text-green-600">Wager Approved ✓</div>
              )}
            </div>
          )}
          <Board board={board} onCellPress={handleCellPress} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();

  const [added, setAdded] = useState(false);
  const [txHash, setTxHash] = useState<string>("");

  const [addFrameResult, setAddFrameResult] = useState("");

  const addFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      if (error instanceof Error) {
        setAddFrameResult(`Error: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);
      setAdded(context.client.added);

      // If frame isn't already added, prompt user to add it
      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }: { notificationDetails: string }) => {
        console.log("notificationsEnabled", notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        console.log("notificationsDisabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready();

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, addFrame, context?.client.added]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-[300px] mx-auto py-2 px-2">
        <GameCard context={context} />
      </div>
    </div>
  );
}
