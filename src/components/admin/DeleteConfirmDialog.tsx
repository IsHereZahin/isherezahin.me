"use client";

import { ConfirmDialog } from "@/components/ui";

interface DeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
}

export default function DeleteConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
}: Readonly<DeleteConfirmDialogProps>) {
    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            description={description}
            confirmText="Delete"
            variant="danger"
            onConfirm={onConfirm}
        />
    );
}
