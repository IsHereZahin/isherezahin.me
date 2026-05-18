"use client";

import {
    ConfirmDialog,
    DatePicker,
    Form,
    FormActions,
    FormControl, FormField, FormItem, FormLabel, FormMessage,
    FormModal,
    ImagePreview,
    ImageUploadField,
    Input,
    isCloudinaryUrl,
} from "@/components/ui";
import { cloudinary, education } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    start: z.string().min(1, "Start date is required"),
    end: z.string(),
    degree: z.string().min(1, "Degree is required"),
    institution: z.string().min(1, "Institution is required"),
    institutionUrl: z.string().url("Invalid URL").or(z.literal("")),
    logo: z.string().min(1, "Logo is required"),
    order: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EducationData {
    _id: string;
    start: string;
    end: string;
    degree: string;
    institution: string;
    institutionUrl: string;
    logo: string;
    order: number;
}

interface EducationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    educationItem?: EducationData | null;
}

const defaultValues: FormValues = {
    start: "", end: "Present", degree: "", institution: "", institutionUrl: "", logo: "", order: 0,
};

export default function EducationModal({ open, onOpenChange, educationItem }: Readonly<EducationModalProps>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showDeleteImageAlert, setShowDeleteImageAlert] = useState(false);
    const [pendingNewImage, setPendingNewImage] = useState<string | null>(null);
    const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const isEditMode = !!educationItem;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    useEffect(() => {
        if (educationItem) {
            form.reset({
                start: educationItem.start,
                end: educationItem.end,
                degree: educationItem.degree,
                institution: educationItem.institution,
                institutionUrl: educationItem.institutionUrl || "",
                logo: educationItem.logo,
                order: educationItem.order,
            });
        } else {
            form.reset(defaultValues);
        }
    }, [educationItem, form]);

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
            if (isEditMode) {
                await education.update(educationItem._id, data);
                toast.success("Education updated successfully!");
            } else {
                await education.create(data);
                toast.success("Education added successfully!");
            }
            queryClient.invalidateQueries({ queryKey: ["admin-education"] });
            queryClient.invalidateQueries({ queryKey: ["education"] });
            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : `Failed to ${isEditMode ? "update" : "add"} education`);
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
                title={isEditMode ? "Edit Education" : "Add Education"}
                description={isEditMode ? "Update education details." : "Add a new education entry."}
                icon={GraduationCap}
                maxWidth="sm:max-w-[700px]"
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="degree" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Degree</FormLabel>
                                    <FormControl><Input placeholder="B.Sc. in Computer Science" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="institution" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Institution</FormLabel>
                                    <FormControl><Input placeholder="University Name" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="institutionUrl" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Institution URL (optional)</FormLabel>
                                <FormControl><Input placeholder="https://university.edu" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
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
                        </div>
                        <FormField control={form.control} name="logo" render={({ field }) => (
                            <ImageUploadField value={field.value} onChange={field.onChange}
                                onUploadStart={() => setIsUploading(true)} onUploadEnd={() => setIsUploading(false)}
                                onPreviousImageDetected={handlePreviousImageDetected} label="Institution Logo" />
                        )} />
                        <ImagePreview url={logoUrl} isLoading={isUploading} />
                        <FormActions
                            onCancel={() => onOpenChange(false)}
                            submitText={isSubmitting ? (isEditMode ? "Saving..." : "Adding...") : isUploading ? "Uploading..." : (isEditMode ? "Save Changes" : "Add Education")}
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
