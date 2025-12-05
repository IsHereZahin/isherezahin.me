"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, ImageIcon, Loader2, Tags as TagsIcon, Trash2, Type, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/shadcn-button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { updateBlog } from "@/lib/api";
import { Blog } from "@/utils/types";

const isValidImageUrl = (url: string) => {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|ico)(\?.*)?$/i;
        const imageHosts = ['cloudinary.com', 'unsplash.com', 'imgur.com', 'githubusercontent.com', 'vercel.app', 'res.cloudinary.com'];
        // Check if URL has image extension OR is from known image hosts
        return imageExtensions.test(parsed.pathname) || imageHosts.some(host => parsed.hostname.includes(host));
    } catch { return false; }
};

const isCloudinaryUrl = (url: string) => url?.includes('res.cloudinary.com');

const blogFormSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    excerpt: z.string().min(1, "Excerpt is required").max(500),
    tags: z.string(),
    imageSrc: z.string().min(1, "Image URL is required").url().refine(isValidImageUrl, "Must be a valid image URL"),
    content: z.string().min(1, "Content is required"),
    published: z.boolean(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface EditBlogModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    blog: Blog;
    onSuccess?: (newSlug: string) => void;
}

export default function EditBlogModal({ open, onOpenChange, blog, onSuccess }: Readonly<EditBlogModalProps>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showDeleteImageAlert, setShowDeleteImageAlert] = useState(false);
    const [pendingNewImage, setPendingNewImage] = useState<string | null>(null);
    const [originalImageSrc] = useState(blog.imageSrc);
    const queryClient = useQueryClient();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(blogFormSchema),
        defaultValues: {
            title: blog.title,
            excerpt: blog.excerpt,
            tags: blog.tags.join(", "),
            imageSrc: blog.imageSrc,
            content: blog.content,
            published: blog.published,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                title: blog.title,
                excerpt: blog.excerpt,
                tags: blog.tags.join(", "),
                imageSrc: blog.imageSrc,
                content: blog.content,
                published: blog.published,
            });
        }
    }, [open, blog, form]);

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
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/cloudinary', { method: 'POST', body: formData });
            const result = await response.json();

            if (!response.ok) throw new Error(result.error);

            const currentImage = form.getValues('imageSrc');
            if (isCloudinaryUrl(currentImage) && currentImage !== originalImageSrc) {
                // If there's already a new uploaded image, delete it
                await fetch(`/api/cloudinary?url=${encodeURIComponent(currentImage)}`, { method: 'DELETE' });
            }

            // Check if we should ask about deleting the original image
            if (isCloudinaryUrl(originalImageSrc) && currentImage === originalImageSrc) {
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
        if (!pendingNewImage) {
            setPendingNewImage(null);
            setShowDeleteImageAlert(false);
            return;
        }

        const newImageUrl = pendingNewImage;

        if (deleteOld && isCloudinaryUrl(originalImageSrc)) {
            try {
                await fetch(`/api/cloudinary?url=${encodeURIComponent(originalImageSrc)}`, { method: 'DELETE' });
                toast.success('Old image deleted');
            } catch {
                toast.error('Failed to delete old image');
            }
        }

        // Set the new image URL in the form
        form.setValue('imageSrc', newImageUrl);

        // Auto-save the blog with the new image URL to prevent the old URL from coming back
        try {
            const currentValues = form.getValues();
            const tagsArray = currentValues.tags ? currentValues.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
            await updateBlog(blog.slug, {
                title: currentValues.title,
                excerpt: currentValues.excerpt,
                tags: tagsArray,
                imageSrc: newImageUrl,
                content: currentValues.content,
                published: currentValues.published,
            });
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            queryClient.invalidateQueries({ queryKey: ["blog", blog.slug] });
            toast.success('Image updated and saved');
        } catch (error) {
            toast.error('Image updated but failed to auto-save. Please save manually.');
        }

        setPendingNewImage(null);
        setShowDeleteImageAlert(false);
    };

    const insertMarkdown = useCallback((before: string, after: string, placeholder = "") => {
        const input = textareaRef.current;
        if (!input) return;
        const content = form.getValues("content");
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const selected = content.substring(start, end) || placeholder;
        form.setValue("content", content.slice(0, start) + before + selected + after + content.slice(end));
        setTimeout(() => { input.focus(); input.setSelectionRange(start + before.length + selected.length, start + before.length + selected.length); }, 0);
    }, [form]);

    const onSubmit = async (data: BlogFormValues) => {
        setIsSubmitting(true);
        try {
            const tagsArray = data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
            const result = await updateBlog(blog.slug, {
                title: data.title, excerpt: data.excerpt, tags: tagsArray,
                imageSrc: data.imageSrc, content: data.content, published: data.published,
            });
            toast.success("Blog updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            queryClient.invalidateQueries({ queryKey: ["blog", blog.slug] });
            onOpenChange(false);
            if (result.slug !== blog.slug && onSuccess) onSuccess(result.slug);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update blog");
        } finally { setIsSubmitting(false); }
    };

    const contentValue = form.watch("content");
    const imageUrl = form.watch("imageSrc");

    let buttonText = "Save Changes";

    if (isSubmitting) {
        buttonText = "Saving...";
    } else if (isUploading) {
        buttonText = "Uploading...";
    }
    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[750px] p-0 gap-0 flex flex-col max-h-[85vh]">
                    <div className="flex-shrink-0 bg-background border-b px-6 py-4 rounded-t-lg">
                        <DialogHeader>
                            <DialogTitle className="text-xl flex items-center gap-2 pr-8"><FileText className="h-5 w-5 text-foreground" />Edit Blog Post</DialogTitle>
                            <DialogDescription>Update your blog post details.</DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-4 modal-scrollbar">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem><FormLabel className="flex items-center gap-2"><Type className="h-4 w-4 text-muted-foreground" />Title</FormLabel>
                                        <FormControl><Input className="h-11 text-base" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />

                                <FormField control={form.control} name="excerpt" render={({ field }) => (
                                    <FormItem><FormLabel>Summary</FormLabel>
                                        <FormControl><Textarea className="resize-none min-h-[80px]" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="imageSrc" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2"><ImageIcon className="h-4 w-4 text-muted-foreground" />Cover Image</FormLabel>
                                            <div className="flex gap-2">
                                                <FormControl><Input {...field} className="flex-1" /></FormControl>
                                                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} className="hidden" />
                                                <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                                                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="tags" render={({ field }) => (
                                        <FormItem><FormLabel className="flex items-center gap-2"><TagsIcon className="h-4 w-4 text-muted-foreground" />Tags</FormLabel>
                                            <FormControl><Input {...field} /></FormControl><FormDescription className="text-xs">Comma-separated</FormDescription><FormMessage /></FormItem>
                                    )} />
                                </div>

                                {/* Image Preview */}
                                {imageUrl && isValidImageUrl(imageUrl) && (
                                    <div className="rounded-lg overflow-hidden border bg-muted/30 relative">
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                                                <Loader2 className="h-8 w-8 animate-spin text-foreground" />
                                            </div>
                                        )}
                                        <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                                    </div>
                                )}

                                <FormField control={form.control} name="content" render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between"><FormLabel>Content</FormLabel>
                                            <button type="button" onClick={() => setShowPreview((p) => !p)} className={`rounded-md px-3 py-1.5 text-xs font-medium ${showPreview ? "bg-foreground text-background" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                                                {showPreview ? "Edit" : "Preview"}
                                            </button>
                                        </div>
                                        <FormControl>
                                            {showPreview ? (
                                                <div className="min-h-[200px] rounded-lg border p-4 bg-card">
                                                    {contentValue ? <MarkdownPreview content={contentValue} /> : <p className="italic text-sm text-muted-foreground">Nothing to preview</p>}
                                                </div>
                                            ) : (
                                                <div className="border rounded-lg overflow-hidden">
                                                    <div className="bg-muted/50 border-b px-3 py-2"><MarkdownToolbar onInsert={insertMarkdown} /></div>
                                                    <Textarea {...field} ref={textareaRef} className="border-0 rounded-none focus-visible:ring-0 min-h-[200px] resize-none" />
                                                </div>
                                            )}
                                        </FormControl><FormMessage />
                                    </FormItem>
                                )} />

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <FormField control={form.control} name="published" render={({ field }) => (
                                        <FormItem className="flex items-center gap-3">
                                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <div className="space-y-0.5">
                                                <FormLabel className="cursor-pointer">{field.value ? "Published" : "Draft"}</FormLabel>
                                                <FormDescription className="text-xs">{field.value ? "Visible to everyone" : "Only visible to you"}</FormDescription>
                                            </div>
                                        </FormItem>
                                    )} />
                                    <div className="flex gap-3">
                                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>Cancel</Button>
                                        <Button type="submit" disabled={isSubmitting || isUploading}>
                                            {buttonText}
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
                        <AlertDialogTitle className="flex items-center gap-2"><Trash2 className="h-5 w-5 text-destructive" />Delete Old Image?</AlertDialogTitle>
                        <AlertDialogDescription>Do you want to delete the old image from Cloudinary? This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => handleDeleteOldImage(false)}>Keep Old Image</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteOldImage(true)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete Old Image</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
