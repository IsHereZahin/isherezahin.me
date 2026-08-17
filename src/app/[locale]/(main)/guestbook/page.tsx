import GuestbookIndex from "@/components/pages/guestbook";
import { METADATA } from "@/config/seo.config";

export const metadata = METADATA.guestbook;

export default function GuestbookPage() {
  return <GuestbookIndex />;
}
