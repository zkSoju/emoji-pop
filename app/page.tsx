"use client";
import dynamic from "next/dynamic";

const EmojipopGame = dynamic(() => import("../components/EmojipopGame"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <div className="relative z-10 flex h-screen w-full items-center justify-center">
        <div className="flex h-[600px] w-[800px] flex-col items-start overflow-hidden bg-black">
          <EmojipopGame />
        </div>
      </div>
    </div>
  );
}
