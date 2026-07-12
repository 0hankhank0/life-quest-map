"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowClockwise,
  ArrowRight,
  Compass,
  DownloadSimple,
  MapPin,
  Package,
  Plus,
  Shield,
  Sparkle,
  Target,
  Trash,
  UploadSimple
} from "@phosphor-icons/react";
import { AchievementBadge } from "@/components/AchievementBadge";
import { BottomNav, type AppTab } from "@/components/BottomNav";
import { CharacterCard } from "@/components/CharacterCard";
import { LifeQuestProvider, useLifeQuest } from "@/components/LifeQuestProvider";
import { PageHeader } from "@/components/PageHeader";
import { QuestCard } from "@/components/QuestCard";
import { QuestForm } from "@/components/QuestForm";
import { StatCard } from "@/components/StatCard";
import {
  categoryLabels,
  focusOptions,
  lifeStageOptions,
  occupationLabels,
  occupationOptions,
  questTypeLabels,
  roleOptions,
  studentStageLabels,
  studentStageOptions
} from "@/data/labels";
import { mapLocations } from "@/data/defaults";
import { getOccupationQuestPack } from "@/data/questPacks";
import { getStrongestStat } from "@/lib/progression";
import { isToday } from "@/lib/utils";
import type {
  GrowthFocus,
  LifeStage,
  OccupationCategory,
  Quest,
  QuestCategory,
  QuestDraft,
  QuestType,
  Role,
  StudentStage
} from "@/types";

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

const statOrder: QuestCategory[] = [
  "learning",
  "fitness",
  "creativity",
  "social",
  "discipline",
  "exploration"
];

const questFilters: Array<QuestType | "all"> = ["all", "main", "side", "daily", "hidden", "map"];

type OccupationFilter = "all" | "mine" | OccupationCategory;

export default function Page() {
  return (
    <LifeQuestProvider>
      <LifeQuestShell />
    </LifeQuestProvider>
  );
}

