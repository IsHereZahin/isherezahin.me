"use client";

import { ApiError, blogViews, deleteBlog, getBlog } from "@/lib/api";
import { extractTocItems, getFormattedDate } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlignLeftIcon, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DeleteConfirmDialog, EditBlogModal } from "@/components/admin";
import { ArticleInfo, BlogSubscribe, MarkdownPreview, RelatedBlogs, TableOfContents } from "@/components/content";
import {
    BlogDetailsLoading,
    BlurImage,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Heading,
    ImageZoom,
    LikeButton,
    Section,
    TextGradient,
} from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";

export default function BlogDetailsIndex({ slug }: { readonly slug: string }) {
    const [showTOC, setShowTOC] = useState(false);
    const [viewCount, setViewCount] = useState(0);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { isAdmin } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["blog", slug],
        queryFn: () => getBlog.getBlog(slug),
        staleTime: 1000 * 60 * 5,
    });

    const viewMutation = useMutation({
        mutationFn: () => blogViews.incrementView(slug),
        onSuccess: (data) => setViewCount(data.views),
    });

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [slug]);

    useEffect(() => {
        if (data) {
            setViewCount(data.views);
            viewMutation.mutate();
        }
    }, [data]);

    const handleDelete = async () => {
        await toast.promise(
            deleteBlog(slug),
            {
                loading: "Deleting blog...",
                success: "Blog deleted successfully!",
                error: "Failed to delete blog",
            }
        );
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
        router.push("/blogs");
    };

    const handleEditSuccess = (newSlug: string) => {
        if (newSlug !== slug) {
            router.push(`/blogs/${newSlug}`);
        }
    };

    if (isLoading) return <BlogDetailsLoading />;

    if (isError) {
        const err = error as ApiError;
        if (err.status === 404) notFound();
        return <p className="text-red-500">{err.message}</p>;
    }

    if (!data) return notFound();
    const toc = extractTocItems(data.content);

    return (
        <>
            <Section id="blog_header" animate className="px-6 pt-16 max-w-[1000px]">
                <div className="text-center mb-6 sm:mb-8 relative">
                    {isAdmin && (
                        <div className="absolute right-0 top-0">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer">
                                        <MoreVertical className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => setIsEditOpen(true)}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit Blog
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={() => setIsDeleteOpen(true)}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Blog
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                    <span className="inline-block px-4 py-1 border border-foreground/10 rounded-full text-xs tracking-wider uppercase text-foreground/70">
                        {data.type}
                    </span>
                </div>
                <Heading size="lg" className="mb-4 sm:mb-6 text-center" text={data.title} />
                <TextGradient text={data.excerpt} className="max-w-2xl mx-auto text-center" />
                <ArticleInfo viewCount={viewCount || 0} commentCount={0} formattedDate={getFormattedDate(data.date)} />
                <ImageZoom>
                    <div className="p-2 border border-dotted border-foreground/10 rounded-2xl mt-10 sm:mt-12">
                        <BlurImage src={data.imageSrc} alt={data.title} width={1170} height={700} lazy={false} className="w-full h-auto object-cover rounded-lg" />
                    </div>
                </ImageZoom>
            </Section>

            <Section id="blog_content">
                <div className="relative flex flex-col lg:flex-row">
                    <div className="flex flex-col lg:flex-row gap-12 w-full">
                        <MarkdownPreview content={data.content} />
                        <TableOfContents tocItems={toc} showMobileTOC={showTOC} setShowMobileTOC={setShowTOC} slug={slug} title={data.title} type={data.type} />
                    </div>
                </div>
                <div className="block lg:hidden">
                    <LikeButton slug={slug} />
                </div>

                {/* Subscribe Section */}
                <BlogSubscribe />

                {/* Related Blogs Section */}
                <RelatedBlogs currentSlug={slug} currentTags={data.tags || []} currentType={data.type} />
            </Section>

            <button onClick={() => setShowTOC(true)} className="group rounded-xl border border-transparent bg-neutral-800/40 backdrop-blur-sm fixed z-10 bottom-5 right-5 lg:hidden py-3 px-3 flex items-center gap-2 transition-opacity duration-300 opacity-50 hover:!opacity-100">
                <AlignLeftIcon className="w-5 h-5" /> Table of Contents
            </button>

            {/* Edit Modal */}
            {isAdmin && data && (
                <EditBlogModal
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    blog={{ ...data, id: data._id?.toString() || data.id, date: data.date?.toString() || data.date, published: data.published ?? true }}
                    onSuccess={handleEditSuccess}
                />
            )}

            {/* Delete Confirmation */}
            <DeleteConfirmDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                title="Delete Blog"
                description={`Are you sure you want to delete "${data.title}"? This action cannot be undone.`}
                onConfirm={handleDelete}
            />
        </>
    );
}
