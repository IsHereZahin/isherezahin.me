import SideQuestsIndex from "@/components/pages/side-quests";
import { METADATA } from "@/config/seo.config";

// Fully static: all content comes from src/data — prerendered at build time.
export const dynamic = "force-static";

export const metadata = METADATA.sideQuests;

export default function SideQuestsPage() {
  return <SideQuestsIndex />;
}