function LifeQuestShell() {
  const { state, isHydrated } = useLifeQuest();
  const [activeTab, setActiveTab] = useState<AppTab>("home");

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  if (!state.profile) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-100">
      <main className="mx-auto min-h-[100dvh] w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        {activeTab === "home" ? <HomePanel onNavigate={setActiveTab} /> : null}
        {activeTab === "quests" ? <QuestGuild /> : null}
        {activeTab === "map" ? <MapPanel /> : null}
        {activeTab === "skills" ? <SkillTreePanel /> : null}
        {activeTab === "profile" ? <ProfilePanel /> : null}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

function LoadingScreen() {
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

function Onboarding() {
  const { onboard } = useLifeQuest();
  const [name, setName] = useState("");
  const [lifeStage, setLifeStage] = useState<LifeStage>("student");
  const [studentStage, setStudentStage] = useState<StudentStage>("senior_high");
  const [role, setRole] = useState<Role>("student");
  const [occupation, setOccupation] = useState<OccupationCategory>("general");
  const [customOccupationName, setCustomOccupationName] = useState("");
  const [occupationSuggestion, setOccupationSuggestion] = useState("");
  const [focuses, setFocuses] = useState<GrowthFocus[]>(["learning"]);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("請先為角色命名。");
      return;
    }

    if (lifeStage === "adult" && occupation === "custom" && !customOccupationName.trim()) {
      setError("請輸入你的自訂職業名稱。");
      return;
    }

    onboard({
      name,
      lifeStage,
      studentStage: lifeStage === "student" ? studentStage : undefined,
      role,
      occupation: lifeStage === "student" ? "student" : occupation,
      customOccupationName: lifeStage === "adult" ? customOccupationName : undefined,
      occupationSuggestion: lifeStage === "adult" ? occupationSuggestion : undefined,
      focuses
    });
  }

  function toggleFocus(focus: GrowthFocus) {
    setFocuses((current) => {
      if (current.includes(focus)) {
        return current.length === 1 ? current : current.filter((item) => item !== focus);
      }

      return [...current, focus];
    });
  }

  return (
    <main className="min-h-[100dvh] bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6">
      <div className="mx-auto grid min-h-[calc(100dvh-3rem)] max-w-5xl items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-100">
            <MapPin className="size-4" weight="fill" />
            Life Quest Map
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-black leading-tight text-zinc-50 sm:text-5xl">
              建立你的日常冒險角色
            </h1>
            <p className="max-w-xl text-base leading-7 text-zinc-300">
              把任務、技能、等級與地點串成一張可推進的人生地圖。
            </p>
          </div>
          <div className="map-preview-panel">
            {mapLocations.slice(0, 5).map((location, index) => (
              <span
                key={location.id}
                className="map-preview-node"
                style={{
                  left: `${18 + (index % 3) * 30}%`,
                  top: `${18 + Math.floor(index / 3) * 36}%`
                }}
              >
                {location.name}
              </span>
            ))}
          </div>
        </section>

        <form onSubmit={handleSubmit} className="game-card space-y-5 p-5 sm:p-6">
          <label className="block space-y-2">
            <span className="text-sm font-bold text-zinc-200">角色名稱</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="field-control"
            />
          </label>

          <fieldset className="space-y-3">
            <legend className="text-sm font-bold text-zinc-200">你現在在哪個階段？</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {lifeStageOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setLifeStage(option.value);
                    if (option.value === "student") {
                      setRole("student");
                      setOccupation("student");
                    } else {
                      setOccupation("general");
                    }
                  }}
                  className={`choice-tile ${lifeStage === option.value ? "choice-tile-active" : ""}`}
                >
                  <span className="font-black">{option.label}</span>
                  <span className="text-xs text-zinc-400">{option.description}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {lifeStage === "student" ? (
            <fieldset className="space-y-3">
              <legend className="text-sm font-bold text-zinc-200">學生階段</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {studentStageOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStudentStage(option.value)}
                    className={`choice-tile ${studentStage === option.value ? "choice-tile-active" : ""}`}
                  >
                    <span className="font-black">{option.label}</span>
                    <span className="text-xs text-zinc-400">{option.description}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          ) : (
            <fieldset className="space-y-3">
              <legend className="text-sm font-bold text-zinc-200">職業路線</legend>
              <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                {occupationOptions
                  .filter((option) => option.value !== "student")
                  .map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setOccupation(option.value)}
                      className={`choice-tile ${occupation === option.value ? "choice-tile-active" : ""}`}
                    >
                      <span className="font-black">{option.label}</span>
                      <span className="text-xs text-zinc-400">{option.description}</span>
                    </button>
                  ))}
              </div>
              {occupation === "custom" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-zinc-200">其他職業名稱</span>
                    <input
                      value={customOccupationName}
                      onChange={(event) => setCustomOccupationName(event.target.value)}
                      className="field-control"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-zinc-200">
                      希望我們開發哪種職業任務包？
                    </span>
                    <input
                      value={occupationSuggestion}
                      onChange={(event) => setOccupationSuggestion(event.target.value)}
                      className="field-control"
                    />
                  </label>
                </div>
              ) : null}
            </fieldset>
          )}

          <fieldset className="space-y-3">
            <legend className="text-sm font-bold text-zinc-200">玩家風格</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {roleOptions
                .filter((option) => lifeStage === "adult" || option.value !== "athlete")
                .map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    className={`choice-tile ${role === option.value ? "choice-tile-active" : ""}`}
                  >
                    <span className="font-black">{option.label}</span>
                    <span className="text-xs text-zinc-400">{option.description}</span>
                  </button>
                ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-bold text-zinc-200">主要成長方向</legend>
            <p className="text-xs text-zinc-400">可複選，至少保留一個方向。</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {focusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleFocus(option.value)}
                  className={`choice-tile ${focuses.includes(option.value) ? "choice-tile-active" : ""}`}
                >
                  <span className="font-black">{option.label}</span>
                  <span className="text-xs text-zinc-400">{option.description}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {error ? <p className="text-sm font-bold text-red-200">{error}</p> : null}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-300 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-emerald-200 active:translate-y-px"
          >
            進入任務地圖
            <ArrowRight className="size-4" weight="bold" />
          </button>
        </form>
      </div>
    </main>
  );
}

