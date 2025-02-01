"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chess, Move } from "chess.js";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Board } from "../components/Board";
import { Comment } from "../components/Comment";
import { on } from "../lib/on";

export interface ChessPageProps {
  FEN: string;
}

export function ChessPage({ FEN }: ChessPageProps) {
  const [sidePaneOpened, setSidePaneOpened] = useState(false);
  const [sidePaneItem, setSidePaneItem] = useState(FEN);

  const handleItemClick = useCallback((clickedItem: string) => {
    setSidePaneItem(clickedItem);
    setSidePaneOpened(true);
  }, []);

  const handleCloseSidePane = useCallback(() => {
    setSidePaneOpened(false);
  }, []);

  return (
    <div
      className={`${
        sidePaneOpened ? "opened" : "closed"
      } group container mx-auto p-4 desktop:flex desktop:gap-6`}
    >
      <div className="desktop:flex-1">
        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold">FEN: {FEN}</h1>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <Board FEN={FEN} width="40vw" height="40vw" />
            </div>
          </CardContent>
        </Card>
        <NextMoves FEN={FEN} onItemClick={handleItemClick} />
        <Comment FEN={FEN} />
      </div>
      {sidePaneOpened && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 desktop:hidden"
          onClick={handleCloseSidePane}
          aria-hidden="true"
        />
      )}
      <SidePane
        FEN={sidePaneItem}
        onClose={handleCloseSidePane}
        onItemClick={handleItemClick}
        isOpen={sidePaneOpened}
      />
    </div>
  );
}

interface NextMovesProps {
  FEN: string;
  onItemClick?: (FEN: string) => void;
}

const NextMoves = dynamic(() => Promise.resolve(NextMovesInternal), {
  ssr: false,
});

const gridClassName =
  "grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-3 tablet:group-[.side-pane]:grid-cols-1 desktop:group-[.closed]:grid-cols-5 desktop:group-[.closed_.side-pane]:grid-cols-1 gap-4";

function NextMovesInternal({ FEN, onItemClick }: NextMovesProps) {
  const handleItemClick = useCallback(
    (e: React.MouseEvent, FEN: string) => {
      e.preventDefault();
      e.stopPropagation();
      onItemClick?.(FEN);
    },
    [onItemClick]
  );

  const nextMoveGroups = useMemo(() => {
    const chess = new Chess(FEN);
    if (chess.isGameOver()) {
      return chess.isStalemate() ? "Stalemate" : "Checkmate";
    }
    const nextMoves = chess.moves({ verbose: true }).map((move) => {
      const chess = new Chess(FEN);
      chess.move(move);
      return { move, FEN: chess.fen() };
    });
    return Object.entries<{ FEN: string; move: Move }[]>(
      nextMoves.reduce<Record<string, { FEN: string; move: Move }[]>>(
        (acc, curr) => {
          const group = curr.move.from;
          acc[group] ??= [];
          acc[group].push(curr);
          return acc;
        },
        {}
      )
    ).sort(([a], [b]) => a.localeCompare(b));
  }, [FEN]);

  return typeof nextMoveGroups === "string" ? (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-2xl">Game Over: {nextMoveGroups}</CardTitle>
      </CardHeader>
    </Card>
  ) : (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Next moves</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {nextMoveGroups.map(([group]) => (
              <TabsTrigger value={`group_${group}`}>{group}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">
            <div className={gridClassName}>
              {nextMoveGroups.map(([_, members]) =>
                members.map(({ FEN, move }) => (
                  <ItemCard
                    key={move.after}
                    FEN={FEN}
                    move={move}
                    onClick={(e) => handleItemClick(e, FEN)}
                  />
                ))
              )}
            </div>
          </TabsContent>
          {nextMoveGroups.map(([group, members]) => (
            <TabsContent value={`group_${group}`}>
              <div className={gridClassName}>
                {members.map(({ FEN, move }) => (
                  <ItemCard
                    key={move.after}
                    FEN={FEN}
                    move={move}
                    onClick={(e) => handleItemClick(e, FEN)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface ItemCardProps {
  FEN: string;
  move: Move;
  onClick?: (e: React.MouseEvent) => void;
}

function ItemCard({ FEN, move, onClick }: ItemCardProps) {
  return (
    <div className="flex flex-col items-center">
      <Board onClick={onClick} FEN={FEN} width={180} height={180} />
      <div className="flex flex-row gap-4">
        <Badge variant="secondary" className="mt-2">
          {move.san}
        </Badge>
        <Badge variant="secondary" className="mt-2">
          {move.lan}
        </Badge>
      </div>
    </div>
  );
}

interface SidePaneProps {
  FEN: string;
  onClose: () => void;
  onItemClick: (FEN: string) => void;
  isOpen: boolean;
}

function SidePane({ FEN, onClose, onItemClick, isOpen }: SidePaneProps) {
  useEffect(() => {
    return on(document, "keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    });
  }, [isOpen, onClose]);

  return (
    <div
      className={`group side-pane fixed desktop:relative inset-y-0 right-0 w-full tablet:w-96 desktop:w-1/3 bg-background shadow-lg p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
        isOpen
          ? "translate-x-0"
          : "translate-x-full desktop:translate-x-0 desktop:hidden"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">FEN: {FEN}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close side pane"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Board FEN={FEN} width="100%" height="200px" />
      <Link href={`/${encodeURIComponent(FEN)}`}>
        <Button className="mt-4 w-full">Open in Full Page</Button>
      </Link>
      <NextMoves FEN={FEN} onItemClick={onItemClick} />
    </div>
  );
}
