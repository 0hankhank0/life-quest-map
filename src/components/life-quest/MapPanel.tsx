"use client";

import dynamic from "next/dynamic";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { PageHeader } from "@/components/PageHeader";
import { mapLocations } from "@/data/defaults";

const DynamicMapView = dynamic(
  () => import("@/components/MapView").then((module) => module.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[62dvh] min-h-[430px] place-items-center rounded-lg border border-emerald-300/20 bg-zinc-950/80 text-sm font-bold text-emerald-100">
        地圖載入中
      </div>
    )
  }
);

export function MapPanel() {
  const { state } = useLifeQuest();

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="World Map"
        title="任務地圖"
        description="拜訪地圖據點，完成安全、清楚、可行的探索任務。"
      />
      <DynamicMapView />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {mapLocations.map((location) => {
          const completed = state.mapCompletions.includes(location.id);

          return (
            <article
              key={location.id}
              className={`rounded-lg border p-4 ${
                completed
                  ? "border-emerald-300/30 bg-emerald-300/10"
                  : "border-white/10 bg-zinc-900/60"
              }`}
            >
              <p className="text-xs font-bold text-emerald-200">{location.type}</p>
              <h3 className="mt-2 font-black text-zinc-50">{location.name}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{location.questTitle}</p>
              <p className="mt-3 text-sm font-black text-emerald-100">
                {completed ? "已探索" : `${location.expReward} EXP`}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