function HomePanel({ onNavigate }: { onNavigate: (tab: AppTab) => void }) {
  const { state, completeQuest } = useLifeQuest();
  const profile = state.profile;

  if (!profile) {
    return null;
  }

  const pendingQuests = state.quests.filter((quest) => quest.status === "pending");
  const mainQuest =
    pendingQuests.find((quest) => quest.type === "main") ?? pendingQuests[0] ?? null;
  const sideQuests = pendingQuests
    .filter((quest) => quest.id !== mainQuest?.id && quest.type !== "hidden")
    .slice(0, 3);
  const completedToday = state.quests.filter((quest) => isToday(quest.completedAt)).length;
  const totalToday = Math.max(
    completedToday + pendingQuests.filter((quest) => quest.type !== "hidden").length,
    1
  );

  return (
    <div className="space-y-5">
      <CharacterCard
        profile={profile}
        stats={state.stats}
        completedToday={completedToday}
        totalToday={totalToday}
      />

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Main Quest
              </p>
              <h1 className="mt-1 text-3xl font-black text-zinc-50">今日主線</h1>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("quests")}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm font-bold text-zinc-200 transition hover:border-emerald-300/30 active:translate-y-px"
            >
              任務公會
            </button>
          </div>

          {mainQuest ? (
            <QuestCard quest={mainQuest} featured onComplete={completeQuest} />
          ) : (
            <EmptyQuestState onNavigate={onNavigate} />
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            {sideQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onComplete={completeQuest} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <section className="game-card p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-zinc-50">技能成長</h2>
                <p className="mt-1 text-sm text-zinc-400">完成任務後即時提升能力值</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("skills")}
                className="rounded-lg bg-emerald-300 px-3 py-2 text-xs font-black text-zinc-950 transition hover:bg-emerald-200 active:translate-y-px"
              >
                技能樹
              </button>
            </div>
            <div className="grid gap-3">
              {statOrder.slice(0, 4).map((category) => (
                <StatCard
                  key={category}
                  category={category}
                  value={state.stats[category]}
                  compact
                />
              ))}
            </div>
          </section>

          <MiniMapPanel onNavigate={onNavigate} />
        </div>
      </section>
    </div>
  );
}

function EmptyQuestState({ onNavigate }: { onNavigate: (tab: AppTab) => void }) {
  return (
    <section className="game-card p-6">
      <Target className="mb-3 size-8 text-emerald-200" weight="duotone" />
      <h2 className="text-2xl font-black text-zinc-50">今日主線已清空</h2>
      <p className="mt-2 text-sm text-zinc-400">新增一張主線任務牌，讓今天有明確推進方向。</p>
      <button
        type="button"
        onClick={() => onNavigate("quests")}
        className="mt-4 rounded-lg bg-emerald-300 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-emerald-200 active:translate-y-px"
      >
        新增任務
      </button>
    </section>
  );
}

function MiniMapPanel({ onNavigate }: { onNavigate: (tab: AppTab) => void }) {
  const { state } = useLifeQuest();

  return (
    <section className="game-card overflow-hidden p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-zinc-50">任務地圖</h2>
          <p className="mt-1 text-sm text-zinc-400">
            {state.mapCompletions.length} / {mapLocations.length} 地點已探索
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("map")}
          className="grid size-10 place-items-center rounded-lg border border-emerald-300/20 bg-emerald-300/10 text-emerald-100 transition hover:bg-emerald-300 hover:text-zinc-950 active:translate-y-px"
          aria-label="前往地圖"
        >
          <Compass className="size-5" weight="bold" />
        </button>
      </div>
      <div className="map-preview-panel h-56">
        {mapLocations.map((location, index) => {
          const completed = state.mapCompletions.includes(location.id);

          return (
            <span
              key={location.id}
              className={`map-preview-node ${completed ? "map-preview-node-completed" : ""}`}
              style={{
                left: `${16 + (index % 3) * 31}%`,
                top: `${16 + Math.floor(index / 3) * 34}%`
              }}
            >
              {location.name}
            </span>
          );
        })}
      </div>
    </section>
  );
}

