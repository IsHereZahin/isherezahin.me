"use client";

import { ConfirmDialog } from "@/components/ui";
import { courses } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ArrowLeft, ChevronDown, GripVertical, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { Lesson, Module } from "./module-editor/types";
import { nextDragId, INPUT_CLASS } from "./module-editor/types";
import { useFetchDuration } from "./module-editor/youtube-utils";
import { SortableModule, SortableLesson } from "./module-editor/SortableItems";
import ModuleModal from "./module-editor/ModuleModal";
import LessonModal from "./module-editor/LessonModal";

interface ModuleEditorProps {
    course: {
        slug: string;
        title: string;
    };
    onBack: () => void;
}

export default function ModuleEditor({ course, onBack }: Readonly<ModuleEditorProps>) {
    const queryClient = useQueryClient();
    const fetchDuration = useFetchDuration();

    const { data: courseData } = useQuery({
        queryKey: ["course", course.slug],
        queryFn: () => courses.get(course.slug),
    });

    const [modules, setModules] = useState<Module[]>([]);
    const [initialized, setInitialized] = useState(false);
    const [expandedModule, setExpandedModule] = useState<number | null>(0);
    const [deleteModuleIndex, setDeleteModuleIndex] = useState<number | null>(null);

    // Module modal state
    const [moduleModal, setModuleModal] = useState<{ open: boolean; index: number | null; title: string }>({ open: false, index: null, title: "" });
    // Lesson modal state
    const [lessonModal, setLessonModal] = useState<{ open: boolean; moduleIndex: number; lessonIndex: number | null; lesson: Lesson }>({
        open: false, moduleIndex: 0, lessonIndex: null,
        lesson: { dragId: "", title: "", order: 0, contentType: "video", videoUrl: null, content: null, duration: null, isFree: false },
    });

    // Initialize from fetched data
    if (courseData?.modules && !initialized) {
        setModules(
            courseData.modules.map((m: Module, i: number) => ({
                ...m,
                dragId: nextDragId(),
                order: m.order ?? i,
                lessons: m.lessons?.map((l: Lesson, j: number) => ({
                    ...l,
                    dragId: nextDragId(),
                    order: l.order ?? j,
                })) || [],
            }))
        );
        setInitialized(true);
    }

    const saveMutation = useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: (data: any[]) => courses.updateModules(course.slug, data),
        onSuccess: () => {
            toast.success("Modules saved successfully!");
            queryClient.invalidateQueries({ queryKey: ["course", course.slug] });
        },
        onError: (error: Error) => toast.error(error.message),
    });

    const handleSave = () => {
        const errors: string[] = [];
        modules.forEach((m, mi) => {
            if (!m.title.trim()) errors.push(`Module ${mi + 1}: Title is required`);
            m.lessons.forEach((l, li) => {
                if (!l.title.trim()) errors.push(`Module ${mi + 1}, Lesson ${li + 1}: Title is required`);
            });
        });
        if (errors.length > 0) { errors.forEach((e) => toast.error(e)); return; }

        const cleaned = modules.map((m, mi) => ({
            ...(m._id ? { _id: m._id } : {}),
            title: m.title,
            order: mi,
            lessons: m.lessons.map((l, li) => ({
                ...(l._id ? { _id: l._id } : {}),
                title: l.title,
                order: li,
                contentType: l.contentType,
                videoUrl: l.videoUrl || null,
                content: l.content || null,
                duration: l.duration || null,
                isFree: l.isFree || false,
            })),
        }));
        saveMutation.mutate(cleaned);
    };

    const removeModule = (index: number) => {
        setModules(modules.filter((_, i) => i !== index));
    };

    const removeLesson = (moduleIndex: number, lessonIndex: number) => {
        const updated = [...modules];
        updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
        setModules(updated);
    };

    const toggleModuleExpand = (index: number) => {
        setExpandedModule((prev) => prev === index ? null : index);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleModuleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = modules.findIndex((m) => m.dragId === active.id);
        const newIndex = modules.findIndex((m) => m.dragId === over.id);
        if (oldIndex === -1 || newIndex === -1) return;
        setModules(arrayMove(modules, oldIndex, newIndex));
        if (expandedModule === oldIndex) setExpandedModule(newIndex);
        else if (expandedModule !== null) {
            if (oldIndex < expandedModule && newIndex >= expandedModule) setExpandedModule(expandedModule - 1);
            else if (oldIndex > expandedModule && newIndex <= expandedModule) setExpandedModule(expandedModule + 1);
        }
    };

    const handleLessonDragEnd = (mi: number) => (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const lessons = modules[mi].lessons;
        const oldIndex = lessons.findIndex((l) => l.dragId === active.id);
        const newIndex = lessons.findIndex((l) => l.dragId === over.id);
        if (oldIndex === -1 || newIndex === -1) return;
        const updated = [...modules];
        updated[mi].lessons = arrayMove(lessons, oldIndex, newIndex);
        setModules(updated);
    };

    // Module modal handlers
    const openAddModule = () => {
        setModuleModal({ open: true, index: null, title: "" });
    };
    const openEditModule = (mi: number) => {
        setModuleModal({ open: true, index: mi, title: modules[mi].title });
    };
    const handleModuleModalSave = (title: string) => {
        if (moduleModal.index === null) {
            setModules([...modules, { dragId: nextDragId(), title, order: modules.length, lessons: [] }]);
            setExpandedModule(modules.length);
        } else {
            const updated = [...modules];
            updated[moduleModal.index].title = title;
            setModules(updated);
        }
        setModuleModal({ open: false, index: null, title: "" });
    };

    // Lesson modal handlers
    const openAddLesson = (mi: number) => {
        setLessonModal({
            open: true,
            moduleIndex: mi,
            lessonIndex: null,
            lesson: { dragId: nextDragId(), title: "", order: modules[mi].lessons.length, contentType: "video", videoUrl: null, content: null, duration: null, isFree: false },
        });
    };
    const openEditLesson = (mi: number, li: number) => {
        setLessonModal({
            open: true,
            moduleIndex: mi,
            lessonIndex: li,
            lesson: { ...modules[mi].lessons[li] },
        });
    };
    const handleLessonModalSave = (lesson: Lesson) => {
        const updated = [...modules];
        if (lessonModal.lessonIndex === null) {
            updated[lessonModal.moduleIndex].lessons.push(lesson);
        } else {
            updated[lessonModal.moduleIndex].lessons[lessonModal.lessonIndex] = lesson;
        }
        setModules(updated);
        setLessonModal((prev) => ({ ...prev, open: false }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Manage Modules</h2>
                        <p className="text-sm text-muted-foreground">{courseData?.title || course.title}</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saveMutation.isPending}
                    className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {saveMutation.isPending ? "Saving..." : "Save All"}
                </button>
            </div>

            {/* Modules */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleModuleDragEnd}>
            <SortableContext items={modules.map((m) => m.dragId)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
                {modules.map((module, mi) => (
                    <SortableModule key={module.dragId} id={module.dragId}>
                    {(dragHandleProps) => (
                    <div className="border border-border rounded-xl">
                        {/* Module Header */}
                        <div className={`flex items-center gap-2 p-3 ${expandedModule === mi ? "border-b border-border" : ""}`}>
                            <button {...dragHandleProps} className="cursor-grab active:cursor-grabbing touch-none p-0.5">
                                <GripVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <div
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => toggleModuleExpand(mi)}
                            >
                                <span className="text-sm font-medium text-foreground truncate block">
                                    {module.title || <span className="text-muted-foreground italic">Untitled Module</span>}
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                                {module.lessons.length} lessons
                            </span>
                            <div className="flex items-center gap-0.5 shrink-0">
                                <button onClick={() => toggleModuleExpand(mi)} className="p-1 hover:bg-muted rounded cursor-pointer">
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedModule === mi ? "rotate-180" : ""}`} />
                                </button>
                                <button onClick={() => openEditModule(mi)} className="p-1 hover:bg-muted rounded cursor-pointer" title="Edit Module">
                                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                                <button onClick={() => setDeleteModuleIndex(mi)} className="p-1 hover:bg-red-500/10 rounded cursor-pointer">
                                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                </button>
                            </div>
                        </div>

                        {/* Lessons */}
                        {expandedModule === mi && (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLessonDragEnd(mi)}>
                            <SortableContext items={module.lessons.map((l) => l.dragId)} strategy={verticalListSortingStrategy}>
                            <div className="p-3 space-y-2">
                                {module.lessons.map((lesson, li) => (
                                    <SortableLesson key={lesson.dragId} id={lesson.dragId}>
                                    {(lessonDragHandleProps) => (
                                    <div
                                        className="flex items-center gap-2 p-2.5 border border-border/50 rounded-lg bg-background hover:bg-muted/30 transition-colors cursor-pointer"
                                        onClick={() => openEditLesson(mi, li)}
                                    >
                                        <button {...lessonDragHandleProps} className="cursor-grab active:cursor-grabbing touch-none p-0.5" onClick={(e) => e.stopPropagation()}>
                                            <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
                                        </button>
                                        <span className="text-xs text-muted-foreground w-5 text-center shrink-0">
                                            {li + 1}
                                        </span>
                                        <span className="flex-1 text-sm text-foreground truncate">
                                            {lesson.title || <span className="text-muted-foreground italic">Untitled Lesson</span>}
                                        </span>
                                        <div className="flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground">
                                            {lesson.contentType !== "video" && (
                                                <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] uppercase">{lesson.contentType}</span>
                                            )}
                                            {lesson.duration && <span>{lesson.duration}</span>}
                                            {lesson.isFree && <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px]">Free</span>}
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeLesson(mi, li); }}
                                            className="p-1 hover:bg-red-500/10 rounded cursor-pointer shrink-0"
                                        >
                                            <X className="w-3 h-3 text-red-400" />
                                        </button>
                                    </div>
                                    )}
                                    </SortableLesson>
                                ))}

                                <button
                                    onClick={() => openAddLesson(mi)}
                                    className="flex items-center gap-1.5 text-sm text-primary hover:underline cursor-pointer px-2 py-1"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Lesson
                                </button>
                            </div>
                            </SortableContext>
                            </DndContext>
                        )}
                    </div>
                    )}
                    </SortableModule>
                ))}

                <button
                    onClick={openAddModule}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Add Module
                </button>
            </div>
            </SortableContext>
            </DndContext>

            {/* Module Modal */}
            <ModuleModal
                open={moduleModal.open}
                onClose={() => setModuleModal({ open: false, index: null, title: "" })}
                onSave={handleModuleModalSave}
                initialTitle={moduleModal.title}
                isNew={moduleModal.index === null}
            />

            {/* Lesson Modal */}
            <LessonModal
                open={lessonModal.open}
                onClose={() => setLessonModal((prev) => ({ ...prev, open: false }))}
                onSave={handleLessonModalSave}
                initialLesson={lessonModal.lesson}
                isNew={lessonModal.lessonIndex === null}
                inputClass={INPUT_CLASS}
                fetchDuration={fetchDuration}
            />

            {/* Delete Module Confirmation */}
            {deleteModuleIndex !== null && (
                <ConfirmDialog
                    open={true}
                    onOpenChange={() => setDeleteModuleIndex(null)}
                    title="Delete Module"
                    description={`Are you sure you want to delete "${modules[deleteModuleIndex]?.title || "Untitled Module"}"? All lessons in this module will be removed. This action cannot be undone.`}
                    onConfirm={() => {
                        removeModule(deleteModuleIndex);
                        setDeleteModuleIndex(null);
                    }}
                    confirmText="Delete"
                    variant="danger"
                />
            )}
        </div>
    );
}
