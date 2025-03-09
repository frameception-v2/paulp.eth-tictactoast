import { NextResponse, type NextRequest } from "next/server";
import { validateGameID } from "~/lib/storage";
import { decryptState } from "@framehq/crypto";
import { FrameRequest, getFrameMessage } from "@farcaster/frame-sdk";
import { PROJECT_ID, SYSTEM_KEY } from "~/lib/constants";

// Validate moves via signed frame messages
async function isValidMove(payload: string, gameId: string, fid: number): Promise<boolean> {
  const [receivedGameId, cellIndex, timestamp] = payload.split(':');
  return (
    receivedGameId === gameId &&
    Number.isInteger(Number(cellIndex)) &&
    Date.now() - Number(timestamp) < 5000 // 5s timeout
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body: FrameRequest = await request.json();
  
  // Validate frame message signature
  const frameMessage = await getFrameMessage(body, {
    systemKey: SYSTEM_KEY,
    projectId: PROJECT_ID,
  });

  if (!frameMessage.isValid) {
    return NextResponse.json({ error: "Invalid message signature" }, { status: 401 });
  }

  // Verify move contains valid signed data
  const moveData = frameMessage.inputText;
  if (!moveData || !isValidMove(moveData, params.id, frameMessage.requesterFid)) {
    return NextResponse.json({ error: "Invalid move payload" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const gameID = params.id;
  const signature = searchParams.get("sig");

  if (!gameID || !signature) {
    return NextResponse.json(
      { error: "Missing game ID or signature" },
      { status: 400 }
    );
  }

  try {
    // Validate game ID format
    if (!validateGameID(gameID)) {
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    }

    // Verify signature matches game ID
    const isValid = await sdk.verifySignature({
      message: gameID,
      signature,
      // @ts-ignore - Frame SDK types need update
      account: null, // Let SDK handle account validation
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Decrypt game state
    const decryptedState = await decryptState(gameID, SYSTEM_KEY);

    return NextResponse.json({
      id: gameID,
      state: decryptedState,
      valid: true,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Game state validation failed:", error);
    return NextResponse.json(
      { error: "Failed to validate game state" },
      { status: 500 }
    );
  }
}
