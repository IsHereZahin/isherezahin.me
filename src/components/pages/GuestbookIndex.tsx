"use client";

import ContentDiscussions from "@/components/content/discussions/ContentDiscussions";
import { PageTitle, ReferralLink, Section } from "@/components/ui";
import { GITHUB_REPO_NAME, GITHUB_REPO_OWNER } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function GuestbookIndex() {
    const [discussionNumber, setDiscussionNumber] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch initial discussion number to show link if exists
    useEffect(() => {
        const fetchDiscussionNumber = async () => {
            try {
                const res = await fetch("/api/discussions/content/guestbook/default");
                if (res.ok) {
                    const data = await res.json();
                    if (data.discussionNumber) {
                        setDiscussionNumber(data.discussionNumber);
                    }
                }
            } catch (error) {
                console.error("Error fetching guestbook discussion:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDiscussionNumber();
    }, []);

    return (
        <Section id="guestbook" className="px-6 py-16 max-w-3xl">
            <PageTitle
                title="GuestBook"
                subtitle="Leave whatever you want to say, message, appreciation, suggestions or feedback."
            />
            <div className="mt-6 sm:mt-8">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <ContentDiscussions
                        contentType="guestbook"
                        identifier="default"
                        initialDiscussionNumber={discussionNumber}
                    />
                )}
                {discussionNumber && (
                    <div className="text-muted-foreground text-xs sm:text-sm text-center mt-4 sm:mt-5">
                        You can also view this guestbook on{" "}
                        <ReferralLink
                            href={`https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/discussions/${discussionNumber}`}
                            className="underline hover:text-foreground transition-colors"
                        >
                            GitHub Discussions
                        </ReferralLink>
                        .
                    </div>
                )}
            </div>
        </Section>
    );
}
