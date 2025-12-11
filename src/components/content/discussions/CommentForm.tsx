"use client"

import { BlurImage } from "@/components/ui"
import { useAuth } from "@/lib/hooks/useAuth"
import { useDiscussion } from "@/lib/hooks/useDiscussion"
import { SiGithub } from "@icons-pack/react-simple-icons"
import { Loader2, LogIn, Send, UserIcon } from "lucide-react"
import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
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
    const { user, loginWithProvider, openLoginModal, isGitHubUser } = useAuth()
    const { addComment, addReply } = useDiscussion()

    const [text, setText] = useState(initialValue)
    const isEditMode = !!onSubmit
    const [submitting, setSubmitting] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loginSettings, setLoginSettings] = useState({
        allowGitHubLogin: true,
        allowGoogleLogin: false,
        primaryLoginMethod: "github" as "github" | "google"
    })

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const canInteract = user && isGitHubUser

    // Fetch login settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/settings/public")
                const data = await res.json()
                setLoginSettings({
                    allowGitHubLogin: data.settings?.allowGitHubLogin ?? true,
                    allowGoogleLogin: data.settings?.allowGoogleLogin ?? false,
                    primaryLoginMethod: data.settings?.primaryLoginMethod ?? "github"
                })
            } catch {
                // Default to GitHub only
                setLoginSettings({ allowGitHubLogin: true, allowGoogleLogin: false, primaryLoginMethod: "github" })
            }
        }
        fetchSettings()
    }, [])

    const handleLogin = useCallback(() => {
        const bothEnabled = loginSettings.allowGitHubLogin && loginSettings.allowGoogleLogin
        if (bothEnabled) {
            // Show modal when both are enabled
            openLoginModal()
        } else {
            // Direct login with the enabled method
            const method = loginSettings.allowGitHubLogin ? "github" : "google"
            loginWithProvider(method)
        }
    }, [loginSettings, openLoginModal, loginWithProvider])

    const showModal = loginSettings.allowGitHubLogin && loginSettings.allowGoogleLogin

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
                            <button
                                type="button"
                                onClick={handleLogin}
                                className="px-5 py-2.5 flex items-center gap-2.5 rounded-xl font-medium text-sm cursor-pointer transition-all bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {showModal ? (
                                    <LogIn className="w-4 h-4" />
                                ) : loginSettings.allowGitHubLogin ? (
                                    <SiGithub className="w-4 h-4" />
                                ) : (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                )}
                                <span>{showModal ? "Sign in to comment" : `Sign in with ${loginSettings.allowGitHubLogin ? "GitHub" : "Google"}`}</span>
                            </button>
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
