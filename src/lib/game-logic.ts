export const checkWinner = (board: number[]): number | null => {
  // All possible winning combinations
  const winLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (const line of winLines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Return winning player (1 or -1)
    }
  }
  
  return null; // No winner
};

export const checkDraw = (board: number[]): boolean => {
  return !board.includes(0) && !checkWinner(board);
};

export const isValidMove = (board: number[], cellIndex: number): boolean => {
  return board[cellIndex] === 0; // Cell is empty
};
