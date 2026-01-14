"use client";

import { cloudinary } from "@/lib/api";
import { MediaItem } from "@/utils/types";
import { ImagePlus, Loader2, Video, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface MediaUploaderProps {
    media: MediaItem[];
    onMediaChange: (media: MediaItem[]) => void;
    maxFiles?: number;
}

export default function MediaUploader({ media, onMediaChange, maxFiles = 10 }: Readonly<MediaUploaderProps>) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (media.length + files.length > maxFiles) {
            toast.error(`Maximum ${maxFiles} files allowed`);
            return;
        }

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

        onMediaChange([...media, ...newMedia]);
        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeMedia = (index: number) => {
        onMediaChange(media.filter((_, i) => i !== index));
    };

    return (
        <>
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

            {/* Upload Button */}
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
        </>
    );
}
