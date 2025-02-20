import { Chess } from "chess.js";

export function isValidFEN(FEN: string): boolean {
  try {
    new Chess(FEN);
    return true;
  } catch (e) {
    return false;
  }
}
