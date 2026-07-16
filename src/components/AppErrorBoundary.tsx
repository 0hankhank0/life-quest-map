"use client";

import { Component, type ReactNode } from "react";

export class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <main className="grid min-h-dvh place-items-center p-6"><section className="game-card max-w-md p-6 text-center"><h1 className="text-2xl font-black text-zinc-50">冒險暫時中斷</h1><p className="mt-3 text-sm leading-6 text-zinc-400">資料仍保留在這台裝置。重新整理頁面即可再試。</p><button type="button" onClick={() => window.location.reload()} className="mt-5 rounded-lg bg-emerald-300 px-4 py-3 font-bold text-zinc-950">重新整理</button></section></main>;
    }
    return this.props.children;
  }
}
