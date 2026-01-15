"use client"

import { useAuth } from "@/lib/hooks/useAuth"
import { useDiscussion } from "@/lib/hooks/useDiscussion"
import { DiscussionProvider } from "@/providers/DiscussionProvider"
import CommentForm from "./CommentForm"
import CommentsList from "./CommentsList"

interface GithubDiscussionsProps {
    discussionNumber: number
    inputOnly?: boolean
    onCommentAdded?: () => void
    seeAllLink?: string
    commentCount?: number
}

function GithubDiscussionsContent({ inputOnly = false, onCommentAdded, seeAllLink, commentCount }: { readonly inputOnly?: boolean; readonly onCommentAdded?: () => void; readonly seeAllLink?: string; readonly commentCount?: number }) {
    const { error } = useDiscussion()

    return (
        <>
            <CommentForm onCommentAdded={onCommentAdded} />

            {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20">
                    {error}
                </div>
            )}
            {inputOnly && seeAllLink && commentCount !== undefined && commentCount > 0 && (
                <div className="mt-3 text-center">
                    <a
                        href={seeAllLink}
                        className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                    >
                        See all {commentCount} comment{commentCount === 1 ? "" : "s"}
                    </a>
                </div>
            )}
            {!inputOnly && <CommentsList />}
        </>
    )
}

export default function GithubDiscussions({ discussionNumber, inputOnly = false, onCommentAdded, seeAllLink, commentCount }: Readonly<GithubDiscussionsProps>) {
    const { user } = useAuth();
    return (
        <DiscussionProvider discussionNumber={discussionNumber} authUsername={user?.username} inputOnly={inputOnly}>
            <GithubDiscussionsContent inputOnly={inputOnly} onCommentAdded={onCommentAdded} seeAllLink={seeAllLink} commentCount={commentCount} />
        </DiscussionProvider>
    )
}