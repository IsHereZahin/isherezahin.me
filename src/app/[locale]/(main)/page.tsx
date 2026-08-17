import HomeIndex from "@/components/pages/home";
import { METADATA } from "@/config/seo.config";
import { getHomeContent } from "@/data/pages/home";
import { getDictionary } from "@/i18n";
import { toLocale } from "@/i18n/config";

export const metadata = METADATA.home;

export default async function App({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(toLocale(locale));

  return <HomeIndex content={getHomeContent(dict)} />;
}
