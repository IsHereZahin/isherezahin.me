"use client";

import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import EditContactInfoModal from "@/components/admin/EditContactInfoModal";
import TestimonialModal from "@/components/admin/TestimonialModal";
import { ShadcnButton as Button } from "@/components/ui";
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

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Home Page Settings</h2>

            {/* Testimonials Section */}
            <section className="border border-border rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <MessageSquareQuote className="h-5 w-5 text-muted-foreground shrink-0" />
                        <h3 className="text-base sm:text-lg font-semibold">Testimonials</h3>
                    </div>
                    <Button size="sm" onClick={() => setTestimonialModal({ open: true, data: null })}>
                        <Plus className="h-4 w-4" /> Add
                    </Button>
                </div>
                {testimonialsData.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No testimonials yet</p>
                ) : (
                    <div className="space-y-3">
                        {testimonialsData.map((item) => (
                            <div key={item._id} className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 sm:p-4 bg-muted/30 rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-muted-foreground line-clamp-2">&quot;{item.quote}&quot;</p>
                                    <p className="text-xs sm:text-sm font-medium mt-1">{item.name} · {item.role}</p>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                    <button onClick={() => setTestimonialModal({ open: true, data: item })} className="p-1.5 sm:p-2 hover:bg-muted rounded-md transition-colors">
                                        <Pencil className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                    <button onClick={() => setDeleteTestimonial(item)} className="p-1.5 sm:p-2 hover:bg-red-500/10 rounded-md transition-colors">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Get In Touch Section */}
            <section className="border border-border rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                        <h3 className="text-base sm:text-lg font-semibold">Get In Touch</h3>
                    </div>
                    <Button size="sm" onClick={() => setEditContactOpen(true)}>
                        <Pencil className="h-4 w-4" /> Edit
                    </Button>
                </div>
                {contactData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div className="p-3 sm:p-4 bg-muted/30 rounded-lg space-y-2">
                            <p className="text-sm font-medium text-foreground mb-2">Contact Details</p>
                            <p className="text-xs sm:text-sm"><span className="text-muted-foreground">Email:</span> {contactData.email || "Not set"}</p>
                            <p className="text-xs sm:text-sm"><span className="text-muted-foreground">Headline:</span> {contactData.headline || "Not set"}</p>
                        </div>
                        <div className="p-3 sm:p-4 bg-muted/30 rounded-lg space-y-2">
                            <p className="text-sm font-medium text-foreground mb-2">Skills & Highlight</p>
                            <p className="text-xs sm:text-sm"><span className="text-muted-foreground">Highlight:</span> {contactData.highlightText || "Not set"}</p>
                            <p className="text-xs sm:text-sm"><span className="text-muted-foreground">Skills:</span> {contactData.skills?.join(", ") || "None"}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center">Contact info not configured yet</p>
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
