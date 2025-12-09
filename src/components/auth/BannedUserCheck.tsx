"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function BannedUserCheck() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const error = searchParams.get("error");
        if (error === "banned") {
            toast.error(
                "Your account has been banned. Please contact support if you believe this is a mistake.",
                { duration: 6000 }
            );
            // Clean up the URL
            window.history.replaceState({}, "", window.location.pathname);
        }
    }, [searchParams]);

    return null;
}
