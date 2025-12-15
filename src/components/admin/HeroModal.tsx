"use client";

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
    ImageUploadField,
    Input,
    isCloudinaryUrl,
    isValidImageUrl,
    Textarea,
} from "@/components/ui";
import { hero } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    profileImage: z.string().optional(),
    greeting: z.string().min(1, "Greeting is required"),
    name: z.string().min(1, "Name is required"),
    tagline: z.string().min(1, "Tagline is required"),
    description: z.string().min(1, "Description is required"),
    highlightedSkills: z.string(),
    buttons: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface HeroButton {
    text: string;
    href: string;
    icon?: string;
    variant?: string;
}

interface HeroData {
    _id?: string;
    profileImage?: string;
    greeting: string;
    name: string;
    tagline: string;
    description: string;
    highlightedSkills: string[];
    buttons: HeroButton[];
    isActive: boolean;
}

interface HeroModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    heroData?: HeroData | null;
}

export default function HeroModal({ open, onOpenChange, heroData }: Readonly<HeroModalProps>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showDeleteImageAlert, setShowDeleteImageAlert] = useState(false);
    const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null);
    const [pendingNewImage, setPendingNewImage] = useState<string | null>(null);
    const [originalImageSrc, setOriginalImageSrc] = useState<string>("");
    const queryClient = useQueryClient();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profileImage: "",
            greeting: "Hey, I'm",
            name: "",
            tagline: "Coder & Thinker",
            description: "",
            highlightedSkills: "",
            buttons: "",
        },
    });

    const profileImage = form.watch("profileImage");

    useEffect(() => {
        if (heroData) {
            const imgSrc = heroData.profileImage || "";
            setOriginalImageSrc(imgSrc);
            form.reset({
                profileImage: imgSrc,
                greeting: heroData.greeting || "Hey, I'm",
                name: heroData.name || "",
                tagline: heroData.tagline || "Coder & Thinker",
                description: heroData.description || "",
                highlightedSkills: heroData.highlightedSkills?.join(", ") || "",
                buttons: heroData.buttons?.map(b => `${b.text}|${b.href}|${b.icon || ""}`).join("\n") || "",
            });
        }
    }, [heroData, form]);

    const handlePreviousImageDetected = (prevUrl: string, newUrl: string) => {
        if (isCloudinaryUrl(prevUrl) && prevUrl !== originalImageSrc) {
            fetch(`/api/cloudinary?url=${encodeURIComponent(prevUrl)}`, { method: 'DELETE' });
        }
        if (isCloudinaryUrl(originalImageSrc) && prevUrl === originalImageSrc) {
            setPreviousImageUrl(prevUrl);
            setPendingNewImage(newUrl);
            setShowDeleteImageAlert(true);
        } else {
            form.setValue("profileImage", newUrl);
            toast.success("Image uploaded successfully");
        }
    };

    const handleDeleteOldImage = async (deleteOld: boolean) => {
        const newImageUrl = pendingNewImage;

        if (deleteOld && isCloudinaryUrl(originalImageSrc)) {
            try {
                await fetch(`/api/cloudinary?url=${encodeURIComponent(originalImageSrc)}`, { method: 'DELETE' });
                toast.success('Old image deleted');
            } catch { toast.error('Failed to delete old image'); }
        }

        if (newImageUrl) {
            form.setValue("profileImage", newImageUrl);
            toast.success("Image uploaded successfully");
        }

        setShowDeleteImageAlert(false);
        setPreviousImageUrl(null);
        setPendingNewImage(null);
    };

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            const skillsArray = data.highlightedSkills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

            const buttonsArray = data.buttons
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                    const [text, href, icon] = line.split("|").map((s) => s.trim());
                    return { text, href, icon: icon || "", variant: "default" };
                });

            await hero.update({
                profileImage: data.profileImage,
                greeting: data.greeting,
                name: data.name,
                tagline: data.tagline,
                description: data.description,
                highlightedSkills: skillsArray,
                buttons: buttonsArray,
                isActive: true,
            });

            toast.success("Hero section updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["hero"] });
            queryClient.invalidateQueries({ queryKey: ["admin-hero"] });
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update hero section");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <FormModal
                open={open}
                onOpenChange={onOpenChange}
                title="Edit Hero Section"
                description="Update your homepage hero section content."
                icon={Sparkles}
                maxWidth="sm:max-w-[650px]"
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Profile Image with Upload and Preview */}
                        <FormField
                            control={form.control}
                            name="profileImage"
                            render={({ field }) => (
                                <div className="space-y-3">
                                    <ImageUploadField
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        label="Profile Image"
                                        placeholder="https://example.com/photo.jpg"
                                        onUploadStart={() => setIsUploading(true)}
                                        onUploadEnd={() => setIsUploading(false)}
                                        onPreviousImageDetected={handlePreviousImageDetected}
                                        disabled={isSubmitting}
                                    />
                                    {profileImage && isValidImageUrl(profileImage) && (
                                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                            <div className="relative size-16 rounded-full overflow-hidden border-2 border-border">
                                                <Image
                                                    src={profileImage}
                                                    alt="Profile preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Preview of your profile image
                                            </p>
                                        </div>
                                    )}
                                    <FormDescription className="text-xs">
                                        Leave empty to use the default from environment variables
                                    </FormDescription>
                                </div>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="greeting"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Greeting</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Hey, I'm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="tagline"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tagline</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Coder & Thinker" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="I work with React & Laravel Ecosystem..."
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="highlightedSkills"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Highlighted Skills</FormLabel>
                                    <FormControl>
                                        <Input placeholder="React, Laravel, TypeScript" {...field} />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Comma-separated. These words will be bolded in the description.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="buttons"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Buttons</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={"Learn More|#about-me|ArrowDown\nMore about me|/about|"}
                                            className="min-h-[70px] font-mono text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        One button per line: Text|URL|Icon (Icon: ArrowDown or leave empty)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormActions
                            onCancel={() => onOpenChange(false)}
                            submitText={isSubmitting ? "Saving..." : "Save Changes"}
                            isSubmitting={isSubmitting || isUploading}
                        />
                    </form>
                </Form>
            </FormModal>

            <ConfirmDialog
                open={showDeleteImageAlert}
                onOpenChange={setShowDeleteImageAlert}
                title="Delete Old Image?"
                description="Do you want to delete the old image from Cloudinary? This action cannot be undone."
                confirmText="Delete Old Image"
                cancelText="Keep Old Image"
                variant="danger"
                onConfirm={() => handleDeleteOldImage(true)}
                onCancel={() => handleDeleteOldImage(false)}
            />
        </>
    );
}
