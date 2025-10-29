"use client"

import { useAuth } from "@/lib/hooks/useAuth"
import { useDiscussion } from "@/lib/hooks/useDiscussion"
import { DiscussionProvider } from "@/providers/DiscussionProvider"
import CommentForm from "./CommentForm"
import CommentsList from "./CommentsList"

interface GithubDiscussionsProps {
    discussionNumber: number
}

function GithubDiscussionsContent() {
    const { error } = useDiscussion()

    return (
        <>
            <CommentForm />

            {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20">
                    {error}
                </div>
            )}
            <CommentsList />
        </>
    )
}

export default function GithubDiscussions({ discussionNumber }: Readonly<GithubDiscussionsProps>) {
    const { user } = useAuth();
    return (
        <DiscussionProvider discussionNumber={discussionNumber} authUsername={user?.username}>
            <GithubDiscussionsContent />
        </DiscussionProvider>
    )
}