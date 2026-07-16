"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardText, ClockCounterClockwise, House, MapTrifold, TreeStructure, UserCircle } from "@phosphor-icons/react";

export const navItems = [
  { href: "/", label: "首頁", Icon: House }, { href: "/quests", label: "任務", Icon: ClipboardText }, { href: "/map", label: "地圖", Icon: MapTrifold }, { href: "/skills", label: "技能", Icon: TreeStructure }, { href: "/history", label: "歷史", Icon: ClockCounterClockwise }, { href: "/profile", label: "檔案", Icon: UserCircle }
] as const;

export function DesktopNav() {
  const pathname = usePathname();
  return <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 border-r border-emerald-300/15 bg-zinc-950/80 px-4 py-6 backdrop-blur-xl lg:block"><Link href="/" className="mb-8 block rounded-lg px-3 py-2"><p className="text-xs font-bold tracking-[.18em] text-emerald-200">LIFE QUEST</p><p className="mt-1 text-xl font-black text-zinc-50">冒險地圖</p></Link><nav aria-label="主要導覽" className="space-y-1">{navItems.map(({ href, label, Icon }) => { const active = pathname === href; return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition ${active ? "bg-emerald-300 text-zinc-950" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"}`}><Icon className="size-5" weight={active ? "fill" : "duotone"} />{label}</Link>; })}</nav></aside>;
}
