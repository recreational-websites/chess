import { BoardState, Piece } from "./BoardState";

export function FENToBoardState(FEN: string): BoardState {
  const [position, turn, castling, enPassant] = FEN.split(" ");

  const board: Piece[][] = Array.from({ length: 8 }, () => Array(8).fill(null));
  const rows = position.split("/");
  for (let rank = 0; rank < 8; rank++) {
    let file = 0;
    for (const char of rows[rank]) {
      if (char >= "1" && char <= "8") {
        file += parseInt(char); // Empty squares
      } else {
        board[rank][file] = {
          type: char.toLowerCase(),
          color: char === char.toLowerCase() ? "b" : "w",
        };
        file++;
      }
    }
  }

  let enPassantSquarePosition: number | null = null;
  if (enPassant !== "-") {
    const file = enPassant.charCodeAt(0) - "a".charCodeAt(0);
    const rank = 8 - parseInt(enPassant[1], 10);
    enPassantSquarePosition = rank * 8 + file;
  }

  return {
    board,
    isBlackTurn: turn === "b",
    castlingRightWhiteKing: castling.includes("K"),
    castlingRightWhiteQueen: castling.includes("Q"),
    castlingRightBlackKing: castling.includes("k"),
    castlingRightBlackQueen: castling.includes("q"),
    enPassantSquarePosition,
  };
}
