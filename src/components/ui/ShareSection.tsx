'use client';

import { Check, Copy, Facebook, Linkedin, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ShareSectionProps {
    title: string;
    type: string;
    url?: string;
    compact?: boolean;
}

export default function ShareSection({ title, type, url, compact = false }: Readonly<ShareSectionProps>) {
    const [shareUrl, setShareUrl] = useState(url || '');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!url && typeof window !== 'undefined') {
            setShareUrl(window.location.href);
        }
    }, [url]);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy link");
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Check out this ${type.toLowerCase()}: ${title}`,
                    url: shareUrl,
                });
            } catch (err) {
                // User cancelled or error
                if ((err as Error).name !== 'AbortError') {
                    toast.error("Failed to share");
                }
            }
        }
    };

    const shareLinks = [
        {
            name: "X (Twitter)",
            href: `https://twitter.com/intent/tweet?text=Check out this ${type.toLowerCase()}: ${title}&url=${encodeURIComponent(shareUrl)}`,
            icon: (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            color: "hover:bg-neutral-800 hover:text-white dark:hover:bg-neutral-200 dark:hover:text-neutral-900",
        },
        {
            name: "LinkedIn",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            icon: <Linkedin className="w-4 h-4" />,
            color: "hover:bg-[#0A66C2] hover:text-white",
        },
        {
            name: "Facebook",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            icon: <Facebook className="w-4 h-4" />,
            color: "hover:bg-[#1877F2] hover:text-white",
        },
    ];

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Share on ${link.name}`}
                        className={`w-9 h-9 flex items-center justify-center rounded-full bg-muted/50 border border-border/50 transition-all duration-200 ${link.color}`}
                    >
                        {link.icon}
                    </a>
                ))}
                <button
                    onClick={handleCopyLink}
                    title="Copy link"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-muted/50 border border-border/50 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                    <button
                        onClick={handleNativeShare}
                        title="Share"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-muted/50 border border-border/50 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="p-5 rounded-xl border border-border/50 bg-card/50">
            <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share this {type.toLowerCase()}
            </h4>

            <div className="flex flex-wrap gap-2">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Share on ${link.name}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 border border-border/50 transition-all duration-200 ${link.color}`}
                    >
                        {link.icon}
                    </a>
                ))}
                <button
                    onClick={handleCopyLink}
                    title="Copy link"
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border border-border/50 transition-all duration-200 ${copied
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : "bg-muted/50 hover:bg-primary hover:text-primary-foreground"
                        }`}
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>

            {/* Native share button for mobile */}
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                    onClick={handleNativeShare}
                    className="w-full mt-3 py-2.5 px-4 rounded-xl bg-foreground text-background font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <Share2 className="w-4 h-4" />
                    Share via...
                </button>
            )}
        </div>
    );
}
