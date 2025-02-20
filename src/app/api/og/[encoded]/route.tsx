import { canonicalize } from "@/_internal/lib/chess/canonicalize";
import { isValidFEN } from "@/_internal/lib/chess/isValidFEN";
import { renderToSvg } from "@/_internal/lib/chess/renderToSvg";
import { Chess } from "chess.js";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

const BADGE_STYLE = {
  padding: 8,
  borderRadius: 12,
  background: `#000`,
  color: `#fff`,
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { encoded: string } }
) {
  const canonicalized = canonicalize(params.encoded);
  if (!canonicalized) {
    return new Response("Not Found", { status: 404 });
  }
  const [canonical, FEN] = canonicalized;
  if (canonical !== params.encoded || !isValidFEN(FEN)) {
    return new Response("Not Found", { status: 404 });
  }

  const chess = new Chess(FEN);

  const svg = renderToSvg(FEN, {
    offset: 25,
    backgroundColor: "transparent",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          alignItems: "center",
          background: "#888",
        }}
      >
        <img
          src={`data:image/svg+xml;base64,${btoa(svg)}`}
          width={630}
          height={630}
        />
        <div
          style={{
            height: "100%",
            flex: 1,
            background: `linear-gradient(to right, #FFF0, white 50%, white)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 48,
            wordBreak: "break-all",
          }}
        >
          Chess
          <div style={{ padding: 24 }}>{FEN}</div>
          <div
            style={{
              display: "flex",
              gap: 12,
              fontSize: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {chess.isStalemate() && <span style={BADGE_STYLE}>Stalemate</span>}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
