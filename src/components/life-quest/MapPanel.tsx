"use client";

import dynamic from "next/dynamic";
import { PageHeader } from "@/components/PageHeader";

const DynamicMapView = dynamic(() => import("@/components/MapView").then((module) => module.MapView), { ssr: false, loading: () => <div className="grid h-[62dvh] min-h-[430px] place-items-center rounded-lg border border-emerald-300/20 bg-zinc-950/80 text-sm font-bold text-emerald-100">載入地圖中…</div> });
export function MapPanel() { return <div className="space-y-5"><PageHeader eyebrow="World Map" title="探索地圖" description="示範據點只供體驗功能使用；新增自訂探索點，建立屬於你的任務地圖。" /><DynamicMapView /></div>; }
