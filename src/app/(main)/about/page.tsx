import AboutIndex from "@/components/pages/about";
import { ProfilePageJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { METADATA, getBreadcrumbs } from "@/config/seo.config";

// Fully static: all content comes from src/data — prerendered at build time.
export const dynamic = "force-static";

export const metadata = METADATA.about;

export default function AboutPage() {
  return (
    <>
      <ProfilePageJsonLd />
      <BreadcrumbJsonLd items={getBreadcrumbs([{ name: "About", path: "/about" }])} />
      <AboutIndex />
    </>
  );
}