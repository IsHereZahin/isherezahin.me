import AttributionIndex from "@/components/pages/attribution";
import { METADATA } from "@/config/seo.config";

// Fully static: all content comes from src/data — prerendered at build time.
export const dynamic = "force-static";

export const metadata = METADATA.attribution;

export default function AttributionPage() {
  return <AttributionIndex />;
}
