"use client";

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
import { cloudinary, createProject } from "@/lib/api";
import { generateSlug } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, Calendar, FolderKanban, Github, Globe, TagsIcon, Type } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const projectFormSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    excerpt: z.string().min(1, "Excerpt is required").max(500),
    categories: z.string(),
    company: z.string().min(1, "Company is required"),
    duration: z.string().min(1, "Duration is required"),
    status: z.string(),
    tags: z.string(),
    imageSrc: z.string().min(1, "Image URL is required").url().refine(isValidImageUrl, "Must be a valid image URL"),
    liveUrl: z.string(),
    githubUrl: z.string(),
    content: z.string().min(1, "Content is required"),
    published: z.boolean(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface AddProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AddProjectModal({ open, onOpenChange }: Readonly<AddProjectModalProps>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showDeleteImageAlert, setShowDeleteImageAlert] = useState(false);
    const [pendingNewImage, setPendingNewImage] = useState<string | null>(null);
    const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            title: "", excerpt: "", categories: "Project", company: "", duration: "",
            status: "completed", tags: "", imageSrc: "", liveUrl: "", githubUrl: "",
            content: "", published: false,
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
                await cloudinary.delete(previousImageUrl);
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

    const onSubmit = async (data: ProjectFormValues) => {
        setIsSubmitting(true);
        try {
            const tagsArray = data.tags ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [];
            await createProject({
                title: data.title, slug: generateSlug(data.title), excerpt: data.excerpt,
                categories: data.categories || "Project", company: data.company, duration: data.duration,
                status: data.status || "completed", tags: tagsArray, imageSrc: data.imageSrc,
                liveUrl: data.liveUrl || undefined, githubUrl: data.githubUrl || undefined,
                content: data.content, published: data.published,
            });
            toast.success("Project created successfully!");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create project");
        } finally {
            setIsSubmitting(false);
        }
    };

    const imageUrl = form.watch("imageSrc");
    const getSubmitText = () => {
        if (isSubmitting) return "Creating...";
        if (isUploading) return "Uploading...";
        return "Create Project";
    };

    return (
        <>
            <FormModal open={open} onOpenChange={onOpenChange} title="Add New Project"
                description="Showcase your work. Fill in the project details below." icon={FolderKanban} maxWidth="sm:max-w-[800px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2"><Type className="h-4 w-4 text-muted-foreground" />Project Title</FormLabel>
                                <FormControl><Input placeholder="Enter your project name" className="h-11 text-base" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="excerpt" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Short Description</FormLabel>
                                <FormControl><Textarea placeholder="A brief summary..." className="resize-none min-h-[80px]" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <FormField control={form.control} name="company" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-muted-foreground" />Company</FormLabel>
                                    <FormControl><Input placeholder="Company" {...field} /></FormControl><FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="duration" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-muted-foreground" />Duration</FormLabel>
                                    <FormControl><Input placeholder="3 months" {...field} /></FormControl><FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="categories" render={({ field }) => (
                                <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="Web App" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Status</FormLabel><FormControl><Input placeholder="completed" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="imageSrc" render={({ field }) => (
                                <ImageUploadField value={field.value} onChange={field.onChange}
                                    onUploadStart={() => setIsUploading(true)} onUploadEnd={() => setIsUploading(false)}
                                    onPreviousImageDetected={handlePreviousImageDetected} />
                            )} />
                            <FormField control={form.control} name="tags" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><TagsIcon className="h-4 w-4 text-muted-foreground" />Technologies</FormLabel>
                                    <FormControl><Input placeholder="react, nextjs, tailwind" {...field} /></FormControl>
                                    <FormDescription className="text-xs">Separate with commas</FormDescription><FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <ImagePreview url={imageUrl} isLoading={isUploading} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="liveUrl" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" />Live URL <span className="text-xs text-muted-foreground font-normal">(optional)</span></FormLabel>
                                    <FormControl><Input placeholder="https://myproject.com" {...field} /></FormControl><FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="githubUrl" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Github className="h-4 w-4 text-muted-foreground" />GitHub URL <span className="text-xs text-muted-foreground font-normal">(optional)</span></FormLabel>
                                    <FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl><FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="content" render={({ field }) => (
                            <MarkdownEditor value={field.value} onChange={field.onChange} label="Project Details"
                                placeholder="Describe your project in detail..." minHeight="min-h-[180px]" />
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
