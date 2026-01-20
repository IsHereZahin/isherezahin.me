"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Tags as TagsIcon, Type } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
    ConfirmDialog,
    Form,
    FormActions,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormModal,
    ImagePreview,
    ImageUploadField,
    Input,
    isCloudinaryUrl,
    isValidImageUrl,
    MarkdownEditor,
    PublishToggle,
    Textarea,
} from "@/components/ui";
import { cloudinary, updateBlog } from "@/lib/api";
import { Blog } from "@/utils/types";

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
    const [isUploading, setIsUploading] = useState(false);
    const [showDeleteImageAlert, setShowDeleteImageAlert] = useState(false);
    const [pendingNewImage, setPendingNewImage] = useState<string | null>(null);
    const [originalImageSrc] = useState(blog.imageSrc);
    const queryClient = useQueryClient();

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(blogFormSchema),
        defaultValues: {
            title: blog.title, excerpt: blog.excerpt, tags: blog.tags.join(", "),
            imageSrc: blog.imageSrc, content: blog.content, published: blog.published,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                title: blog.title, excerpt: blog.excerpt, tags: blog.tags.join(", "),
                imageSrc: blog.imageSrc, content: blog.content, published: blog.published,
            });
        }
    }, [open, blog, form]);

    const handlePreviousImageDetected = (prevUrl: string, newUrl: string) => {
        // If there's already a new uploaded image (not original), delete it first
        if (isCloudinaryUrl(prevUrl) && prevUrl !== originalImageSrc) {
            cloudinary.delete(prevUrl);
        }
        // If current image is the original, ask about deleting it
        if (isCloudinaryUrl(originalImageSrc) && prevUrl === originalImageSrc) {
            setPendingNewImage(newUrl);
            setShowDeleteImageAlert(true);
        } else {
            form.setValue('imageSrc', newUrl);
            toast.success('Image uploaded successfully');
        }
    };

    const handleDeleteOldImage = async (deleteOld: boolean) => {
        if (!pendingNewImage) {
            setShowDeleteImageAlert(false);
            return;
        }
        const newImageUrl = pendingNewImage;

        if (deleteOld && isCloudinaryUrl(originalImageSrc)) {
            try {
                await cloudinary.delete(originalImageSrc);
                toast.success('Old image deleted');
            } catch { toast.error('Failed to delete old image'); }
        }

        form.setValue('imageSrc', newImageUrl);

        // Auto-save to prevent old URL from coming back
        try {
            const currentValues = form.getValues();
            const tagsArray = currentValues.tags ? currentValues.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
            await updateBlog(blog.slug, {
                title: currentValues.title, excerpt: currentValues.excerpt, tags: tagsArray,
                imageSrc: newImageUrl, content: currentValues.content, published: currentValues.published,
            });
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            queryClient.invalidateQueries({ queryKey: ["blog", blog.slug] });
            toast.success('Image updated and saved');
        } catch { toast.error('Image updated but failed to auto-save. Please save manually.'); }

        setPendingNewImage(null);
        setShowDeleteImageAlert(false);
    };

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

    const imageUrl = form.watch("imageSrc");
    const getSubmitText = () => {
        if (isSubmitting) return "Saving...";
        if (isUploading) return "Uploading...";
        return "Save Changes";
    };

    return (
        <>
            <FormModal open={open} onOpenChange={onOpenChange} title="Edit Blog Post"
                description="Update your blog post details." icon={FileText}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2"><Type className="h-4 w-4 text-muted-foreground" />Title</FormLabel>
                                <FormControl><Input className="h-11 text-base" {...field} /></FormControl><FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="excerpt" render={({ field }) => (
                            <FormItem><FormLabel>Summary</FormLabel>
                                <FormControl><Textarea className="resize-none min-h-[80px]" {...field} /></FormControl><FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="imageSrc" render={({ field }) => (
                                <ImageUploadField value={field.value} onChange={field.onChange}
                                    onUploadStart={() => setIsUploading(true)} onUploadEnd={() => setIsUploading(false)}
                                    onPreviousImageDetected={handlePreviousImageDetected} />
                            )} />
                            <FormField control={form.control} name="tags" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><TagsIcon className="h-4 w-4 text-muted-foreground" />Tags</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormDescription className="text-xs">Comma-separated</FormDescription><FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <ImagePreview url={imageUrl} isLoading={isUploading} />

                        <FormField control={form.control} name="content" render={({ field }) => (
                            <MarkdownEditor value={field.value} onChange={field.onChange} placeholder="Write your blog content here..." />
                        )} />

                        <FormActions onCancel={() => onOpenChange(false)} submitText={getSubmitText()} isSubmitting={isSubmitting} isDisabled={isUploading}
                            leftContent={<FormField control={form.control} name="published" render={({ field }) => (
                                <PublishToggle checked={field.value} onCheckedChange={field.onChange} />
                            )} />}
                        />
                    </form>
                </Form>
            </FormModal>

            <ConfirmDialog open={showDeleteImageAlert} onOpenChange={setShowDeleteImageAlert}
                title="Delete Old Image?" description="Do you want to delete the old image from Cloudinary? This action cannot be undone."
                confirmText="Delete Old Image" cancelText="Keep Old Image" variant="danger"
                onConfirm={() => handleDeleteOldImage(true)} onCancel={() => handleDeleteOldImage(false)} />
        </>
    );
}
