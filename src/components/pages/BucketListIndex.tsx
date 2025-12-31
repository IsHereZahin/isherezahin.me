"use client";

import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import BucketListModal, { BucketListItem } from "@/components/admin/BucketListModal";
import MotionWrapper from "@/components/motion/MotionWrapper";
import { AdminAddButton, AdminEmptyState, Badge, EmptyState, ErrorState, PageTitle, Section, Skeleton } from "@/components/ui";
import { bucketList as bucketListApi } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Circle, Clock, Edit, Info, MapPin, Target, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type BucketListStatus = "completed" | "in-progress" | "pending";
type BucketListCategory = "travel" | "adventure" | "personal" | "career" | "learning" | "lifestyle";

const CATEGORIES: { value: BucketListCategory | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "travel", label: "Travel" },
    { value: "adventure", label: "Adventure" },
    { value: "personal", label: "Personal" },
    { value: "career", label: "Career" },
    { value: "learning", label: "Learning" },
    { value: "lifestyle", label: "Lifestyle" },
];

const STATUS_CONFIG: Record<BucketListStatus, { icon: typeof CheckCircle; color: string; label: string }> = {
    completed: { icon: CheckCircle, color: "text-green-500", label: "Completed" },
    "in-progress": { icon: Clock, color: "text-yellow-500", label: "In Progress" },
    pending: { icon: Circle, color: "text-muted-foreground", label: "Pending" },
};

const CATEGORY_COLORS: Record<BucketListCategory, string> = {
    travel: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    adventure: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    personal: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    career: "bg-green-500/10 text-green-500 border-green-500/20",
    learning: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    lifestyle: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
};

function BucketListLoading() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl border border-border/30 p-4 sm:p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function StatsLoading() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center p-3 sm:p-4 rounded-xl bg-muted/50 border border-border/30">
                    <Skeleton className="h-6 w-12 mx-auto mb-1" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                </div>
            ))}
        </div>
    );
}

interface BucketListCardProps {
    item: BucketListItem;
    index: number;
    isAdmin: boolean;
    onEdit: (item: BucketListItem) => void;
    onDelete: (item: BucketListItem) => void;
}

function BucketListCard({ item, index, isAdmin, onEdit, onDelete }: Readonly<BucketListCardProps>) {
    const StatusIcon = STATUS_CONFIG[item.status].icon;

    return (
        <MotionWrapper direction="bottom" delay={0.1 + index * 0.05}>
            <article className="group relative rounded-2xl border border-border/30 p-4 sm:p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 bg-card/50 backdrop-blur-sm">
                {/* Admin controls */}
                {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.isActive === false && (
                            <Badge variant="secondary" className="text-xs mr-1">Inactive</Badge>
                        )}
                        <button
                            onClick={() => onEdit(item)}
                            className="p-1.5 rounded-lg bg-background/80 backdrop-blur border hover:bg-accent transition-colors"
                            title="Edit"
                        >
                            <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => onDelete(item)}
                            className="p-1.5 rounded-lg bg-background/80 backdrop-blur border hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* Status indicator */}
                <div className={`absolute ${isAdmin ? 'top-12' : 'top-4'} right-4 sm:right-6`}>
                    <StatusIcon
                        className={`w-5 h-5 ${STATUS_CONFIG[item.status].color} transition-transform group-hover:scale-110`}
                    />
                </div>

                <div className="pr-8">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {item.description}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Badge
                        variant="outline"
                        className={`text-xs capitalize ${CATEGORY_COLORS[item.category]}`}
                    >
                        {item.category}
                    </Badge>

                    {item.location && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {item.location}
                        </span>
                    )}

                    {item.completedDate && (
                        <span className="text-xs text-green-500">
                            {new Date(item.completedDate).toLocaleDateString()}
                        </span>
                    )}
                </div>

                {item.status === "in-progress" && (
                    <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-gradient-to-r from-primary to-primary/60 rounded-full animate-pulse" />
                    </div>
                )}
            </article>
        </MotionWrapper>
    );
}

