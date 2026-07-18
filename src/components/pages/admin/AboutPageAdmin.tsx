"use client";

import AboutHeroModal from "@/components/admin/AboutHeroModal";
import CurrentStatusModal from "@/components/admin/CurrentStatusModal";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import EducationModal from "@/components/admin/EducationModal";
import WorkExperienceModal from "@/components/admin/WorkExperienceModal";
import { ShadcnButton as Button } from "@/components/ui";
import { aboutHero, currentStatus, education, workExperience } from "@/lib/api";
import { formatMonthYear } from "@/utils";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, CircleHelp, GraduationCap, GripVertical, type LucideIcon, Pencil, Plus, Trash2, User } from "lucide-react";
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

interface EducationItem {
    _id: string;
    start: string;
    end: string;
    degree: string;
    institution: string;
    institutionUrl: string;
    logo: string;
    order: number;
    isActive: boolean;
}

function SortableStatusItem({ item, onEdit, onDelete }: { item: CurrentStatusItem; onEdit: () => void; onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item._id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

    return (
        <div ref={setNodeRef} style={style} className={`flex items-center gap-2.5 rounded-xl border border-[var(--s-border)] bg-[var(--s-card)] px-3 py-2.5 ${isDragging ? "shadow-lg ring-2 ring-[#F4C63D]/30" : ""}`}>
            <button {...attributes} {...listeners} aria-label="Drag to reorder" className="shrink-0 cursor-grab touch-none rounded-lg p-1 text-[var(--s-faint)] transition-colors hover:bg-[var(--s-soft)] hover:text-[var(--s-text)] active:cursor-grabbing">
                <GripVertical className="h-4 w-4" />
            </button>
            <p className="min-w-0 flex-1 break-words text-[13px] text-[var(--s-text2)]">{item.text}</p>
            <div className="flex shrink-0 items-center gap-1">
                {!item.isActive && <StatusBadge>Hidden</StatusBadge>}
                <button onClick={onEdit} aria-label="Edit status" className="rounded-xl p-2 transition-colors hover:bg-[var(--s-soft)]">
                    <Pencil className="h-4 w-4 text-[var(--s-text2)]" />
                </button>
                <button onClick={onDelete} aria-label="Delete status" className="rounded-xl p-2 transition-colors hover:bg-[#EE5D4A]/10">
                    <Trash2 className="h-4 w-4 text-[#EE5D4A]" />
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
    const [educationModal, setEducationModal] = useState<{ open: boolean; data: EducationItem | null }>({ open: false, data: null });
    const [deleteEducation, setDeleteEducation] = useState<EducationItem | null>(null);
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    const { data: aboutHeroData } = useQuery<AboutHeroData>({ queryKey: ["admin-about-hero"], queryFn: aboutHero.get });
    const { data: statusData = [] } = useQuery<CurrentStatusItem[]>({ queryKey: ["admin-current-status"], queryFn: () => currentStatus.getAll(true) });
    const { data: experienceData = [] } = useQuery<WorkExperienceItem[]>({ queryKey: ["admin-work-experience"], queryFn: () => workExperience.getAll(true) });
    const { data: educationData = [] } = useQuery<EducationItem[]>({ queryKey: ["admin-education"], queryFn: () => education.getAll(true) });

    const handleDeleteStatus = async () => {
        if (!deleteStatus) return;
        try {
            await currentStatus.delete(deleteStatus._id);
            toast.success("Status deleted");
            queryClient.invalidateQueries({ queryKey: ["admin-current-status"] });
        } catch { toast.error("Failed to delete status"); }
        setDeleteStatus(null);
    };

    const handleDeleteExperience = async () => {
        if (!deleteExperience) return;
        try {
            await workExperience.delete(deleteExperience._id);
            toast.success("Experience deleted");
            queryClient.invalidateQueries({ queryKey: ["admin-work-experience"] });
        } catch { toast.error("Failed to delete experience"); }
        setDeleteExperience(null);
    };

    const handleDeleteEducation = async () => {
        if (!deleteEducation) return;
        try {
            await education.delete(deleteEducation._id);
            toast.success("Education deleted");
            queryClient.invalidateQueries({ queryKey: ["admin-education"] });
            queryClient.invalidateQueries({ queryKey: ["education"] });
        } catch { toast.error("Failed to delete education"); }
        setDeleteEducation(null);
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
        <div className="space-y-5">
            {/* Summary tiles */}
            <section className="rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    <StatTile label="Work Experience" value={experienceData.length} />
                    <StatTile label="Education" value={educationData.length} />
                    <StatTile label="Status Updates" value={statusData.length} />
                    <StatTile label="Bio Paragraphs" value={aboutHeroData?.paragraphs?.length ?? 0} />
                </div>
            </section>

            {/* Hero */}
            <SectionCard
                icon={User}
                title="Hero Section"
                description="Profile details shown at the top of your About page"
                action={<Button size="sm" onClick={() => setAboutHeroModal(true)} className="inline-flex items-center gap-2 rounded-full bg-[var(--s-invert)] px-5 h-10 text-[13px] font-medium text-white transition-transform hover:scale-[1.02]"><Pencil className="h-4 w-4" /> Edit</Button>}
            >
                {aboutHeroData ? (
                    <div className="grid gap-2.5 md:grid-cols-2">
                        <div className="rounded-2xl bg-[var(--s-soft)] p-4">
                            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--s-muted)]">Profile Info</p>
                            <dl className="space-y-2 text-[13px]">
                                <InfoRow label="Name" value={aboutHeroData.name} />
                                <InfoRow label="Title" value={aboutHeroData.title} />
                                <InfoRow label="Location" value={aboutHeroData.location} />
                                <InfoRow label="Image" value={aboutHeroData.imageSrc ? "Set" : "Not set"} />
                            </dl>
                        </div>
                        <div className="rounded-2xl bg-[var(--s-soft)] p-4">
                            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--s-muted)]">Page Content</p>
                            <dl className="space-y-2 text-[13px]">
                                <InfoRow label="Page Title" value={aboutHeroData.pageTitle || "About Me"} />
                                <InfoRow label="Subtitle" value={aboutHeroData.pageSubtitle || "Not set"} />
                                <InfoRow label="Paragraphs" value={String(aboutHeroData.paragraphs?.length || 0)} />
                            </dl>
                        </div>
                    </div>
                ) : (
                    <EmptyState icon={User} text="Hero section not configured yet" />
                )}
            </SectionCard>

            {/* Current status */}
            <SectionCard
                icon={CircleHelp}
                title="What I'm Up To Now"
                description="Drag to reorder what you're currently up to"
                action={<Button size="sm" onClick={() => setStatusModal({ open: true, data: null })} className="inline-flex items-center gap-2 rounded-full bg-[var(--s-invert)] px-5 h-10 text-[13px] font-medium text-white transition-transform hover:scale-[1.02]"><Plus className="h-4 w-4" /> Add</Button>}
            >
                {statusData.length === 0 ? (
                    <EmptyState icon={CircleHelp} text="No status items yet" />
                ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleStatusDragEnd}>
                        <SortableContext items={statusData.map((item) => item._id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-2">
                                {statusData.map((item) => (<SortableStatusItem key={item._id} item={item} onEdit={() => setStatusModal({ open: true, data: item })} onDelete={() => setDeleteStatus(item)} />))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </SectionCard>

            {/* Work experience */}
            <SectionCard
                icon={Briefcase}
                title="Work Experience"
                description="Roles and positions listed on your About page"
                action={<Button size="sm" onClick={() => setExperienceModal({ open: true, data: null })} className="inline-flex items-center gap-2 rounded-full bg-[var(--s-invert)] px-5 h-10 text-[13px] font-medium text-white transition-transform hover:scale-[1.02]"><Plus className="h-4 w-4" /> Add</Button>}
            >
                {experienceData.length === 0 ? (
                    <EmptyState icon={Briefcase} text="No work experience yet" />
                ) : (
                    <div className="divide-y divide-[var(--s-border-soft)]">
                        {experienceData.map((item) => (
                            <div key={item._id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--s-soft)]">
                                        <Briefcase className="h-[18px] w-[18px] text-[var(--s-text2)]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-[14px] font-medium text-[var(--s-text)]">{item.title}</p>
                                        <p className="truncate text-[12px] text-[var(--s-muted)]">{item.company} · {formatMonthYear(item.start)} - {formatMonthYear(item.end)}</p>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-1">
                                    {!item.isActive && <StatusBadge>Hidden</StatusBadge>}
                                    <button onClick={() => setExperienceModal({ open: true, data: item })} aria-label="Edit experience" className="rounded-xl p-2 transition-colors hover:bg-[var(--s-soft)]"><Pencil className="h-4 w-4 text-[var(--s-text2)]" /></button>
                                    <button onClick={() => setDeleteExperience(item)} aria-label="Delete experience" className="rounded-xl p-2 transition-colors hover:bg-[#EE5D4A]/10"><Trash2 className="h-4 w-4 text-[#EE5D4A]" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </SectionCard>

            {/* Education */}
            <SectionCard
                icon={GraduationCap}
                title="Education"
                description="Schools and degrees listed on your About page"
                action={<Button size="sm" onClick={() => setEducationModal({ open: true, data: null })} className="inline-flex items-center gap-2 rounded-full bg-[var(--s-invert)] px-5 h-10 text-[13px] font-medium text-white transition-transform hover:scale-[1.02]"><Plus className="h-4 w-4" /> Add</Button>}
            >
                {educationData.length === 0 ? (
                    <EmptyState icon={GraduationCap} text="No education entries yet" />
                ) : (
                    <div className="divide-y divide-[var(--s-border-soft)]">
                        {educationData.map((item) => (
                            <div key={item._id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--s-soft)]">
                                        <GraduationCap className="h-[18px] w-[18px] text-[var(--s-text2)]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-[14px] font-medium text-[var(--s-text)]">{item.institution}</p>
                                        <p className="truncate text-[12px] text-[var(--s-muted)]">{item.degree} · {formatMonthYear(item.start)} - {formatMonthYear(item.end)}</p>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-1">
                                    {!item.isActive && <StatusBadge>Hidden</StatusBadge>}
                                    <button onClick={() => setEducationModal({ open: true, data: item })} aria-label="Edit education" className="rounded-xl p-2 transition-colors hover:bg-[var(--s-soft)]"><Pencil className="h-4 w-4 text-[var(--s-text2)]" /></button>
                                    <button onClick={() => setDeleteEducation(item)} aria-label="Delete education" className="rounded-xl p-2 transition-colors hover:bg-[#EE5D4A]/10"><Trash2 className="h-4 w-4 text-[#EE5D4A]" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </SectionCard>

            <AboutHeroModal open={aboutHeroModal} onOpenChange={setAboutHeroModal} aboutData={aboutHeroData} />
            <CurrentStatusModal open={statusModal.open} onOpenChange={(open) => setStatusModal({ open, data: open ? statusModal.data : null })} status={statusModal.data} />
            <DeleteConfirmDialog open={!!deleteStatus} onOpenChange={(open) => !open && setDeleteStatus(null)} title="Delete Status" description="Are you sure you want to delete this status item?" onConfirm={handleDeleteStatus} />
            <WorkExperienceModal open={experienceModal.open} onOpenChange={(open) => setExperienceModal({ open, data: open ? experienceModal.data : null })} experience={experienceModal.data} />
            <DeleteConfirmDialog open={!!deleteExperience} onOpenChange={(open) => !open && setDeleteExperience(null)} title="Delete Experience" description="Are you sure you want to delete this work experience?" onConfirm={handleDeleteExperience} />
            <EducationModal open={educationModal.open} onOpenChange={(open) => setEducationModal({ open, data: open ? educationModal.data : null })} educationItem={educationModal.data} />
            <DeleteConfirmDialog open={!!deleteEducation} onOpenChange={(open) => !open && setDeleteEducation(null)} title="Delete Education" description="Are you sure you want to delete this education entry?" onConfirm={handleDeleteEducation} />
        </div>
    );
}

function SectionCard({ icon: Icon, title, description, action, children }: { icon: LucideIcon; title: string; description: string; action?: React.ReactNode; children: React.ReactNode }) {
    return (
        <section className="rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--s-soft)]">
                        <Icon className="h-5 w-5 text-[var(--s-text)]" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-[16px] font-semibold text-[var(--s-text)]">{title}</h3>
                        <p className="text-[12px] text-[var(--s-muted)]">{description}</p>
                    </div>
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </div>
            {children}
        </section>
    );
}

function StatTile({ label, value }: { label: string; value: number | string }) {
    return (
        <div className="rounded-2xl bg-[var(--s-soft)] px-4 py-3">
            <p className="text-[22px] font-bold leading-none text-[var(--s-text)]">{value}</p>
            <p className="mt-1.5 text-[12px] text-[var(--s-muted)]">{label}</p>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <dt className="shrink-0 text-[var(--s-muted)]">{label}</dt>
            <dd className="min-w-0 truncate text-right font-medium text-[var(--s-text)]">{value}</dd>
        </div>
    );
}

function StatusBadge({ children }: { children: React.ReactNode }) {
    return (
        <span className="mr-1 rounded-full bg-[var(--s-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--s-muted)]">{children}</span>
    );
}

function EmptyState({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[var(--s-soft)]/60 py-10 text-center">
            <Icon className="h-6 w-6 text-[var(--s-faint)]" />
            <p className="text-[13px] text-[var(--s-muted)]">{text}</p>
        </div>
    );
}
