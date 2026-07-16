"use client";

import { useEffect, useState } from "react";

export function OfflineStatus() {
  const [online, setOnline] = useState(true);
  useEffect(() => { const update = () => setOnline(navigator.onLine); update(); window.addEventListener("online", update); window.addEventListener("offline", update); return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); }; }, []);
  return online ? null : <p role="status" className="fixed inset-x-4 top-3 z-50 mx-auto max-w-lg rounded-lg border border-amber-300/30 bg-amber-950 px-4 py-2 text-center text-sm font-bold text-amber-100">目前離線：已儲存的冒險資料仍可使用。</p>;
}
