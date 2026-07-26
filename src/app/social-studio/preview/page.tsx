import { SocialPostCard, type SocialCardFormat } from "@/components/SocialPostCard";
import { adventureQuotes } from "@/data/adventureQuotes";
import { socialMissions } from "@/data/socialMissions";

export const metadata = { title: "Life Quest Map 社群貼文預覽", robots: { index: false, follow: false } };

export default async function SocialPostPreview({ searchParams }: { searchParams: Promise<{ type?: string; quote?: string; mission?: string; format?: string; source?: string }> }) {
  const params = await searchParams;
  const format: SocialCardFormat = params.format === "square" ? "square" : params.format === "threads-wide" || params.format === "threads" ? "threads-wide" : "instagram-portrait";
  if (params.type === "mission") {
    const mission = socialMissions.find((item) => item.id === params.mission) ?? socialMissions[0];
    return <main className="social-post-export-page"><SocialPostCard mission={mission} format={format} /></main>;
  }
  const quote = adventureQuotes.find((item) => item.id === params.quote && item.enabled) ?? adventureQuotes.find((item) => item.enabled) ?? adventureQuotes[0];
  return <main className="social-post-export-page"><SocialPostCard quote={quote} format={format} showSource={params.source !== "0"} /></main>;
}
