"use client";

import MarkdownPreview from "@/components/content/discussions/MarkdownPreview";
import MarkdownToolbar from "@/components/content/discussions/MarkdownToolbar";
import { ConfirmDialog, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { courses } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import QuizEditor from "./QuizEditor";
import { ArrowLeft, ChevronDown, ChevronUp, Eye, GripVertical, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// YouTube IFrame API types
declare global {
    interface Window {
        YT: {
            Player: new (
                el: string | HTMLElement,
                config: {
                    videoId: string;
                    width?: string | number;
                    height?: string | number;
                    playerVars?: Record<string, unknown>;
                    events?: {
                        onReady?: (event: { target: { getDuration: () => number; destroy: () => void } }) => void;
                        onStateChange?: (event: { data: number; target: { getDuration: () => number; destroy: () => void } }) => void;
                    };
                }
            ) => { getDuration: () => number; destroy: () => void };
            PlayerState: {
                ENDED: number;
                PLAYING: number;
                PAUSED: number;
                BUFFERING: number;
                CUED: number;
            };
        };
        onYouTubeIframeAPIReady: (() => void) | undefined;
        _ytApiLoaded?: boolean;
    }
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
    } catch { /* noop */ }
    return null;
}

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

function loadYouTubeAPI(): Promise<void> {
    return new Promise((resolve) => {
        if (window.YT?.Player) { resolve(); return; }
        const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
        if (!existingScript) {
            const script = document.createElement("script");
            script.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(script);
        }
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            prev?.();
            resolve();
        };
    });
}

function useFetchDuration() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Create a hidden container once
    useEffect(() => {
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.width = "0";
        div.style.height = "0";
        div.style.overflow = "hidden";
        document.body.appendChild(div);
        containerRef.current = div;
        return () => { div.remove(); };
    }, []);

    const fetchDuration = useCallback(async (videoId: string): Promise<string | null> => {
        await loadYouTubeAPI();
        if (!containerRef.current) return null;

        return new Promise((resolve) => {
            const el = document.createElement("div");
            containerRef.current!.appendChild(el);

            const timeout = setTimeout(() => {
                try { player.destroy(); } catch { /* noop */ }
                el.remove();
                resolve(null);
            }, 10000);

            const player = new window.YT.Player(el, {
                videoId,
                playerVars: { autoplay: 0, controls: 0, mute: 1 },
                events: {
                    onReady: (event) => {
                        clearTimeout(timeout);
                        const dur = event.target.getDuration();
                        try { event.target.destroy(); } catch { /* noop */ }
                        el.remove();
                        resolve(dur > 0 ? formatDuration(dur) : null);
                    },
                },
            });
        });
    }, []);

    return fetchDuration;
}

function LessonDescription({
    value,
    onChange,
    inputClass,
    placeholder = "Description note (optional) — Markdown supported",
    rows = 2,
    noWrapper = false,
}: Readonly<{ value: string; onChange: (val: string) => void; inputClass: string; placeholder?: string; rows?: number; noWrapper?: boolean }>) {
    const [showPreview, setShowPreview] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea to fit content
    const autoResize = useCallback(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, []);

    useEffect(() => {
        autoResize();
    }, [value, autoResize]);

    const insertMarkdown = useCallback((before: string, after: string, placeholder = "") => {
        const input = textareaRef.current;
        if (!input) return;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const selected = value.substring(start, end) || placeholder;
        const newContent = value.slice(0, start) + before + selected + after + value.slice(end);
        onChange(newContent);
        setTimeout(() => {
            input.focus();
            const pos = start + before.length + selected.length;
            input.setSelectionRange(pos, pos);
        }, 0);
    }, [value, onChange]);

    const content = (
        <div className="border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between bg-muted/30 border-b border-border px-2 py-1">
                <div className="flex-1">
                    {!showPreview && <MarkdownToolbar onInsert={insertMarkdown} />}
                </div>
                <button
                    type="button"
                    onClick={() => setShowPreview((p) => !p)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title={showPreview ? "Edit" : "Preview"}
                >
                    {showPreview ? <Pencil className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
            </div>
            {showPreview ? (
                <div className="p-3 min-h-16 text-xs">
                    {value ? (
                        <MarkdownPreview content={value} />
                    ) : (
                        <p className="italic text-xs text-muted-foreground">No content</p>
                    )}
                </div>
            ) : (
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        autoResize();
                    }}
                    className={`${inputClass} text-xs min-h-16 resize-none border-0 rounded-none focus:ring-0 overflow-hidden`}
                    placeholder={placeholder}
                    rows={rows}
                />
            )}
        </div>
    );

    if (noWrapper) return content;
    return <div className="ml-8">{content}</div>;
}

