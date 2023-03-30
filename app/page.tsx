"use client";
import EmojipopGame from "@/components/EmojipopGame";
import { useIsMounted } from "@/lib/hooks/useIsMounted";

export default function Home() {
  useIsMounted();

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
