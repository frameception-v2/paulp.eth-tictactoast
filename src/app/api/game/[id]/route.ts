import { NextResponse } from "next/server";
import { validateGameID } from "~/lib/storage";
import { decryptState } from "@framehq/crypto";
import { SYSTEM_KEY } from "~/lib/constants";

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
