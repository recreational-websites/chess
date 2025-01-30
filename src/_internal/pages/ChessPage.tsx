import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Board } from "../components/Board";
import { Comment } from "../components/Comment";

export interface ChessPageProps {
  FEN: string;
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
            <Board FEN={FEN} width="40vw" height="40vw" />
          </CardContent>
        </Card>
      </div>
      <Comment FEN={FEN} />
    </div>
  );
}
