import { boardStateToFEN } from "./BoardStateToFEN";
import { FENToBoardState } from "./FENToBoardState";
import { b64ToBits } from "./b64ToBits";
import { bitsToB64 } from "./bitsToB64";
import { bitsToBoardState } from "./bitsToBoardState";
import { boardStateToBits } from "./boardStateToBits";

export function canonicalize(
  encoded: string
): [canonicalized: string, FEN: string] | undefined {
  try {
    const FEN = boardStateToFEN(bitsToBoardState(b64ToBits(encoded)));
    return [bitsToB64(boardStateToBits(FENToBoardState(FEN))), FEN];
  } catch {
    return undefined;
  }
}
