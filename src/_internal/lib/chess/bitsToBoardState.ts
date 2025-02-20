import { BoardState, Piece } from "./BoardState";

export function bitsToBoardState(bitString: string): BoardState {
  const pieceMap: Record<number, "K" | "Q" | "R" | "N" | "B" | "P"> = {
    0b000: "K",
    0b001: "Q",
    0b010: "R",
    0b011: "B",
    0b100: "N",
    0b101: "P",
  };

  let index = 0;
  const isBlackTurn = bitString[index] === "1";
  index++;

  const pieces: {
    type: "K" | "Q" | "R" | "N" | "B" | "P";
    color: "w" | "b";
    position: number;
  }[] = [];

  function extractBits(size: number): string {
    let bits = bitString.slice(index, index + size);
    while (bits.length < size) bits += "0"; // Pad with zeros if missing
    index += size;
    return bits;
  }

  // Castling Rights and En Passant
  let castlingRightWhiteKing = false;
  let castlingRightWhiteQueen = false;
  let castlingRightBlackKing = false;
  let castlingRightBlackQueen = false;
  let enPassantSquarePosition: number | null = null;

  // Decode White King
  const whiteKingPosition = parseInt(extractBits(6), 2);
  pieces.push({ type: "K", color: "w", position: whiteKingPosition });

  // Decode White Pieces Until Special Command (000)
  while (extractBits(3) !== "000") {
    index -= 3; // Reset index after checking for special command
    const typeBits = parseInt(extractBits(3), 2);
    const positionBits = parseInt(extractBits(6), 2);
    if (typeBits === 0b110) {
      if (enPassantSquarePosition !== null) {
        throw new Error("En passant must be one or less");
      }
      enPassantSquarePosition = positionBits + 8;
      pieces.push({
        type: "P",
        color: "w",
        position: positionBits,
      });
    } else if (typeBits === 0b111) {
      if (positionBits === 63) {
        castlingRightWhiteKing = true; // H1
      } else if (positionBits === 56) {
        castlingRightWhiteQueen = true; // A1
      } else {
        throw new Error("white castling rook position must be 63 or 56");
      }
      pieces.push({
        type: "R",
        color: "w",
        position: positionBits,
      });
    } else {
      pieces.push({
        type: pieceMap[typeBits],
        color: "w",
        position: positionBits,
      });
    }
  }

  // Decode Black King
  const blackKingPosition = parseInt(extractBits(6), 2);
  pieces.push({ type: "K", color: "b", position: blackKingPosition });

  // Decode Black Pieces
  while (extractBits(3) !== "000") {
    index -= 3; // Reset index after checking for special command
    const typeBits = parseInt(extractBits(3), 2);
    const positionBits = parseInt(extractBits(6), 2);
    if (typeBits === 0b110) {
      if (enPassantSquarePosition !== null) {
        throw new Error("En passant must be one or less");
      }
      enPassantSquarePosition = positionBits - 8;
      pieces.push({
        type: "P",
        color: "b",
        position: positionBits,
      });
    } else if (typeBits === 0b111) {
      if (positionBits === 7) {
        castlingRightBlackKing = true; // H8
      } else if (positionBits === 0) {
        castlingRightBlackQueen = true; // A8
      } else {
        throw new Error(
          "black castling rook position must be 7 or 0, was " + positionBits
        );
      }
      pieces.push({
        type: "R",
        color: "b",
        position: positionBits,
      });
    } else {
      pieces.push({
        type: pieceMap[typeBits],
        color: "b",
        position: positionBits,
      });
    }
  }

  // Reconstruct 8x8 Board
  const board: Piece[][] = Array.from({ length: 8 }, () => Array(8).fill(null));
  for (const { type, color, position } of pieces) {
    const rank = Math.floor(position / 8);
    const file = position % 8;
    board[rank][file] = { type, color };
  }

  return {
    board,
    isBlackTurn,
    castlingRightWhiteKing,
    castlingRightWhiteQueen,
    castlingRightBlackKing,
    castlingRightBlackQueen,
    enPassantSquarePosition,
  };
}
