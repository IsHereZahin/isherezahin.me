"use client";

import { Loader2 } from "lucide-react";
import { isValidImageUrl } from "./ImageUploadField";

interface ImagePreviewProps {
    url: string;
    isLoading?: boolean;
    height?: string;
    alt?: string;
}

export default function ImagePreview({
    url,
    isLoading = false,
    height = "h-40",
    alt = "Preview",
}: Readonly<ImagePreviewProps>) {
    if (!url || !isValidImageUrl(url)) return null;

    return (
        <div className={`rounded-lg overflow-hidden border bg-muted/30 relative ${height}`}>
            {isLoading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                    <Loader2 className="h-8 w-8 animate-spin text-foreground" />
                </div>
            )}
            <img
                src={url}
                alt={alt}
                className={`w-full ${height} object-cover`}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
        </div>
    );
}
