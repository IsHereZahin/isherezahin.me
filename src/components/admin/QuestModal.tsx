"use client";

import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, GripVertical, ImageIcon, MapPin, Plus, Trash2, Type, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
    ShadcnButton as Button,
    ConfirmDialog, DatePicker, Form, FormActions, FormControl, FormField, FormItem, FormLabel, FormMessage,
    FormModal, ImagePreview, ImageUploadField, Input, isCloudinaryUrl, PublishToggle, Select, SelectContent,
    SelectItem, SelectTrigger, SelectValue,
    Textarea
} from "@/components/ui";
import { cloudinary, quests as questsApi } from "@/lib/api";

const mediaItemSchema = z.object({
    id: z.string(),
    type: z.enum(["image", "video"]),
    src: z.string().min(1, "Source URL is required"),
    thumbnail: z.string().optional().or(z.literal("")),
});

const questFormSchema = z.object({
    date: z.string().min(1, "Date is required"),
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
    location: z.string().min(1, "Location is required"),
    description: z.string().min(1, "Description is required"),
    media: z.array(mediaItemSchema).min(1, "At least one media item is required"),
    isActive: z.boolean(),
});

type QuestFormValues = z.infer<typeof questFormSchema>;
type MediaItem = z.infer<typeof mediaItemSchema>;

export interface Quest {
    id: string;
    date: string;
    title: string;
    location: string;
    description: string;
    media: { type: "image" | "video"; src: string; thumbnail?: string }[];
    order?: number;
    isActive?: boolean;
}

interface QuestModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quest?: Quest | null;
}

interface SortableMediaItemProps {
    item: MediaItem;
    index: number;
    form: ReturnType<typeof useForm<QuestFormValues>>;
    onRemove: () => void;
    canRemove: boolean;
    uploadingIndex: number | null;
    setUploadingIndex: (index: number | null) => void;
    onPreviousImageDetected: (index: number, prevUrl: string, newUrl: string) => void;
}

