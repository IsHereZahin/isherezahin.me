'use client'

import {
    ShadcnButton as Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    MarkdownTextarea,
} from "@/components/ui"
import { ApiError, chat } from '@/lib/api'
import { useAuth } from '@/lib/hooks/useAuth'
import { Loader2, MessageCircle, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface SendMessageModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function SendMessageModal({ isOpen, onClose }: SendMessageModalProps) {
    const { user } = useAuth()
    const router = useRouter()
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!message.trim()) {
            toast.error('Please enter a message')
            return
        }

        setSending(true)
        try {
            // Send message via chat API (creates conversation if needed)
            await chat.sendMessage(null, message.trim())

            toast.success('Message sent! Redirecting to chat...')
            setMessage('')
            onClose()

            // Redirect to live chat
            router.push('/profile/chat')
        } catch (error) {
            const errorMessage = error instanceof ApiError ? error.message : 'Failed to send message'
            toast.error(errorMessage)
        } finally {
            setSending(false)
        }
    }

    const handleClose = () => {
        if (!sending) {
            setMessage('')
            onClose()
        }
    }

    const handleGoToChat = () => {
        onClose()
        router.push('/profile/chat')
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Send a Message</DialogTitle>
                    <DialogDescription>
                        {user?.name ? `Hi ${user.name.split(' ')[0]}, ` : ''}
                        Start a conversation and I&apos;ll get back to you soon.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1.5">
                            Message <span className="text-red-500">*</span>
                        </label>
                        <MarkdownTextarea
                            id="message"
                            value={message}
                            onChange={setMessage}
                            placeholder="Write your message here..."
                            rows={4}
                            disabled={sending}
                        />
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoToChat}
                            disabled={sending}
                            className="gap-2 w-full sm:w-auto"
                        >
                            <MessageCircle className="h-4 w-4" />
                            Go to Chat
                        </Button>
                        <Button
                            type="submit"
                            disabled={sending || !message.trim()}
                            className="gap-2 w-full sm:w-auto"
                        >
                            {sending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Send & Open Chat
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
