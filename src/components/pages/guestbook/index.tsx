"use client";

import ContentDiscussions from "@/components/content/discussions/ContentDiscussions";
import { PageTitle, ReferralLink, Section } from "@/components/ui";
import { contentDiscussions } from "@/lib/api";
import { GITHUB_REPO_NAME, GITHUB_REPO_OWNER } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function GuestbookIndex() {
    // Cached by React Query, so coming back to the guestbook reuses the result
    // instead of re-running the lookup and re-showing the spinner every visit.
    const { data, isLoading: loading } = useQuery({
        queryKey: ["contentDiscussion", "guestbook", "default"],
        queryFn: () => contentDiscussions.get("guestbook", "default"),
        staleTime: 1000 * 60 * 5,
    });

    const discussionNumber: number | null = data?.discussionNumber ?? null;

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
