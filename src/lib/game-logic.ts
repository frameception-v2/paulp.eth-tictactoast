export function checkWinner(board: number[]): number | null {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function checkDraw(board: number[]): boolean {
  return !board.includes(0) && !checkWinner(board);
}

export function isValidMove(board: number[], cellIndex: number): boolean {
  return board[cellIndex] === 0;
}
