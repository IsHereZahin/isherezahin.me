import GuestbookIndex from "@/components/pages/GuestbookIndex";
import { METADATA } from "@/config/seo.config";

export const metadata = METADATA.guestbook;

export default function GuestbookPage() {
  return <GuestbookIndex />;
}
