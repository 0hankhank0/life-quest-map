"use client";

import { useEffect } from "react";
import { GoogleLogo, Shield } from "@phosphor-icons/react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";

export function AuthEntry() {
  const { isConfigured, googleEnabled, signInWithGoogle, continueAsGuest } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("auth_error");
    if (!error) return;
    showToast(error === "auth_not_configured" ? "登入尚未設定，請先檢查環境變數。" : "登入未完成，請再試一次。", "error");
    window.history.replaceState({}, "", window.location.pathname);
  }, [showToast]);

  async function beginGoogleSignIn() {
    try {
      await signInWithGoogle();
    } catch {
      showToast("登入無法開始，請確認 Supabase 與 Google OAuth 設定。", "error");
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-zinc-950 px-4 text-zinc-100">
      <section className="w-full max-w-lg rounded-3xl border border-emerald-300/20 bg-zinc-900/80 p-7 shadow-2xl shadow-emerald-950/30 sm:p-10">
        <div className="grid size-14 place-items-center rounded-2xl bg-emerald-300/15 text-emerald-200"><Shield size={32} weight="duotone" /></div>
        <p className="mt-6 text-sm font-black tracking-[0.2em] text-emerald-200">LIFE QUEST</p>
        <h1 className="mt-2 text-3xl font-black">開始你的冒險</h1>
        <p className="mt-3 leading-7 text-zinc-400">登入或以訪客身分開始使用。遊戲進度目前仍保存在這台裝置；之後可隨時在個人檔案登出。</p>
        <div className="mt-7 grid gap-3">
          {googleEnabled ? <button type="button" onClick={() => void beginGoogleSignIn()} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-emerald-300 px-4 font-black text-emerald-950 transition hover:bg-emerald-200"><GoogleLogo size={20} weight="bold" />使用 Google 登入</button> : null}
          <button type="button" onClick={continueAsGuest} className="min-h-12 rounded-xl border border-emerald-300/25 px-4 font-black text-emerald-100 transition hover:bg-emerald-300/10">先以訪客身分繼續</button>
        </div>
        {!isConfigured ? <p className="mt-5 rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-sm text-amber-100">登入尚未設定。你仍可先以訪客身分開始。</p> : null}
        <p className="mt-6 text-xs leading-5 text-zinc-500">登入僅使用基本身分資訊，不會要求 Drive、Calendar 或 Contacts 權限。</p>
      </section>
    </main>
  );
}
