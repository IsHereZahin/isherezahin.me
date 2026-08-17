import SideQuestsIndex from "@/components/pages/side-quests";
import { METADATA } from "@/config/seo.config";
import { getSideQuestsContent } from "@/data/pages/side-quests";
import { getDictionary } from "@/i18n";
import { toLocale } from "@/i18n/config";

// Fully static: all content comes from src/data + src/i18n — prerendered per locale.
export const dynamic = "force-static";

export const metadata = METADATA.sideQuests;

export default async function SideQuestsPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(toLocale(locale));

  return <SideQuestsIndex content={getSideQuestsContent(dict)} />;
}
