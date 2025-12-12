"use client";

import {
    Form,
    FormActions,
    FormControl, FormField, FormItem, FormLabel, FormMessage,
    FormModal,
    Input, Textarea,
} from "@/components/ui";
import { testimonials } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { MessageSquareQuote } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    quote: z.string().min(1, "Quote is required"),
    name: z.string().min(1, "Name is required"),
    role: z.string().min(1, "Role is required"),
    order: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TestimonialData {
    _id: string;
    quote: string;
    name: string;
    role: string;
    order: number;
}

interface TestimonialModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    testimonial?: TestimonialData | null;
}

export default function TestimonialModal({ open, onOpenChange, testimonial }: Readonly<TestimonialModalProps>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const isEditMode = !!testimonial;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { quote: "", name: "", role: "", order: 0 },
    });

    useEffect(() => {
        if (testimonial) {
            form.reset({
                quote: testimonial.quote,
                name: testimonial.name,
                role: testimonial.role,
                order: testimonial.order,
            });
        } else {
            form.reset({ quote: "", name: "", role: "", order: 0 });
        }
    }, [testimonial, form]);

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            if (isEditMode) {
                await testimonials.update(testimonial._id, data);
                toast.success("Testimonial updated successfully!");
            } else {
                await testimonials.create(data);
                toast.success("Testimonial added successfully!");
            }
            queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : `Failed to ${isEditMode ? "update" : "add"} testimonial`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal
            open={open}
            onOpenChange={onOpenChange}
            title={isEditMode ? "Edit Testimonial" : "Add Testimonial"}
            description={isEditMode ? "Update the testimonial details." : "Add a new testimonial from someone you've worked with."}
            icon={MessageSquareQuote}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="quote" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quote</FormLabel>
                            <FormControl>
                                <Textarea placeholder="What they said about you..." className="min-h-[100px]" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="role" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl><Input placeholder="CEO | Company" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <FormActions
                        onCancel={() => onOpenChange(false)}
                        submitText={isSubmitting ? (isEditMode ? "Saving..." : "Adding...") : (isEditMode ? "Save Changes" : "Add Testimonial")}
                        isSubmitting={isSubmitting}
                    />
                </form>
            </Form>
        </FormModal>
    );
}
