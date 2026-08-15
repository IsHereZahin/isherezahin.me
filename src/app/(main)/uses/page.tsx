import UsesIndex from "@/components/pages/uses";
import { METADATA } from "@/config/seo.config";

// Fully static: all content comes from src/data — prerendered at build time.
export const dynamic = "force-static";

export const metadata = METADATA.uses;

export default function UsesPage() {
  return <UsesIndex />;
}