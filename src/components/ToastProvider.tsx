"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type ToastTone = "success" | "error" | "info";
interface Toast { id: number; message: string; tone: ToastTone; }
const ToastContext = createContext<{ showToast: (message: string, tone?: ToastTone) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string, tone: ToastTone = "info") => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4500);
  }, []);
  const value = useMemo(() => ({ showToast }), [showToast]);
  return <ToastContext.Provider value={value}>{children}<div className="pointer-events-none fixed inset-x-4 bottom-24 z-50 mx-auto flex max-w-md flex-col gap-2 lg:bottom-6">{toasts.map((toast) => <div key={toast.id} role="status" className={`rounded-lg border px-4 py-3 text-sm font-bold shadow-xl ${toast.tone === "error" ? "border-red-300/30 bg-red-950 text-red-100" : toast.tone === "success" ? "border-emerald-300/30 bg-emerald-950 text-emerald-100" : "border-white/15 bg-zinc-900 text-zinc-100"}`}>{toast.message}</div>)}</div></ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
