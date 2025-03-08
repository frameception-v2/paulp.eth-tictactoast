export interface GameState {
  players: [`0x${string}`, `0x${string}` | null]; // [creator, opponent]
  board: number[]; // 9-element array representing 3x3 grid (0 = empty, 1 = X, 2 = O)
  currentPlayer: number; // Index of players array (0 or 1)
  payments: {
    [key: string]: {
      txHash: string;
      status: PaymentStatus;
      amount: string;
    };
  };
  createdAt: number;
  expiresAt: number;
  status: GameStatus;
}

export enum GameStatus {
  WAITING = "waiting",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export enum PaymentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  FAILED = "failed",
}

export type MoveRequest = {
  gameId: string;
  cellIndex: number;
  signature: string;
  playerAddress: `0x${string}`;
};
