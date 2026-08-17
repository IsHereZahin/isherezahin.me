import AttributionIndex from "@/components/pages/attribution";
import { METADATA } from "@/config/seo.config";
import { getAttributionContent } from "@/data/pages/attribution";
import { getDictionary } from "@/i18n";
import { toLocale } from "@/i18n/config";

// Fully static: all content comes from src/data + src/i18n — prerendered per locale.
export const dynamic = "force-static";

export const metadata = METADATA.attribution;

export default async function AttributionPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(toLocale(locale));

  return <AttributionIndex content={getAttributionContent(dict)} />;
}
