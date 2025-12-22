"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui";
import { parseMarkdown } from "@/lib/markdown";
import { formatDistanceToNow } from "date-fns";

interface EditHistory {
    content: string;
    editedAt: string;
}

interface EditHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentContent: string;
    editHistory: EditHistory[];
}

export default function EditHistoryModal({
    isOpen,
    onClose,
    currentContent,
    editHistory,
}: EditHistoryModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit History</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto chat-scrollbar">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-primary">Current</span>
                        </div>
                        <div
                            className="text-sm prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(currentContent) }}
                        />
                    </div>

                    {editHistory.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-muted-foreground">
                                Previous versions
                            </h4>
                            {[...editHistory].reverse().map((edit, index) => (
                                <div
                                    key={index}
                                    className="p-3 rounded-lg bg-muted border border-border"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(edit.editedAt), {
                                                addSuffix: true,
                                            })}
                                        </span>
                                    </div>
                                    <div
                                        className="text-sm prose prose-sm max-w-none text-muted-foreground"
                                        dangerouslySetInnerHTML={{ __html: parseMarkdown(edit.content) }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
