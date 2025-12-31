"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, FileText, MapPin, Tag, Target, Type } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
    DatePicker, Form, FormActions, FormControl, FormField, FormItem, FormLabel, FormMessage,
    FormModal, Input, PublishToggle, Select, SelectContent,
    SelectItem, SelectTrigger, SelectValue, Textarea
} from "@/components/ui";
import { bucketList as bucketListApi } from "@/lib/api";

const bucketListFormSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
    description: z.string().min(1, "Description is required"),
    category: z.enum(["travel", "adventure", "personal", "career", "learning", "lifestyle"]),
    status: z.enum(["completed", "in-progress", "pending"]),
    location: z.string().optional().or(z.literal("")),
    completedDate: z.string().optional().or(z.literal("")),
    isActive: z.boolean(),
});

type BucketListFormValues = z.infer<typeof bucketListFormSchema>;

export interface BucketListItem {
    id: string;
    title: string;
    description: string;
    category: "travel" | "adventure" | "personal" | "career" | "learning" | "lifestyle";
    status: "completed" | "in-progress" | "pending";
    location?: string;
    completedDate?: string;
    order?: number;
    isActive?: boolean;
}

interface BucketListModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item?: BucketListItem | null;
}

const CATEGORIES = [
    { value: "travel", label: "Travel" },
    { value: "adventure", label: "Adventure" },
    { value: "personal", label: "Personal" },
    { value: "career", label: "Career" },
    { value: "learning", label: "Learning" },
    { value: "lifestyle", label: "Lifestyle" },
];

const STATUSES = [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
];

export default function BucketListModal({ open, onOpenChange, item }: Readonly<BucketListModalProps>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const isEditing = !!item;

    const form = useForm<BucketListFormValues>({
        resolver: zodResolver(bucketListFormSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "personal",
            status: "pending",
            location: "",
            completedDate: "",
            isActive: true,
        },
    });

    const watchStatus = form.watch("status");

    useEffect(() => {
        if (item) {
            form.reset({
                title: item.title,
                description: item.description,
                category: item.category,
                status: item.status,
                location: item.location || "",
                completedDate: item.completedDate || "",
                isActive: item.isActive ?? true,
            });
        } else {
            form.reset({
                title: "",
                description: "",
                category: "personal",
                status: "pending",
                location: "",
                completedDate: "",
                isActive: true,
            });
        }
    }, [item, form]);

    const onSubmit = async (data: BucketListFormValues) => {
        setIsSubmitting(true);
        try {
            const payload = {
                title: data.title,
                description: data.description,
                category: data.category,
                status: data.status,
                location: data.location || undefined,
                completedDate: data.status === "completed" ? data.completedDate || undefined : undefined,
                order: 0,
                isActive: data.isActive,
            };

            if (isEditing && item) {
                await bucketListApi.update(item.id, payload);
                toast.success("Bucket list item updated!");
            } else {
                await bucketListApi.create(payload);
                toast.success("Bucket list item created!");
            }

            queryClient.invalidateQueries({ queryKey: ["bucketList"] });
            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : `Failed to ${isEditing ? "update" : "create"} item`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal
            open={open}
            onOpenChange={onOpenChange}
            title={isEditing ? "Edit Bucket List Item" : "Add New Goal"}
            description={isEditing ? "Update your bucket list item details." : "Add a new dream, goal, or adventure to your bucket list."}
            icon={Target}
            maxWidth="sm:max-w-[600px]"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                    <Input placeholder="e.g., Visit the Northern Lights" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-muted-foreground" />
                                        Category
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {CATEGORIES.map((cat) => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Target className="h-4 w-4 text-muted-foreground" />
                                        Status
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {STATUSES.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        Location (optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Iceland / Norway" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {watchStatus === "completed" && (
                            <FormField
                                control={form.control}
                                name="completedDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            Completed Date
                                        </FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                value={field.value ? new Date(field.value) : undefined}
                                                onChange={(date) => field.onChange(date ? date.toISOString() : "")}
                                                placeholder="Select date"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    Description
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe your dream or goal..."
                                        className="resize-none min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormActions
                        onCancel={() => onOpenChange(false)}
                        submitText={
                            isSubmitting
                                ? isEditing
                                    ? "Updating..."
                                    : "Creating..."
                                : isEditing
                                ? "Update Item"
                                : "Create Item"
                        }
                        isSubmitting={isSubmitting}
                        leftContent={
                            <FormField
                                control={form.control}
                                name="isActive"
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
