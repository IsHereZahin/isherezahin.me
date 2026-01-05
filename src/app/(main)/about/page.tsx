import AboutIndex from "@/components/pages/AboutIndex";
import { ProfilePageJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { METADATA, getBreadcrumbs } from "@/config/seo.config";

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