"use client";

import MarkdownTextarea from "@/components/ui/MarkdownTextarea";
import { cloudinary, saylo } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Globe, ImagePlus, Loader2, Lock, Send, Users, Video, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Category, MediaItem } from "@/utils/types";
import CategorySelector from "./CategorySelector";

interface SayloComposerProps {
    onSuccess?: () => void;
}

export default function SayloComposer({ onSuccess }: Readonly<SayloComposerProps>) {
    const [content, setContent] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [newCategory, setNewCategory] = useState<string | null>(null);
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [visibility, setVisibility] = useState<"public" | "authenticated" | "private">("public");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    const visibilityOptions = [
        { value: "public", label: "Public", icon: Globe, description: "Anyone can see" },
        { value: "authenticated", label: "Signed In", icon: Users, description: "Only signed in users" },
        { value: "private", label: "Only Me", icon: Lock, description: "Only you can see" },
    ] as const;

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
        // Check if this is a new category (not in existing categories)
        const isExisting = categoriesData?.categories.some((c: Category) => c.name === category);
        if (category && !isExisting) {
            setNewCategory(category);
        } else {
            setNewCategory(null);
        }
    };

    return (
        <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-4">
            <MarkdownTextarea value={content} onChange={setContent} placeholder="What's on your mind?" rows={3} />

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
                                onClick={() => removeMedia(index)}
                                className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
                <div className="flex items-center gap-2">
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
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors cursor-pointer"
                        title="Add images or videos"
                    >
                        {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
                    </button>

                    {/* Category Selector */}
                    <CategorySelector
                        categories={categoriesData?.categories || []}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                        allowCreate={true}
                    />

                    {/* Visibility Selector */}
                    <div className="relative group">
                        <button
                            className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors cursor-pointer"
                            title={currentVisibility.description}
                        >
                            <currentVisibility.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{currentVisibility.label}</span>
                        </button>
                        <div className="absolute left-0 bottom-full mb-1 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-40">
                            {visibilityOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setVisibility(option.value)}
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
                    </div>
                </div>

                <button
                    onClick={() => createMutation.mutate()}
                    disabled={!content.trim() || createMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
                >
                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Post
                </button>
            </div>
        </div>
    );
}
