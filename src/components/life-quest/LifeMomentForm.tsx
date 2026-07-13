"use client";

import { useState } from "react";
import type { LifeMomentMood } from "@/types";

const moodOptions: Array<{ value: LifeMomentMood; label: string }> = [
  { value: "happier", label: "更開心了" },
  { value: "relaxed", label: "比較放鬆" },
  { value: "refreshed", label: "有一點新鮮感" },
  { value: "unchanged", label: "沒有太大變化" },
  { value: "trySomethingElse", label: "想再試試其他事情" }
];

interface LifeMomentFormProps {
  adventureName: string;
  onSave: (note: string, mood: LifeMomentMood) => void;
  onClose: () => void;
}

export function LifeMomentForm({ adventureName, onSave, onClose }: LifeMomentFormProps) {
  const [note, setNote] = useState("");
  const [mood, setMood] = useState<LifeMomentMood>("refreshed");

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-zinc-950/75 p-3 backdrop-blur-sm sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-labelledby="life-moment-title">
      <div className="w-full max-w-md rounded-2xl border border-emerald-200/25 bg-zinc-900 p-5 shadow-2xl">
        <p className="text-sm font-semibold text-emerald-200">完成這次小冒險</p>
        <h2 id="life-moment-title" className="mt-2 text-xl font-black text-zinc-50">{adventureName}</h2>
        <label className="mt-5 block text-sm font-bold text-zinc-100">
          留下一小段文字 <span className="font-normal text-zinc-400">（可不填）</span>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={280} rows={3} placeholder="今天有什麼讓你記得？" className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-emerald-200" />
        </label>
        <fieldset className="mt-5">
          <legend className="text-sm font-bold text-zinc-100">完成後的心情</legend>
          <div className="mt-2 grid gap-2">
            {moodOptions.map((option) => (
              <button key={option.value} type="button" onClick={() => setMood(option.value)} className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${mood === option.value ? "border-emerald-200 bg-emerald-300 text-zinc-950" : "border-white/10 bg-white/[0.03] text-zinc-200"}`}>
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-zinc-300">先不用</button>
          <button type="button" onClick={() => onSave(note, mood)} className="rounded-xl bg-emerald-300 px-4 py-3 text-sm font-bold text-zinc-950">留下這個片段</button>
        </div>
      </div>
    </div>
  );
}
