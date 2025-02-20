"use client";

import { useContext } from "react";

import { ModeContext } from "@-ft/mode-next";
import Giscus from "@giscus/react";
import { bitsToB64 } from "../lib/chess/bitsToB64";
import { boardStateToBits } from "../lib/chess/boardStateToBits";
import { FENToBoardState } from "../lib/chess/FENToBoardState";

export interface CommentProps {
  FEN: string;
}

export function Comment({ FEN }: CommentProps) {
  const { theme } = useContext(ModeContext);
  return (
    <Giscus
      id="comments"
      repo="recreational-websites/chess"
      repoId="R_kgDONxpznA"
      category="Announcements"
      categoryId="DIC_kwDONxpznM4Cmdmq"
      mapping="specific"
      term={`${bitsToB64(boardStateToBits(FENToBoardState(FEN)))}`}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme}
      lang="en"
      loading="lazy"
    />
  );
}
