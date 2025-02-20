export type Piece = { type: string; color: "w" | "b" } | null;

export interface BoardState {
  board: Piece[][];
  isBlackTurn: boolean;
  castlingRightWhiteKing: boolean;
  castlingRightWhiteQueen: boolean;
  castlingRightBlackKing: boolean;
  castlingRightBlackQueen: boolean;
  enPassantSquarePosition: number | null;
}