export default function BucketListIndex() {
    const [selectedCategory, setSelectedCategory] = useState<BucketListCategory | "all">("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<BucketListItem | null>(null);
    const [deleteItem, setDeleteItem] = useState<BucketListItem | null>(null);
    const { isAdmin } = useAuth();
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["bucketList"],
        queryFn: bucketListApi.getAll,
        staleTime: 1000 * 60 * 5,
    });

    const items: BucketListItem[] = data?.items || [];
    const stats = data?.stats || { total: 0, completed: 0, inProgress: 0, pending: 0 };

    const filteredItems = selectedCategory === "all"
        ? items
        : items.filter((item) => item.category === selectedCategory);

    const handleEdit = (item: BucketListItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteItem) return;
        try {
            await bucketListApi.delete(deleteItem.id);
            toast.success("Item deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["bucketList"] });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete item");
        } finally {
            setDeleteItem(null);
        }
    };

    if (isError) {
        return (
            <Section id="bucket-list">
                <PageTitle
                    title="My Bucket List"
                    subtitle="Dreams, goals, and adventures I'm chasing in this lifetime."
                />
                <ErrorState
                    title="Failed to load bucket list"
                    message={error instanceof Error ? error.message : "We couldn't load the bucket list. Please check your connection and try again."}
                    onRetry={() => refetch()}
                />
            </Section>
        );
    }

    const hasItems = items.length > 0;
    const hasFilteredItems = filteredItems.length > 0;

    const renderStatsOverview = () => {
        if (isLoading) return <StatsLoading />;
        if (!hasItems) return null;
        return (
            <MotionWrapper direction="top" delay={0.1}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
                    <div className="text-center p-3 sm:p-4 rounded-xl bg-muted/50 border border-border/30">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <Target className="w-4 h-4 text-primary" />
                            <span className="text-lg sm:text-xl font-bold text-foreground">{stats.total}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Total Goals</span>
                    </div>
                    <div className="text-center p-3 sm:p-4 rounded-xl bg-muted/50 border border-border/30">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-lg sm:text-xl font-bold text-foreground">{stats.completed}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Completed</span>
                    </div>
                    <div className="text-center p-3 sm:p-4 rounded-xl bg-muted/50 border border-border/30">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <Clock className="w-4 h-4 text-yellow-500" />
                            <span className="text-lg sm:text-xl font-bold text-foreground">{stats.inProgress}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">In Progress</span>
                    </div>
                    <div className="text-center p-3 sm:p-4 rounded-xl bg-muted/50 border border-border/30">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <Circle className="w-4 h-4 text-muted-foreground" />
                            <span className="text-lg sm:text-xl font-bold text-foreground">{stats.pending}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Pending</span>
                    </div>
                </div>
            </MotionWrapper>
        );
    };

    const renderContent = () => {
        if (isLoading) return <BucketListLoading />;

        if (hasFilteredItems) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {filteredItems.map((item, index) => (
                        <BucketListCard
                            key={item.id}
                            item={item}
                            index={index}
                            isAdmin={isAdmin}
                            onEdit={handleEdit}
                            onDelete={setDeleteItem}
                        />
                    ))}
                </div>
            );
        }

        if (hasItems) {
            return (
                <EmptyState
                    type="projects"
                    title="No items found"
                    subtitle="No bucket list items in this category"
                    description="Try selecting a different category to see more goals."
                />
            );
        }

        if (isAdmin) {
            return <AdminEmptyState type="projects" onAdd={handleAdd} />;
        }

        return (
            <EmptyState
                type="projects"
                title="No goals yet"
                subtitle="The bucket list is empty"
                description="Check back later for exciting goals and adventures."
            />
        );
    };

    return (
        <>
            <Section id="bucket-list">
                {(isLoading || hasItems) && (
                    <>
                        <PageTitle
                            title="My Bucket List"
                            subtitle="Dreams, goals, and adventures I'm chasing in this lifetime."
                        />

                        {/* Note */}
                        <MotionWrapper direction="top" delay={0.05}>
                            <div className="mb-8 p-4 rounded-xl bg-primary/5 border border-primary/20">
                                <div className="flex gap-3">
                                    <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        This is a professional ‘My Bucket List.’ Personal or career-related goals are not included. You also do not share private goals publicly, simply list them and celebrate their completion without revealing any personal details. Above all, let us remember that our ultimate goal is to strive to be good human beings.
                                    </p>
                                </div>
                            </div>
                        </MotionWrapper>
                    </>
                )}

                {isAdmin && hasItems && (
                    <AdminAddButton onClick={handleAdd} label="Add Goal" className="mb-4" />
                )}

                {/* Stats Overview */}
                {renderStatsOverview()}

                {/* Category Filter */}
                {(isLoading || hasItems) && (
                    <MotionWrapper direction="left" delay={0.2}>
                        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category.value}
                                    onClick={() => setSelectedCategory(category.value)}
                                    className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                                        selectedCategory === category.value
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                                    }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </MotionWrapper>
                )}

                {/* Content */}
                {renderContent()}
            </Section>

            <BucketListModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                item={editingItem}
            />

            <DeleteConfirmDialog
                open={!!deleteItem}
                onOpenChange={(open) => !open && setDeleteItem(null)}
                onConfirm={handleDelete}
                title="Delete Bucket List Item"
                description={`Are you sure you want to delete "${deleteItem?.title}"? This action cannot be undone.`}
            />
        </>
    );
}
