"use client"

import { BlurImage, GitHubSignInButton } from "@/components/ui"
import { useAuth } from "@/lib/hooks/useAuth"
import { useDiscussion } from "@/lib/hooks/useDiscussion"
import { Loader2, Send, UserIcon } from "lucide-react"
import type React from "react"
import { useCallback, useRef, useState } from "react"
import MarkdownPreview from "./MarkdownPreview"
import MarkdownToolbar from "./MarkdownToolbar"

interface CommentFormProps {
    parentId?: string
    onCancel?: () => void
    initialValue?: string
    onSubmit?: (body: string) => Promise<void>
    submitLabel?: string
}

export default function CommentForm({
    parentId,
    onCancel,
    initialValue = "",
    onSubmit,
    submitLabel
}: Readonly<CommentFormProps>) {
    const { user, isGitHubUser } = useAuth()
    const { addComment, addReply } = useDiscussion()

    const [text, setText] = useState(initialValue)
    const isEditMode = !!onSubmit
    const [submitting, setSubmitting] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const canInteract = user && isGitHubUser

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            if (!text.trim() || !user || submitting) return

            try {
                setSubmitting(true)
                setError(null)

                if (onSubmit) {
                    await onSubmit(text.trim())
                } else if (parentId) {
                    await addReply(parentId, text.trim())
                } else {
                    await addComment(text.trim())
                }

                if (!onSubmit) {
                    setText("")
                    setShowPreview(false)
                }
                onCancel?.()
            } catch (err) {
                console.error("Submission failed:", err)
                setError(isEditMode ? "Failed to save. Please try again." : "Failed to post. Please try again.")
            } finally {
                setSubmitting(false)
            }
        },
        [text, user, submitting, parentId, addComment, addReply, onCancel, onSubmit, isEditMode]
    )

    const insertMarkdown = (before: string, after: string, placeholder = "") => {
        const input = textareaRef.current
        if (!input) return

        const start = input.selectionStart
        const end = input.selectionEnd
        const selected = text.substring(start, end) || placeholder

        const newText = text.slice(0, start) + before + selected + after + text.slice(end)
        setText(newText)

        setTimeout(() => {
            input.focus()
            const newCursorPos = start + before.length + selected.length
            input.setSelectionRange(newCursorPos, newCursorPos)
        }, 0)
    }

    let commentBody: React.ReactNode
    if (showPreview) {
        commentBody = text ? (
            <div className="text-sm prose prose-sm max-w-none min-h-[80px] p-3">
                <MarkdownPreview content={text} />
            </div>
        ) : (
            <p className="italic text-sm text-muted-foreground p-3 min-h-[80px]">Nothing to preview</p>
        )
    } else {
        commentBody = (
            <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={parentId ? "Write a reply..." : "Leave a comment..."}
                className="w-full border-none outline-none text-sm resize-none min-h-[80px] overflow-auto rounded-lg p-3 focus:ring-2 focus:ring-primary/20 transition-all bg-secondary/50 text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                rows={3}
                disabled={submitting || !canInteract}
                aria-label={parentId ? "Reply input" : "Comment input"}
            />
        )
    }

    return (
        <div className="relative">
            <form
                onSubmit={handleSubmit}
                className={`relative rounded-xl p-4 flex flex-col sm:flex-row items-start gap-4 border border-border/50 bg-card hover:border-border/80 transition-all mt-3 overflow-hidden ${canInteract ? "" : "opacity-60"}`}
            >
                {/* Sign in overlay */}
                {!canInteract && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/60 backdrop-blur-[2px]">
                        {!user ? (
                            <GitHubSignInButton />
                        ) : (
                            <div className="px-5 py-4 rounded-xl bg-card border border-border text-sm text-center shadow-lg">
                                <p className="font-medium text-foreground">GitHub account required</p>
                                <p className="text-xs text-muted-foreground mt-1">Please sign in with GitHub to interact</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Avatar */}
                <div className="flex-shrink-0 hidden sm:block">
                    {user?.image ? (
                        <BlurImage
                            src={user.image}
                            alt={user.name || "User"}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full ring-2 ring-border"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                    )}
                </div>

                {/* Input area */}
                <div className="flex min-w-0 flex-1 flex-col w-full">
                    {commentBody}

                    {error && (
                        <p className="mt-2 text-sm text-destructive px-1" role="alert">{error}</p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        {!showPreview && (
                            <MarkdownToolbar onInsert={insertMarkdown} disabled={!canInteract || submitting} />
                        )}
                        {showPreview && <div />}

                        <div className="flex items-center gap-2 ml-auto">
                            {(parentId || isEditMode) && onCancel && (
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    disabled={submitting}
                                    className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => setShowPreview((p) => !p)}
                                disabled={!canInteract || submitting}
                                className={`rounded-lg px-3 py-1.5 text-sm transition-colors disabled:opacity-50 ${showPreview ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                            >
                                {showPreview ? "Write" : "Preview"}
                            </button>

                            <button
                                type="submit"
                                disabled={!text.trim() || submitting || !canInteract}
                                className="rounded-lg p-2 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title={submitLabel || (parentId ? "Reply" : "Comment")}
                            >
                                {submitting ? (
                                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
