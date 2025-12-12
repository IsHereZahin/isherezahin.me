"use client";

import {
    Form,
    FormActions,
    FormControl, FormField, FormItem, FormLabel, FormMessage,
    FormModal,
} from "@/components/ui";
import MarkdownTextarea from "@/components/ui/MarkdownTextarea";
import { currentStatus } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CircleHelp } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    text: z.string().min(1, "Status text is required"),
    order: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CurrentStatusData {
    _id: string;
    text: string;
    order: number;
}

interface CurrentStatusModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    status?: CurrentStatusData | null;
}

export default function CurrentStatusModal({ open, onOpenChange, status }: Readonly<CurrentStatusModalProps>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const isEditMode = !!status;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { text: "", order: 0 },
    });

    useEffect(() => {
        if (status) {
            form.reset({ text: status.text, order: status.order });
        } else {
            form.reset({ text: "", order: 0 });
        }
    }, [status, form]);

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            if (isEditMode) {
                await currentStatus.update(status._id, data);
                toast.success("Status updated successfully!");
            } else {
                await currentStatus.create(data);
                toast.success("Status added successfully!");
            }
            queryClient.invalidateQueries({ queryKey: ["admin-current-status"] });
            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : `Failed to ${isEditMode ? "update" : "add"} status`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal
            open={open}
            onOpenChange={onOpenChange}
            title={isEditMode ? "Edit Current Status" : "Add Current Status"}
            description={isEditMode ? "Update your current status." : "Add what you're currently working on or doing."}
            icon={CircleHelp}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="text" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status Text</FormLabel>
                            <FormControl>
                                <MarkdownTextarea
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="What are you currently working on?"
                                    rows={3}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormActions
                        onCancel={() => onOpenChange(false)}
                        submitText={isSubmitting ? (isEditMode ? "Saving..." : "Adding...") : (isEditMode ? "Save Changes" : "Add Status")}
                        isSubmitting={isSubmitting}
                    />
                </form>
            </Form>
        </FormModal>
    );
}
