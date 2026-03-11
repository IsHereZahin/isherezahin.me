"use client";

import MarkdownPreview from "@/components/content/discussions/MarkdownPreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useEffect, useRef } from "react";

interface Lesson {
    _id: string;
    title: string;
    contentType: string;
    videoUrl?: string | null;
    content?: string | null;
    duration?: string | null;
}

interface LessonPreviewModalProps {
    lesson: Lesson | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function getYouTubeVideoId(url: string): string | null {
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes("youtube.com") && parsed.pathname === "/watch") {
            return parsed.searchParams.get("v");
        }
        if (parsed.hostname.includes("youtu.be")) {
            return parsed.pathname.slice(1);
        }
        if (parsed.hostname.includes("youtube.com") && parsed.pathname.startsWith("/embed/")) {
            return parsed.pathname.split("/embed/")[1]?.split("?")[0] || null;
        }
    } catch {
        // noop
    }
    return null;
}

export default function LessonPreviewModal({ lesson, open, onOpenChange }: Readonly<LessonPreviewModalProps>) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Stop video when modal closes
    useEffect(() => {
        if (!open && iframeRef.current) {
            iframeRef.current.src = "";
        }
    }, [open]);

    if (!lesson) return null;

    const videoId = lesson.videoUrl ? getYouTubeVideoId(lesson.videoUrl) : null;
    const isVideo = lesson.contentType === "video" && videoId;
    const isText = lesson.contentType === "text" && lesson.content;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`p-0 gap-0 flex flex-col ${isVideo ? "sm:max-w-[900px]" : "sm:max-w-[750px]"} max-h-[90vh]`}>
                {/* Hidden title for accessibility */}
                <DialogHeader className="sr-only">
                    <DialogTitle>{lesson.title}</DialogTitle>
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 overflow-y-auto modal-scrollbar">
                    {isVideo && (
                        <div className="aspect-video bg-black">
                            <iframe
                                ref={iframeRef}
                                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                title={lesson.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}

                    {isText && (
                        <div className="p-6">
                            <MarkdownPreview content={lesson.content!} />
                        </div>
                    )}

                    {!isVideo && !isText && (
                        <div className="p-8 text-center text-muted-foreground">
                            <p>No preview content available for this lesson.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
