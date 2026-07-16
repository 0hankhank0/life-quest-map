"use client";

import { useEffect, useState } from "react";

export function PwaRegistrar() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;

    let hadController = Boolean(navigator.serviceWorker.controller);
    let registration: ServiceWorkerRegistration | null = null;
    let watchInstallingWorker: (() => void) | null = null;
    const onControllerChange = () => {
      if (hadController) setUpdateAvailable(true);
      hadController = true;
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    navigator.serviceWorker.register("/sw.js")
      .then((nextRegistration) => {
        registration = nextRegistration;
        watchInstallingWorker = () => {
          const worker = nextRegistration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) setUpdateAvailable(true);
          });
        };
        nextRegistration.addEventListener("updatefound", watchInstallingWorker);
        watchInstallingWorker();
        return nextRegistration.update();
      })
      .catch(() => undefined);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      if (registration && watchInstallingWorker) registration.removeEventListener("updatefound", watchInstallingWorker);
    };
  }, []);

  if (!updateAvailable) return null;
  return <aside role="status" aria-live="polite" className="fixed inset-x-4 top-3 z-[60] mx-auto flex max-w-xl items-center justify-between gap-3 rounded-lg border border-emerald-300/35 bg-zinc-900 px-4 py-3 shadow-xl"><p className="text-sm font-bold text-emerald-100">新版已就緒，重新整理以套用最新內容。</p><button type="button" onClick={() => window.location.reload()} className="shrink-0 rounded-md bg-emerald-300 px-3 py-2 text-sm font-black text-zinc-950">重新整理</button></aside>;
}
