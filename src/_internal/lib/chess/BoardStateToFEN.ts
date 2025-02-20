import { BoardState } from "./BoardState";

export function boardStateToFEN(state: BoardState): string {
  let fen = "";

  // Convert board to FEN ranks
  for (let rank = 0; rank < 8; rank++) {
    let emptyCount = 0;
    let rankFEN = "";

    for (let file = 0; file < 8; file++) {
      const piece = state.board[rank][file];

      if (!piece) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          rankFEN += emptyCount.toString();
          emptyCount = 0;
        }
        rankFEN +=
          piece.color === "w"
            ? piece.type.toUpperCase()
            : piece.type.toLowerCase();
      }
    }

    if (emptyCount > 0) rankFEN += emptyCount.toString(); // Add trailing empty squares

    fen += rankFEN;
    if (rank < 7) fen += "/"; // Separate ranks with "/"
  }

  // Add turn
  fen += ` ${state.isBlackTurn ? "b" : "w"}`;

  // Compute castling rights
  let castlingRights = "";
  if (state.castlingRightWhiteKing) castlingRights += "K";
  if (state.castlingRightWhiteQueen) castlingRights += "Q";
  if (state.castlingRightBlackKing) castlingRights += "k";
  if (state.castlingRightBlackQueen) castlingRights += "q";
  if (castlingRights === "") castlingRights = "-"; // No castling available

  fen += ` ${castlingRights}`;

  // Compute en passant target square
  if (state.enPassantSquarePosition !== null) {
    const file = String.fromCharCode(
      "a".charCodeAt(0) + (state.enPassantSquarePosition % 8)
    );
    const rank = 8 - Math.floor(state.enPassantSquarePosition / 8);
    fen += ` ${file}${rank}`;
  } else {
    fen += " -";
  }

  // Halfmove clock & Fullmove number (set to 0 and 1 as default)
  fen += " 0 1";

  return fen;
}
