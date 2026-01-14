"use client";

import { Section } from "@/components/ui";
import SayCard from "@/components/saylo/SayCard";
import { saylo } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SayloDetailsIndex({ id }: { id: string }) {
    const { isAdmin, status, user } = useAuth();
    const isLoggedIn = status === "authenticated";
    const router = useRouter();

    const { data: sayloData, isLoading, isError, error } = useQuery({
        queryKey: ["saylo", id],
        queryFn: () => saylo.get(id),
    });

    if (isLoading) {
        return (
            <Section id="saylo-detail" className="px-4 sm:px-6 py-12 sm:py-16 max-w-2xl">
                <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            </Section>
        );
    }

    if (isError || !sayloData) {
        return (
            <Section id="saylo-detail" className="px-4 sm:px-6 py-12 sm:py-16 max-w-2xl">
                <div className="text-center py-16">
                    <p className="text-foreground font-medium mb-4">
                        {(error as Error)?.message === "Not found" ? "Saylo not found" : "Failed to load saylo"}
                    </p>
                    <Link
                        href="/saylo"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Saylo
                    </Link>
                </div>
            </Section>
        );
    }

    return (
        <Section id="saylo-detail" className="px-4 sm:px-6 py-12 sm:py-16 max-w-2xl">
            {/* Back Button */}
            <Link
                href="/saylo"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Saylo
            </Link>

            {/* Saylo Card with inline comments */}
            <SayCard
                saylo={sayloData}
                isAdmin={isAdmin}
                isLoggedIn={isLoggedIn}
                userId={user?.id}
                variant="detail"
                onDeleted={() => router.push("/saylo")}
            />
        </Section>
    );
}
