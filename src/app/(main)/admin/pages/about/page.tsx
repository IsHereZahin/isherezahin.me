"use client";

import AboutHeroModal from "@/components/admin/AboutHeroModal";
import CurrentStatusModal from "@/components/admin/CurrentStatusModal";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import WorkExperienceModal from "@/components/admin/WorkExperienceModal";
import { Button } from "@/components/ui/shadcn-button";
import { aboutHero, currentStatus, workExperience } from "@/lib/api";
import { formatMonthYear } from "@/utils";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, CircleHelp, GripVertical, Pencil, Plus, Trash2, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AboutHeroData {
    _id?: string;
    name: string;
    title: string;
    location: string;
    age?: string;
    imageSrc: string;
    paragraphs: string[];
    pageTitle?: string;
    pageSubtitle?: string;
}

interface CurrentStatusItem {
    _id: string;
    text: string;
    order: number;
    isActive: boolean;
}

interface WorkExperienceItem {
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
    isActive: boolean;
}

function SortableStatusItem({ item, onEdit, onDelete }: { item: CurrentStatusItem; onEdit: () => void; onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item._id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

    return (
        <div ref={setNodeRef} style={style} className={`flex flex-col sm:flex-row sm:items-start gap-3 p-3 sm:p-4 bg-muted/30 rounded-lg ${isDragging ? "shadow-lg ring-2 ring-primary/20" : ""}`}>
            <div className="flex items-start gap-2 flex-1 min-w-0">
                <button {...attributes} {...listeners} className="p-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0 touch-none">
                    <GripVertical className="h-4 w-4" />
                </button>
                <p className="text-sm text-muted-foreground flex-1 break-words">{item.text}</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 ml-6 sm:ml-0 shrink-0">
                <button onClick={onEdit} className="p-1.5 sm:p-2 hover:bg-muted rounded-md transition-colors">
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                </button>
                <button onClick={onDelete} className="p-1.5 sm:p-2 hover:bg-red-500/10 rounded-md transition-colors">
                    <Trash2 className="h-4 w-4 text-red-500" />
                </button>
            </div>
        </div>
    );
}


export default function AboutPageAdmin() {
    const queryClient = useQueryClient();
    const [aboutHeroModal, setAboutHeroModal] = useState(false);
    const [statusModal, setStatusModal] = useState<{ open: boolean; data: CurrentStatusItem | null }>({ open: false, data: null });
    const [deleteStatus, setDeleteStatus] = useState<CurrentStatusItem | null>(null);
    const [experienceModal, setExperienceModal] = useState<{ open: boolean; data: WorkExperienceItem | null }>({ open: false, data: null });
    const [deleteExperience, setDeleteExperience] = useState<WorkExperienceItem | null>(null);

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    const { data: aboutHeroData } = useQuery<AboutHeroData>({
        queryKey: ["admin-about-hero"],
        queryFn: aboutHero.get,
    });

    const { data: statusData = [] } = useQuery<CurrentStatusItem[]>({
        queryKey: ["admin-current-status"],
        queryFn: () => currentStatus.getAll(true),
    });

    const { data: experienceData = [] } = useQuery<WorkExperienceItem[]>({
        queryKey: ["admin-work-experience"],
        queryFn: () => workExperience.getAll(true),
    });

    const handleDeleteStatus = async () => {
        if (!deleteStatus) return;
        try {
            await currentStatus.delete(deleteStatus._id);
            toast.success("Status deleted");
            queryClient.invalidateQueries({ queryKey: ["admin-current-status"] });
        } catch {
            toast.error("Failed to delete status");
        }
        setDeleteStatus(null);
    };

    const handleDeleteExperience = async () => {
        if (!deleteExperience) return;
        try {
            await workExperience.delete(deleteExperience._id);
            toast.success("Experience deleted");
            queryClient.invalidateQueries({ queryKey: ["admin-work-experience"] });
        } catch {
            toast.error("Failed to delete experience");
        }
        setDeleteExperience(null);
    };

    const handleStatusDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = statusData.findIndex((item) => item._id === active.id);
        const newIndex = statusData.findIndex((item) => item._id === over.id);
        const newOrder = arrayMove(statusData, oldIndex, newIndex);
        queryClient.setQueryData(["admin-current-status"], newOrder);
        try {
            await Promise.all(newOrder.map((item, index) => currentStatus.update(item._id, { text: item.text, order: index })));
            toast.success("Order updated");
        } catch {
            toast.error("Failed to update order");
            queryClient.invalidateQueries({ queryKey: ["admin-current-status"] });
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">About Page Settings</h2>

            {/* Hero Section */}
            <section className="border border-border rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground shrink-0" />
                        <h3 className="text-base sm:text-lg font-semibold">Hero Section</h3>
                    </div>
                    <Button size="sm" onClick={() => setAboutHeroModal(true)}>
                        <Pencil className="h-4 w-4" /> Edit
                    </Button>
                </div>
                {aboutHeroData ? (
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                            <p className="text-sm font-medium text-foreground mb-2">Profile Info</p>
                            <p className="text-sm"><span className="text-muted-foreground">Name:</span> {aboutHeroData.name}</p>
                            <p className="text-sm"><span className="text-muted-foreground">Title:</span> {aboutHeroData.title}</p>
                            <p className="text-sm"><span className="text-muted-foreground">Location:</span> {aboutHeroData.location}</p>
                            <p className="text-sm"><span className="text-muted-foreground">Image:</span> {aboutHeroData.imageSrc ? "Set" : "Not set"}</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                            <p className="text-sm font-medium text-foreground mb-2">Page Content</p>
                            <p className="text-sm"><span className="text-muted-foreground">Page Title:</span> {aboutHeroData.pageTitle || "About Me"}</p>
                            <p className="text-sm"><span className="text-muted-foreground">Subtitle:</span> {aboutHeroData.pageSubtitle || "Not set"}</p>
                            <p className="text-sm"><span className="text-muted-foreground">Paragraphs:</span> {aboutHeroData.paragraphs?.length || 0}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center">Hero section not configured yet</p>
                )}
            </section>

            {/* Current Status Section */}
            <section className="border border-border rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <CircleHelp className="h-5 w-5 text-muted-foreground shrink-0" />
                        <h3 className="text-base sm:text-lg font-semibold">What I&apos;m Up To Now</h3>
                    </div>
                    <Button size="sm" onClick={() => setStatusModal({ open: true, data: null })}>
                        <Plus className="h-4 w-4" /> Add
                    </Button>
                </div>
                {statusData.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No status items yet</p>
                ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleStatusDragEnd}>
                        <SortableContext items={statusData.map((item) => item._id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-3">
                                {statusData.map((item) => (
                                    <SortableStatusItem key={item._id} item={item} onEdit={() => setStatusModal({ open: true, data: item })} onDelete={() => setDeleteStatus(item)} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </section>

            {/* Work Experience Section */}
            <section className="border border-border rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-muted-foreground shrink-0" />
                        <h3 className="text-base sm:text-lg font-semibold">Work Experience</h3>
                    </div>
                    <Button size="sm" onClick={() => setExperienceModal({ open: true, data: null })}>
                        <Plus className="h-4 w-4" /> Add
                    </Button>
                </div>
                {experienceData.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No work experience yet</p>
                ) : (
                    <div className="space-y-3">
                        {experienceData.map((item) => (
                            <div key={item._id} className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 sm:p-4 bg-muted/30 rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm sm:text-base">{item.title}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{item.company} · {formatMonthYear(item.start)} - {formatMonthYear(item.end)}</p>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                    <button onClick={() => setExperienceModal({ open: true, data: item })} className="p-1.5 sm:p-2 hover:bg-muted rounded-md transition-colors">
                                        <Pencil className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                    <button onClick={() => setDeleteExperience(item)} className="p-1.5 sm:p-2 hover:bg-red-500/10 rounded-md transition-colors">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Modals */}
            <AboutHeroModal open={aboutHeroModal} onOpenChange={setAboutHeroModal} aboutData={aboutHeroData} />
            <CurrentStatusModal open={statusModal.open} onOpenChange={(open) => setStatusModal({ open, data: open ? statusModal.data : null })} status={statusModal.data} />
            <DeleteConfirmDialog open={!!deleteStatus} onOpenChange={(open) => !open && setDeleteStatus(null)} title="Delete Status" description="Are you sure you want to delete this status item?" onConfirm={handleDeleteStatus} />
            <WorkExperienceModal open={experienceModal.open} onOpenChange={(open) => setExperienceModal({ open, data: open ? experienceModal.data : null })} experience={experienceModal.data} />
            <DeleteConfirmDialog open={!!deleteExperience} onOpenChange={(open) => !open && setDeleteExperience(null)} title="Delete Experience" description="Are you sure you want to delete this work experience?" onConfirm={handleDeleteExperience} />
        </div>
    );
}
