"use client";

import type { ReactNode } from "react";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { LifeQuestProvider } from "@/components/LifeQuestProvider";
import { ToastProvider } from "@/components/ToastProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return <AppErrorBoundary><LifeQuestProvider><ToastProvider>{children}</ToastProvider></LifeQuestProvider></AppErrorBoundary>;
}