function SortableMediaItem({
    item, index, form, onRemove, canRemove, uploadingIndex, setUploadingIndex, onPreviousImageDetected,
}: SortableMediaItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
    const mediaType = form.watch(`media.${index}.type`);
    const mediaSrc = form.watch(`media.${index}.src`);

    return (
        <div ref={setNodeRef} style={style} className={`border rounded-lg p-3 space-y-3 bg-background ${isDragging ? "shadow-lg ring-2 ring-primary/20" : ""}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button type="button" {...attributes} {...listeners} className="p-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none">
                        <GripVertical className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium">Media {index + 1}</span>
                </div>
                {canRemove && (
                    <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                )}
            </div>
            <FormField control={form.control} name={`media.${index}.type`} render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-xs">Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="image"><span className="flex items-center gap-2"><ImageIcon className="h-3 w-3" /> Image</span></SelectItem>
                            <SelectItem value="video"><span className="flex items-center gap-2"><Video className="h-3 w-3" /> Video (YouTube)</span></SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
            {mediaType === "image" ? (
                <>
                    <FormField control={form.control} name={`media.${index}.src`} render={({ field }) => (
                        <ImageUploadField value={field.value} onChange={field.onChange}
                            onUploadStart={() => setUploadingIndex(index)} onUploadEnd={() => setUploadingIndex(null)}
                            onPreviousImageDetected={(prevUrl, newUrl) => onPreviousImageDetected(index, prevUrl, newUrl)} label="Image" />
                    )} />
                    <ImagePreview url={mediaSrc} isLoading={uploadingIndex === index} />
                </>
            ) : (
                <>
                    <FormField control={form.control} name={`media.${index}.src`} render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">YouTube URL</FormLabel>
                            <FormControl><Input placeholder="https://www.youtube.com/watch?v=..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name={`media.${index}.thumbnail`} render={({ field }) => (
                        <ImageUploadField value={field.value || ""} onChange={field.onChange}
                            onUploadStart={() => setUploadingIndex(index)} onUploadEnd={() => setUploadingIndex(null)}
                            onPreviousImageDetected={(prevUrl, newUrl) => {
                                if (prevUrl && isCloudinaryUrl(prevUrl)) { onPreviousImageDetected(index, prevUrl, newUrl); }
                                else { field.onChange(newUrl); }
                            }} label="Thumbnail (optional)" />
                    )} />
                </>
            )}
        </div>
    );
}

const generateId = () => Math.random().toString(36).substring(2, 11);


export default function QuestModal({ open, onOpenChange, quest }: Readonly<QuestModalProps>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [showDeleteImageAlert, setShowDeleteImageAlert] = useState(false);
    const [pendingImageChange, setPendingImageChange] = useState<{ index: number; newUrl: string; prevUrl: string } | null>(null);
    const queryClient = useQueryClient();
    const isEditing = !!quest;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const form = useForm<QuestFormValues>({
        resolver: zodResolver(questFormSchema),
        defaultValues: { date: "", title: "", location: "", description: "", media: [{ id: generateId(), type: "image", src: "", thumbnail: "" }], isActive: true },
    });

    const { fields, append, remove, move } = useFieldArray({ control: form.control, name: "media" });

    useEffect(() => {
        if (quest) {
            form.reset({
                date: quest.date, title: quest.title, location: quest.location, description: quest.description,
                media: quest.media.map(m => ({ id: generateId(), type: m.type, src: m.src, thumbnail: m.thumbnail || "" })),
                isActive: quest.isActive ?? true,
            });
        } else {
            form.reset({ date: "", title: "", location: "", description: "", media: [{ id: generateId(), type: "image", src: "", thumbnail: "" }], isActive: true });
        }
    }, [quest, form]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex((f) => f.id === active.id);
            const newIndex = fields.findIndex((f) => f.id === over.id);
            move(oldIndex, newIndex);
        }
    };

    const handlePreviousImageDetected = (index: number, prevUrl: string, newUrl: string) => {
        setPendingImageChange({ index, newUrl, prevUrl });
        setShowDeleteImageAlert(true);
    };

    const handleDeleteOldImage = async (deleteOld: boolean) => {
        if (!pendingImageChange) return;
        if (deleteOld && pendingImageChange.prevUrl && isCloudinaryUrl(pendingImageChange.prevUrl)) {
            try {
                await cloudinary.delete(pendingImageChange.prevUrl);
                toast.success("Old image deleted");
            } catch { toast.error("Failed to delete old image"); }
        }
        form.setValue(`media.${pendingImageChange.index}.src`, pendingImageChange.newUrl);
        toast.success("Image updated");
        setPendingImageChange(null);
        setShowDeleteImageAlert(false);
    };

    const onSubmit = async (data: QuestFormValues) => {
        setIsSubmitting(true);
        try {
            const payload = {
                date: data.date, title: data.title, location: data.location, description: data.description,
                media: data.media.map((m) => ({ type: m.type, src: m.src, ...(m.type === "video" && m.thumbnail ? { thumbnail: m.thumbnail } : {}) })),
                order: 0, isActive: data.isActive,
            };
            if (isEditing && quest) { await questsApi.update(quest.id, payload); toast.success("Quest updated!"); }
            else { await questsApi.create(payload); toast.success("Quest created!"); }
            queryClient.invalidateQueries({ queryKey: ["quests"] });
            form.reset();
            onOpenChange(false);
        } catch (error) { toast.error(error instanceof Error ? error.message : `Failed to ${isEditing ? "update" : "create"} quest`); }
        finally { setIsSubmitting(false); }
    };

    const isUploading = uploadingIndex !== null;

    return (
        <>
            <FormModal open={open} onOpenChange={onOpenChange} title={isEditing ? "Edit Quest" : "Create New Quest"}
                description={isEditing ? "Update your side quest details." : "Add a new side quest to share your adventures."} icon={MapPin} maxWidth="sm:max-w-[700px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2"><Type className="h-4 w-4 text-muted-foreground" />Title</FormLabel>
                                <FormControl><Input placeholder="e.g., Swimming" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="date" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />Date</FormLabel>
                                    <FormControl>
                                        <DatePicker value={field.value ? new Date(field.value) : undefined}
                                            onChange={(date) => field.onChange(date ? date.toISOString() : "")} placeholder="Select date" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="location" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />Location</FormLabel>
                                    <FormControl><Input placeholder="e.g., Cox's Bazar, BD" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea placeholder="Tell your story..." className="resize-none min-h-[100px]" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <FormLabel className="flex items-center gap-2"><ImageIcon className="h-4 w-4 text-muted-foreground" />Media (drag to reorder)</FormLabel>
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ id: generateId(), type: "image", src: "", thumbnail: "" })}>
                                    <Plus className="h-4 w-4 mr-1" />Add Media
                                </Button>
                            </div>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-3">
                                        {fields.map((field, index) => (
                                            <SortableMediaItem key={field.id} item={field} index={index} form={form} onRemove={() => remove(index)}
                                                canRemove={fields.length > 1} uploadingIndex={uploadingIndex} setUploadingIndex={setUploadingIndex}
                                                onPreviousImageDetected={handlePreviousImageDetected} />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                            {form.formState.errors.media?.message && <p className="text-sm text-destructive">{form.formState.errors.media.message}</p>}
                        </div>
                        <FormActions onCancel={() => onOpenChange(false)}
                            submitText={isSubmitting ? (isEditing ? "Updating..." : "Creating...") : isUploading ? "Uploading..." : (isEditing ? "Update Quest" : "Create Quest")}
                            isSubmitting={isSubmitting} isDisabled={isUploading}
                            leftContent={<FormField control={form.control} name="isActive" render={({ field }) => (
                                <PublishToggle checked={field.value} onCheckedChange={field.onChange} />
                            )} />} />
                    </form>
                </Form>
            </FormModal>
            <ConfirmDialog open={showDeleteImageAlert} onOpenChange={setShowDeleteImageAlert} title="Delete Old Image?"
                description="Do you want to delete the old image from Cloudinary? This action cannot be undone."
                confirmText="Delete Old Image" cancelText="Keep Old Image" variant="danger"
                onConfirm={() => handleDeleteOldImage(true)} onCancel={() => handleDeleteOldImage(false)} />
        </>
    );
}
