"use client";

import { ReferralListItem, Section, Skeleton } from "@/components/ui";
import { currentStatus as staticCurrentStatus } from "@/data";
import { currentStatus as currentStatusApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { CircleHelp } from "lucide-react";

interface StatusItem {
    _id: string;
    text: string;
    isActive: boolean;
}

export default function CurrentStatusCard() {
    const { data, isLoading } = useQuery<StatusItem[]>({
        queryKey: ["current-status"],
        queryFn: () => currentStatusApi.getAll(),
    });

    const displayStatus = data && data.length > 0
        ? data.map(s => ({ text: s.text }))
        : staticCurrentStatus;

    return (
        <Section
            animate delay={0.2}
            id="current-status"
            className="px-4 sm:px-6 py-10 max-w-[1000px] mx-auto overflow-hidden"
        >
            <div className="shadow-feature-card px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12 rounded-2xl flex flex-col md:flex-row items-center md:items-center justify-between gap-6 sm:gap-10 md:gap-14 backdrop-blur-sm transition-all duration-300 overflow-hidden">

                {/* Left Section - Icon + Title */}
                <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 md:gap-5 w-full md:w-auto text-center sm:text-left flex-shrink-0">
                    <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-foreground/5 backdrop-blur-md shadow-feature-card before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-br before:from-background/10 before:via-foreground/20 before:to-background/10 before:-z-10 flex-shrink-0">
                        <CircleHelp className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" strokeWidth={1.4} />
                    </div>
                    <h4 className="text-base sm:text-lg md:text-xl font-semibold text-foreground leading-snug break-words">
                        What I&apos;m up to now
                    </h4>
                </div>

                {/* Right Section - Content */}
                <article className="text-left">
                    {isLoading ? (
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-4 w-64" />
                            ))}
                        </div>
                    ) : (
                        <ul className="list-disc list-outside space-y-1.5 sm:space-y-2 text-sm sm:text-base text-muted-foreground hover:text-foreground/80 transition-colors leading-relaxed pl-5 marker:text-secondary-foreground break-words">
                            <ReferralListItem listItems={displayStatus} />
                        </ul>
                    )}
                </article>
            </div>
        </Section>
    );
}