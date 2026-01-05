import UsesIndex from "@/components/pages/UsesIndex";
import { METADATA } from "@/config/seo.config";

export const metadata = METADATA.uses;

export default function UsesPage() {
  return <UsesIndex />;
}