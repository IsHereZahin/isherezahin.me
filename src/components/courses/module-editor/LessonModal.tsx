"use client";

import { FormModal, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import QuizEditor from "../QuizEditor";
import LessonDescription from "./LessonDescription";
import { getYouTubeVideoId } from "./youtube-utils";
import type { Lesson } from "./types";

interface LessonModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (lesson: Lesson) => void;
    initialLesson: Lesson;
    isNew: boolean;
    inputClass: string;
    fetchDuration: (videoId: string) => Promise<string | null>;
}

export default function LessonModal({ open, onClose, onSave, initialLesson, isNew, inputClass, fetchDuration }: Readonly<LessonModalProps>) {
    const [lesson, setLesson] = useState<Lesson>(initialLesson);
    const [fetchingDur, setFetchingDur] = useState(false);

    useEffect(() => { setLesson(initialLesson); }, [initialLesson]);

    const update = (field: keyof Lesson, value: unknown) => {
        setLesson((prev) => ({ ...prev, [field]: value }));
    };

    const handleVideoUrlChange = async (url: string) => {
        update("videoUrl", url);
        const videoId = getYouTubeVideoId(url);
        if (!videoId) return;
        setFetchingDur(true);
        const duration = await fetchDuration(videoId);
        if (duration) update("duration", duration);
        setFetchingDur(false);
    };

    return (
        <FormModal
            open={open}
            onOpenChange={(v) => { if (!v) onClose(); }}
            title={isNew ? "Add Lesson" : "Edit Lesson"}
            description={isNew ? "Create a new lesson" : "Update lesson details"}
            maxWidth="sm:max-w-[700px]"
        >
            <div className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Lesson Title *</label>
                    <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => update("title", e.target.value)}
                        className={inputClass}
                        placeholder="e.g. Getting Started"
                        autoFocus
                    />
                </div>

                {/* Type, Duration, Free/Paid */}
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Type</label>
                        <Select value={lesson.contentType} onValueChange={(v) => { update("contentType", v); if (v === "quiz") update("isFree", false); }}>
                            <SelectTrigger className={inputClass}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="quiz">Quiz</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {lesson.contentType !== "quiz" && (
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Duration</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={lesson.duration || ""}
                                    onChange={(e) => update("duration", e.target.value)}
                                    className={`${inputClass} ${fetchingDur ? "pr-8" : ""}`}
                                    placeholder="e.g. 7:56"
                                />
                                {fetchingDur && (
                                    <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                                )}
                            </div>
                        </div>
                    )}
                    {lesson.contentType !== "quiz" && (
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Access</label>
                            <label className="flex items-center gap-2 h-10 cursor-pointer select-none">
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={lesson.isFree || false}
                                    onClick={() => update("isFree", !lesson.isFree)}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                                        lesson.isFree ? "bg-primary" : "bg-border"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                                            lesson.isFree ? "translate-x-4.5" : "translate-x-0.76"
                                        }`}
                                    />
                                </button>
                                <span className={`text-sm ${lesson.isFree ? "text-primary" : "text-muted-foreground"}`}>
                                    {lesson.isFree ? "Free Preview" : "Paid"}
                                </span>
                            </label>
                        </div>
                    )}
                </div>

                {/* Content area based on type */}
                {lesson.contentType === "video" && (
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">YouTube URL</label>
                        <input
                            type="text"
                            value={lesson.videoUrl || ""}
                            onChange={(e) => handleVideoUrlChange(e.target.value)}
                            className={inputClass}
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                    </div>
                )}

                {(lesson.contentType === "video" || lesson.contentType === "text") && (
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                            {lesson.contentType === "text" ? "Content (Markdown)" : "Description (optional)"}
                        </label>
                        <LessonDescription
                            value={lesson.content || ""}
                            onChange={(val) => update("content", val)}
                            inputClass={inputClass}
                            placeholder={lesson.contentType === "text" ? "Markdown content..." : "Description note (optional) — Markdown supported"}
                            rows={lesson.contentType === "text" ? 6 : 3}
                        />
                    </div>
                )}

                {lesson.contentType === "quiz" && (
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Quiz Questions</label>
                        <QuizEditor
                            value={lesson.content || "[]"}
                            onChange={(val) => {
                                update("content", val);
                                try {
                                    const questions = JSON.parse(val);
                                    if (Array.isArray(questions)) {
                                        const count = questions.length;
                                        update("duration", count > 0 ? `${count} question${count > 1 ? "s" : ""}` : null);
                                    }
                                } catch { /* noop */ }
                            }}
                            inputClass={inputClass}
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { if (lesson.title.trim()) onSave(lesson); }}
                        disabled={!lesson.title.trim()}
                        className="px-5 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {isNew ? "Add Lesson" : "Save"}
                    </button>
                </div>
            </div>
        </FormModal>
    );
}
