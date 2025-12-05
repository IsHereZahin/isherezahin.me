"use client";

import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./dialog";

interface FormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    icon?: LucideIcon;
    children: ReactNode;
    maxWidth?: string;
}

export default function FormModal({
    open,
    onOpenChange,
    title,
    description,
    icon: Icon,
    children,
    maxWidth = "sm:max-w-[750px]",
}: Readonly<FormModalProps>) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`${maxWidth} p-0 gap-0 flex flex-col max-h-[85vh]`}>
                {/* Fixed Header */}
                <div className="flex-shrink-0 bg-background border-b px-6 py-4 rounded-t-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2 pr-8">
                            {Icon && <Icon className="h-5 w-5 text-foreground" />}
                            {title}
                        </DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 modal-scrollbar">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}
