"use client";

import { ErrorState, Section } from "@/components/ui";
import { useEffect } from "react";

export default function MainError({
    error,
    reset,
}: {
    readonly error: Error & { digest?: string };
    readonly reset: () => void;
}) {
    useEffect(() => {
        // Surface the error for logging/monitoring. Wire this to Sentry etc. later.
        console.error(error);
    }, [error]);

    return (
        <Section id="page-error">
            <ErrorState
                title="Something went wrong"
                message="An unexpected error occurred while loading this page. You can try again, or head back home."
                onRetry={reset}
            />
        </Section>
    );
}
