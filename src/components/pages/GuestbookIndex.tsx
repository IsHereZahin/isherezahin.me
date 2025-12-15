"use client";

import GithubDiscussions from "@/components/content/discussions/GithubDiscussions";
import { GitHubSignInButton, PageTitle, ReferralLink, Section } from "@/components/ui";
import { GITHUB_REPO_NAME, GITHUB_REPO_OWNER } from "@/lib/constants";
import { useAuth } from "@/lib/hooks/useAuth";
import { Loader2, MessageSquare } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function CreateGuestbookPrompt({ onDiscussionCreated }: { onDiscussionCreated: (discussionNumber: number) => void }) {
    const { user, isGitHubUser } = useAuth();
    const [creating, setCreating] = useState(false);

    const handleCreate = useCallback(async () => {
        setCreating(true);
        try {
            const res = await fetch("/api/discussions/guestbook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to create guestbook");
            }

            const { discussionNumber } = await res.json();
            toast.success("Guestbook created! You can now leave a message.");
            onDiscussionCreated(discussionNumber);
        } catch (error) {
            console.error("Error:", error);
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setCreating(false);
        }
    }, [onDiscussionCreated]);

    const canInteract = user && isGitHubUser;

    return (
        <div className="space-y-6">
            <div className="relative rounded-xl border border-border/50 bg-card p-6 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                        <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium text-foreground">No messages yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Be the first to leave a message!
                        </p>
                    </div>

                    {!canInteract ? (
                        <GitHubSignInButton />
                    ) : (
                        <button
                            onClick={handleCreate}
                            disabled={creating}
                            className="px-5 py-2.5 flex items-center gap-2.5 rounded-xl font-medium text-sm cursor-pointer transition-all bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                            {creating ? "Setting up..." : "Start the Guestbook"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function GuestbookIndex() {
    const { user } = useAuth();
    const [discussionNumber, setDiscussionNumber] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiscussionNumber = async () => {
            try {
                const res = await fetch("/api/discussions/guestbook");
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
                ) : discussionNumber ? (
                    <GithubDiscussions discussionNumber={discussionNumber} />
                ) : (
                    <CreateGuestbookPrompt onDiscussionCreated={setDiscussionNumber} />
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
