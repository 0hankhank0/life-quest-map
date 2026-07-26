import type { Metadata } from "next";

export const metadata: Metadata = { title: "隱私說明", description: "Life Quest Map 的登入、遊戲資料與定位使用說明。" };

export default function PrivacyPage() {
  return <main className="mx-auto min-h-dvh max-w-3xl bg-zinc-950 px-6 py-12 text-zinc-100"><h1 className="text-3xl font-black">隱私說明</h1><div className="mt-8 space-y-6 leading-7 text-zinc-300"><p>Life Quest Map 可在訪客模式下使用，資料保存在你的瀏覽器。登入後，會以 Supabase 帳號專屬存檔保存遊戲進度，並保留這台裝置的離線快取。</p><p>Google OAuth 僅用於登入身分驗證；不要求 Drive、Calendar 或 Contacts 權限。定位只會在你主動使用定位功能時取得，不會背景追蹤，也不會寫入遊戲存檔。</p><p>你可在個人檔案匯出 JSON 備份。若要刪除雲端帳號資料，請以登入帳號與需求說明聯絡專案維護者；在資料刪除功能推出前，維護者會依 Supabase 的帳號與資料刪除程序處理。</p><p>本專案不使用分析追蹤。回報問題或聯絡維護者請使用 <a className="text-emerald-200 underline" href="https://github.com/0hankhank0/life-quest-map/issues">GitHub Issues</a>。</p></div></main>;
}
