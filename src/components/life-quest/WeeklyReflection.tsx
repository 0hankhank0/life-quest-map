import { CheckCircle, Sparkle } from "@phosphor-icons/react";
import type { LifeMoment, LifeMomentMood } from "@/types";
import { addCalendarDays, calendarDateKey, calendarWeekday } from "@/lib/utils";

const moodLabels: Record<LifeMomentMood, string> = {
  happier: "更開心",
  relaxed: "更放鬆",
  refreshed: "煥然一新",
  unchanged: "平靜如常",
  trySomethingElse: "想換個方式試試"
};

function getThisWeeksMoments(lifeMoments: LifeMoment[], now = new Date()) {
  const today = calendarDateKey(now);
  const weekday = calendarWeekday(today);
  const monday = addCalendarDays(today, weekday === 0 ? -6 : 1 - weekday);
  return lifeMoments.filter((moment) => calendarDateKey(new Date(moment.completedAt)) >= monday);
}

function getMostCommonMood(lifeMoments: LifeMoment[]) {
  const counts = new Map<LifeMomentMood, number>();

  for (const moment of lifeMoments) {
    counts.set(moment.mood, (counts.get(moment.mood) ?? 0) + 1);
  }

  return [...counts.entries()].sort(([, firstCount], [, secondCount]) => secondCount - firstCount)[0]?.[0];
}

function getReflectionMessage(count: number) {
  if (count === 0) return "這週還有很多空白，從一個五分鐘的小冒險開始就好。";
  if (count === 1) return "這週已經有一個值得記住的時刻。";
  if (count <= 3) return "這週的生活，已經多了幾個不一樣的片段。";
  return "你正在慢慢收藏一段屬於自己的生活。";
}

function getMomentsToRemember(lifeMoments: LifeMoment[]) {
  return lifeMoments
    .slice()
    .sort((first, second) => {
      const noteDifference = Number(Boolean(second.note.trim())) - Number(Boolean(first.note.trim()));
      return noteDifference || second.completedAt.localeCompare(first.completedAt);
    })
    .slice(0, 3);
}

export function WeeklyReflection({
  lifeMoments,
  onFindAdventure
}: {
  lifeMoments: LifeMoment[];
  onFindAdventure: () => void;
}) {
  const thisWeeksMoments = getThisWeeksMoments(lifeMoments);
  const mostCommonMood = getMostCommonMood(thisWeeksMoments);
  const momentsToRemember = getMomentsToRemember(thisWeeksMoments);

  return (
    <section className="game-card overflow-hidden p-4 sm:p-5" aria-labelledby="weekly-reflection-heading">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-300/10 text-emerald-200">
          <Sparkle className="size-5" weight="fill" />
        </div>
        <div>
          <h2 id="weekly-reflection-heading" className="text-xl font-black text-zinc-50">這週的生活</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-400">回頭看看，你留下了哪些值得記住的片段。</p>
        </div>
      </div>

      {thisWeeksMoments.length === 0 ? (
        <div className="mt-5 rounded-xl bg-white/[0.04] px-4 py-4">
          <p className="text-sm leading-6 text-zinc-300">這週還沒有留下生活片段，今天可以從一件小事開始。</p>
          <button type="button" onClick={onFindAdventure} className="mt-3 rounded-xl border border-emerald-200/30 px-3 py-2 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/10 active:scale-[0.98]">
            找一個小冒險
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <p className="text-sm leading-6 text-zinc-300">
            這週留下了 <span className="font-bold text-emerald-100">{thisWeeksMoments.length}</span> 個不一樣的時刻。
            {mostCommonMood ? <> 這週最常感受到：<span className="font-bold text-emerald-100">{moodLabels[mostCommonMood]}</span>。</> : null}
          </p>
          <p className="mt-3 text-sm font-medium leading-6 text-emerald-100">{getReflectionMessage(thisWeeksMoments.length)}</p>
          <div className="mt-4 space-y-2">
            {momentsToRemember.map((moment) => (
              <div key={moment.id} className="flex items-start gap-3 rounded-xl bg-white/[0.04] px-3 py-3">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-emerald-200" weight="fill" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-zinc-100">{moment.adventureName}</p>
                  {moment.note ? <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-300">{moment.note}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
