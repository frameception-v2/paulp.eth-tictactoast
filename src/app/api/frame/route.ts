import { Frog } from "frog";
import { FrameState } from "./types";

// Initialize Frog framework
export const { GET, POST } = Frog({
  basePath: "/api/frame",
  initialState: {
    players: [],
    board: Array(9).fill(0),
    status: "waiting"
  } as FrameState
})

// Start route with game creation CTA
POST("/start", (c) => {
  const { buttonValue, deriveState } = c
  const state = deriveState()
  
  return c.res({
    image: (
      <div style={{ 
        backgroundColor: "#c026d3",
        backgroundSize: "100% 100%",
        display: "flex",
        flexDirection: "column",
        padding: 48,
        gap: 24
      }}>
        <h1 style={{ color: "white", fontSize: 48 }}>Tic Tac Toe Wager</h1>
        <p style={{ color: "white", fontSize: 32 }}>Stake 1 USDC to start a game</p>
      </div>
    ),
    intents: [
      <Button value="create">Create Game (1 USDC)</Button>,
      <Button.Link href="/rules">How to Play</Button.Link>
    ],
    postUrl: `${process.env.NEXT_PUBLIC_HOST}/api/frame/start`
  })
})
