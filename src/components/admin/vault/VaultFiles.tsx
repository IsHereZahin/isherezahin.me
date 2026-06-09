"use client";

import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Star, Trash2, HardDriveUpload, Download, Eye, Pencil, FileIcon } from "lucide-react";
import { toast } from "sonner";
import { vault } from "@/lib/api";
import type { VaultFile } from "@/lib/vault/types";
import { Badge, ConfirmDialog, Dialog, DialogContent, DialogHeader, DialogTitle, Input, ShadcnButton as Button } from "@/components/ui";
import { glassItem } from "./glass";

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const IMAGE_EXT = ["png", "jpg", "jpeg", "gif", "webp"];

// Image thumbnail: shows a placeholder icon instantly, lazy-loads the image and
// fades it in once ready (so the file list/info renders without waiting on images).
function FileThumb({ id, name, onClick }: Readonly<{ id: string; name: string; onClick: () => void }>) {
    const [loaded, setLoaded] = useState(false);
    return (
        <button
            type="button"
            onClick={onClick}
            title="Preview"
            className="relative h-10 w-10 rounded-lg overflow-hidden border border-border shrink-0 bg-muted"
        >
            {!loaded && <FileIcon className="absolute inset-0 m-auto h-4 w-4 text-muted-foreground" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={vault.files.fileUrl(id)}
                alt={name}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            />
        </button>
    );
}

export default function VaultFiles({ folderId, query }: Readonly<{ folderId?: string | null; query?: string }>) {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [toDelete, setToDelete] = useState<VaultFile | null>(null);
    const [preview, setPreview] = useState<VaultFile | null>(null);
    const [renaming, setRenaming] = useState<VaultFile | null>(null);
    const [renameValue, setRenameValue] = useState("");

    const searching = !!query?.trim();
    const lowerQ = (query ?? "").trim().toLowerCase();

    const { data: raw, isLoading } = useQuery<VaultFile[]>({
        queryKey: ["vault-files", searching ? "search" : folderId ?? null],
        queryFn: () => vault.files.getAll(searching ? {} : { folderId }),
    });

    const files = searching
        ? (raw ?? []).filter((f) => `${f.name} ${f.originalName} ${f.extension} ${f.tags.join(" ")}`.toLowerCase().includes(lowerQ))
        : raw;

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["vault-files"] });
        queryClient.invalidateQueries({ queryKey: ["vault-dashboard"] });
    };

    const uploadFiles = async (fileList: FileList | File[]) => {
        const arr = Array.from(fileList);
        if (!arr.length) return;
        setUploading(true);
        try {
            for (const file of arr) {
                await vault.files.upload(file, { folderId });
            }
            toast.success(`Uploaded ${arr.length} file(s)`);
            invalidate();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
    };

    const toggleFavorite = async (file: VaultFile) => {
        await vault.files.update(file._id, { isFavorite: !file.isFavorite });
        invalidate();
    };

    const handleRename = async () => {
        if (!renaming || !renameValue.trim()) return;
        await vault.files.update(renaming._id, { name: renameValue.trim() });
        toast.success("File renamed");
        invalidate();
        setRenaming(null);
    };

    const handleDelete = async () => {
        if (!toDelete) return;
        await vault.files.delete(toDelete._id);
        toast.success("File deleted");
        invalidate();
        setToDelete(null);
    };

    const isImage = (f: VaultFile) => IMAGE_EXT.includes(f.extension);
    const isPdf = (f: VaultFile) => f.extension === "pdf";

    if (searching && !isLoading && !files?.length) return null;

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <HardDriveUpload className="h-5 w-5 icon-bw" />
                <h3 className="text-base font-semibold">Files</h3>
            </div>

            {/* Drag-and-drop zone (hidden while searching) */}
            {!searching && (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`w-full border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragOver ? "border-primary bg-muted" : "border-border hover:bg-muted/50"}`}
                >
                    {uploading ? (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" /> Uploading...
                        </div>
                    ) : (
                        <div className="text-muted-foreground">
                            <HardDriveUpload className="h-7 w-7 mx-auto mb-2" />
                            <p className="text-sm">Drag &amp; drop files here, or click to browse</p>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => { if (e.target.files) uploadFiles(e.target.files); e.target.value = ""; }}
                    />
                </button>
            )}

            {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : !files?.length ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No files yet.</p>
            ) : (
                <div className="space-y-2">
                    {files.map((file) => (
                        <div key={file._id} className={`${glassItem} p-3 flex items-center justify-between gap-3`}>
                            <div className="flex items-center gap-3 min-w-0">
                                {isImage(file) ? (
                                    <FileThumb id={file._id} name={file.name} onClick={() => setPreview(file)} />
                                ) : (
                                    <div className="p-2 rounded-lg bg-muted border border-border shrink-0">
                                        <FileIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm truncate">{file.name}</p>
                                        {file.isFavorite && <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 shrink-0" />}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {file.extension.toUpperCase()} · {formatBytes(file.sizeBytes)} · {new Date(file.createdAt).toLocaleString()}
                                    </p>
                                    {file.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {file.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                {(isImage(file) || isPdf(file)) && (
                                    <button onClick={() => setPreview(file)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground" title="Preview">
                                        <Eye className="h-4 w-4" />
                                    </button>
                                )}
                                <a href={vault.files.fileUrl(file._id, true)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground" title="Download">
                                    <Download className="h-4 w-4" />
                                </a>
                                <button onClick={() => toggleFavorite(file)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground" title="Favorite">
                                    <Star className={`h-4 w-4 ${file.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                                </button>
                                <button onClick={() => { setRenaming(file); setRenameValue(file.name); }} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground" title="Rename">
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button onClick={() => setToDelete(file)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive" title="Delete">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Preview modal */}
            <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
                <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between pr-6">
                            <span className="truncate">{preview?.name}</span>
                        </DialogTitle>
                    </DialogHeader>
                    {preview && isImage(preview) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={vault.files.fileUrl(preview._id)} alt={preview.name} className="max-w-full rounded-lg" />
                    )}
                    {preview && isPdf(preview) && (
                        <iframe src={vault.files.fileUrl(preview._id)} title={preview.name} className="w-full h-[70vh] rounded-lg border border-border" />
                    )}
                </DialogContent>
            </Dialog>

            {/* Rename modal */}
            <Dialog open={!!renaming} onOpenChange={(open) => !open && setRenaming(null)}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Rename File</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} autoFocus />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setRenaming(null)}>Cancel</Button>
                            <Button onClick={handleRename}>Save</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={!!toDelete}
                onOpenChange={(open) => !open && setToDelete(null)}
                title="Delete File?"
                description={`"${toDelete?.name}" and its contents will be permanently removed.`}
                confirmText="Delete"
                variant="danger"
                onConfirm={handleDelete}
            />
        </section>
    );
}
