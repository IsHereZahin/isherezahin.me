"use client";

import {
    Form,
    FormActions,
    FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
    FormModal,
    Input,
} from "@/components/ui";
import { contactInfo } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    email: z.string().email("Invalid email address").or(z.literal("")),
    headline: z.string().min(1, "Headline is required"),
    subheadline: z.string().min(1, "Subheadline is required"),
    highlightText: z.string().optional(),
    skills: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactInfoData {
    email?: string;
    headline: string;
    subheadline: string;
    highlightText?: string;
    skills: string[];
}

interface EditContactInfoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contactData?: ContactInfoData;
}

export default function EditContactInfoModal({ open, onOpenChange, contactData }: Readonly<EditContactInfoModalProps>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            headline: "Any questions about software?",
            subheadline: "Feel free to reach out to me!",
            highlightText: "I'm available for collaboration.",
            skills: "",
        },
    });

    useEffect(() => {
        if (contactData) {
            form.reset({
                email: contactData.email || "",
                headline: contactData.headline || "Any questions about software?",
                subheadline: contactData.subheadline || "Feel free to reach out to me!",
                highlightText: contactData.highlightText || "I'm available for collaboration.",
                skills: contactData.skills?.join(", ") || "",
            });
        }
    }, [contactData, form]);

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            const skillsArray = data.skills.split(",").map(s => s.trim()).filter(Boolean);
            await contactInfo.update({
                email: data.email,
                headline: data.headline,
                subheadline: data.subheadline,
                highlightText: data.highlightText,
                skills: skillsArray,
            });
            toast.success("Contact info updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["admin-contact-info"] });
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update contact info");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal open={open} onOpenChange={onOpenChange} title="Edit Contact Info"
            description="Update your contact section details." icon={Mail} maxWidth="sm:max-w-[600px]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                            <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                            <FormDescription className="text-xs">Leave empty to show &quot;Send Message&quot; button instead (requires login)</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="headline" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Headline</FormLabel>
                            <FormControl><Input placeholder="Any questions about software?" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="subheadline" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subheadline</FormLabel>
                            <FormControl><Input placeholder="Feel free to reach out to me!" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="highlightText" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Highlight Text <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                            <FormControl><Input placeholder="I'm available for collaboration." {...field} /></FormControl>
                            <FormDescription className="text-xs">Highlighted text shown after the subheadline</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="skills" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Skills (for animation)</FormLabel>
                            <FormControl><Input placeholder="Next.js, React.js, TypeScript, Laravel" {...field} /></FormControl>
                            <FormDescription className="text-xs">Comma-separated list of skills to display in the animation</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormActions onCancel={() => onOpenChange(false)} submitText={isSubmitting ? "Saving..." : "Save Changes"} isSubmitting={isSubmitting} />
                </form>
            </Form>
        </FormModal>
    );
}
