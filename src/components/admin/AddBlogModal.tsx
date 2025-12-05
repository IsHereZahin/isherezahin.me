"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Tags as TagsIcon, Type } from "lucide-react";
import { useState } from "react";
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
import { createBlog } from "@/lib/api";
import { generateSlug } from "@/utils";

const blogFormSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
    excerpt: z.string().min(1, "Excerpt is required").max(500, "Excerpt is too long"),
    tags: z.string(),
    imageSrc: z.string().min(1, "Image URL is required").url("Must be a valid URL")
        .refine(isValidImageUrl, "Must be a valid image URL"),
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
    const [isUploading, setIsUploading] = useState(false);
    const [showDeleteImageAlert, setShowDeleteImageAlert] = useState(false);
    const [pendingNewImage, setPendingNewImage] = useState<string | null>(null);
    const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(blogFormSchema),
        defaultValues: {
            title: "", excerpt: "", tags: "", imageSrc: "", content: "", published: false,
        },
    });

    const handlePreviousImageDetected = (prevUrl: string, newUrl: string) => {
        setPreviousImageUrl(prevUrl);
        setPendingNewImage(newUrl);
        setShowDeleteImageAlert(true);
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

    const onSubmit = async (data: BlogFormValues) => {
        setIsSubmitting(true);
        try {
            const tagsArray = data.tags ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [];
            await createBlog({
                title: data.title,
                slug: generateSlug(data.title),
                excerpt: data.excerpt,
                tags: tagsArray,
                imageSrc: data.imageSrc,
                content: data.content,
                published: data.published,
            });
            toast.success("Blog created successfully!");
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create blog");
        } finally {
            setIsSubmitting(false);
        }
    };

    const imageUrl = form.watch("imageSrc");
    const contentValue = form.watch("content");

    const getSubmitText = () => {
        if (isSubmitting) return "Creating...";
        if (isUploading) return "Uploading...";
        return "Create Blog";
    };

    return (
        <>
            <FormModal
                open={open}
                onOpenChange={onOpenChange}
                title="Create New Blog Post"
                description="Share your thoughts with the world. Fill in the details below."
                icon={FileText}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Type className="h-4 w-4 text-muted-foreground" />
                                        Title
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter an engaging title" className="h-11 text-base" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Excerpt */}
                        <FormField
                            control={form.control}
                            name="excerpt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Summary</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Write a brief summary..." className="resize-none min-h-[80px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Image & Tags */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="imageSrc"
                                render={({ field }) => (
                                    <ImageUploadField
                                        value={field.value}
                                        onChange={field.onChange}
                                        onUploadStart={() => setIsUploading(true)}
                                        onUploadEnd={() => setIsUploading(false)}
                                        onPreviousImageDetected={handlePreviousImageDetected}
                                    />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <TagsIcon className="h-4 w-4 text-muted-foreground" />
                                            Tags
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="react, nextjs, typescript" {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs">Separate tags with commas</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Image Preview */}
                        <ImagePreview url={imageUrl} isLoading={isUploading} />

                        {/* Content */}
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <MarkdownEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Write your blog content here..."
                                />
                            )}
                        />

                        {/* Footer */}
                        <FormActions
                            onCancel={() => onOpenChange(false)}
                            submitText={getSubmitText()}
                            isSubmitting={isSubmitting}
                            isDisabled={isUploading}
                            leftContent={
                                <FormField
                                    control={form.control}
                                    name="published"
                                    render={({ field }) => (
                                        <PublishToggle checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                            }
                        />
                    </form>
                </Form>
            </FormModal>

            {/* Delete Old Image Confirmation */}
            <ConfirmDialog
                open={showDeleteImageAlert}
                onOpenChange={setShowDeleteImageAlert}
                title="Delete Old Image?"
                description="Do you want to delete the old image from Cloudinary? This action cannot be undone."
                confirmText="Delete Old Image"
                cancelText="Keep Old Image"
                variant="danger"
                onConfirm={() => handleDeleteOldImage(true)}
                onCancel={() => handleDeleteOldImage(false)}
            />
        </>
    );
}
