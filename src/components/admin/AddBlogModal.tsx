"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, ImageIcon, Loader2, Tags as TagsIcon, Trash2, Type, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import MarkdownPreview from "@/components/content/discussions/MarkdownPreview";
import MarkdownToolbar from "@/components/content/discussions/MarkdownToolbar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/shadcn-button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createBlog } from "@/lib/api";

// Helper to validate image URL
const isValidImageUrl = (url: string) => {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|ico)(\?.*)?$/i;
        const imageHosts = ['cloudinary.com', 'unsplash.com', 'imgur.com', 'githubusercontent.com', 'vercel.app', 'res.cloudinary.com'];
        return imageExtensions.test(parsed.pathname) || imageHosts.some(host => parsed.hostname.includes(host));
    } catch { return false; }
};

const isCloudinaryUrl = (url: string) => url?.includes('res.cloudinary.com');

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
};

const blogFormSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
    excerpt: z.string().min(1, "Excerpt is required").max(500, "Excerpt is too long"),
    tags: z.string(),
    imageSrc: z.string().min(1, "Image URL is required").url("Must be a valid URL")
        .refine(isValidImageUrl, "Must be a valid image URL (e.g., ending in .jpg, .png, or from cloudinary/unsplash)"),
    content: z.string().min(1, "Content is required"),
    published: z.boolean(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface AddBlogModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AddBlogModal({ open, onOpenChange }: Readonly<AddBlogModalProps>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showDeleteImageAlert, setShowDeleteImageAlert] = useState(false);
    const [pendingNewImage, setPendingNewImage] = useState<string | null>(null);
    const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(blogFormSchema),
        defaultValues: {
            title: "",
            excerpt: "",
            tags: "",
            imageSrc: "",
            content: "",
            published: false,
        },
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error('Image must be less than 5MB'); return; }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('/api/cloudinary', { method: 'POST', body: formData });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            const currentImage = form.getValues('imageSrc');

            // If there's already a Cloudinary image, ask user if they want to delete it
            if (isCloudinaryUrl(currentImage)) {
                setPreviousImageUrl(currentImage);
                setPendingNewImage(result.url);
                setShowDeleteImageAlert(true);
            } else {
                form.setValue('imageSrc', result.url);
                toast.success('Image uploaded successfully');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Upload failed');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDeleteOldImage = async (deleteOld: boolean) => {
        if (deleteOld && previousImageUrl && isCloudinaryUrl(previousImageUrl)) {
            try {
                await fetch(`/api/cloudinary?url=${encodeURIComponent(previousImageUrl)}`, { method: 'DELETE' });
                toast.success('Old image deleted');
            } catch {
                toast.error('Failed to delete old image');
            }
        }
        if (pendingNewImage) {
            form.setValue('imageSrc', pendingNewImage);
            toast.success('Image updated');
        }
        setPendingNewImage(null);
        setPreviousImageUrl(null);
        setShowDeleteImageAlert(false);
    };

    // Insert markdown syntax at cursor position
    const insertMarkdown = useCallback((before: string, after: string, placeholder = "") => {
        const input = textareaRef.current;
        if (!input) return;

        const content = form.getValues("content");
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const selected = content.substring(start, end) || placeholder;

        const newContent = content.slice(0, start) + before + selected + after + content.slice(end);
        form.setValue("content", newContent);

        setTimeout(() => {
            input.focus();
            const newCursorPos = start + before.length + selected.length;
            input.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    }, [form]);

    const onSubmit = async (data: BlogFormValues) => {
        setIsSubmitting(true);
        try {
            const tagsArray = data.tags
                ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
                : [];

            const slug = generateSlug(data.title);

            await createBlog({
                title: data.title,
                slug,
                excerpt: data.excerpt,
                tags: tagsArray,
                imageSrc: data.imageSrc,
                content: data.content,
                published: data.published,
            });

            toast.success("Blog created successfully!");
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            form.reset();
            setShowPreview(false);
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create blog");
        } finally {
            setIsSubmitting(false);
        }
    };

    const contentValue = form.watch("content");
    const imageUrl = form.watch("imageSrc");

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[750px] p-0 gap-0 flex flex-col max-h-[85vh]">
                    {/* Fixed Header */}
                    <div className="flex-shrink-0 bg-background border-b px-6 py-4 rounded-t-lg">
                        <DialogHeader>
                            <DialogTitle className="text-xl flex items-center gap-2 pr-8">
                                <FileText className="h-5 w-5 text-foreground" />
                                Create New Blog Post
                            </DialogTitle>
                            <DialogDescription>
                                Share your thoughts with the world. Fill in the details below.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 modal-scrollbar">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Title Section */}
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                    <Type className="h-4 w-4 text-muted-foreground" />
                                                    Title
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter an engaging title for your blog post"
                                                        className="h-11 text-base"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="excerpt"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">Summary</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Write a brief summary that will appear in blog listings..."
                                                        className="resize-none min-h-[80px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Image & Tags Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="imageSrc"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                    Cover Image
                                                </FormLabel>
                                                <div className="flex gap-2">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="https://example.com/image.jpg"
                                                            {...field}
                                                            className="flex-1"
                                                        />
                                                    </FormControl>
                                                    <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} className="hidden" />
                                                    <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                                                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="tags"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                    <TagsIcon className="h-4 w-4 text-muted-foreground" />
                                                    Tags
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="react, nextjs, typescript"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Separate tags with commas
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Image Preview */}
                                {imageUrl && isValidImageUrl(imageUrl) && (
                                    <div className="rounded-lg overflow-hidden border bg-muted/30 relative">
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                                                <Loader2 className="h-8 w-8 animate-spin text-foreground" />
                                            </div>
                                        )}
                                        <img
                                            src={imageUrl}
                                            alt="Cover preview"
                                            className="w-full h-40 object-cover"
                                            onError={(e) => e.currentTarget.style.display = 'none'}
                                        />
                                    </div>
                                )}

                                {/* Content Section */}
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel className="text-sm font-medium">Content</FormLabel>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">Markdown supported</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPreview((p) => !p)}
                                                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${showPreview
                                                            ? "bg-foreground text-background"
                                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                                            }`}
                                                    >
                                                        {showPreview ? "Edit" : "Preview"}
                                                    </button>
                                                </div>
                                            </div>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    {showPreview ? (
                                                        <div className="min-h-[200px] rounded-lg border p-4 bg-card">
                                                            {contentValue ? (
                                                                <MarkdownPreview content={contentValue} />
                                                            ) : (
                                                                <p className="italic text-sm text-muted-foreground">Nothing to preview</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="border rounded-lg overflow-hidden">
                                                            <div className="bg-muted/50 border-b px-3 py-2">
                                                                <MarkdownToolbar onInsert={insertMarkdown} />
                                                            </div>
                                                            <Textarea
                                                                {...field}
                                                                ref={textareaRef}
                                                                placeholder="Write your blog content here..."
                                                                className="border-0 rounded-none focus-visible:ring-0 min-h-[200px] resize-none"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Footer Actions */}
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <FormField
                                        control={form.control}
                                        name="published"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center gap-3">
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-sm font-medium cursor-pointer">
                                                        {field.value ? "Published" : "Draft"}
                                                    </FormLabel>
                                                    <FormDescription className="text-xs">
                                                        {field.value ? "Visible to everyone" : "Only visible to you"}
                                                    </FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => onOpenChange(false)}
                                            disabled={isUploading}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting || isUploading}>
                                            {isSubmitting ? "Creating..." : isUploading ? "Uploading..." : "Create Blog"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Old Image Confirmation */}
            <AlertDialog open={showDeleteImageAlert} onOpenChange={setShowDeleteImageAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-destructive" />
                            Delete Old Image?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Do you want to delete the old image from Cloudinary? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => handleDeleteOldImage(false)}>Keep Old Image</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteOldImage(true)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete Old Image
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
