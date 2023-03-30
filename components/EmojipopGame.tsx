"use client";

import { useRef } from "react";

const EmojipopGame = () => {
  const parentEl = useRef<HTMLDivElement>(null);
  // useGame(gameConfig, parentEl);

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
