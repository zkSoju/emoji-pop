"use client";

import gameConfig from "@/game/emojipop";
import { useGame } from "@/lib/hooks/useGame";
import { useRef } from "react";

const EmojipopGame = () => {
  const parentEl = useRef<HTMLDivElement>(null);
  useGame(gameConfig, parentEl);

  return (
    <div
      ref={parentEl}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default EmojipopGame;
