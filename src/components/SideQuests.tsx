"use client";

import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import QuestModal, { Quest } from "@/components/admin/QuestModal";
import { AdminAddButton, AdminEmptyState, Badge, BlurImage, EmptyState, ExpandableText, Section, Skeleton } from "@/components/ui";
import { quests as questsApi } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatMonthYear } from "@/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, MapPin, Play, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SideQuests() {
    const [selectedMedia, setSelectedMedia] = useState<Record<string, number>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
    const [deleteQuest, setDeleteQuest] = useState<Quest | null>(null);
    const { isAdmin } = useAuth();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["quests"],
        queryFn: questsApi.getAll,
    });

    const quests: Quest[] = data?.quests || [];

    const getYouTubeEmbedUrl = (url: string) => {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const handleEdit = (quest: Quest) => {
        setEditingQuest(quest);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingQuest(null);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteQuest) return;
        try {
            await questsApi.delete(deleteQuest.id);
            toast.success("Quest deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["quests"] });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete quest");
        } finally {
            setDeleteQuest(null);
        }
    };

    if (isLoading) {
        return (
            <Section id="side-quests" animate delay={0.1}>
                <div className="space-y-16 sm:space-y-24">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                            <div className="lg:w-1/4 space-y-4">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="md:w-3/4">
                                <Skeleton className="h-64 w-full rounded-2xl" />
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        );
    }

    if (error) {
        return (
            <Section id="side-quests" animate delay={0.1}>
                <div className="text-center py-12 text-muted-foreground">
                    Failed to load quests. Please try again later.
                </div>
            </Section>
        );
    }

    const hasQuests = quests.length > 0;

    return (
        <>
            <Section id="side-quests" animate delay={0.1}>
                {isAdmin && hasQuests && (
                    <AdminAddButton onClick={handleAdd} label="Add Quest" className="mb-6" />
                )}

                {!hasQuests ? (
                    isAdmin ? (
                        <AdminEmptyState type="quests" onAdd={handleAdd} />
                    ) : (
                        <EmptyState type="quests" />
                    )
                ) : (
                    <div className="space-y-16 sm:space-y-24">
                        {quests.map((quest) => (
                            <div key={quest.id} className="relative">
                                {isAdmin && (
                                    <div className="absolute -top-2 right-0 flex gap-2 z-10">
                                        {quest.isActive === false && (
                                            <Badge variant="secondary" className="text-xs">Inactive</Badge>
                                        )}
                                        <button
                                            onClick={() => handleEdit(quest)}
                                            className="p-2 rounded-lg bg-background/80 backdrop-blur border hover:bg-accent transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteQuest(quest)}
                                            className="p-2 rounded-lg bg-background/80 backdrop-blur border hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                                    {/* Left: Meta Info */}
                                    <div className="md:w-1/4">
                                        <div className="sticky top-8">
                                            <p className="text-xs sm:text-sm text-muted-foreground hover:text-foreground/80 transition-colors uppercase tracking-wider mb-1 sm:mb-2">{formatMonthYear(quest.date)}</p>
                                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-foreground">{quest.title}</h3>
                                            <p className="text-sm sm:text-base text-muted-foreground hover:text-foreground/80 transition-colors flex items-center gap-1.5 sm:gap-2">
                                                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                {quest.location}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="md:w-3/4">
                                        <div className="shadow-feature-card rounded-2xl p-4 sm:p-6 group/card">
                                            <div className="text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                                                <ExpandableText text={quest.description} limit={200} />
                                            </div>

                                            {/* Main Media Display */}
                                            {quest.media && quest.media.length > 0 && (
                                                <>
                                                    <div className="relative rounded-xl overflow-hidden bg-gray-800/50 aspect-video mb-4">
                                                        {(() => {
                                                            const selectedIndex = selectedMedia[quest.id] ?? 0;
                                                            const media = quest.media[selectedIndex];

                                                            if (media?.type === "video") {
                                                                return (
                                                                    <iframe
                                                                        className="w-full h-full"
                                                                        src={getYouTubeEmbedUrl(media.src)}
                                                                        title="YouTube video player"
                                                                        frameBorder="0"
                                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                        allowFullScreen
                                                                    />
                                                                );
                                                            }

                                                            return media ? <BlurImage src={media.src} alt={quest.title} /> : null;
                                                        })()}
                                                    </div>

                                                    {/* Thumbnail Grid */}
                                                    {quest.media.length > 1 && (
                                                        <div className="grid grid-cols-4 gap-3">
                                                            {quest.media.map((item, index) => (
                                                                <button
                                                                    key={index}
                                                                    onClick={() => setSelectedMedia({ ...selectedMedia, [quest.id]: index })}
                                                                    className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${(selectedMedia[quest.id] === index || (selectedMedia[quest.id] === undefined && index === 0))
                                                                        ? 'ring-2 ring-primary'
                                                                        : 'opacity-60 hover:opacity-100'
                                                                        }`}
                                                                >
                                                                    {item.type === 'video' ? (
                                                                        <>
                                                                            <BlurImage
                                                                                src={item.thumbnail || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400'}
                                                                                alt={`Thumbnail ${index + 1}`}
                                                                            />
                                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                                                <div className="size-5 xs:size-6 sm:size-7 md:size-8 lg:size-9 rounded-full bg-foreground/90 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                                                                    <Play
                                                                                        className="size-3 xs:size-3.5 sm:size-4 md:size-5 lg:size-5 ml-0.5 text-background"
                                                                                        fill="currentColor"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <BlurImage
                                                                            src={item.src}
                                                                            alt={`Thumbnail ${index + 1}`}
                                                                        />
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Section>

            <QuestModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                quest={editingQuest}
            />

            <DeleteConfirmDialog
                open={!!deleteQuest}
                onOpenChange={(open) => !open && setDeleteQuest(null)}
                onConfirm={handleDelete}
                title="Delete Quest"
                description={`Are you sure you want to delete "${deleteQuest?.title}"? This action cannot be undone.`}
            />
        </>
    );
}