"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import MotionWrapper from "../motion/MotionWrapper";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({
    title = "Something went wrong",
    message = "We encountered an error while loading the content. Please try again.",
    onRetry
}: Readonly<ErrorStateProps>) {
    return (
        <MotionWrapper direction="bottom" delay={0.3}>
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
                <div className="mb-6 p-4 rounded-full bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>

                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
                    {title}
                </h3>

                <p className="text-muted-foreground max-w-md leading-relaxed mb-6">
                    {message}
                </p>

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-primary-foreground hover:bg-foreground/80 transition-colors font-medium"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                )}
            </div>
        </MotionWrapper>
    );
}