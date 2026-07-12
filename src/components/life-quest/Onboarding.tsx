"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, MapPin } from "@phosphor-icons/react";
import { useLifeQuest } from "@/components/LifeQuestProvider";
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

export function Onboarding() {
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
