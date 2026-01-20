"use client";

import {
    Form,
    FormActions,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormModal,
    Input,
    MarkdownTextarea,
    PublishToggle
} from "@/components/ui";
import { legal } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Type } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const legalPageFormSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    subtitle: z.string().max(500).optional(),
    content: z.string(),
    published: z.boolean(),
});

type LegalPageFormValues = z.infer<typeof legalPageFormSchema>;

interface EditLegalPageModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    slug: "privacy-policy" | "terms-of-service";
    initialData?: {
        title?: string;
        subtitle?: string;
        content?: string;
        published?: boolean;
    } | null;
}

const defaultTitles = {
    "privacy-policy": "Privacy Policy",
    "terms-of-service": "Terms of Service",
};

const defaultSubtitles = {
    "privacy-policy": "How we collect, use, and protect your personal information",
    "terms-of-service": "Please read these terms carefully before using our services",
};

export default function EditLegalPageModal({
    open,
    onOpenChange,
    slug,
    initialData,
}: Readonly<EditLegalPageModalProps>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<LegalPageFormValues>({
        resolver: zodResolver(legalPageFormSchema),
        defaultValues: {
            title: initialData?.title || defaultTitles[slug],
            subtitle: initialData?.subtitle || defaultSubtitles[slug],
            content: initialData?.content || "",
            published: initialData?.published ?? false,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                title: initialData?.title || defaultTitles[slug],
                subtitle: initialData?.subtitle || defaultSubtitles[slug],
                content: initialData?.content || "",
                published: initialData?.published ?? false,
            });
        }
    }, [open, initialData, slug, form]);

    const onSubmit = async (data: LegalPageFormValues) => {
        setIsSubmitting(true);
        try {
            await legal.update(slug, data);
            toast.success("Page updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["legal-page", slug] });
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update page");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal
            open={open}
            onOpenChange={onOpenChange}
            title={`Edit ${defaultTitles[slug]}`}
            description="Update the legal page content using Markdown."
            icon={FileText}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                    <Input className="h-11 text-base" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="subtitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subtitle</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value || ""}
                                        placeholder="A brief description shown below the title..."
                                        className="h-11 text-base"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <MarkdownTextarea
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Write your legal page content here using Markdown..."
                                        rows={12}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormActions
                        onCancel={() => onOpenChange(false)}
                        submitText={isSubmitting ? "Saving..." : "Save Changes"}
                        isSubmitting={isSubmitting}
                        leftContent={
                            <FormField
                                control={form.control}
                                name="published"
                                render={({ field }) => (
                                    <PublishToggle
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        }
                    />
                </form>
            </Form>
        </FormModal>
    );
}
