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

    // Handle submit for comment or reply
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            if (!text.trim() || !user) return

            try {
                setSubmitting(true)
                setError(null)
                if (parentId) {
                    await addReply(parentId, text)
                } else {
                    await addComment(text, user.image || undefined)
                }
                setText("")
                setShowPreview(false)
                if (onCancel) onCancel()
            } catch (err) {
                console.error(err)
                setError("Failed to submit. Please try again.")
            } finally {
                setSubmitting(false)
            }
        },
        [text, user, addComment, addReply, parentId, onCancel],
    )

    // Insert markdown syntax at cursor
    const insertMarkdown = (before: string, after: string, placeholder = "") => {
        const input = textareaRef.current
        if (!input) return
        const start = input.selectionStart
        const end = input.selectionEnd
        const selectedText = text.substring(start, end)
        const newText = text.substring(0, start) + before + (selectedText || placeholder) + after + text.substring(end)
        setText(newText)
        setTimeout(() => {
            input.focus()
            input.setSelectionRange(start + before.length, start + before.length + (selectedText || placeholder).length)
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

                <div className="flex-shrink-0 sm:order-1">
                    {user?.image ? (
                        <BlurImage
                            src={user?.image}
                            alt={user?.name || "User avatar"}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full ring-2 ring-primary/20"
                        />
                    ) : (
                        <UserIcon className="w-8 h-8 text-muted-foreground hidden sm:block " aria-hidden="true" />
                    )}
                </div>

                <div className="flex-1 flex flex-col min-w-0 w-full sm:order-2">
                    {commentBody}

                    {error && (
                        <p id="comment-error" className="text-sm text-destructive mt-2" role="alert">
                            {error}
                        </p>
                    )}

                    <div className="flex items-center justify-between gap-2 mt-3 flex-wrap sm:justify-end">
                        {!showPreview && <MarkdownToolbar onInsert={insertMarkdown} disabled={!user} />}

                        <div className="flex items-center gap-2 ml-auto flex-wrap">
                            {parentId && onCancel && (
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all disabled:opacity-50"
                                    disabled={!user}
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowPreview(!showPreview)}
                                disabled={!user}
                                className="p-2 text-xs transition-all cursor-pointer hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                                title={`Toggle ${showPreview ? "write" : "preview"} mode`}
                            >
                                {showPreview ? "Write" : "Preview"}
                            </button>

                            <button
                                type="submit"
                                disabled={!text.trim() || submitting || !user}
                                className="p-2 transition-all cursor-pointer hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-primary hover:text-primary"
                                title={parentId ? "Post reply" : "Post comment"}
                            >
                                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}