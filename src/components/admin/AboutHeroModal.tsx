"use client";

import {
    ConfirmDialog,
    Form,
    FormActions,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormModal,
    ImagePreview,
    ImageUploadField,
    Input,
    isCloudinaryUrl,
} from "@/components/ui";
import MarkdownTextarea from "@/components/ui/MarkdownTextarea";
import { aboutHero } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    title: z.string().min(1, "Title is required"),
    location: z.string().min(1, "Location is required"),
    age: z.string().optional(),
    imageSrc: z.string().min(1, "Image is required"),
    paragraphs: z.array(z.object({ text: z.string().min(1, "Paragraph text is required") })),
    pageTitle: z.string().optional(),
    pageSubtitle: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AboutHeroData {
    _id?: string;
    name: string;
    title: string;
    location: string;
    age?: string;
    imageSrc: string;
    paragraphs: string[];
    pageTitle?: string;
    pageSubtitle?: string;
}

interface AboutHeroModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    aboutData?: AboutHeroData | null;
}

const defaultValues: FormValues = {
    name: "",
    title: "",
    location: "",
    age: "",
    imageSrc: "",
    paragraphs: [{ text: "" }],
    pageTitle: "About Me",
    pageSubtitle: "",
};

export default function AboutHeroModal({ open, onOpenChange, aboutData }: Readonly<AboutHeroModalProps>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showDeleteImageAlert, setShowDeleteImageAlert] = useState(false);
    const [pendingNewImage, setPendingNewImage] = useState<string | null>(null);
    const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "paragraphs",
    });

    useEffect(() => {
        if (aboutData) {
            const paragraphsArray = aboutData.paragraphs?.length > 0
                ? aboutData.paragraphs.map(text => ({ text }))
                : [{ text: "" }];
            form.reset({
                name: aboutData.name,
                title: aboutData.title,
                location: aboutData.location,
                age: aboutData.age || "",
                imageSrc: aboutData.imageSrc,
                paragraphs: paragraphsArray,
                pageTitle: aboutData.pageTitle || "About Me",
                pageSubtitle: aboutData.pageSubtitle || "",
            });
        } else {
            form.reset(defaultValues);
        }
    }, [aboutData, form]);

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

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            const paragraphsArray = data.paragraphs
                .map(p => p.text.trim())
                .filter(p => p.length > 0);

            await aboutHero.update({
                name: data.name,
                title: data.title,
                location: data.location,
                age: data.age,
                imageSrc: data.imageSrc,
                paragraphs: paragraphsArray,
                pageTitle: data.pageTitle,
                pageSubtitle: data.pageSubtitle,
            });
            toast.success("About hero updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["admin-about-hero"] });
            queryClient.invalidateQueries({ queryKey: ["about-hero"] });
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update about hero");
        } finally {
            setIsSubmitting(false);
        }
    };

    const imageSrc = form.watch("imageSrc");

    return (
        <>
            <FormModal
                open={open}
                onOpenChange={onOpenChange}
                title="Edit About Hero"
                description="Update your about page hero section content."
                icon={User}
                maxWidth="sm:max-w-[700px]"
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Page Content Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-border">
                                <span className="text-sm font-semibold text-foreground">Page Content</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="pageTitle" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Page Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="About Me" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="pageSubtitle" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Page Subtitle</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="A brief description..." />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div>
                                <FormLabel className="mb-2 block">About Paragraphs</FormLabel>
                                <p className="text-xs text-muted-foreground mb-3">
                                    Use **text** for bold, *text* for italic. Supports markdown formatting.
                                </p>
                                <div className="space-y-3">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2">
                                            <FormField
                                                control={form.control}
                                                name={`paragraphs.${index}.text`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormControl>
                                                            <MarkdownTextarea
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                placeholder={`Paragraph ${index + 1}...`}
                                                                rows={4}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {fields.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="p-2 hover:bg-red-500/10 rounded-md self-start mt-1"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => append({ text: "" })}
                                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        <Plus className="h-4 w-4" /> Add Paragraph
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-border">
                                <span className="text-sm font-semibold text-foreground">Profile Info</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="John Doe" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="age" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Age Badge</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="23Y" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Professional Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Software Developer | Frontend Focused" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="location" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="City, Country (UTC+X)" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="imageSrc" render={({ field }) => (
                                <ImageUploadField
                                    value={field.value}
                                    onChange={field.onChange}
                                    onUploadStart={() => setIsUploading(true)}
                                    onUploadEnd={() => setIsUploading(false)}
                                    onPreviousImageDetected={handlePreviousImageDetected}
                                    label="Profile Image"
                                />
                            )} />
                            <ImagePreview url={imageSrc} isLoading={isUploading} />
                        </div>

                        <FormActions
                            onCancel={() => onOpenChange(false)}
                            submitText={isSubmitting ? "Saving..." : isUploading ? "Uploading..." : "Save Changes"}
                            isSubmitting={isSubmitting}
                            isDisabled={isUploading}
                        />
                    </form>
                </Form>
            </FormModal>

            <ConfirmDialog
                open={showDeleteImageAlert}
                onOpenChange={setShowDeleteImageAlert}
                title="Delete Old Image?"
                description="Do you want to delete the old image from Cloudinary?"
                confirmText="Delete Old Image"
                cancelText="Keep Old Image"
                variant="danger"
                onConfirm={() => handleDeleteOldImage(true)}
                onCancel={() => handleDeleteOldImage(false)}
            />
        </>
    );
}
