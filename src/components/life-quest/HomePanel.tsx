"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BookmarkSimple, CalendarCheck, CheckCircle, Clock, Fire, Heart, Lightning, MapPin, Prohibit, Shuffle, Sparkle, Sun } from "@phosphor-icons/react";
import { ExpBar } from "@/components/ExpBar";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { adventureLocationLabels, adventureTimeOfDayLabels, microAdventures, type AvailableTime, type LocationPreference, type Mood, type TimeOfDayPreference } from "@/data/microAdventures";
import { formatLocalShortDate, getRecentCompletedQuests, getTodayActivity, getWeekActivity } from "@/lib/activityStats";
import { getNextDisplayedAdventureId, shouldRecordShown } from "@/lib/displayedAdventure";
import { getAdventureRecommendations } from "@/lib/recommendations";
import { calendarDateKey } from "@/lib/utils";

const moods: Array<{ value: Mood; label: string }> = [
  { value: "bored", label: "無聊" }, { value: "tired", label: "疲憊" }, { value: "good", label: "狀態不錯" },
  { value: "out", label: "想出門" }, { value: "social", label: "想社交" }, { value: "quiet", label: "想安靜" }
];
const times: AvailableTime[] = ["5", "15", "30", "60"];
const locations: Array<{ value: LocationPreference; label: string }> = [
  { value: "any", label: "不限地點" }, ...Object.entries(adventureLocationLabels).map(([value, label]) => ({ value: value as LocationPreference, label }))
];
const timesOfDay: Array<{ value: TimeOfDayPreference; label: string }> = [
  { value: "any", label: "不限時段" }, ...Object.entries(adventureTimeOfDayLabels).map(([value, label]) => ({ value: value as TimeOfDayPreference, label }))
];
const weekLabels = ["一", "二", "三", "四", "五", "六", "日"];

