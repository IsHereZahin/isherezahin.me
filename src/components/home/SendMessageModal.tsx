'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import MarkdownTextarea from '@/components/ui/MarkdownTextarea'
import { Button } from '@/components/ui/shadcn-button'
import { useAuth } from '@/lib/hooks/useAuth'
import { Loader2, Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface SendMessageModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function SendMessageModal({ isOpen, onClose }: SendMessageModalProps) {
    const { user } = useAuth()
    const [message, setMessage] = useState('')
    const [subject, setSubject] = useState('')
    const [sending, setSending] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!message.trim()) {
            toast.error('Please enter a message')
            return
        }

        setSending(true)
        try {
            const response = await fetch('/api/contact/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: subject.trim() || 'No Subject',
                    message: message.trim()
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to send message')
            }

            toast.success('Message sent successfully!')
            setMessage('')
            setSubject('')
            onClose()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to send message')
        } finally {
            setSending(false)
        }
    }

    const handleClose = () => {
        if (!sending) {
            setMessage('')
            setSubject('')
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Send a Message</DialogTitle>
                    <DialogDescription>
                        {user?.name ? `Hi ${user.name.split(' ')[0]}, ` : ''}
                        Send me a message and I&apos;ll get back to you soon.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-1.5">
                            Subject <span className="text-muted-foreground">(optional)</span>
                        </label>
                        <input
                            id="subject"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="What's this about?"
                            disabled={sending}
                            className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                        />
                    </div>

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

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClose}
                            disabled={sending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={sending || !message.trim()}
                            className="gap-2"
                        >
                            {sending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Send Message
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