function QuestGuild() {
  const {
    state,
    addQuest,
    addOccupationQuestPack,
    updateQuest,
    deleteQuest,
    completeQuest
  } = useLifeQuest();
  const [filter, setFilter] = useState<QuestType | "all">("all");
  const [occupationFilter, setOccupationFilter] = useState<OccupationFilter>("all");
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [packMessage, setPackMessage] = useState("");
  const currentOccupation = state.profile?.occupation ?? "general";
  const currentPack = getOccupationQuestPack(currentOccupation);
  const currentOccupationName =
    currentOccupation === "custom"
      ? state.profile?.customOccupationName || "通用冒險者"
      : occupationLabels[currentOccupation];

  const filteredQuests = useMemo(() => {
    const byType =
      filter === "all" ? state.quests : state.quests.filter((quest) => quest.type === filter);

    if (occupationFilter === "all") {
      return byType;
    }

    if (occupationFilter === "mine") {
      return byType.filter(
        (quest) =>
          quest.occupation === state.profile?.occupation || quest.occupation === "general"
      );
    }

    return byType.filter((quest) => quest.occupation === occupationFilter);
  }, [filter, occupationFilter, state.profile?.occupation, state.quests]);

  function handleSubmit(draft: QuestDraft) {
    if (editingQuest) {
      updateQuest(editingQuest.id, draft);
    } else {
      addQuest(draft);
    }

    setEditingQuest(null);
    setIsFormOpen(false);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Quest Guild"
        title="任務公會"
        description="新增、編輯與完成任務牌。主線推進等級，支線累積技能。"
        action={
          <button
            type="button"
            onClick={() => {
              setEditingQuest(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-300 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-emerald-200 active:translate-y-px"
          >
            <Plus className="size-4" weight="bold" />
            新增任務
          </button>
        }
      />

      {currentPack ? (
        <section className="game-card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid size-12 shrink-0 place-items-center rounded-lg border border-emerald-300/20 bg-emerald-300/10">
                <Package className="size-6 text-emerald-200" weight="duotone" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-200">職業任務包</p>
                <h2 className="mt-1 text-xl font-black text-zinc-50">
                  {currentOccupationName}路線
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                  {currentPack.description}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const addedCount = addOccupationQuestPack(currentOccupation);
                setPackMessage(
                  addedCount > 0
                    ? `已加入 ${addedCount} 張職業任務牌。`
                    : "這個職業任務包已經加入過了。"
                );
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-300 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-emerald-200 active:translate-y-px"
            >
              <Plus className="size-4" weight="bold" />
              加入任務包
            </button>
          </div>
          {packMessage ? (
            <p className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm font-bold text-emerald-100">
              {packMessage}
            </p>
          ) : null}
        </section>
      ) : null}

      {isFormOpen ? (
        <QuestForm
          quest={editingQuest}
          onSubmit={handleSubmit}
          onCancel={() => {
            setEditingQuest(null);
            setIsFormOpen(false);
          }}
        />
      ) : null}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {questFilters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-bold transition active:translate-y-px ${
              filter === item
                ? "border-emerald-300 bg-emerald-300 text-zinc-950"
                : "border-white/10 text-zinc-300 hover:border-emerald-300/30"
            }`}
          >
            {item === "all" ? "全部" : questTypeLabels[item]}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setOccupationFilter("all")}
          className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-bold transition active:translate-y-px ${
            occupationFilter === "all"
              ? "border-emerald-300 bg-emerald-300 text-zinc-950"
              : "border-white/10 text-zinc-300 hover:border-emerald-300/30"
          }`}
        >
          全部職業
        </button>
        <button
          type="button"
          onClick={() => setOccupationFilter("mine")}
          className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-bold transition active:translate-y-px ${
            occupationFilter === "mine"
              ? "border-emerald-300 bg-emerald-300 text-zinc-950"
              : "border-white/10 text-zinc-300 hover:border-emerald-300/30"
          }`}
        >
          我的路線
        </button>
        {occupationOptions
          .filter((option) => option.value !== "custom")
          .map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setOccupationFilter(option.value)}
              className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-bold transition active:translate-y-px ${
                occupationFilter === option.value
                  ? "border-emerald-300 bg-emerald-300 text-zinc-950"
                  : "border-white/10 text-zinc-300 hover:border-emerald-300/30"
              }`}
            >
              {option.label}
            </button>
          ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {filteredQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onComplete={completeQuest}
            onEdit={(target) => {
              setEditingQuest(target);
              setIsFormOpen(true);
            }}
            onDelete={deleteQuest}
          />
        ))}
      </div>

      {filteredQuests.length === 0 ? (
        <section className="game-card p-6 text-center">
          <p className="font-bold text-zinc-200">這個分類目前沒有任務牌。</p>
        </section>
      ) : null}
    </div>
  );
}

function MapPanel() {
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

function SkillTreePanel() {
  const { state } = useLifeQuest();

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Skill Tree"
        title="技能樹"
        description="每次完成任務，對應能力值都會成長。地圖任務會提升探索力。"
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statOrder.map((category) => (
          <StatCard key={category} category={category} value={state.stats[category]} />
        ))}
      </section>
      <section className="game-card p-5">
        <div className="flex items-center gap-3">
          <Sparkle className="size-6 text-emerald-200" weight="fill" />
          <div>
            <h2 className="text-xl font-black text-zinc-50">成長規則</h2>
            <p className="mt-1 text-sm text-zinc-400">
              完成任務可獲得 EXP，並讓對應能力值增加 2 點。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfilePanel() {
  const { state, resetAppData, restoreDemoData, exportData, importData } = useLifeQuest();
  const profile = state.profile;
  const importInputRef = useRef<HTMLInputElement>(null);
  const [dataMessage, setDataMessage] = useState("");

  if (!profile) {
    return null;
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
            onClick={() => {
              const blob = new Blob([exportData()], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = `life-quest-map-${new Date().toISOString().slice(0, 10)}.json`;
              anchor.click();
              URL.revokeObjectURL(url);
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
