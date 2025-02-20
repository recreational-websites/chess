import { canonicalize } from "@/_internal/lib/chess/canonicalize";
import { isValidFEN } from "@/_internal/lib/chess/isValidFEN";
import { env } from "@/_internal/lib/env";
import { ChessPage } from "@/_internal/pages/ChessPage";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

interface Params {
  params: Record<"encoded", string>;
}

export default async function Page({ params: { encoded } }: Params) {
  const canonicalized = canonicalize(encoded);
  if (!canonicalized) {
    throw notFound();
  }
  const [canonical, FEN] = canonicalized;
  if (canonical !== encoded) {
    if (!isValidFEN(FEN)) {
      throw notFound();
    }
    throw redirect(`/${canonical}`);
  }
  if (!isValidFEN(FEN)) {
    throw notFound();
  }
  return <ChessPage FEN={FEN} />;
}

export function generateMetadata({ params: { encoded } }: Params): Metadata {
  const canonicalized = canonicalize(encoded);
  if (!canonicalized) {
    throw notFound();
  }
  const [canonical, FEN] = canonicalized;
  if (canonical !== encoded || !isValidFEN(FEN)) {
    throw notFound();
  }

  const title = `FEN ${FEN}`;
  const description = `FEN ${FEN}`;

  return {
    metadataBase: new URL(env("METADATA_BASE")),
    title,
    description,
    openGraph: {
      title,
      images: `${env("METADATA_BASE")}/chess/api/og/${canonical}`,
      description,
    },
  };
}
