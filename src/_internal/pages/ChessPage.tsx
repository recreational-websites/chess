import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chess } from "chess.js";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo } from "react";
import { Board } from "../components/Board";
import { Comment } from "../components/Comment";

export interface ChessPageProps {
  FEN: string;
}

function useNextMoves(FEN: string): { FEN: string; move: string }[] {
  return useMemo(() => {
    const chess = new Chess(FEN);
    return chess.moves().map((move) => {
      const chess = new Chess(FEN);
      chess.move(move);
      return { move, FEN: chess.fen() };
    });
  }, [FEN]);
}

export function ChessPage({ FEN }: ChessPageProps) {
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Card className="w-full max-w-3xl bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              FEN: {FEN}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <div
                className="w-full shadow-lg flex items-center justify-center"
                aria-label={`FEN for ${FEN}`}
              >
                <Board FEN={FEN} width="100%" height="fit-content" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">정보</p>
                <p className="text-md">뭐시기</p>
              </div>
              <NextMove FEN={FEN} />
            </div>
          </CardContent>
        </Card>
      </div>
      <Comment FEN={FEN} />
    </div>
  );
}

const NextMove = dynamic(() => Promise.resolve(NextMoveInternal), {
  ssr: false,
});

function NextMoveInternal({ FEN }: ChessPageProps) {
  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4 text-center">Next moves</h3>
      <div className="grid grid-cols-2 tablet:grid-cols-3 gap-4">
        {useNextMoves(FEN).map((nextMove) => (
          <Link
            href={`/${encodeURIComponent(nextMove.FEN)}`}
            key={nextMove.move}
            passHref
          >
            <Board FEN={nextMove.FEN} width="100%" height="fit-content" />
            {nextMove.move}
          </Link>
        ))}
      </div>
    </div>
  );
}
