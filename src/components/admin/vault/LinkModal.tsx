"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Link2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormActions,
    FormModal,
    Input,
    Textarea,
} from "@/components/ui";
import { vault } from "@/lib/api";
import type { VaultLink } from "@/lib/vault/types";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    url: z.string().url("Enter a valid URL"),
    description: z.string().optional(),
    tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LinkModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    link?: VaultLink | null;
    folderId?: string | null;
}

export default function LinkModal({ open, onOpenChange, link, folderId }: Readonly<LinkModalProps>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const isEdit = !!link;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: "", url: "", description: "", tags: "" },
    });

    useEffect(() => {
        if (link) {
            form.reset({
                title: link.title,
                url: link.url,
                description: link.description,
                tags: link.tags.join(", "),
            });
        } else {
            form.reset({ title: "", url: "", description: "", tags: "" });
        }
    }, [link, form, open]);

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            const payload = {
                title: data.title,
                url: data.url,
                description: data.description || "",
                tags: (data.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
                folderId: link?.folderId ?? folderId ?? null,
            };
            if (isEdit) {
                await vault.links.update(link._id, payload);
                toast.success("Link updated");
            } else {
                await vault.links.create(payload);
                toast.success("Link saved");
            }
            queryClient.invalidateQueries({ queryKey: ["vault-links"] });
            queryClient.invalidateQueries({ queryKey: ["vault-dashboard"] });
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save link");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal
            open={open}
            onOpenChange={onOpenChange}
            title={isEdit ? "Edit Link" : "Save Link"}
            description={isEdit ? "Update this saved link." : "Quickly store a URL for later."}
            icon={Link2}
            maxWidth="sm:max-w-[600px]"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl><Input placeholder="My reference link" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="url" render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl><Input placeholder="https://example.com" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl><Textarea placeholder="Optional notes about this link" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="tags" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl><Input placeholder="Comma-separated, e.g. work, docs" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormActions
                        onCancel={() => onOpenChange(false)}
                        submitText={isSubmitting ? "Saving..." : "Save Link"}
                        isSubmitting={isSubmitting}
                    />
                </form>
            </Form>
        </FormModal>
    );
}
