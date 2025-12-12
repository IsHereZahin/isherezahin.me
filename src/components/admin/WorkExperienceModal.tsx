"use client";

import {
    ConfirmDialog,
    Form,
    FormActions,
    FormControl, FormField, FormItem, FormLabel, FormMessage,
    FormModal,
    ImagePreview,
    ImageUploadField,
    Input,
    isCloudinaryUrl,
} from "@/components/ui";
import MarkdownTextarea from "@/components/ui/MarkdownTextarea";
import { workExperience } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DatePicker } from "../ui/date-picker";

const formSchema = z.object({
    start: z.string().min(1, "Start date is required"),
    end: z.string(),
    title: z.string().min(1, "Title is required"),
    company: z.string().min(1, "Company is required"),
    companyUrl: z.string().url("Invalid URL"),
    location: z.string().min(1, "Location is required"),
    type: z.string(),
    description: z.string().min(1, "Description is required"),
    highlights: z.array(z.object({ text: z.string().min(1, "Highlight text is required") })),
    logo: z.string().min(1, "Logo is required"),
    order: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface WorkExperienceData {
    _id: string;
    start: string;
    end: string;
    title: string;
    company: string;
    companyUrl: string;
    location: string;
    type: string;
    description: string;
    highlights: { text: string }[];
    logo: string;
    order: number;
}

interface WorkExperienceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    experience?: WorkExperienceData | null;
}

const defaultValues: FormValues = {
    start: "", end: "Present", title: "", company: "", companyUrl: "",
    location: "", type: "On Site", description: "", highlights: [{ text: "" }], logo: "", order: 0,
};

export default function WorkExperienceModal({ open, onOpenChange, experience }: Readonly<WorkExperienceModalProps>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showDeleteImageAlert, setShowDeleteImageAlert] = useState(false);
    const [pendingNewImage, setPendingNewImage] = useState<string | null>(null);
    const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const isEditMode = !!experience;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const { fields, append, remove } = useFieldArray({ control: form.control, name: "highlights" });

    useEffect(() => {
        if (experience) {
            form.reset({
                start: experience.start,
                end: experience.end,
                title: experience.title,
                company: experience.company,
                companyUrl: experience.companyUrl,
                location: experience.location,
                type: experience.type,
                description: experience.description,
                highlights: experience.highlights.length > 0 ? experience.highlights : [{ text: "" }],
                logo: experience.logo,
                order: experience.order,
            });
        } else {
            form.reset(defaultValues);
        }
    }, [experience, form]);

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
            } catch { toast.error('Failed to delete old image'); }
        }
        if (pendingNewImage) {
            form.setValue('logo', pendingNewImage);
            toast.success('Image updated');
        }
        setPendingNewImage(null);
        setPreviousImageUrl(null);
        setShowDeleteImageAlert(false);
    };

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            const payload = { ...data, highlights: data.highlights.filter(h => h.text.trim()) };
            if (isEditMode) {
                await workExperience.update(experience._id, payload);
                toast.success("Work experience updated successfully!");
            } else {
                await workExperience.create(payload);
                toast.success("Work experience added successfully!");
            }
            queryClient.invalidateQueries({ queryKey: ["admin-work-experience"] });
            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : `Failed to ${isEditMode ? "update" : "add"} work experience`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const logoUrl = form.watch("logo");

    return (
        <>
            <FormModal
                open={open}
                onOpenChange={onOpenChange}
                title={isEditMode ? "Edit Work Experience" : "Add Work Experience"}
                description={isEditMode ? "Update work experience details." : "Add a new work experience entry."}
                icon={Briefcase}
                maxWidth="sm:max-w-[700px]"
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Title</FormLabel>
                                    <FormControl><Input placeholder="Frontend Developer" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="company" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company</FormLabel>
                                    <FormControl><Input placeholder="Company Name" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="companyUrl" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company URL</FormLabel>
                                    <FormControl><Input placeholder="https://company.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="location" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl><Input placeholder="City, Country" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <FormField control={form.control} name="start" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            value={field.value ? new Date(field.value) : undefined}
                                            onChange={(date) => field.onChange(date ? date.toISOString() : "")}
                                            placeholder="Select start date"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="end" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            value={field.value && field.value !== "Present" ? new Date(field.value) : undefined}
                                            onChange={(date) => field.onChange(date ? date.toISOString() : "Present")}
                                            placeholder="Present"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Work Type</FormLabel>
                                    <FormControl><Input placeholder="On Site / Remote" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <MarkdownTextarea
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Brief description of your role..."
                                        rows={3}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div>
                            <FormLabel className="mb-2 block">Highlights</FormLabel>
                            <div className="space-y-2">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <FormField control={form.control} name={`highlights.${index}.text`} render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <MarkdownTextarea
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Achievement or responsibility..."
                                                        rows={2}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        {fields.length > 1 && (
                                            <button type="button" onClick={() => remove(index)} className="p-2 hover:bg-red-500/10 rounded-md self-start mt-1">
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => append({ text: "" })}
                                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                                    <Plus className="h-4 w-4" /> Add Highlight
                                </button>
                            </div>
                        </div>
                        <FormField control={form.control} name="logo" render={({ field }) => (
                            <ImageUploadField value={field.value} onChange={field.onChange}
                                onUploadStart={() => setIsUploading(true)} onUploadEnd={() => setIsUploading(false)}
                                onPreviousImageDetected={handlePreviousImageDetected} label="Company Logo" />
                        )} />
                        <ImagePreview url={logoUrl} isLoading={isUploading} />
                        <FormActions
                            onCancel={() => onOpenChange(false)}
                            submitText={isSubmitting ? (isEditMode ? "Saving..." : "Adding...") : isUploading ? "Uploading..." : (isEditMode ? "Save Changes" : "Add Experience")}
                            isSubmitting={isSubmitting}
                            isDisabled={isUploading}
                        />
                    </form>
                </Form>
            </FormModal>
            <ConfirmDialog open={showDeleteImageAlert} onOpenChange={setShowDeleteImageAlert}
                title="Delete Old Image?" description="Do you want to delete the old image from Cloudinary?"
                confirmText="Delete Old Image" cancelText="Keep Old Image" variant="danger"
                onConfirm={() => handleDeleteOldImage(true)} onCancel={() => handleDeleteOldImage(false)} />
        </>
    );
}
