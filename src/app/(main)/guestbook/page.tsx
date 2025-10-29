// src/app/(main)/guestbook/page.tsx
import GuestbookIndex from "@/components/pages/GuestbookIndex";
import { MY_FULL_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: `GuestBook | ${MY_FULL_NAME}`,
    description: "Leave your thoughts, messages, or feedback on the Guestbook page.",
};

export default function GuestbookPage() {
    return <GuestbookIndex discussionNumber={4} />;
}