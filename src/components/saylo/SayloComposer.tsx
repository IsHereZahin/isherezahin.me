"use client";

import { BlurImage, ToolDropdown } from "@/components/ui";
import { PERSON } from "@/config/seo.config";
import { parseMarkdown } from "@/lib/markdown";
import { cloudinary, saylo } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Globe, ImagePlus, Loader2, Lock, Send, UserIcon, Users, Video, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Category, MediaItem } from "@/utils/types";
import CategorySelector from "./CategorySelector";

interface SayloComposerProps {
    onSuccess?: () => void;
}

export default function SayloComposer({ onSuccess }: Readonly<SayloComposerProps>) {
    const { user, isAdmin } = useAuth();
    const [content, setContent] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [newCategory, setNewCategory] = useState<string | null>(null);
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [visibility, setVisibility] = useState<"public" | "authenticated" | "private">("public");
    const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const visibilityRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    const visibilityOptions = [
        { value: "public", label: "Public", icon: Globe, description: "Anyone can see" },
        { value: "authenticated", label: "Signed In", icon: Users, description: "Only signed in users" },
        { value: "private", label: "Only Me", icon: Lock, description: "Only you can see" },
    ] as const;

    // Click outside handler for visibility dropdown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (visibilityRef.current && !visibilityRef.current.contains(e.target as Node)) {
                setShowVisibilityDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const { data: categoriesData } = useQuery({
        queryKey: ["sayloCategories"],
        queryFn: () => saylo.getCategories(),
    });

    const createMutation = useMutation({
        mutationFn: async () => {
            return saylo.create({
                content,
                category: selectedCategory,
                newCategory: newCategory,
                images: media.filter((m) => m.type === "image").map((m) => m.url),
                videos: media.filter((m) => m.type === "video").map((m) => m.url),
                visibility,
            });
        },
        onSuccess: () => {
            setContent("");
            setSelectedCategory(null);
            setNewCategory(null);
            setMedia([]);
            setVisibility("public");
            queryClient.invalidateQueries({ queryKey: ["saylos"] });
            queryClient.invalidateQueries({ queryKey: ["sayloCategories"] });
            toast.success("Posted successfully");
            onSuccess?.();
        },
        onError: () => {
            toast.error("Failed to post");
        },
    });

    const currentVisibility = visibilityOptions.find((v) => v.value === visibility)!;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newMedia: MediaItem[] = [];

        for (const file of Array.from(files)) {
            const isVideoByType = file.type.startsWith("video/") || /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(file.name);

            try {
                const data = await cloudinary.upload(file);
                const isVideoFile = data.resource_type === "video" || data.url?.includes("/video/") || isVideoByType;
                newMedia.push({ url: data.url, type: isVideoFile ? "video" : "image" });
            } catch (err) {
                console.error("Upload error:", err);
                toast.error(`Failed to upload ${file.name}`);
            }
        }

        setMedia((prev) => [...prev, ...newMedia]);
        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeMedia = (index: number) => {
        setMedia((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCategoryChange = (category: string | null) => {
        setSelectedCategory(category);
        const isExisting = categoriesData?.categories.some((c: Category) => c.name === category);
        if (category && !isExisting) {
            setNewCategory(category);
        } else {
            setNewCategory(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || createMutation.isPending) return;
        createMutation.mutate();
    };

    const insertMarkdown = (before: string, after: string, placeholder = "") => {
        const input = textareaRef.current;
        if (!input) return;

        const start = input.selectionStart;
        const end = input.selectionEnd;
        const selected = content.substring(start, end) || placeholder;

        const newText = content.slice(0, start) + before + selected + after + content.slice(end);
        setContent(newText);

        setTimeout(() => {
            input.focus();
            const newCursorPos = start + before.length + selected.length;
            input.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    // Auto-resize textarea based on content
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [content]);

    // Only admin can post
    if (!isAdmin) {
        return null;
    }

    return (
        <div className="relative">
            <form
                onSubmit={handleSubmit}
                className="relative rounded-xl p-4 flex flex-col sm:flex-row items-start gap-4 border border-border/50 bg-card hover:border-border/80 transition-all"
            >
                {/* Avatar */}
                <div className="shrink-0 hidden sm:block">
                    {user?.image ? (
                        <BlurImage
                            src={user.image}
                            alt={user.name || PERSON.name.full}
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
                    {showPreview ? (
                        <div
                            className="w-full min-h-20 rounded-lg p-3 bg-secondary/50 text-foreground text-sm prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: content ? parseMarkdown(content) : '<span class="text-muted-foreground italic">Nothing to preview</span>'
                            }}
                        />
                    ) : (
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full border-none outline-none text-sm resize-none min-h-20 overflow-auto rounded-lg p-3 focus:ring-2 focus:ring-primary/20 transition-all bg-secondary/50 text-foreground placeholder:text-muted-foreground disabled:opacity-50 modal-scrollbar"
                            rows={3}
                            disabled={createMutation.isPending}
                        />
                    )}

                    {/* Media Previews */}
                    {media.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {media.map((item, index) => (
                                <div key={`media-${item.url}`} className="relative group">
                                    {item.type === "video" ? (
                                        <div className="relative w-20 h-20 bg-accent rounded-lg flex items-center justify-center overflow-hidden">
                                            <video src={item.url} className="w-full h-full object-cover" muted />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <Video className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <Image
                                            src={item.url}
                                            alt={`Upload ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeMedia(index)}
                                        className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions row - single row always */}
                    <div className="mt-3 flex items-center gap-2">
                        {/* Format Dropdown */}
                        <ToolDropdown
                            onInsert={insertMarkdown}
                            disabled={createMutation.isPending || showPreview}
                            size="sm"
                        />

                        {/* Preview Button */}
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            disabled={createMutation.isPending}
                            className={`px-2 py-1.5 text-xs rounded transition-colors ${showPreview
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                } ${createMutation.isPending ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                        >
                            Preview
                        </button>

                        {/* Separator */}
                        <div className="h-4 w-px bg-border/50" />

                        <div className="flex items-center gap-2 ml-auto">
                            {/* Media Upload */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading || createMutation.isPending}
                                className="p-1 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors cursor-pointer disabled:opacity-50"
                                title="Add images or videos"
                            >
                                {isUploading ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> : <ImagePlus className="w-3 h-3 sm:w-4 sm:h-4" />}
                            </button>

                            {/* Category Selector */}
                            <CategorySelector
                                categories={categoriesData?.categories || []}
                                selectedCategory={selectedCategory}
                                onCategoryChange={handleCategoryChange}
                                allowCreate={true}
                            />

                            {/* Visibility Selector */}
                            <div className="relative" ref={visibilityRef}>
                                <button
                                    type="button"
                                    onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
                                    className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors cursor-pointer"
                                    title={currentVisibility.description}
                                >
                                    <currentVisibility.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline text-xs">{currentVisibility.label}</span>
                                </button>
                                {showVisibilityDropdown && (
                                    <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 min-w-40">
                                        {visibilityOptions.map((option) => (
                                            <button
                                                type="button"
                                                key={option.value}
                                                onClick={() => {
                                                    setVisibility(option.value);
                                                    setShowVisibilityDropdown(false);
                                                }}
                                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent/50 transition-colors cursor-pointer first:rounded-t-lg last:rounded-b-lg ${visibility === option.value ? "text-primary bg-accent/30" : "text-foreground"}`}
                                            >
                                                <option.icon className="w-4 h-4" />
                                                <div className="text-left">
                                                    <div className="font-medium">{option.label}</div>
                                                    <div className="text-xs text-muted-foreground">{option.description}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={!content.trim() || createMutation.isPending}
                                className="rounded-lg p-2 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Post"
                            >
                                {createMutation.isPending ? (
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
    );
}
