"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  type FrameContext,
} from "@farcaster/frame-sdk";
import { Board } from "~/components/Board";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

import { config } from "~/lib/wagmi/config";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";
import { isValidMove, checkWinner, checkDraw } from "~/lib/game-logic";

function GameCard() {
  const [board, setBoard] = useState<number[]>(Array(9).fill(0));
  
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'draw'>('playing');

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
    }
    
    setBoard(newBoard);
  }, [board, currentPlayer, gameStatus]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{PROJECT_TITLE}</CardTitle>
        <CardDescription>{PROJECT_DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-square w-full">
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
        <GameCard />
      </div>
    </div>
  );
}
