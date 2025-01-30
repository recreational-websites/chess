import { env } from "@/_internal/lib/env";
import { isValidFEN } from "@/_internal/lib/isValidFEN";
import { ChessPage } from "@/_internal/pages/ChessPage";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Params {
  params: Record<"FEN", string[]>;
}

export default async function Page({ params: { FEN } }: Params) {
  const realFEN = decodeURIComponent(FEN.join("/"));
  if (!isValidFEN(realFEN)) {
    throw notFound();
  }
  return <ChessPage FEN={realFEN} />;
}

export function generateMetadata({ params: { FEN } }: Params): Metadata {
  const realFEN = decodeURIComponent(FEN.join("/"));
  const title = `FEN ${realFEN}`;
  const description = `FEN ${realFEN}`;

  return {
    metadataBase: new URL(env("METADATA_BASE")),
    title,
    description,
    openGraph: {
      title,
      images: `${env("METADATA_BASE")}/chess/api/og/${encodeURIComponent(
        realFEN
      )}`,
      description,
    },
  };
}
