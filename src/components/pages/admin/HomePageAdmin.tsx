"use client";

import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import EditContactInfoModal from "@/components/admin/EditContactInfoModal";
import TestimonialModal from "@/components/admin/TestimonialModal";
import { contactInfo, testimonials } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, MessageSquareQuote, Pencil, Plus, Trash2 } from "lucide-react";
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

interface ContactInfoData {
    email?: string;
    headline: string;
    subheadline: string;
    highlightText?: string;
    skills: string[];
}

export default function HomePageAdmin() {
    const queryClient = useQueryClient();
    const [testimonialModal, setTestimonialModal] = useState<{ open: boolean; data: TestimonialItem | null }>({ open: false, data: null });
    const [deleteTestimonial, setDeleteTestimonial] = useState<TestimonialItem | null>(null);
    const [editContactOpen, setEditContactOpen] = useState(false);

    const { data: testimonialsData = [] } = useQuery<TestimonialItem[]>({
        queryKey: ["admin-testimonials"],
        queryFn: () => testimonials.getAll(true),
    });

    const { data: contactData } = useQuery<ContactInfoData>({
        queryKey: ["admin-contact-info"],
        queryFn: contactInfo.get,
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

    const activeCount = testimonialsData.filter((t) => t.isActive).length;
    const skillsCount = contactData?.skills?.length ?? 0;

    return (
        <div className="space-y-5">
            {/* Summary tiles */}
            <div className="grid grid-cols-3 gap-3">
                <StatTile label="Testimonials" value={testimonialsData.length} />
                <StatTile label="Active" value={activeCount} />
                <StatTile label="Skills listed" value={skillsCount} />
            </div>

            {/* Testimonials */}
            <section className="rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between gap-4">
                    <SectionHeading icon={MessageSquareQuote} title="Testimonials" description="Quotes shown on your home page" />
                    <button
                        onClick={() => setTestimonialModal({ open: true, data: null })}
                        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-[var(--s-invert)] px-5 text-[13px] font-medium text-white transition-transform hover:scale-[1.02]"
                    >
                        <Plus className="h-4 w-4" /> Add
                    </button>
                </div>

                {testimonialsData.length === 0 ? (
                    <EmptyState icon={MessageSquareQuote} text="No testimonials yet" />
                ) : (
                    <div className="mt-4 divide-y divide-[var(--s-border-soft)]">
                        {testimonialsData.map((item) => (
                            <div key={item._id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <p className="text-[14px] font-medium text-[var(--s-text)]">{item.name}</p>
                                        <span className="text-[var(--s-faint)]">·</span>
                                        <span className="text-[12px] text-[var(--s-muted)]">{item.role}</span>
                                        <StatusBadge active={item.isActive} />
                                    </div>
                                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[var(--s-text2)]">&quot;{item.quote}&quot;</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-1">
                                    <button
                                        onClick={() => setTestimonialModal({ open: true, data: item })}
                                        aria-label="Edit testimonial"
                                        className="rounded-xl p-2 text-[var(--s-muted)] transition-colors hover:bg-[var(--s-soft)]"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteTestimonial(item)}
                                        aria-label="Delete testimonial"
                                        className="rounded-xl p-2 text-[#EE5D4A] transition-colors hover:bg-[#EE5D4A]/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Get In Touch */}
            <section className="rounded-[24px] border border-[var(--s-border)] bg-[var(--s-card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between gap-4">
                    <SectionHeading icon={Mail} title="Get In Touch" description="Contact section shown to visitors" />
                    <button
                        onClick={() => setEditContactOpen(true)}
                        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[var(--s-border)] bg-[var(--s-card)] px-4 text-[13px] font-medium text-[var(--s-text)] transition-colors hover:bg-[var(--s-soft)]"
                    >
                        <Pencil className="h-4 w-4" /> Edit
                    </button>
                </div>

                {contactData ? (
                    <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <InfoTile label="Email" value={contactData.email || "Not set"} />
                            <InfoTile label="Headline" value={contactData.headline || "Not set"} />
                            <InfoTile label="Subheadline" value={contactData.subheadline || "Not set"} />
                            <InfoTile label="Highlight" value={contactData.highlightText || "Not set"} />
                        </div>
                        <div className="rounded-2xl bg-[var(--s-soft)] px-4 py-3">
                            <p className="text-[11px] text-[var(--s-muted)]">Skills</p>
                            {contactData.skills?.length ? (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {contactData.skills.map((skill, i) => (
                                        <span
                                            key={`${skill}-${i}`}
                                            className="inline-flex items-center rounded-full border border-[var(--s-border)] bg-[var(--s-card)] px-2.5 py-1 text-[12px] font-medium text-[var(--s-text2)]"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-1 text-[14px] font-medium text-[var(--s-text)]">None</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <EmptyState icon={Mail} text="Contact info not configured yet" />
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
            <EditContactInfoModal
                open={editContactOpen}
                onOpenChange={setEditContactOpen}
                contactData={contactData}
            />
        </div>
    );
}

function SectionHeading({ icon: Icon, title, description }: { icon: typeof Mail; title: string; description: string }) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--s-soft)]">
                <Icon className="h-5 w-5 text-[var(--s-text)]" />
            </div>
            <div className="min-w-0">
                <h3 className="text-[16px] font-semibold text-[var(--s-text)]">{title}</h3>
                <p className="text-[12px] text-[var(--s-muted)]">{description}</p>
            </div>
        </div>
    );
}

function StatTile({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-2xl bg-[var(--s-soft)] px-4 py-3">
            <p className="text-[20px] font-semibold leading-none text-[var(--s-text)]">{value}</p>
            <p className="mt-1.5 text-[12px] text-[var(--s-muted)]">{label}</p>
        </div>
    );
}

function InfoTile({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-[var(--s-soft)] px-4 py-3">
            <p className="text-[11px] text-[var(--s-muted)]">{label}</p>
            <p className="mt-1 wrap-break-word text-[14px] font-medium text-[var(--s-text)]">{value}</p>
        </div>
    );
}

function StatusBadge({ active }: { active: boolean }) {
    return active ? (
        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-600 dark:bg-green-500/10 dark:text-green-400">
            Active
        </span>
    ) : (
        <span className="inline-flex items-center rounded-full bg-[var(--s-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--s-muted)]">
            Hidden
        </span>
    );
}

function EmptyState({ icon: Icon, text }: { icon: typeof Mail; text: string }) {
    return (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl bg-[var(--s-soft)] py-10 text-center">
            <Icon className="h-6 w-6 text-[var(--s-faint)]" />
            <p className="text-[13px] text-[var(--s-muted)]">{text}</p>
        </div>
    );
}
