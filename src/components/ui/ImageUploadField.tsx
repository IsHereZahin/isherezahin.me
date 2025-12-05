"use client";

import { ImageIcon, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { FormControl, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";
import { Button } from "./shadcn-button";

// Helper to validate image URL
export const isValidImageUrl = (url: string) => {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|ico)(\?.*)?$/i;
        const imageHosts = ['cloudinary.com', 'unsplash.com', 'imgur.com', 'githubusercontent.com', 'vercel.app', 'res.cloudinary.com'];
        return imageExtensions.test(parsed.pathname) || imageHosts.some(host => parsed.hostname.includes(host));
    } catch { return false; }
};

export const isCloudinaryUrl = (url: string) => url?.includes('res.cloudinary.com');

interface ImageUploadFieldProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    placeholder?: string;
    onUploadStart?: () => void;
    onUploadEnd?: () => void;
    onPreviousImageDetected?: (previousUrl: string, newUrl: string) => void;
    disabled?: boolean;
}

export default function ImageUploadField({
    value,
    onChange,
    label = "Cover Image",
    placeholder = "https://example.com/image.jpg",
    onUploadStart,
    onUploadEnd,
    onPreviousImageDetected,
    disabled = false,
}: Readonly<ImageUploadFieldProps>) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB');
            return;
        }

        setIsUploading(true);
        onUploadStart?.();

        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('/api/cloudinary', { method: 'POST', body: formData });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            // Check if there's a previous Cloudinary image
            if (isCloudinaryUrl(value) && onPreviousImageDetected) {
                onPreviousImageDetected(value, result.url);
            } else {
                onChange(result.url);
                toast.success('Image uploaded successfully');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Upload failed');
        } finally {
            setIsUploading(false);
            onUploadEnd?.();
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <FormItem>
            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                {label}
            </FormLabel>
            <div className="flex gap-2">
                <FormControl>
                    <Input
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="flex-1"
                        disabled={disabled || isUploading}
                    />
                </FormControl>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || isUploading}
                >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
            </div>
            <FormMessage />
        </FormItem>
    );
}
