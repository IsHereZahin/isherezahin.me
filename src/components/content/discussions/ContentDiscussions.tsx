"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Loader2, MessageSquare } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import GithubDiscussions from "./GithubDiscussions";
import { GitHubSignInButton } from "@/components/ui";

interface ContentDiscussionsProps {
    contentType: "blog" | "project";
    slug: string;
    title: string;
    initialDiscussionNumber?: number | null;
}

function CreateDiscussionPrompt({
    contentType,
    slug,
    title,
    onDiscussionCreated,
}: {
    contentType: "blog" | "project";
    slug: string;
    title: string;
    onDiscussionCreated: (discussionNumber: number) => void;
}) {
    const { user, isGitHubUser } = useAuth();
    const [creating, setCreating] = useState(false);

    const handleCreateAndComment = useCallback(async () => {
        setCreating(true);
        try {
            // Create the discussion
            const createRes = await fetch("/api/discussions/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contentType, slug, title }),
            });

            if (!createRes.ok) {
                const error = await createRes.json();
                throw new Error(error.error || "Failed to create discussion");
            }

            const { discussionNumber } = await createRes.json();
            toast.success("Discussion created! You can now comment.");
            onDiscussionCreated(discussionNumber);
        } catch (error) {
            console.error("Error:", error);
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setCreating(false);
        }
    }, [contentType, slug, title, onDiscussionCreated]);

    const canInteract = user && isGitHubUser;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-medium text-foreground">Comments</h2>
                <span className="text-secondary-foreground font-medium">(0)</span>
            </div>

            <div className="relative rounded-xl border border-border/50 bg-card p-6 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                        <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium text-foreground">No comments yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Be the first to share your thoughts!
                        </p>
                    </div>

                    {!canInteract ? (
                        <GitHubSignInButton />
                    ) : (
                        <button
                            onClick={handleCreateAndComment}
                            disabled={creating}
                            className="px-5 py-2.5 flex items-center gap-2.5 rounded-xl font-medium text-sm cursor-pointer transition-all bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                            {creating ? "Starting discussion..." : "Start the conversation"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ContentDiscussions({
    contentType,
    slug,
    title,
    initialDiscussionNumber,
}: Readonly<ContentDiscussionsProps>) {
    const [discussionNumber, setDiscussionNumber] = useState<number | null>(
        initialDiscussionNumber ?? null
    );
    const [loading, setLoading] = useState(!initialDiscussionNumber);

    // Fetch discussion number if not provided
    useEffect(() => {
        if (initialDiscussionNumber) {
            setDiscussionNumber(initialDiscussionNumber);
            setLoading(false);
            return;
        }

        const fetchDiscussionNumber = async () => {
            try {
                const res = await fetch(`/api/${contentType}/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.discussionNumber) {
                        setDiscussionNumber(data.discussionNumber);
                    }
                }
            } catch (error) {
                console.error("Error fetching discussion number:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDiscussionNumber();
    }, [contentType, slug, initialDiscussionNumber]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // If no discussion exists yet, show the create prompt
    if (!discussionNumber) {
        return (
            <CreateDiscussionPrompt
                contentType={contentType}
                slug={slug}
                title={title}
                onDiscussionCreated={setDiscussionNumber}
            />
        );
    }

    // Discussion exists - use the same GithubDiscussions component as guestbook
    return <GithubDiscussions discussionNumber={discussionNumber} />;
}
