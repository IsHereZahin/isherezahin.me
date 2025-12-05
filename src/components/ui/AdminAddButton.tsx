"use client";

import { FilePlus } from "lucide-react";
import { Button } from "./shadcn-button";

interface AdminAddButtonProps {
    onClick: () => void;
    label: string;
    className?: string;
}

export default function AdminAddButton({ onClick, label, className = "" }: Readonly<AdminAddButtonProps>) {
    return (
        <div className={`flex justify-start ${className}`}>
            <Button
                onClick={onClick}
                size="sm"
                className="shrink-0 cursor-pointer"
            >
                <FilePlus className="h-4 w-4 mr-1" />
                {label}
            </Button>
        </div>
    );
}
