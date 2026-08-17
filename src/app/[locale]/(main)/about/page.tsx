import AboutIndex from "@/components/pages/about";
import { ProfilePageJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { METADATA, getBreadcrumbs } from "@/config/seo.config";
import { getAboutContent } from "@/data/pages/about";
import { getDictionary } from "@/i18n";
import { toLocale } from "@/i18n/config";

// Fully static: all content comes from src/data + src/i18n — prerendered per locale.
export const dynamic = "force-static";

export const metadata = METADATA.about;

export default async function AboutPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(toLocale(locale));

  return (
    <>
      <ProfilePageJsonLd />
      <BreadcrumbJsonLd items={getBreadcrumbs([{ name: "About", path: "/about" }])} />
      <AboutIndex content={getAboutContent(dict)} />
    </>
  );
}
