"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardText, House, MapTrifold, TreeStructure, UserCircle } from "@phosphor-icons/react";

const navItems = [{ href: "/", label: "首頁", Icon: House }, { href: "/quests", label: "任務", Icon: ClipboardText }, { href: "/map", label: "地圖", Icon: MapTrifold }, { href: "/skills", label: "技能", Icon: TreeStructure }, { href: "/profile", label: "檔案", Icon: UserCircle }] as const;

export function BottomNav() {
  const pathname = usePathname();
  return <nav aria-label="行動版主要導覽" className="fixed inset-x-0 bottom-0 z-30 border-t border-emerald-300/15 bg-zinc-950/90 px-3 py-2 backdrop-blur-xl lg:hidden"><div className="mx-auto grid max-w-xl grid-cols-5 gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">{navItems.map(({ href, label, Icon }) => { const active = pathname === href; return <Link key={href} href={href} aria-label={label} aria-current={active ? "page" : undefined} className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-bold transition ${active ? "bg-emerald-300 text-zinc-950 shadow-[0_0_18px_rgba(52,211,153,0.28)]" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"}`}><Icon className="size-5" weight={active ? "fill" : "duotone"} /><span>{label}</span></Link>; })}</div></nav>;
}
