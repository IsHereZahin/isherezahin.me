"use client";

import { FormModal } from "@/components/ui";
import { courses } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { BookOpen, Loader2, Plus, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

function ThumbnailUploadButton({ onUploaded }: Readonly<{ onUploaded: (url: string) => void }>) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error("Image must be less than 5MB"); return; }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch("/api/cloudinary", { method: "POST", body: formData });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            onUploaded(result.url);
            toast.success("Image uploaded");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Upload failed");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <>
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} className="hidden" />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors disabled:opacity-50 cursor-pointer"
            >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            </button>
        </>
    );
}

interface CourseFormModalProps {
    course?: {
        slug: string;
        title: string;
        description: string;
        thumbnail: string | null;
        category: string | null;
        tags: string[];
        difficulty: string;
        instructors: { name: string; image?: string | null; bio?: string | null }[];
        price: number;
        originalPrice?: number | null;
        currency: string;
        learningOutcomes: string[];
        status: string;
    } | null;
    onClose: () => void;
    onSuccess: () => void;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-");
}

export default function CourseFormModal({ course, onClose, onSuccess }: Readonly<CourseFormModalProps>) {
    const isEditing = !!course;

    const [form, setForm] = useState({
        title: course?.title || "",
        slug: course?.slug || "",
        description: course?.description || "",
        thumbnail: course?.thumbnail || "",
        category: course?.category || "",
        tags: course?.tags?.join(", ") || "",
        difficulty: course?.difficulty || "beginner",
        price: course?.price?.toString() || "0",
        originalPrice: course?.originalPrice?.toString() || "",
        currency: course?.currency || "BDT",
        status: course?.status || "draft",
        instructors: course?.instructors || [{ name: "", image: null, bio: null }],
        learningOutcomes: course?.learningOutcomes?.length ? course.learningOutcomes : [""],
    });

    const mutation = useMutation({
        mutationFn: (data: Record<string, unknown>) =>
            isEditing ? courses.update(course!.slug, data) : courses.create(data as Parameters<typeof courses.create>[0]),
        onSuccess: () => {
            toast.success(isEditing ? "Course updated!" : "Course created!");
            onSuccess();
        },
        onError: (error: Error) => toast.error(error.message),
    });

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        mutation.mutate({
            title: form.title.trim(),
            slug: form.slug.trim(),
            description: form.description.trim(),
            thumbnail: form.thumbnail || null,
            category: form.category.trim() || null,
            tags: form.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            difficulty: form.difficulty,
            price: parseFloat(form.price) || 0,
            originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
            currency: form.currency,
            status: form.status,
            instructors: form.instructors.filter((i) => i.name.trim()),
            learningOutcomes: form.learningOutcomes.filter((o) => o.trim()),
        });
    };

    const updateField = (field: string, value: unknown) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const inputClass = "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";
    const labelClass = "block text-sm font-medium text-foreground mb-1";

    return (
        <FormModal
            open={true}
            onOpenChange={(open) => { if (!open) onClose(); }}
            title={isEditing ? "Edit Course" : "Create Course"}
            description={isEditing ? "Update course details below." : "Fill in the details to create a new course."}
            icon={BookOpen}
            maxWidth="sm:max-w-[750px]"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Title *</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => {
                                updateField("title", e.target.value);
                                if (!isEditing) updateField("slug", slugify(e.target.value));
                            }}
                            className={inputClass}
                            required
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Slug *</label>
                        <input
                            type="text"
                            value={form.slug}
                            onChange={(e) => updateField("slug", slugify(e.target.value))}
                            className={inputClass}
                            required
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        className={`${inputClass} min-h-20 resize-y`}
                        rows={3}
                    />
                </div>

                {/* Thumbnail */}
                <div>
                    <label className={labelClass}>Thumbnail</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={form.thumbnail}
                            onChange={(e) => updateField("thumbnail", e.target.value)}
                            className={`${inputClass} flex-1`}
                            placeholder="https://example.com/image.jpg"
                        />
                        <ThumbnailUploadButton
                            onUploaded={(url) => updateField("thumbnail", url)}
                        />
                    </div>
                </div>

                {/* Category, Difficulty, Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className={labelClass}>Category</label>
                        <input
                            type="text"
                            value={form.category}
                            onChange={(e) => updateField("category", e.target.value)}
                            className={inputClass}
                            placeholder="e.g. Web Development"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Difficulty</label>
                        <select
                            value={form.difficulty}
                            onChange={(e) => updateField("difficulty", e.target.value)}
                            className={inputClass}
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => updateField("status", e.target.value)}
                            className={inputClass}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                {/* Price */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className={labelClass}>Price</label>
                        <input
                            type="number"
                            value={form.price}
                            onChange={(e) => updateField("price", e.target.value)}
                            className={inputClass}
                            min="0"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Original Price</label>
                        <input
                            type="number"
                            value={form.originalPrice}
                            onChange={(e) => updateField("originalPrice", e.target.value)}
                            className={inputClass}
                            min="0"
                            placeholder="For discount display"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Currency</label>
                        <select
                            value={form.currency}
                            onChange={(e) => updateField("currency", e.target.value)}
                            className={inputClass}
                        >
                            <option value="BDT">BDT (৳)</option>
                            <option value="USD">USD ($)</option>
                        </select>
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className={labelClass}>Tags (comma separated)</label>
                    <input
                        type="text"
                        value={form.tags}
                        onChange={(e) => updateField("tags", e.target.value)}
                        className={inputClass}
                        placeholder="e.g. React, TypeScript, Next.js"
                    />
                </div>

                {/* Instructors */}
                <div>
                    <label className={labelClass}>Instructors</label>
                    <div className="space-y-2">
                        {form.instructors.map((instructor, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={instructor.name}
                                    onChange={(e) => {
                                        const updated = [...form.instructors];
                                        updated[i] = { ...updated[i], name: e.target.value };
                                        updateField("instructors", updated);
                                    }}
                                    className={`${inputClass} flex-1`}
                                    placeholder="Instructor name"
                                />
                                <input
                                    type="text"
                                    value={instructor.bio || ""}
                                    onChange={(e) => {
                                        const updated = [...form.instructors];
                                        updated[i] = { ...updated[i], bio: e.target.value };
                                        updateField("instructors", updated);
                                    }}
                                    className={`${inputClass} flex-1`}
                                    placeholder="Bio (optional)"
                                />
                                {form.instructors.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = form.instructors.filter((_, idx) => idx !== i);
                                            updateField("instructors", updated);
                                        }}
                                        className="p-2 hover:bg-red-500/10 rounded-lg cursor-pointer"
                                    >
                                        <X className="w-4 h-4 text-red-400" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                updateField("instructors", [...form.instructors, { name: "", image: null, bio: null }])
                            }
                            className="flex items-center gap-1.5 text-sm text-primary hover:underline cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add instructor
                        </button>
                    </div>
                </div>

                {/* Learning Outcomes */}
                <div>
                    <label className={labelClass}>Learning Outcomes</label>
                    <div className="space-y-2">
                        {form.learningOutcomes.map((outcome, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={outcome}
                                    onChange={(e) => {
                                        const updated = [...form.learningOutcomes];
                                        updated[i] = e.target.value;
                                        updateField("learningOutcomes", updated);
                                    }}
                                    className={`${inputClass} flex-1`}
                                    placeholder="What students will learn"
                                />
                                {form.learningOutcomes.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = form.learningOutcomes.filter((_, idx) => idx !== i);
                                            updateField("learningOutcomes", updated);
                                        }}
                                        className="p-2 hover:bg-red-500/10 rounded-lg cursor-pointer"
                                    >
                                        <X className="w-4 h-4 text-red-400" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => updateField("learningOutcomes", [...form.learningOutcomes, ""])}
                            className="flex items-center gap-1.5 text-sm text-primary hover:underline cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add outcome
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={mutation.isPending || !form.title.trim() || !form.slug.trim()}
                        className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {mutation.isPending
                            ? isEditing ? "Saving..." : "Creating..."
                            : isEditing ? "Save Changes" : "Create Course"}
                    </button>
                </div>
            </form>
        </FormModal>
    );
}
