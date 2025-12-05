"use client";

import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./alert-dialog";

type ConfirmVariant = "danger" | "warning" | "default";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmVariant;
    onConfirm: () => Promise<void> | void;
    onCancel?: () => void;
    isLoading?: boolean;
}

const variantConfig = {
    danger: {
        icon: Trash2,
        iconClass: "text-destructive",
        buttonClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
    warning: {
        icon: AlertTriangle,
        iconClass: "text-yellow-500",
        buttonClass: "bg-yellow-500 text-white hover:bg-yellow-600",
    },
    default: {
        icon: AlertTriangle,
        iconClass: "text-foreground",
        buttonClass: "",
    },
};

export default function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    onConfirm,
    onCancel,
    isLoading: externalLoading,
}: Readonly<ConfirmDialogProps>) {
    const [internalLoading, setInternalLoading] = useState(false);
    const isLoading = externalLoading ?? internalLoading;

    const config = variantConfig[variant];
    const Icon = config.icon;

    const handleConfirm = async () => {
        setInternalLoading(true);
        try {
            await onConfirm();
            onOpenChange(false);
        } catch (error) {
            console.error("Confirm action failed:", error);
        } finally {
            setInternalLoading(false);
        }
    };

    const handleCancel = () => {
        onCancel?.();
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${config.iconClass}`} />
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={config.buttonClass}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
