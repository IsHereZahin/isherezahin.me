"use client"

import BlurImage from "@/components/ui/BlurImage"
import { useAuth } from "@/lib/hooks/useAuth"
import { useDiscussion } from "@/lib/hooks/useDiscussion"
import { SiGithub } from "@icons-pack/react-simple-icons"
import { Send, UserIcon } from "lucide-react"
import type React from "react"
import { useCallback, useRef, useState } from "react"
import MarkdownPreview from "./MarkdownPreview"
import MarkdownToolbar from "./MarkdownToolbar"

interface CommentFormProps {
    parentId?: string
    onCancel?: () => void
}

export default function CommentForm({ parentId, onCancel }: Readonly<CommentFormProps>) {
    const { user, login } = useAuth()
    const { addComment, addReply } = useDiscussion()

    const [text, setText] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            if (!text.trim() || !user || submitting) return

            try {
                setSubmitting(true)
                setError(null)

                if (parentId) {
                    // Reply to a comment
                    await addReply(parentId, text.trim())
                } else {
                    // Top-level comment
                    await addComment(text.trim())
                }

                // Success: reset form
                setText("")
                setShowPreview(false)
                onCancel?.()
            } catch (err) {
                console.error("Submission failed:", err)
                setError("Failed to post. Please try again.")
            } finally {
                setSubmitting(false)
            }
        },
        [text, user, submitting, parentId, addComment, addReply, onCancel]
    )

    // Insert markdown syntax at cursor position
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

    // Extract comment/preview content
    let commentBody: React.ReactNode
    if (showPreview) {
        commentBody = text ? (
            <div className="text-sm prose prose-sm max-w-none">
                <MarkdownPreview content={text} />
            </div>
        ) : (
            <p className="italic text-sm text-muted-foreground">Nothing to preview</p>
        )
    } else {
        commentBody = (
            <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={parentId ? "Write a reply..." : "Leave a comment..."}
                className="w-full border-none outline-none text-sm resize-none max-h-32 overflow-auto rounded-lg p-3 focus:ring-2 focus:ring-secondary-foreground/30 transition-all bg-secondary/50 text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                rows={3}
                disabled={submitting || !user}
                aria-label={parentId ? "Reply input" : "Comment input"}
                aria-describedby={error ? "comment-error" : undefined}
            />
        )
    }

    return (
        <div className="relative">
            <form
                onSubmit={handleSubmit}
                className={`relative rounded-xl p-4 flex flex-col sm:flex-row items-start gap-4 border border-border/70 bg-card hover:border-border transition-all mt-3 overflow-hidden ${user ? "" : "opacity-60"}`}
            >
                {/* Sign in button */}
                {!user && (
                    <button
                        type="button"
                        onClick={() => login?.()}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                            px-4 py-2 flex items-center gap-2 rounded-lg font-semibold text-sm 
                            cursor-pointer transition-all bg-foreground text-background 
                            hover:shadow-lg hover:bg-foreground/90 pointer-events-auto z-10"
                        aria-label="Sign in with GitHub"
                    >
                        <SiGithub className="w-5 h-5" />
                        <span className="sm:hidden">Sign in</span>
                        <span className="hidden sm:inline">Sign in with GitHub</span>
                    </button>
                )}

                {/* Avatar */}
                <div className="flex-shrink-0">
                    {user?.image ? (
                        <BlurImage
                            src={user.image} alt={user.name || "User"} width={32} height={32} className="h-8 w-8 rounded-full ring-2 ring-primary/20" />
                    ) : (
                        <UserIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                </div>

                {/* Input / Preview + Controls */}
                <div className="flex min-w-0 flex-1 flex-col">
                    {commentBody}

                    {error && (
                        <p className="mt-2 text-sm text-destructive" role="alert">
                            {error}
                        </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                        {/* Markdown toolbar – only in write mode */}
                        {!showPreview && <MarkdownToolbar onInsert={insertMarkdown} disabled={!user || submitting} />}

                        <div className="flex items-center gap-2">
                            {parentId && onCancel && (
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    disabled={submitting}
                                    className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => setShowPreview((p) => !p)}
                                disabled={!user || submitting}
                                className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:opacity-50"
                            >
                                {showPreview ? "Write" : "Preview"}
                            </button>

                            <button
                                type="submit"
                                disabled={!text.trim() || submitting || !user}
                                className="rounded-lg p-2 text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                                title={parentId ? "Post reply" : "Post comment"}
                            >
                                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}