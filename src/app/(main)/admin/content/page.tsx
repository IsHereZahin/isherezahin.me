"use client";

import CurrentStatusModal from "@/components/admin/CurrentStatusModal";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import EditContactInfoModal from "@/components/admin/EditContactInfoModal";
import HeroModal from "@/components/admin/HeroModal";
import TestimonialModal from "@/components/admin/TestimonialModal";
import WorkExperienceModal from "@/components/admin/WorkExperienceModal";
import { contactInfo, currentStatus, hero, testimonials, workExperience } from "@/lib/api";
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
import { Briefcase, CircleHelp, Sparkles, GripVertical, Mail, MessageSquareQuote, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TestimonialItem {
    _id: string;
    quote: string;
    name: string;
    role: string;
    order: number;
    isActive: boolean;
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

interface ContactInfoData {
    email?: string;
    headline: string;
    subheadline: string;
    highlightText?: string;
    skills: string[];
}

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

interface SortableStatusItemProps {
    item: CurrentStatusItem;
    onEdit: () => void;
    onDelete: () => void;
}

function SortableStatusItem({ item, onEdit, onDelete }: SortableStatusItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-start justify-between p-4 bg-muted/30 rounded-lg ${isDragging ? "shadow-lg ring-2 ring-primary/20" : ""}`}
        >
            <div className="flex items-start gap-2 flex-1 min-w-0">
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground mt-0.5"
                >
                    <GripVertical className="h-4 w-4" />
                </button>
                <p className="text-sm text-muted-foreground flex-1">{item.text}</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
                <button onClick={onEdit} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                </button>
                <button onClick={onDelete} className="p-1.5 hover:bg-red-500/10 rounded-md transition-colors">
                    <Trash2 className="h-4 w-4 text-red-500" />
                </button>
            </div>
        </div>
    );
}

export default function ContentPage() {
    const queryClient = useQueryClient();

    const [testimonialModal, setTestimonialModal] = useState<{ open: boolean; data: TestimonialItem | null }>({ open: false, data: null });
    const [deleteTestimonial, setDeleteTestimonial] = useState<TestimonialItem | null>(null);

    const [statusModal, setStatusModal] = useState<{ open: boolean; data: CurrentStatusItem | null }>({ open: false, data: null });
    const [deleteStatus, setDeleteStatus] = useState<CurrentStatusItem | null>(null);

    const [experienceModal, setExperienceModal] = useState<{ open: boolean; data: WorkExperienceItem | null }>({ open: false, data: null });
    const [deleteExperience, setDeleteExperience] = useState<WorkExperienceItem | null>(null);

    const [editContactOpen, setEditContactOpen] = useState(false);
    const [heroModalOpen, setHeroModalOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const { data: testimonialsData = [] } = useQuery<TestimonialItem[]>({
        queryKey: ["admin-testimonials"],
        queryFn: () => testimonials.getAll(true),
    });

    const { data: statusData = [] } = useQuery<CurrentStatusItem[]>({
        queryKey: ["admin-current-status"],
        queryFn: () => currentStatus.getAll(true),
    });

    const { data: experienceData = [] } = useQuery<WorkExperienceItem[]>({
        queryKey: ["admin-work-experience"],
        queryFn: () => workExperience.getAll(true),
    });

    const { data: contactData } = useQuery<ContactInfoData>({
        queryKey: ["admin-contact-info"],
        queryFn: contactInfo.get,
    });

    const { data: heroData } = useQuery<HeroData>({
        queryKey: ["admin-hero"],
        queryFn: hero.get,
    });

    const handleDeleteTestimonial = async () => {
        if (!deleteTestimonial) return;
        try {
            await testimonials.delete(deleteTestimonial._id);
            toast.success("Testimonial deleted");
            queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
        } catch {
            toast.error("Failed to delete testimonial");
        }
        setDeleteTestimonial(null);
    };

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

        // Optimistically update the UI
        queryClient.setQueryData(["admin-current-status"], newOrder);

        // Update order in database
        try {
            await Promise.all(
                newOrder.map((item, index) =>
                    currentStatus.update(item._id, { text: item.text, order: index })
                )
            );
            toast.success("Order updated");
        } catch {
            toast.error("Failed to update order");
            queryClient.invalidateQueries({ queryKey: ["admin-current-status"] });
        }
    };

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <section className="border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Hero Section</h3>
                    </div>
                    <button
                        onClick={() => setHeroModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                    >
                        <Pencil className="h-4 w-4" /> Edit
                    </button>
                </div>
                {heroData ? (
                    <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                        <p className="text-sm"><span className="text-muted-foreground">Greeting:</span> {heroData.greeting} <span className="text-primary font-medium">{heroData.name}</span></p>
                        <p className="text-sm"><span className="text-muted-foreground">Tagline:</span> {heroData.tagline}</p>
                        <p className="text-sm line-clamp-2"><span className="text-muted-foreground">Description:</span> {heroData.description}</p>
                        <p className="text-sm"><span className="text-muted-foreground">Skills:</span> {heroData.highlightedSkills?.join(", ") || "None"}</p>
                        <p className="text-sm"><span className="text-muted-foreground">Buttons:</span> {heroData.buttons?.length || 0} configured</p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center">Hero section not configured (using defaults)</p>
                )}
            </section>

            {/* Testimonials Section */}
            <section className="border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <MessageSquareQuote className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Nice Words (Testimonials)</h3>
                    </div>
                    <button
                        onClick={() => setTestimonialModal({ open: true, data: null })}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> Add
                    </button>
                </div>
                {testimonialsData.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No testimonials yet</p>
                ) : (
                    <div className="space-y-3">
                        {testimonialsData.map((item) => (
                            <div key={item._id} className="flex items-start justify-between p-4 bg-muted/30 rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-muted-foreground line-clamp-2">&quot;{item.quote}&quot;</p>
                                    <p className="text-sm font-medium mt-1">{item.name} · {item.role}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button onClick={() => setTestimonialModal({ open: true, data: item })} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                                        <Pencil className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                    <button onClick={() => setDeleteTestimonial(item)} className="p-1.5 hover:bg-red-500/10 rounded-md transition-colors">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Get In Touch Section */}
            <section className="border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Get In Touch</h3>
                    </div>
                    <button
                        onClick={() => setEditContactOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                    >
                        <Pencil className="h-4 w-4" /> Edit
                    </button>
                </div>
                {contactData ? (
                    <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                        <p className="text-sm"><span className="text-muted-foreground">Email:</span> {contactData.email || "Not set"}</p>
                        <p className="text-sm"><span className="text-muted-foreground">Headline:</span> {contactData.headline}</p>
                        <p className="text-sm"><span className="text-muted-foreground">Skills:</span> {contactData.skills?.join(", ") || "None"}</p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center">Contact info not configured</p>
                )}
            </section>

            {/* Current Status Section */}
            <section className="border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <CircleHelp className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">What I&apos;m Up To Now</h3>
                    </div>
                    <button
                        onClick={() => setStatusModal({ open: true, data: null })}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> Add
                    </button>
                </div>
                {statusData.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No status items yet</p>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleStatusDragEnd}
                    >
                        <SortableContext
                            items={statusData.map((item) => item._id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {statusData.map((item) => (
                                    <SortableStatusItem
                                        key={item._id}
                                        item={item}
                                        onEdit={() => setStatusModal({ open: true, data: item })}
                                        onDelete={() => setDeleteStatus(item)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </section>

            {/* Work Experience Section */}
            <section className="border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Work Experience</h3>
                    </div>
                    <button
                        onClick={() => setExperienceModal({ open: true, data: null })}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> Add
                    </button>
                </div>
                {experienceData.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No work experience yet</p>
                ) : (
                    <div className="space-y-3">
                        {experienceData.map((item) => (
                            <div key={item._id} className="flex items-start justify-between p-4 bg-muted/30 rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.company} · {item.start} - {item.end}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button onClick={() => setExperienceModal({ open: true, data: item })} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                                        <Pencil className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                    <button onClick={() => setDeleteExperience(item)} className="p-1.5 hover:bg-red-500/10 rounded-md transition-colors">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Modals */}
            <TestimonialModal
                open={testimonialModal.open}
                onOpenChange={(open) => setTestimonialModal({ open, data: open ? testimonialModal.data : null })}
                testimonial={testimonialModal.data}
            />
            <DeleteConfirmDialog
                open={!!deleteTestimonial}
                onOpenChange={(open) => !open && setDeleteTestimonial(null)}
                title="Delete Testimonial"
                description="Are you sure you want to delete this testimonial? This action cannot be undone."
                onConfirm={handleDeleteTestimonial}
            />

            <CurrentStatusModal
                open={statusModal.open}
                onOpenChange={(open) => setStatusModal({ open, data: open ? statusModal.data : null })}
                status={statusModal.data}
            />
            <DeleteConfirmDialog
                open={!!deleteStatus}
                onOpenChange={(open) => !open && setDeleteStatus(null)}
                title="Delete Status"
                description="Are you sure you want to delete this status item? This action cannot be undone."
                onConfirm={handleDeleteStatus}
            />

            <WorkExperienceModal
                open={experienceModal.open}
                onOpenChange={(open) => setExperienceModal({ open, data: open ? experienceModal.data : null })}
                experience={experienceModal.data}
            />
            <DeleteConfirmDialog
                open={!!deleteExperience}
                onOpenChange={(open) => !open && setDeleteExperience(null)}
                title="Delete Experience"
                description="Are you sure you want to delete this work experience? This action cannot be undone."
                onConfirm={handleDeleteExperience}
            />

            <EditContactInfoModal
                open={editContactOpen}
                onOpenChange={setEditContactOpen}
                contactData={contactData}
            />

            <HeroModal
                open={heroModalOpen}
                onOpenChange={setHeroModalOpen}
                heroData={heroData}
            />
        </div>
    );
}
