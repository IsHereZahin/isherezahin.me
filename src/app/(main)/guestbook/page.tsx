// src/app/(main)/guestbook/page.tsx
import GuestbookIndex from "@/components/pages/GuestbookIndex";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Guestbook - isherezahin.me",
    description:
        "Leave your thoughts, messages, or feedback on the Guestbook of isherezahin.me - a personal portfolio and blog by Zahin. All messages are synced with GitHub Discussions.",
    openGraph: {
        title: "Guestbook - isherezahin.me",
        description:
            "Leave your thoughts, messages, or feedback on the Guestbook of isherezahin.me - a personal portfolio and blog by Zahin.",
        url: "https://isherezahin.vercel.app/guestbook",
        siteName: "isherezahin.me",
        images: [
            {
                url: "https://avatars.githubusercontent.com/u/105446082?v=4",
                width: 1200,
                height: 630,
                alt: "isherezahin.me Guestbook",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Guestbook - isherezahin.me",
        description:
            "Sign the guestbook and leave a message for Zahin on isherezahin.me.",
        images: ["https://avatars.githubusercontent.com/u/105446082?v=4"],
    },
};

export default function GuestbookPage() {
    return <GuestbookIndex />;
}