interface Lesson {
    _id?: string;
    title: string;
    order: number;
    contentType: "video" | "text" | "quiz";
    videoUrl?: string | null;
    content?: string | null;
    duration?: string | null;
    isFree?: boolean;
}

interface Module {
    _id?: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

interface ModuleEditorProps {
    course: {
        slug: string;
        title: string;
    };
    onBack: () => void;
}

export default function ModuleEditor({ course, onBack }: Readonly<ModuleEditorProps>) {
    const queryClient = useQueryClient();
    const fetchDuration = useFetchDuration();
    const [fetchingDuration, setFetchingDuration] = useState<string | null>(null); // "mi-li" key

    const handleVideoUrlChange = async (mi: number, li: number, url: string) => {
        const updated = [...modules];
        updated[mi].lessons[li].videoUrl = url;
        setModules(updated);

        const videoId = getYouTubeVideoId(url);
        if (!videoId) return;

        const key = `${mi}-${li}`;
        setFetchingDuration(key);
        const duration = await fetchDuration(videoId);
        if (duration) {
            setModules((prev) => {
                const next = [...prev];
                if (next[mi]?.lessons[li]) {
                    next[mi].lessons[li].duration = duration;
                }
                return next;
            });
        }
        setFetchingDuration((prev) => (prev === key ? null : prev));
    };

    const { data: courseData } = useQuery({
        queryKey: ["course", course.slug],
        queryFn: () => courses.get(course.slug),
    });

    const [modules, setModules] = useState<Module[]>([]);
    const [initialized, setInitialized] = useState(false);
    const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));
    const [deleteModuleIndex, setDeleteModuleIndex] = useState<number | null>(null);

    // Initialize from fetched data
    if (courseData?.modules && !initialized) {
        setModules(
            courseData.modules.map((m: Module, i: number) => ({
                ...m,
                order: m.order ?? i,
                lessons: m.lessons?.map((l: Lesson, j: number) => ({
                    ...l,
                    order: l.order ?? j,
                })) || [],
            }))
        );
        setInitialized(true);
    }

    const saveMutation = useMutation({
        mutationFn: (data: Module[]) => courses.updateModules(course.slug, data),
        onSuccess: () => {
            toast.success("Modules saved successfully!");
            queryClient.invalidateQueries({ queryKey: ["course", course.slug] });
        },
        onError: (error: Error) => toast.error(error.message),
    });

    const handleSave = () => {
        // Validate before saving
        const errors: string[] = [];
        modules.forEach((m, mi) => {
            if (!m.title.trim()) {
                errors.push(`Module ${mi + 1}: Title is required`);
            }
            m.lessons.forEach((l, li) => {
                if (!l.title.trim()) {
                    errors.push(`Module ${mi + 1}, Lesson ${li + 1}: Title is required`);
                }
            });
        });

        if (errors.length > 0) {
            errors.forEach((e) => toast.error(e));
            return;
        }

        // Clean and reorder — preserve _id to keep enrollment data intact
        const cleaned = modules.map((m, mi) => ({
            ...(m._id ? { _id: m._id } : {}),
            title: m.title,
            order: mi,
            lessons: m.lessons.map((l, li) => ({
                    ...(l._id ? { _id: l._id } : {}),
                    title: l.title,
                    order: li,
                    contentType: l.contentType,
                    videoUrl: l.videoUrl || null,
                    content: l.content || null,
                    duration: l.duration || null,
                    isFree: l.isFree || false,
                })),
        }));
        saveMutation.mutate(cleaned);
    };

    const addModule = () => {
        setModules([...modules, { title: "", order: modules.length, lessons: [] }]);
        setExpandedModules((prev) => new Set([...prev, modules.length]));
    };

    const removeModule = (index: number) => {
        setModules(modules.filter((_, i) => i !== index));
    };

    const moveModule = (index: number, direction: "up" | "down") => {
        const target = direction === "up" ? index - 1 : index + 1;
        if (target < 0 || target >= modules.length) return;
        const updated = [...modules];
        [updated[index], updated[target]] = [updated[target], updated[index]];
        setModules(updated);
    };

    const addLesson = (moduleIndex: number) => {
        const updated = [...modules];
        updated[moduleIndex].lessons.push({
            title: "",
            order: updated[moduleIndex].lessons.length,
            contentType: "video",
            videoUrl: null,
            content: null,
            duration: null,
            isFree: false,
        });
        setModules(updated);
    };

    const removeLesson = (moduleIndex: number, lessonIndex: number) => {
        const updated = [...modules];
        updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
        setModules(updated);
    };

    const moveLesson = (moduleIndex: number, lessonIndex: number, direction: "up" | "down") => {
        const target = direction === "up" ? lessonIndex - 1 : lessonIndex + 1;
        const lessons = modules[moduleIndex].lessons;
        if (target < 0 || target >= lessons.length) return;
        const updated = [...modules];
        const lessonsCopy = [...updated[moduleIndex].lessons];
        [lessonsCopy[lessonIndex], lessonsCopy[target]] = [lessonsCopy[target], lessonsCopy[lessonIndex]];
        updated[moduleIndex].lessons = lessonsCopy;
        setModules(updated);
    };

    const toggleModuleExpand = (index: number) => {
        setExpandedModules((prev) => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const inputClass = "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Manage Modules</h2>
                        <p className="text-sm text-muted-foreground">{courseData?.title || course.title}</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saveMutation.isPending}
                    className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {saveMutation.isPending ? "Saving..." : "Save All"}
                </button>
            </div>

            {/* Modules */}
            <div className="space-y-4">
                {modules.map((module, mi) => (
                    <div key={mi} className="border border-border rounded-xl overflow-hidden bg-card">
                        {/* Module Header */}
                        <div className="flex items-center gap-2 p-3 bg-muted/30 border-b border-border">
                            <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <input
                                type="text"
                                value={module.title}
                                onChange={(e) => {
                                    const updated = [...modules];
                                    updated[mi].title = e.target.value;
                                    setModules(updated);
                                }}
                                className="flex-1 bg-transparent text-sm font-medium text-foreground focus:outline-none placeholder:text-muted-foreground"
                                placeholder="Module title..."
                            />
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                                {module.lessons.length} lessons
                            </span>
                            <div className="flex items-center gap-0.5 flex-shrink-0">
                                <button onClick={() => moveModule(mi, "up")} disabled={mi === 0} className="p-1 hover:bg-muted rounded disabled:opacity-30 cursor-pointer disabled:cursor-default">
                                    <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => moveModule(mi, "down")} disabled={mi === modules.length - 1} className="p-1 hover:bg-muted rounded disabled:opacity-30 cursor-pointer disabled:cursor-default">
                                    <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => toggleModuleExpand(mi)} className="p-1 hover:bg-muted rounded cursor-pointer">
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedModules.has(mi) ? "rotate-180" : ""}`} />
                                </button>
                                <button onClick={() => setDeleteModuleIndex(mi)} className="p-1 hover:bg-red-500/10 rounded cursor-pointer">
                                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                </button>
                            </div>
                        </div>

                        {/* Lessons */}
                        {expandedModules.has(mi) && (
                            <div className="p-3 space-y-3">
                                {module.lessons.map((lesson, li) => (
                                    <div key={li} className="p-3 border border-border/50 rounded-lg bg-background space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground w-6 text-center flex-shrink-0">
                                                {li + 1}
                                            </span>
                                            <input
                                                type="text"
                                                value={lesson.title}
                                                onChange={(e) => {
                                                    const updated = [...modules];
                                                    updated[mi].lessons[li].title = e.target.value;
                                                    setModules(updated);
                                                }}
                                                className="flex-1 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
                                                placeholder="Lesson title..."
                                            />
                                            <div className="flex items-center gap-0.5 flex-shrink-0">
                                                <button onClick={() => moveLesson(mi, li, "up")} disabled={li === 0} className="p-1 hover:bg-muted rounded disabled:opacity-30 cursor-pointer disabled:cursor-default">
                                                    <ChevronUp className="w-3 h-3" />
                                                </button>
                                                <button onClick={() => moveLesson(mi, li, "down")} disabled={li === module.lessons.length - 1} className="p-1 hover:bg-muted rounded disabled:opacity-30 cursor-pointer disabled:cursor-default">
                                                    <ChevronDown className="w-3 h-3" />
                                                </button>
                                                <button onClick={() => removeLesson(mi, li)} className="p-1 hover:bg-red-500/10 rounded cursor-pointer">
                                                    <X className="w-3 h-3 text-red-400" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Lesson details */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 ml-8">
                                            <Select
                                                value={lesson.contentType}
                                                onValueChange={(v) => {
                                                    const updated = [...modules];
                                                    updated[mi].lessons[li].contentType = v as "video" | "text" | "quiz";
                                                    setModules(updated);
                                                }}
                                            >
                                                <SelectTrigger className={`${inputClass} text-xs`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="video">Video</SelectItem>
                                                    <SelectItem value="text">Text</SelectItem>
                                                    <SelectItem value="quiz">Quiz</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {lesson.contentType !== "quiz" && (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={lesson.duration || ""}
                                                        onChange={(e) => {
                                                            const updated = [...modules];
                                                            updated[mi].lessons[li].duration = e.target.value;
                                                            setModules(updated);
                                                        }}
                                                        className={`${inputClass} text-xs ${fetchingDuration === `${mi}-${li}` ? "pr-8" : ""}`}
                                                        placeholder="Duration (e.g. 7:56)"
                                                    />
                                                    {fetchingDuration === `${mi}-${li}` && (
                                                        <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-muted-foreground" />
                                                    )}
                                                </div>
                                            )}
                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <span className={`text-xs ${lesson.isFree ? "text-primary" : "text-muted-foreground"}`}>
                                                    {lesson.isFree ? "Free" : "Paid"}
                                                </span>
                                                <button
                                                    type="button"
                                                    role="switch"
                                                    aria-checked={lesson.isFree || false}
                                                    onClick={() => {
                                                        const updated = [...modules];
                                                        updated[mi].lessons[li].isFree = !lesson.isFree;
                                                        setModules(updated);
                                                    }}
                                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                                                        lesson.isFree ? "bg-primary" : "bg-border"
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                                                            lesson.isFree ? "translate-x-4.5" : "translate-x-0.75"
                                                        }`}
                                                    />
                                                </button>
                                            </label>
                                        </div>

                                        {/* Video URL or content */}
                                        <div className="ml-8">
                                            {lesson.contentType === "video" ? (
                                                <input
                                                    type="text"
                                                    value={lesson.videoUrl || ""}
                                                    onChange={(e) => handleVideoUrlChange(mi, li, e.target.value)}
                                                    className={`${inputClass} text-xs`}
                                                    placeholder="YouTube video URL (private/unlisted)"
                                                />
                                            ) : lesson.contentType === "text" ? (
                                                <LessonDescription
                                                    value={lesson.content || ""}
                                                    onChange={(val) => {
                                                        const updated = [...modules];
                                                        updated[mi].lessons[li].content = val;
                                                        setModules(updated);
                                                    }}
                                                    inputClass={inputClass}
                                                    placeholder="Markdown content..."
                                                    rows={4}
                                                    noWrapper
                                                />
                                            ) : lesson.contentType === "quiz" ? (
                                                <QuizEditor
                                                    value={lesson.content || "[]"}
                                                    onChange={(val) => {
                                                        const updated = [...modules];
                                                        updated[mi].lessons[li].content = val;
                                                        // Auto-calculate duration based on question count
                                                        try {
                                                            const questions = JSON.parse(val);
                                                            if (Array.isArray(questions)) {
                                                                const count = questions.length;
                                                                updated[mi].lessons[li].duration = count > 0 ? `${count} question${count > 1 ? "s" : ""}` : null;
                                                            }
                                                        } catch { /* noop */ }
                                                        setModules(updated);
                                                    }}
                                                    inputClass={inputClass}
                                                />
                                            ) : null}
                                        </div>

                                        {/* Optional description note for video lessons */}
                                        {lesson.contentType === "video" && (
                                            <LessonDescription
                                                value={lesson.content || ""}
                                                onChange={(val) => {
                                                    const updated = [...modules];
                                                    updated[mi].lessons[li].content = val;
                                                    setModules(updated);
                                                }}
                                                inputClass={inputClass}
                                            />
                                        )}
                                    </div>
                                ))}

                                <button
                                    onClick={() => addLesson(mi)}
                                    className="flex items-center gap-1.5 text-sm text-primary hover:underline cursor-pointer px-2"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Lesson
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                <button
                    onClick={addModule}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Add Module
                </button>
            </div>

            {deleteModuleIndex !== null && (
                <ConfirmDialog
                    open={true}
                    onOpenChange={() => setDeleteModuleIndex(null)}
                    title="Delete Module"
                    description={`Are you sure you want to delete "${modules[deleteModuleIndex]?.title || "Untitled Module"}"? All lessons in this module will be removed. This action cannot be undone.`}
                    onConfirm={() => {
                        removeModule(deleteModuleIndex);
                        setDeleteModuleIndex(null);
                    }}
                    confirmText="Delete"
                    variant="danger"
                />
            )}
        </div>
    );
}
