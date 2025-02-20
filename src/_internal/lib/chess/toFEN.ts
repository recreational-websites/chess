import { boardStateToFEN } from "./BoardStateToFEN";
import { b64ToBits } from "./b64ToBits";
import { bitsToBoardState } from "./bitsToBoardState";

export function toFEN(encoded: string): string | undefined {
  try {
    return boardStateToFEN(bitsToBoardState(b64ToBits(encoded)));
  } catch {
    return undefined;
  }
}
