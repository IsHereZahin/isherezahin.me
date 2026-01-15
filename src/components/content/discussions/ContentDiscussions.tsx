"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Loader2, MessageSquare } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import GithubDiscussions from "./GithubDiscussions";
import { GitHubSignInButton } from "@/components/ui";

type ContentType = "blog" | "project" | "saylo" | "guestbook";

interface ContentDiscussionsProps {
    contentType: ContentType;
    identifier: string;
    initialDiscussionNumber?: number | null;
    inputOnly?: boolean;
    onCommentAdded?: () => void;
    seeAllLink?: string;
    commentCount?: number;
}

function CreateDiscussionPrompt({
    contentType,
    identifier,
    onDiscussionCreated,
    inputOnly = false,
}: {
    readonly contentType: ContentType;
    readonly identifier: string;
    readonly onDiscussionCreated: (discussionNumber: number) => void;
    readonly inputOnly?: boolean;
}) {
    const { user, isGitHubUser } = useAuth();
    const [creating, setCreating] = useState(false);

    const handleCreateAndComment = useCallback(async () => {
        setCreating(true);
        try {
            // Use unified API
            const createRes = await fetch(`/api/discussions/content/${contentType}/${identifier}`, {
                method: "POST",
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
    }, [contentType, identifier, onDiscussionCreated]);

    const canInteract = user && isGitHubUser;

    const promptText = contentType === "guestbook"
        ? { title: "Messages", empty: "No messages yet", cta: "Be the first to leave a message!" }
        : { title: "Comments", empty: "No comments yet", cta: "Be the first to share your thoughts!" };

    // Compact version for inputOnly mode
    if (inputOnly) {
        return (
            <div className="relative rounded-xl border border-border/50 bg-card p-6 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                        <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium text-foreground">{promptText.empty}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {promptText.cta}
                        </p>
                    </div>

                    {canInteract ? (
                        <button
                            onClick={handleCreateAndComment}
                            disabled={creating}
                            className="px-5 py-2.5 flex items-center gap-2.5 rounded-xl font-medium text-sm cursor-pointer transition-all bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                            {creating ? "Starting discussion..." : "Start the conversation"}
                        </button>
                    ) : (
                        <GitHubSignInButton />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-medium text-foreground">{promptText.title}</h2>
                <span className="text-secondary-foreground font-medium">(0)</span>
            </div>

            <div className="relative rounded-xl border border-border/50 bg-card p-6 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                        <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium text-foreground">{promptText.empty}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {promptText.cta}
                        </p>
                    </div>

                    {canInteract ? (
                        <button
                            onClick={handleCreateAndComment}
                            disabled={creating}
                            className="px-5 py-2.5 flex items-center gap-2.5 rounded-xl font-medium text-sm cursor-pointer transition-all bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                            {creating ? "Starting discussion..." : "Start the conversation"}
                        </button>
                    ) : (
                        <GitHubSignInButton />
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ContentDiscussions({
    contentType,
    identifier,
    initialDiscussionNumber,
    inputOnly = false,
    onCommentAdded,
    seeAllLink,
    commentCount,
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
                // Use unified API for all content types
                const res = await fetch(`/api/discussions/content/${contentType}/${identifier}`);
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
    }, [contentType, identifier, initialDiscussionNumber]);

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
                identifier={identifier}
                onDiscussionCreated={setDiscussionNumber}
                inputOnly={inputOnly}
            />
        );
    }

    // Discussion exists - show GithubDiscussions component
    return <GithubDiscussions discussionNumber={discussionNumber} inputOnly={inputOnly} onCommentAdded={onCommentAdded} seeAllLink={seeAllLink} commentCount={commentCount} />;
}
