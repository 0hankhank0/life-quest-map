"use client";

import { useRef, useState, type ChangeEvent } from "react";
import {
  ArrowClockwise,
  DownloadSimple,
  Shield,
  Trash,
  UploadSimple
} from "@phosphor-icons/react";
import { AchievementBadge } from "@/components/AchievementBadge";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { useToast } from "@/components/ToastProvider";
import { HistoryPanel } from "@/components/life-quest/HistoryPanel";
import { PageHeader } from "@/components/PageHeader";
import { categoryLabels, occupationLabels, roleOptions, studentStageLabels } from "@/data/labels";
import { getStrongestStat } from "@/lib/progression";
import { calendarDateKey } from "@/lib/utils";

export function ProfilePanel() {
  const { state, resetAppData, restoreDemoData, exportData, importData } = useLifeQuest();
  const { showToast } = useToast();
  const profile = state.profile;
  const importInputRef = useRef<HTMLInputElement>(null);
  const [dataMessage, setDataMessage] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);

  if (!profile) {
    return null;
  }

  if (historyOpen) {
    return <HistoryPanel state={state} onBack={() => setHistoryOpen(false)} />;
  }

  const completedQuests = state.quests.filter((quest) => quest.status === "completed");
  const strongestStat = getStrongestStat(state.stats);
  const unlockedAchievements = state.achievements.filter((achievement) => achievement.unlocked);
  const occupationName =
    profile.lifeStage === "student"
      ? `${profile.studentStage ? studentStageLabels[profile.studentStage] : ""}學生`
      : profile.occupation === "custom"
      ? profile.customOccupationName || "自訂職業"
      : occupationLabels[profile.occupation];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Hero Profile"
        title="角色頁"
        description="查看你的等級、總 EXP、最強能力、稱號與成就徽章。"
      />

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="game-card p-5">
          <div className="flex items-start gap-4">
            <div className="grid size-16 place-items-center rounded-2xl border border-emerald-300/25 bg-emerald-300/10">
              <Shield className="size-9 text-emerald-200" weight="duotone" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-200">Lv {profile.level}</p>
              <h2 className="mt-1 text-3xl font-black text-zinc-50">{profile.name}</h2>
              <p className="mt-2 text-sm text-zinc-400">
                {roleOptions.find((option) => option.value === profile.role)?.label}
              </p>
              <p className="mt-1 text-sm font-bold text-emerald-100">
                {occupationName}路線
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <ProfileMetric label="總 EXP" value={profile.exp} />
            <ProfileMetric label="完成任務" value={completedQuests.length} />
            <ProfileMetric label="最強能力" value={categoryLabels[strongestStat]} />
            <ProfileMetric label="職業路線" value={occupationName} />
          </div>
        </div>

        <div className="game-card p-5">
          <h2 className="text-xl font-black text-zinc-50">已解鎖稱號</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {unlockedAchievements.length > 0 ? (
              unlockedAchievements.map((achievement) => (
                <span
                  key={achievement.id}
                  className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm font-bold text-emerald-100"
                >
                  {achievement.title}
                </span>
              ))
            ) : (
              <p className="text-sm text-zinc-400">完成第一個任務後會解鎖稱號。</p>
            )}
          </div>
        </div>
      </section>

      <section className="game-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-zinc-50">冒險歷史</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-400">查看近 30 天進度、成長類別與生命片段時間軸。</p>
        </div>
        <button type="button" onClick={() => setHistoryOpen(true)} className="shrink-0 rounded-lg border border-emerald-300/30 px-4 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/10 active:translate-y-px">
          開啟歷史
        </button>
      </section>

      {state.occupationSuggestions.length > 0 ? (
        <section className="game-card p-5">
          <h2 className="text-xl font-black text-zinc-50">冷門職業建議</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {state.occupationSuggestions.map((suggestion) => (
              <article
                key={suggestion.id}
                className="rounded-lg border border-white/10 bg-zinc-950/50 p-4"
              >
                <p className="font-black text-zinc-50">{suggestion.name}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {suggestion.note || "尚未填寫任務包建議"}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="game-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-xl font-black text-zinc-50">資料管理</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              匯出目前角色資料，或匯入先前備份。恢復 Demo 會保留角色，重置角色會回到初始設定。
            </p>
          </div>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={async (event: ChangeEvent<HTMLInputElement>) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }

              const rawJson = await file.text();
              const result = importData(rawJson);
              setDataMessage(result.message);
              event.currentTarget.value = "";
            }}
          />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            data-testid="export-data"
            onClick={() => {
              const blob = new Blob([exportData()], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = `life-quest-map-${calendarDateKey()}.json`;
              anchor.click();
              URL.revokeObjectURL(url);
              showToast("資料已匯出，可安全備份。", "success");
              setDataMessage("已匯出目前資料。");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-zinc-100 transition hover:border-emerald-300/30 active:translate-y-px"
          >
            <DownloadSimple className="size-4" weight="bold" />
            匯出資料
          </button>
          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-zinc-100 transition hover:border-emerald-300/30 active:translate-y-px"
          >
            <UploadSimple className="size-4" weight="bold" />
            匯入資料
          </button>
          <button
            type="button"
            onClick={() => {
              if (!window.confirm("恢復 Demo 會重建任務、能力值、成就與地圖進度。")) {
                return;
              }
              restoreDemoData();
              setDataMessage("已恢復 Demo 任務，角色資料已保留。");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-zinc-100 transition hover:border-emerald-300/30 active:translate-y-px"
          >
            <ArrowClockwise className="size-4" weight="bold" />
            恢復 Demo
          </button>
          <button
            type="button"
            onClick={() => {
              if (!window.confirm("重置角色會清空目前資料並回到初始設定。")) {
                return;
              }
              resetAppData();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300/20 px-4 py-3 text-sm font-bold text-red-100 transition hover:border-red-300/50 active:translate-y-px"
          >
            <Trash className="size-4" weight="bold" />
            重置角色
          </button>
        </div>

        {dataMessage ? (
          <p className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm font-bold text-emerald-100">
            {dataMessage}
          </p>
        ) : null}
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {state.achievements.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </section>
    </div>
  );
}

function ProfileMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950/50 p-4">
      <p className="text-2xl font-black text-zinc-50">{value}</p>
      <p className="mt-1 text-xs text-zinc-400">{label}</p>
    </div>
  );
}
