import Link from "next/link";
import { MouseEvent, memo } from "react";
import { renderToSvg } from "../lib/chess/renderToSvg";

export interface BoardProps {
  FEN: string;
  width: string | number;
  height: string | number;
  onClick?: (e: MouseEvent) => void;
}

function BoardInternal({ FEN, width, height, onClick }: BoardProps) {
  const svgString = renderToSvg(FEN, {
    skipSize: true,
  });
  const href = `/${encodeURIComponent(FEN)}`;

  return (
    <Link
      href={href}
      onClick={onClick}
      className="focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <img
        className="w-full h-full"
        style={{ width, height }}
        src={`data:image/svg+xml;base64,${btoa(svgString)}`}
        alt={`FEN ${FEN}`}
      />
    </Link>
  );
}

export const Board = memo(BoardInternal);
