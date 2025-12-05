"use client";

import { ReactNode } from "react";
import { Button } from "./shadcn-button";

interface FormActionsProps {
    onCancel: () => void;
    submitText: string;
    isSubmitting?: boolean;
    isDisabled?: boolean;
    cancelText?: string;
    leftContent?: ReactNode;
}

export default function FormActions({
    onCancel,
    submitText,
    isSubmitting = false,
    isDisabled = false,
    cancelText = "Cancel",
    leftContent,
}: Readonly<FormActionsProps>) {
    return (
        <div className="flex items-center justify-between pt-4 border-t">
            <div>{leftContent}</div>
            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isDisabled}
                >
                    {cancelText}
                </Button>
                <Button type="submit" disabled={isSubmitting || isDisabled}>
                    {submitText}
                </Button>
            </div>
        </div>
    );
}
