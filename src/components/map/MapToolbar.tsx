"use client";

import { focusOptions } from "@/data/labels";
import type { MapLocationFilter } from "@/lib/mapLocations";

export function MapToolbar({ filter, selecting, onFilter, onLocate, onFitBounds, onStartAdd, onCancelAdd }: { filter: MapLocationFilter; selecting: boolean; onFilter: (filter: MapLocationFilter) => void; onLocate: () => void; onFitBounds: () => void; onStartAdd: () => void; onCancelAdd: () => void }) {
  const filters: Array<{ value: MapLocationFilter; label: string }> = [
    { value: "all", label: "全部" }, { value: "pending", label: "未完成" }, { value: "completed", label: "已完成" },
    { value: "custom", label: "自訂" }, { value: "hide-demo", label: "隱藏示範據點" },
    ...focusOptions.map((item) => ({ value: item.value, label: item.label }))
  ];
  return <div className="space-y-2">
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={onLocate} aria-label="回到我的位置" className="min-h-11 rounded-md bg-emerald-600 px-4 py-2 text-sm font-black text-white hover:bg-emerald-700">回到我的位置</button>
      <button type="button" onClick={onFitBounds} aria-label="顯示全部目前篩選的據點" className="min-h-11 rounded-md bg-zinc-700 px-4 py-2 text-sm font-black text-zinc-100 hover:bg-zinc-600">顯示全部據點</button>
      {selecting ? <button type="button" onClick={onCancelAdd} className="min-h-11 rounded-md border border-amber-300/60 px-4 py-2 text-sm font-black text-amber-100">取消新增</button> : <button type="button" onClick={onStartAdd} className="min-h-11 rounded-md bg-sky-600 px-4 py-2 text-sm font-black text-white hover:bg-sky-700">新增探索點</button>}
    </div>
    {selecting && <p className="rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm text-amber-100" role="status">選點模式：請點擊地圖放置暫存探索點；拖曳地圖不會新增地點。</p>}
    <div className="flex flex-wrap gap-2" aria-label="地點篩選">{filters.map((item) => <button type="button" key={item.value} onClick={() => onFilter(item.value)} aria-pressed={filter === item.value} className={`min-h-10 rounded-full px-3 py-1.5 text-xs font-bold ${filter === item.value ? "bg-emerald-300 text-zinc-950" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}>{item.label}</button>)}</div>
  </div>;
}