function ChoiceButton({ active, children, onClick, disabled }: { active: boolean; children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} aria-pressed={active} className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60 ${active ? "border-emerald-200 bg-emerald-300 text-zinc-950" : "border-white/10 bg-white/[.03] text-zinc-200 hover:border-emerald-200/50"}`}>{children}</button>;
}

function RecommendationReasons({ reasons }: { reasons: string[] }) {
  return reasons.length ? <ul className="mt-4 flex flex-wrap gap-2" aria-label="推薦原因">{reasons.map((reason) => <li key={reason} className="rounded-md bg-emerald-200/10 px-2.5 py-1 text-xs text-emerald-100">{reason}</li>)}</ul> : null;
}

export function HomePanel() {
  const router = useRouter();
  const onNavigate = (tab: "profile" | "quests") => router.push(tab === "profile" ? "/history" : "/quests");
  const { state, startMicroAdventure, cancelMicroAdventure, completeMicroAdventure, toggleFavoriteAdventure, toggleSavedAdventure, dismissAdventure, showAdventure, clearSelectedAdventure } = useLifeQuest();
  const [mood, setMood] = useState<Mood>("bored");
  const [time, setTime] = useState<AvailableTime>("15");
  const [location, setLocation] = useState<LocationPreference>("any");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDayPreference>("any");
  const [displayedAdventureId, setDisplayedAdventureId] = useState<string | null>(null);
  const lastShownAdventureId = useRef<string | null>(null);
  const today = useMemo(() => getTodayActivity(state.quests), [state.quests]);
  const week = useMemo(() => getWeekActivity(state.quests), [state.quests]);
  const recentCompleted = useMemo(() => getRecentCompletedQuests(state.quests), [state.quests]);
  const completedTodayIds = useMemo(() => state.lifeMoments.filter((moment) => moment.adventureId && (moment.rewardGranted ?? true) && calendarDateKey(new Date(moment.completedAt)) === today.date).map((moment) => moment.adventureId as string), [state.lifeMoments, today.date]);
  const shownHistory = useMemo(() => state.recommendationHistory.filter((item) => item.action === "shown").slice(-8), [state.recommendationHistory]);
  const recentlyShownIds = useMemo(() => shownHistory.map((item) => item.adventureId), [shownHistory]);
  const recentlyShownCategories = useMemo(() => shownHistory.flatMap((item) => microAdventures.filter((adventure) => adventure.id === item.adventureId).map((adventure) => adventure.category)), [shownHistory]);
  const recommendationContext = useMemo(() => ({ focuses: state.profile?.setupCompletedAt === null ? undefined : state.profile?.focuses, occupation: state.profile?.setupCompletedAt === null ? undefined : state.profile?.occupation, favoriteAdventureIds: state.favoriteAdventureIds, savedAdventureIds: state.savedAdventureIds, dismissedAdventures: state.dismissedAdventures, recentlyShownIds, recentlyShownCategories, completedTodayIds }), [completedTodayIds, recentlyShownCategories, recentlyShownIds, state.dismissedAdventures, state.favoriteAdventureIds, state.profile?.focuses, state.profile?.occupation, state.profile?.setupCompletedAt, state.savedAdventureIds]);
  const recommendations = useMemo(() => getAdventureRecommendations(microAdventures, { ...recommendationContext, mood, time, location, timeOfDay }), [location, mood, recommendationContext, time, timeOfDay]);
  // A saved or active adventure must remain accessible even when it takes more
  // time than the default budget after navigating back or reloading.
  const catalogueRecommendations = useMemo(() => getAdventureRecommendations(microAdventures, { ...recommendationContext, mood, time: "60" }), [mood, recommendationContext]);
  const selectedAdventure = state.selectedAdventureId ? catalogueRecommendations.find((item) => item.adventure.id === state.selectedAdventureId) : undefined;
  const activeRecommendation = state.activeMicroAdventure ? catalogueRecommendations.find((item) => item.adventure.id === state.activeMicroAdventure?.adventureId) : undefined;
  const displayedRecommendation = activeRecommendation ?? selectedAdventure ?? (displayedAdventureId ? recommendations.find((item) => item.adventure.id === displayedAdventureId) : undefined) ?? recommendations[0];
  const adventure = displayedRecommendation?.adventure;

  useEffect(() => {
    if (activeRecommendation) {
      if (Number(time) < Math.min(...activeRecommendation.adventure.times.map(Number))) {
        setTime(activeRecommendation.adventure.times[0]);
      }
      setDisplayedAdventureId(activeRecommendation.adventure.id);
      return;
    }
    if (state.selectedAdventureId && selectedAdventure) {
      setTime(selectedAdventure.adventure.times[0]);
      setLocation("any");
      setTimeOfDay("any");
      setDisplayedAdventureId(selectedAdventure.adventure.id);
      clearSelectedAdventure();
      return;
    }

    if (!recommendations.some((item) => item.adventure.id === displayedAdventureId) && recommendations[0]) {
      setDisplayedAdventureId(recommendations[0].adventure.id);
    }
  }, [activeRecommendation, clearSelectedAdventure, displayedAdventureId, recommendations, selectedAdventure, state.selectedAdventureId, time]);

  useEffect(() => {
    if (displayedAdventureId && shouldRecordShown(lastShownAdventureId.current, displayedAdventureId)) {
      lastShownAdventureId.current = displayedAdventureId;
      showAdventure(displayedAdventureId);
    }
  }, [displayedAdventureId, showAdventure]);

  useEffect(() => {
    if (window.sessionStorage.getItem("lifeQuestMap:focus-recommended-adventure") !== "true") return;
    window.sessionStorage.removeItem("lifeQuestMap:focus-recommended-adventure");
    window.requestAnimationFrame(() => {
      const adventureSection = document.getElementById("recommended-adventure");
      adventureSection?.scrollIntoView({ behavior: state.userSettings.reducedMotion ? "auto" : "smooth", block: "center" });
      adventureSection?.querySelector<HTMLElement>("h2")?.focus();
    });
  }, [state.userSettings.reducedMotion]);
  if (!state.profile) return null;

  const completed = adventure ? completedTodayIds.includes(adventure.id) : false;
  const inProgress = Boolean(state.activeMicroAdventure);
  const choose = (nextMood: Mood, nextTime: AvailableTime, nextLocation = location, nextTimeOfDay = timeOfDay) => {
    const nextRecommendations = getAdventureRecommendations(microAdventures, { ...recommendationContext, mood: nextMood, time: nextTime, location: nextLocation, timeOfDay: nextTimeOfDay });
    setMood(nextMood); setTime(nextTime); setLocation(nextLocation); setTimeOfDay(nextTimeOfDay);
    setDisplayedAdventureId(getNextDisplayedAdventureId(nextRecommendations, adventure?.id ?? null));
  };
  const finish = () => { if (adventure) completeMicroAdventure(adventure.id, adventure, "", "unchanged"); };
  const weekMax = Math.max(1, ...week.map((day) => day.completedCount));

  return <main className="mx-auto flex max-w-4xl flex-col gap-6 pb-8">
    <header className="order-1 px-1 pt-3"><p className="text-sm font-semibold tracking-wide text-emerald-200">Life Quest · {state.profile.name}</p><h1 className="mt-2 text-4xl font-black tracking-[-.045em] text-zinc-50 sm:text-5xl">今天想先完成什麼？</h1><p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300">完成任務後，進度和筆記會記錄在這裡。</p></header>

    <section className="order-4 game-card overflow-hidden p-4 sm:p-5" aria-label="今日進度">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-sm font-bold text-emerald-100">今日進度</p><h2 className="mt-1 text-2xl font-black text-zinc-50">已累積 {today.completedCount} 個完成項目</h2></div><div className="w-full max-w-sm"><div className="mb-2 flex justify-between text-sm"><span className="font-bold text-zinc-100">Lv {state.profile.level}</span><span className="text-emerald-100">總 EXP {state.profile.exp}</span></div><ExpBar exp={state.profile.exp} /></div></div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><Metric icon={<CalendarCheck weight="duotone" />} label="今日完成" value={`${today.completedCount} 項`} /><Metric icon={<Lightning weight="fill" />} label="今日 EXP" value={`${today.expEarned} EXP`} /><Metric icon={<Fire weight="fill" />} label="目前連續" value={`${state.streak.current} 天`} /><Metric icon={<Sparkle weight="fill" />} label="最長紀錄" value={`${state.streak.longest} 天`} /></div>
    </section>

    <section className="order-5 game-card p-4 sm:p-5" aria-labelledby="week-heading"><div className="flex items-center justify-between"><div><h2 id="week-heading" className="text-xl font-black text-zinc-50">本週完成紀錄</h2><p className="mt-1 text-sm text-zinc-400">看看這週每天完成了多少任務。</p></div><span className="text-sm font-bold text-emerald-100">{week.reduce((total, day) => total + day.completedCount, 0)} 項</span></div><div className="mt-5 grid grid-cols-7 gap-2">{week.map((day, index) => <div key={day.date} className="min-w-0 text-center"><p className="text-xs font-bold text-zinc-400">{weekLabels[index]}</p><div className="mt-2 flex h-20 items-end justify-center rounded-lg bg-white/[0.035] p-1"><div className="w-full rounded-md bg-emerald-300/85 transition-[height]" style={{ height: `${day.completedCount ? Math.max(18, (day.completedCount / weekMax) * 100) : 6}%` }} aria-label={`${formatLocalShortDate(day.date)} ${day.completedCount} 項`} /></div><p className="mt-2 text-xs font-bold text-emerald-100">{day.completedCount}</p></div>)}</div></section>

    <section className="order-6 game-card p-4 sm:p-5" aria-labelledby="recent-heading"><div className="flex items-center justify-between"><h2 id="recent-heading" className="text-xl font-black text-zinc-50">最近完成</h2><button type="button" onClick={() => onNavigate("profile")} className="text-sm font-bold text-emerald-200 hover:text-emerald-100">查看歷史</button></div>{recentCompleted.length ? <div className="mt-4 grid gap-2 md:grid-cols-3">{recentCompleted.map((quest) => <article key={quest.id} className="rounded-lg bg-white/[0.04] p-3"><p className="text-xs font-bold text-emerald-100">+{quest.expReward} EXP</p><h3 className="mt-1 line-clamp-2 text-sm font-bold text-zinc-100">{quest.title}</h3><p className="mt-2 text-xs text-zinc-400">{quest.completedAt ? new Date(quest.completedAt).toLocaleDateString() : ""}</p></article>)}</div> : <p className="mt-4 rounded-lg bg-white/[0.04] p-4 text-sm text-zinc-400">完成第一個任務後，這裡會記錄你的最新進展。</p>}</section>

    <section className="order-2 game-card p-4 sm:p-5" aria-label="推薦活動條件">
      <h2 className="text-lg font-bold text-zinc-50">此刻想做什麼？</h2>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="心情">{moods.map((item) => <ChoiceButton key={item.value} active={mood === item.value} disabled={inProgress} onClick={() => choose(item.value, time)}>{item.label}</ChoiceButton>)}</div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <fieldset><legend className="flex items-center gap-2 text-sm font-bold text-zinc-50"><MapPin className="size-5 text-emerald-200" weight="duotone" />活動地點</legend><div className="mt-3 flex flex-wrap gap-2">{locations.map((item) => <ChoiceButton key={item.value} active={location === item.value} disabled={inProgress} onClick={() => choose(mood, time, item.value)}>{item.label}</ChoiceButton>)}</div></fieldset>
        <fieldset><legend className="flex items-center gap-2 text-sm font-bold text-zinc-50"><Sun className="size-5 text-emerald-200" weight="duotone" />活動時段</legend><div className="mt-3 flex flex-wrap gap-2">{timesOfDay.map((item) => <ChoiceButton key={item.value} active={timeOfDay === item.value} disabled={inProgress} onClick={() => choose(mood, time, location, item.value)}>{item.label}</ChoiceButton>)}</div></fieldset>
      </div>
      <fieldset className="mt-5"><legend className="flex items-center gap-2 text-sm font-bold text-zinc-50"><Clock className="size-5 text-emerald-200" weight="duotone" />可用時間</legend><div className="mt-3 flex flex-wrap gap-2">{times.map((item) => <ChoiceButton key={item} active={time === item} disabled={inProgress} onClick={() => choose(mood, item)}>{item === "60" ? "1 小時" : `${item} 分鐘`}</ChoiceButton>)}</div></fieldset>
      <p className="mt-4 text-xs leading-5 text-zinc-400">{inProgress ? "先完成或取消正在進行的冒險，再調整推薦條件。" : "依活動場景、時段和可用時間挑選；出門前請確認場所開放時間。"}</p>
    </section>
    {adventure && displayedRecommendation ? <section id="recommended-adventure" data-testid="recommended-adventure" className="order-3 relative overflow-hidden rounded-2xl border border-emerald-200/25 bg-[linear-gradient(135deg,rgba(52,211,153,.18),rgba(24,24,27,.9)_55%)] p-5 shadow-[0_20px_60px_rgba(3,20,15,.3)]">
      <Sparkle className="absolute right-4 top-4 size-9 text-emerald-200/40" weight="fill" />
      <p className="text-sm font-semibold text-emerald-100">{inProgress ? "正在進行的微冒險" : "推薦的微冒險"}</p>
      <h2 tabIndex={-1} className="mt-2 max-w-md text-2xl font-black tracking-[-.02em] text-zinc-50 outline-none">{adventure.title}</h2>
      <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-200">{adventure.description}</p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs leading-5 text-zinc-300">
        <span data-testid="adventure-locations">地點：{adventure.locations.map((item) => adventureLocationLabels[item]).join("／")}</span>
        <span data-testid="adventure-times-of-day">時段：{adventure.timesOfDay.length === 3 ? "不限時段" : adventure.timesOfDay.map((item) => adventureTimeOfDayLabels[item]).join("／")}</span>
        <span data-testid="adventure-duration">約需 {Math.min(...adventure.times.map(Number))} 分鐘</span>
      </div>
      <RecommendationReasons reasons={displayedRecommendation.reasons} />
      <div className="mt-4 rounded-lg bg-zinc-950/35 p-3" role="status" data-testid="micro-adventure-status">
        <p className="text-sm font-bold text-emerald-100">{completed ? "今天已完成" : inProgress ? "冒險進行中" : "待開始"}</p>
        <p className="mt-1 text-xs leading-5 text-zinc-300">{completed ? "這次冒險的獎勵已記錄，可以換一個新冒險。" : inProgress ? "照著上方的任務內容行動，做完後再回來完成。進度已保留，也可以稍後繼續。" : "準備好了就開始，實際做完後再回來領取獎勵。"}</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button data-testid={inProgress || completed ? "complete-micro-adventure" : "start-micro-adventure"} type="button" onClick={inProgress ? finish : () => startMicroAdventure(adventure.id)} disabled={completed} className="min-h-11 rounded-xl bg-emerald-300 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60">{completed ? "今天已完成" : inProgress ? "完成這次冒險" : "開始冒險"}</button>
        {inProgress ? <button data-testid="cancel-micro-adventure" type="button" onClick={cancelMicroAdventure} className="min-h-11 rounded-xl border border-emerald-200/50 px-4 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/10">取消這次冒險</button> : <button type="button" onClick={() => setDisplayedAdventureId(getNextDisplayedAdventureId(recommendations, adventure.id))} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-200/50 px-4 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/10"><Shuffle className="size-4" />換一個</button>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => toggleFavoriteAdventure(adventure.id)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10"><Heart className="size-4 text-emerald-200" weight={state.favoriteAdventureIds.includes(adventure.id) ? "fill" : "regular"} />收藏</button>
        <button type="button" onClick={() => toggleSavedAdventure(adventure.id)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10"><BookmarkSimple className="size-4 text-emerald-200" weight={state.savedAdventureIds.includes(adventure.id) ? "fill" : "regular"} />稍後再做</button>
        {!inProgress ? <button type="button" onClick={() => { dismissAdventure(adventure.id); setDisplayedAdventureId(getNextDisplayedAdventureId(recommendations, adventure.id)); }} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10"><Prohibit className="size-4" />不適合現在</button> : null}
      </div>
    </section> : <section id="recommended-adventure" className="order-3 game-card p-5" role="status"><h2 className="text-lg font-bold text-zinc-50">目前沒有符合條件的活動</h2><p className="mt-2 text-sm text-zinc-300">試著增加可用時間，或放寬地點與時段。</p><button type="button" onClick={() => choose(mood, "60", "any", "any")} className="mt-4 min-h-11 rounded-xl bg-emerald-300 px-4 py-2 text-sm font-bold text-zinc-950">重設推薦條件</button></section>}
    <section className="order-7 game-card flex items-center gap-3 p-4"><CheckCircle className="size-5 text-emerald-200" weight="fill" /><p className="text-sm text-zinc-300">還有時間的話，可以再完成一個任務。</p><button type="button" onClick={() => onNavigate("quests")} className="ml-auto shrink-0 text-sm font-bold text-emerald-200 hover:text-emerald-100">查看任務</button></section>
  </main>;
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <div className="rounded-lg border border-white/10 bg-zinc-950/45 p-3"><div className="flex items-center gap-2 text-emerald-200">{icon}<p className="text-xs font-bold text-zinc-400">{label}</p></div><p className="mt-3 text-lg font-black text-zinc-50">{value}</p></div>; }
