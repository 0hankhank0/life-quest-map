"use client";

import { Compass } from "@phosphor-icons/react";

export function LoadingScreen() {
  return (
    <div className="grid min-h-[100dvh] place-items-center bg-zinc-950 px-6 text-zinc-100">
      <div className="game-card w-full max-w-sm p-6 text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-lg border border-emerald-300/20 bg-emerald-300/10">
          <Compass className="size-8 text-emerald-200" weight="duotone" />
        </div>
        <p className="text-sm font-bold text-emerald-100">讀取任務地圖</p>
        <p className="mt-2 text-xs text-zinc-400">正在同步你的角色狀態</p>
      </div>
    </div>
  );
}
