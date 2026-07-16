"use client";

import { categoryLabels } from "@/data/labels";
import { distanceInKilometers, formatDistance } from "@/lib/mapLocations";
import type { Coordinates } from "@/lib/mapLocations";
import type { MapLocation } from "@/types";

export function MapLocationList({ locations, completions, position, selectedLocationId, onSelect }: { locations: MapLocation[]; completions: string[]; position: Coordinates | null; selectedLocationId: string | null; onSelect: (location: MapLocation) => void }) {
  if (!locations.length) return <div className="rounded-lg border border-dashed border-zinc-600 p-5 text-center text-sm text-zinc-400" role="status">沒有符合篩選的探索任務。可調整篩選條件或新增自訂探索點。</div>;
  return <section aria-label="附近探索任務" className="space-y-3"><h2 className="font-black text-zinc-50">附近探索任務</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{locations.map((location) => { const completed = completions.includes(location.id); const distance = position ? formatDistance(distanceInKilometers(position, location)) : null; const selected = selectedLocationId === location.id; return <button type="button" key={location.id} onClick={() => onSelect(location)} aria-pressed={selected} className={`min-h-32 rounded-lg border p-4 text-left transition ${selected ? "border-sky-300 bg-sky-300/10" : completed ? "border-emerald-300/30 bg-emerald-300/10" : "border-white/10 bg-zinc-900/60 hover:border-emerald-300/40"}`}><div className="flex items-start justify-between gap-2"><p className="text-xs font-bold text-emerald-200">{location.isCustom ? "自訂據點" : "示範據點"} · {location.type}</p>{distance && <span className="shrink-0 text-xs text-zinc-400">{distance}</span>}</div><h3 className="mt-2 font-black text-zinc-50">{location.name}</h3><p className="mt-1 text-sm text-zinc-400">{location.questTitle}</p><p className="mt-3 text-xs font-bold text-emerald-100">{categoryLabels[location.category]} · {completed ? "已完成" : `${location.expReward} EXP`}</p></button>; })}</div></section>;
}
