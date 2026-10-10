"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, MapPin } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { useAuth } from "@/components/AuthProvider";
import { mapLocations } from "@/data/defaults";
import {
  focusOptions,
  lifeStageOptions,
  occupationOptions,
  roleOptions,
  studentStageOptions
} from "@/data/labels";
import type {
  GrowthFocus,
  LifeStage,
  OccupationCategory,
  Role,
  StudentStage
} from "@/types";

export function Onboarding({ editing = false, onComplete, onCancel }: { editing?: boolean; onComplete?: () => void; onCancel?: () => void }) {
  const router = useRouter();
  const { state, onboard, startDirectExperience } = useLifeQuest();
  const { user } = useAuth();
  const profile = editing ? state.profile : null;
  const [name, setName] = useState(() => profile?.name ?? String(user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? ""));
  const [lifeStage, setLifeStage] = useState<LifeStage>(profile?.lifeStage ?? "student");
  const [studentStage, setStudentStage] = useState<StudentStage>(profile?.studentStage ?? "senior_high");
  const [role, setRole] = useState<Role>(profile?.role ?? "student");
  const [occupation, setOccupation] = useState<OccupationCategory>(profile?.occupation ?? "general");
  const [customOccupationName, setCustomOccupationName] = useState(profile?.customOccupationName ?? "");
  const [occupationSuggestion, setOccupationSuggestion] = useState(() => state.occupationSuggestions.findLast((item) => item.name === profile?.customOccupationName)?.note ?? "");
  const [focuses, setFocuses] = useState<GrowthFocus[]>(profile?.focuses ?? ["learning"]);
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
    onComplete?.();
  }

  function toggleFocus(focus: GrowthFocus) {
    setFocuses((current) => {
      if (current.includes(focus)) {
        return current.length === 1 ? current : current.filter((item) => item !== focus);
      }

      return [...current, focus];
    });
  }

  const Container = editing ? "div" : "main";

  return (
    <Container className={editing ? "mx-auto max-w-3xl" : "min-h-[100dvh] bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6"}>
      {user && !editing ? <p className="mx-auto mb-3 max-w-5xl rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">已使用 {user.app_metadata.provider === "facebook" ? "Facebook" : "Google"} 登入：{user.email}</p> : null}
      <div className={editing ? "space-y-5" : "mx-auto grid min-h-[calc(100dvh-3rem)] max-w-5xl items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]"}>
        {!editing ? <section className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-100">
            <MapPin className="size-4" weight="fill" />
            Life Quest Map
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <button type="button" data-testid="direct-experience" aria-describedby="direct-experience-description" onClick={() => { startDirectExperience(); router.push("/"); }} className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-emerald-200 sm:w-auto">
              直接體驗
              <ArrowRight className="size-4" weight="bold" />
            </button>
            <div id="direct-experience-description" className="space-y-1 text-sm leading-6">
              <p className="text-zinc-300">選擇直接體驗可略過設定與教學。</p>
              <p className="text-zinc-400">先用預設角色開始探索，角色、階段、風格與成長方向可在角色頁補填，教學也能稍後觀看。</p>
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-black leading-tight text-zinc-50 sm:text-5xl">
              建立你的日常冒險角色
            </h1>
            <p className="max-w-xl text-base leading-7 text-zinc-300">
              用任務、技能、等級與地點整理你的日常進度。
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
        </section> : null}

        <form onSubmit={handleSubmit} className="game-card space-y-5 p-5 sm:p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-zinc-50">{editing ? "角色設定" : "先設定角色"}</h2>
            <p className="text-sm leading-6 text-zinc-400">{editing ? "調整角色資料，已累積的 EXP、任務與冒險紀錄都會保留。" : "也可以先完成設定，再進入任務地圖；完成設定後會開啟新手教學。"}</p>
          </div>
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
              {roleOptions.map((option) => (
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

          <div className="space-y-1 rounded-lg border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-3 text-xs leading-5 text-zinc-300">
            {editing ? <p>儲存後即可繼續冒險，教學可從角色頁開啟。</p> : null}
            <p className="text-zinc-400">資料只保存在目前裝置，不會自動上傳；之後可在角色頁匯出備份。</p>
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-300 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-emerald-200 active:translate-y-px"
          >
            {editing ? "儲存角色設定" : "進入任務地圖"}
            <ArrowRight className="size-4" weight="bold" />
          </button>
          {editing ? <button type="button" onClick={onCancel} className="min-h-11 w-full rounded-lg border border-white/15 px-4 py-3 text-sm font-bold text-zinc-300 hover:bg-white/5">稍後再填</button> : null}
        </form>
      </div>
    </Container>
  );
}
