"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, Calendar, FolderKanban, Github, Globe, Tags as TagsIcon, Type } from "lucide-react";
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
import { cloudinary, updateProject } from "@/lib/api";
import { Project } from "@/utils/types";

const projectFormSchema = z.object({
    title: z.string().min(1).max(200),
    excerpt: z.string().min(1).max(500),
    categories: z.string(),
    company: z.string().min(1),
    duration: z.string().min(1),
    status: z.string(),
    tags: z.string(),
    imageSrc: z.string().min(1).url().refine(isValidImageUrl, "Must be a valid image URL"),
    liveUrl: z.string(),
    githubUrl: z.string(),
    content: z.string().min(1),
    published: z.boolean(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface EditProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project;
    onSuccess?: (newSlug: string) => void;
}

export default function EditProjectModal({ open, onOpenChange, project, onSuccess }: Readonly<EditProjectModalProps>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showDeleteImageAlert, setShowDeleteImageAlert] = useState(false);
    const [pendingNewImage, setPendingNewImage] = useState<string | null>(null);
    const [originalImageSrc] = useState(project.imageSrc);
    const queryClient = useQueryClient();

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            title: project.title, excerpt: project.excerpt, categories: project.categories || "Project",
            company: project.company, duration: project.duration, status: project.status || "completed",
            tags: project.tags.join(", "), imageSrc: project.imageSrc, liveUrl: project.liveUrl || "",
            githubUrl: project.githubUrl || "", content: project.content, published: project.published,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                title: project.title, excerpt: project.excerpt, categories: project.categories || "Project",
                company: project.company, duration: project.duration, status: project.status || "completed",
                tags: project.tags.join(", "), imageSrc: project.imageSrc, liveUrl: project.liveUrl || "",
                githubUrl: project.githubUrl || "", content: project.content, published: project.published,
            });
        }
    }, [open, project, form]);

    const handlePreviousImageDetected = (prevUrl: string, newUrl: string) => {
        if (isCloudinaryUrl(prevUrl) && prevUrl !== originalImageSrc) {
            cloudinary.delete(prevUrl);
        }
        if (isCloudinaryUrl(originalImageSrc) && prevUrl === originalImageSrc) {
            setPendingNewImage(newUrl);
            setShowDeleteImageAlert(true);
        } else {
            form.setValue('imageSrc', newUrl);
            toast.success('Image uploaded successfully');
        }
    };

    const handleDeleteOldImage = async (deleteOld: boolean) => {
        if (!pendingNewImage) { setShowDeleteImageAlert(false); return; }
        const newImageUrl = pendingNewImage;

        if (deleteOld && isCloudinaryUrl(originalImageSrc)) {
            try {
                await cloudinary.delete(originalImageSrc);
                toast.success('Old image deleted');
            } catch { toast.error('Failed to delete old image'); }
        }

        form.setValue('imageSrc', newImageUrl);

        try {
            const v = form.getValues();
            const tagsArray = v.tags ? v.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
            await updateProject(project.slug, {
                title: v.title, excerpt: v.excerpt, categories: v.categories || "Project",
                company: v.company, duration: v.duration, status: v.status || "completed",
                tags: tagsArray, imageSrc: newImageUrl, liveUrl: v.liveUrl || undefined,
                githubUrl: v.githubUrl || undefined, content: v.content, published: v.published,
            });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project", project.slug] });
            toast.success('Image updated and saved');
        } catch { toast.error('Image updated but failed to auto-save. Please save manually.'); }

        setPendingNewImage(null);
        setShowDeleteImageAlert(false);
    };

    const onSubmit = async (data: ProjectFormValues) => {
        setIsSubmitting(true);
        try {
            const tagsArray = data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
            const result = await updateProject(project.slug, {
                title: data.title, excerpt: data.excerpt, categories: data.categories || "Project",
                company: data.company, duration: data.duration, status: data.status || "completed",
                tags: tagsArray, imageSrc: data.imageSrc, liveUrl: data.liveUrl || undefined,
                githubUrl: data.githubUrl || undefined, content: data.content, published: data.published,
            });
            toast.success("Project updated!");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project", project.slug] });
            onOpenChange(false);
            if (result.slug !== project.slug && onSuccess) onSuccess(result.slug);
        } catch (error) { toast.error(error instanceof Error ? error.message : "Failed to update"); }
        finally { setIsSubmitting(false); }
    };

    const imageUrl = form.watch("imageSrc");
    const getSubmitText = () => {
        if (isSubmitting) return "Saving...";
        if (isUploading) return "Uploading...";
        return "Save Changes";
    };

    return (
        <>
            <FormModal open={open} onOpenChange={onOpenChange} title="Edit Project"
                description="Update your project details." icon={FolderKanban} maxWidth="sm:max-w-[800px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2"><Type className="h-4 w-4 text-muted-foreground" />Title</FormLabel>
                                <FormControl><Input className="h-11 text-base" {...field} /></FormControl><FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="excerpt" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel>
                                <FormControl><Textarea className="resize-none min-h-[80px]" {...field} /></FormControl><FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <FormField control={form.control} name="company" render={({ field }) => (
                                <FormItem><FormLabel className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-muted-foreground" />Company</FormLabel>
                                    <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="duration" render={({ field }) => (
                                <FormItem><FormLabel className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-muted-foreground" />Duration</FormLabel>
                                    <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="categories" render={({ field }) => (
                                <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Status</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="imageSrc" render={({ field }) => (
                                <ImageUploadField value={field.value} onChange={field.onChange}
                                    onUploadStart={() => setIsUploading(true)} onUploadEnd={() => setIsUploading(false)}
                                    onPreviousImageDetected={handlePreviousImageDetected} />
                            )} />
                            <FormField control={form.control} name="tags" render={({ field }) => (
                                <FormItem><FormLabel className="flex items-center gap-2"><TagsIcon className="h-4 w-4 text-muted-foreground" />Technologies</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormDescription className="text-xs">Comma-separated</FormDescription><FormMessage /></FormItem>
                            )} />
                        </div>

                        <ImagePreview url={imageUrl} isLoading={isUploading} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="liveUrl" render={({ field }) => (
                                <FormItem><FormLabel className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" />Live URL <span className="text-xs text-muted-foreground">(optional)</span></FormLabel>
                                    <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="githubUrl" render={({ field }) => (
                                <FormItem><FormLabel className="flex items-center gap-2"><Github className="h-4 w-4 text-muted-foreground" />GitHub <span className="text-xs text-muted-foreground">(optional)</span></FormLabel>
                                    <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="content" render={({ field }) => (
                            <MarkdownEditor value={field.value} onChange={field.onChange} label="Details"
                                placeholder="Describe your project..." minHeight="min-h-[180px]" />
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
