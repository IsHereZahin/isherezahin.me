import UsesIndex from "@/components/pages/uses";
import { METADATA } from "@/config/seo.config";
import { getUsesContent } from "@/data/pages/uses";
import { getDictionary } from "@/i18n";
import { toLocale } from "@/i18n/config";

// Fully static: all content comes from src/data + src/i18n — prerendered per locale.
export const dynamic = "force-static";

export const metadata = METADATA.uses;

export default async function UsesPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(toLocale(locale));

  return <UsesIndex content={getUsesContent(dict)} />;
}
