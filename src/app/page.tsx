"use client";

import { LifeQuestProvider } from "@/components/LifeQuestProvider";
import { LifeQuestShell } from "@/components/life-quest/LifeQuestShell";

export default function Page() {
  return (
    <LifeQuestProvider>
      <LifeQuestShell />
    </LifeQuestProvider>
  );
}
