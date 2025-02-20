import { BoardState } from "./BoardState";

export function boardStateToBits(state: BoardState): string {
  const pieceMap: Record<string, number> = {
    K: 0b000, // King
    Q: 0b001, // Queen
    R: 0b010, // Rook
    B: 0b011, // Bishop
    N: 0b100, // Knight
    P: 0b101, // Pawn
  };

  let bitString = state.isBlackTurn ? "1" : "0";
  const pieces: { type: number; position: number }[] = [];

  // Loop through board and collect pieces
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = state.board[rank][file];
      if (piece) {
        let type = pieceMap[piece.type.toUpperCase()];
        const position = rank * 8 + file;

        if (piece.type.toUpperCase() === "R") {
          // Encode castling rook
          if (
            (piece.color === "w" &&
              position === 63 &&
              state.castlingRightWhiteKing) || // White King-side Rook (H1)
            (piece.color === "w" &&
              position === 56 &&
              state.castlingRightWhiteQueen) || // White Queen-side Rook (A1)
            (piece.color === "b" &&
              position === 7 &&
              state.castlingRightBlackKing) || // Black King-side Rook (H8)
            (piece.color === "b" &&
              position === 0 &&
              state.castlingRightBlackQueen) // Black Queen-side Rook (A8)
          ) {
            type = 0b111;
          }
        } else if (piece.type.toUpperCase() === "P") {
          // Encode En Passant Pawn
          if (
            position + (piece.color === "w" ? 8 : -8) ===
            state.enPassantSquarePosition
          ) {
            type = 0b110; // Special En Passant Pawn
          }
        }

        // Store piece type with color bit
        pieces.push({
          type: type | (piece.color === "b" ? 0b1000 : 0),
          position,
        });
      }
    }
  }

  // Sort so kings are first
  pieces.sort((a, b) => a.type - b.type || a.position - b.position);

  for (const piece of pieces) {
    if ((piece.type & 0b111) === 0b000) {
      // King encoding
      if (piece.type === 0b1000) {
        // If black king
        bitString += "000"; // Special command to switch to black
      }
    } else {
      // Non-king
      bitString += (piece.type & 0b111).toString(2).padStart(3, "0");
    }
    bitString += piece.position.toString(2).padStart(6, "0");
  }

  // Remove trailing zeros
  return bitString.replace(/0+$/, "");
}
