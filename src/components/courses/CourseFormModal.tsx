"use client";

import { FormModal, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { courses, instructors as instructorsApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Check, ChevronDown, Loader2, Plus, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function ImageUploadButton({ onUploaded, size = "normal" }: Readonly<{ onUploaded: (url: string) => void; size?: "normal" | "small" }>) {
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
                className={`bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center ${
                    size === "small" ? "p-1.5" : "px-3 py-2"
                }`}
            >
                {isUploading ? <Loader2 className={`animate-spin ${size === "small" ? "w-3.5 h-3.5" : "w-4 h-4"}`} /> : <Upload className={size === "small" ? "w-3.5 h-3.5" : "w-4 h-4"} />}
            </button>
        </>
    );
}

interface Instructor {
    id: string;
    name: string;
    image: string | null;
    bio: string | null;
}

interface InstructorSelectorProps {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    inputClass: string;
}

function InstructorSelector({ selectedIds, onChange, inputClass }: Readonly<InstructorSelectorProps>) {
    const queryClient = useQueryClient();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newInstructor, setNewInstructor] = useState({ name: "", image: null as string | null, bio: "" });
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data } = useQuery({
        queryKey: ["instructors"],
        queryFn: () => instructorsApi.getAll(),
    });

    const allInstructors: Instructor[] = data?.instructors || [];

    const createMutation = useMutation({
        mutationFn: (data: { name: string; image?: string | null; bio?: string | null }) =>
            instructorsApi.create(data),
        onSuccess: (created: Instructor) => {
            toast.success("Instructor created!");
            queryClient.invalidateQueries({ queryKey: ["instructors"] });
            onChange([...selectedIds, created.id]);
            setNewInstructor({ name: "", image: null, bio: "" });
            setShowAddForm(false);
        },
        onError: (error: Error) => toast.error(error.message),
    });

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filteredInstructors = allInstructors.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedInstructors = allInstructors.filter((i) => selectedIds.includes(i.id));

    const toggleInstructor = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((sid) => sid !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    const handleCreateSubmit = () => {
        if (!newInstructor.name.trim()) {
            toast.error("Instructor name is required");
            return;
        }
        createMutation.mutate({
            name: newInstructor.name.trim(),
            image: newInstructor.image,
            bio: newInstructor.bio.trim() || null,
        });
    };

    return (
        <div className="space-y-2">
            {/* Selected instructors */}
            {selectedInstructors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedInstructors.map((instructor) => (
                        <div
                            key={instructor.id}
                            className="flex items-center gap-2 px-2.5 py-1.5 bg-muted border border-border rounded-lg text-sm"
                        >
                            {instructor.image ? (
                                <img
                                    src={instructor.image}
                                    alt=""
                                    className="w-5 h-5 rounded-full object-cover"
                                />
                            ) : (
                                <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                    {instructor.name.charAt(0)}
                                </span>
                            )}
                            <span className="text-foreground">{instructor.name}</span>
                            <button
                                type="button"
                                onClick={() => toggleInstructor(instructor.id)}
                                className="p-0.5 hover:bg-red-500/10 rounded cursor-pointer"
                            >
                                <X className="w-3 h-3 text-red-400" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Dropdown trigger */}
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`${inputClass} flex items-center justify-between cursor-pointer`}
                >
                    <span className="text-muted-foreground text-sm">
                        {selectedIds.length > 0
                            ? `${selectedIds.length} instructor${selectedIds.length > 1 ? "s" : ""} selected`
                            : "Select instructors..."}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                </button>

                {showDropdown && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-72 overflow-hidden">
                        {/* Search */}
                        <div className="p-2 border-b border-border">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`${inputClass} text-xs`}
                                placeholder="Search instructors..."
                                autoFocus
                            />
                        </div>

                        {/* List */}
                        <div className="max-h-40 overflow-y-auto">
                            {filteredInstructors.length > 0 ? (
                                filteredInstructors.map((instructor) => {
                                    const isSelected = selectedIds.includes(instructor.id);
                                    return (
                                        <button
                                            key={instructor.id}
                                            type="button"
                                            onClick={() => toggleInstructor(instructor.id)}
                                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                                                isSelected ? "bg-primary/5" : "hover:bg-muted/50"
                                            }`}
                                        >
                                            {instructor.image ? (
                                                <img
                                                    src={instructor.image}
                                                    alt=""
                                                    className="w-7 h-7 rounded-full object-cover shrink-0"
                                                />
                                            ) : (
                                                <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                                                    {instructor.name.charAt(0)}
                                                </span>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-foreground truncate">{instructor.name}</p>
                                                {instructor.bio && (
                                                    <p className="text-xs text-muted-foreground truncate">{instructor.bio}</p>
                                                )}
                                            </div>
                                            {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                                        </button>
                                    );
                                })
                            ) : (
                                <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                                    {search ? "No matching instructors" : "No instructors yet"}
                                </p>
                            )}
                        </div>

                        {/* Add new button */}
                        <div className="border-t border-border p-2">
                            {!showAddForm ? (
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(true)}
                                    className="w-full flex items-center gap-1.5 px-3 py-2 text-sm text-primary hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add new instructor
                                </button>
                            ) : (
                                <div className="space-y-2 p-1">
                                    <div className="flex items-center gap-2">
                                        {newInstructor.image ? (
                                            <div className="relative shrink-0">
                                                <img
                                                    src={newInstructor.image}
                                                    alt=""
                                                    className="w-9 h-9 rounded-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setNewInstructor({ ...newInstructor, image: null })}
                                                    className="absolute -top-1 -right-1 p-0.5 bg-card border border-border rounded-full cursor-pointer hover:bg-red-500/10"
                                                >
                                                    <X className="w-2.5 h-2.5 text-red-400" />
                                                </button>
                                            </div>
                                        ) : (
                                            <ImageUploadButton
                                                size="small"
                                                onUploaded={(url) => setNewInstructor({ ...newInstructor, image: url })}
                                            />
                                        )}
                                        <input
                                            type="text"
                                            value={newInstructor.name}
                                            onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                                            className={`${inputClass} text-xs flex-1`}
                                            placeholder="Name *"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={newInstructor.bio}
                                        onChange={(e) => setNewInstructor({ ...newInstructor, bio: e.target.value })}
                                        className={`${inputClass} text-xs`}
                                        placeholder="Bio (optional)"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddForm(false);
                                                setNewInstructor({ name: "", image: null, bio: "" });
                                            }}
                                            className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCreateSubmit}
                                            disabled={createMutation.isPending || !newInstructor.name.trim()}
                                            className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                                        >
                                            {createMutation.isPending ? "Adding..." : "Add"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
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
        instructors: { id?: string; name: string; image?: string | null; bio?: string | null }[];
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
        instructorIds: course?.instructors?.map((i) => i.id).filter(Boolean) as string[] || [],
        learningOutcomes: course?.learningOutcomes?.length ? course.learningOutcomes : [""],
    });

    const mutation = useMutation({
        mutationFn: (data: Record<string, unknown>) =>
            isEditing ? courses.update(course!.slug, data) : courses.create(data as unknown as Parameters<typeof courses.create>[0]),
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
            instructorIds: form.instructorIds,
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
                        <ImageUploadButton
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
                        <Select value={form.difficulty} onValueChange={(v) => updateField("difficulty", v)}>
                            <SelectTrigger className="w-full text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className={labelClass}>Status</label>
                        <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
                            <SelectTrigger className="w-full text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
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
                        <Select value={form.currency} onValueChange={(v) => updateField("currency", v)}>
                            <SelectTrigger className={inputClass}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BDT">BDT (৳)</SelectItem>
                                <SelectItem value="USD">USD ($)</SelectItem>
                            </SelectContent>
                        </Select>
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
                    <label className={labelClass}>Instructors *</label>
                    <InstructorSelector
                        selectedIds={form.instructorIds}
                        onChange={(ids) => updateField("instructorIds", ids)}
                        inputClass={inputClass}
                    />
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
                        disabled={mutation.isPending || !form.title.trim() || !form.slug.trim() || form.instructorIds.length === 0}
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
