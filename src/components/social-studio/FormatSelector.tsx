import type { SocialCardFormat } from "@/components/SocialPostCard";

export const socialCardFormats: ReadonlyArray<{ value: SocialCardFormat; label: string; detail: string; ratio: string }> = [
  { value: "instagram-portrait", label: "Instagram 直式", detail: "1080 × 1350", ratio: "4 / 5" },
  { value: "square", label: "正方形", detail: "1080 × 1080", ratio: "1 / 1" },
  { value: "threads-wide", label: "Threads 寬版", detail: "1080 × 810", ratio: "4 / 3" },
];

export function FormatSelector({ value, onChange }: { value: SocialCardFormat; onChange: (value: SocialCardFormat) => void }) {
  return <div className="social-format-controls" role="group" aria-label="圖卡尺寸">{socialCardFormats.map((format) => <button key={format.value} type="button" aria-pressed={format.value === value} onClick={() => onChange(format.value)} className={`social-format-button ${format.value === value ? "social-format-button--selected" : ""}`}><span>{format.label}</span><small>{format.detail}</small></button>)}</div>;
}
