import SideQuestsIndex from "@/components/pages/SideQuestsIndex";
import { METADATA } from "@/config/seo.config";

export const metadata = METADATA.sideQuests;

export default function SideQuestsPage() {
  return <SideQuestsIndex />;
}
