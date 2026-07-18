"use client";

import ApplicationOverview from "@/components/admin/dashboard/ApplicationOverview";
import GitHubActivity from "@/components/admin/dashboard/GitHubActivity";
import { SectionHeader } from "@/components/admin/dashboard/primitives";
import { ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
    return (
        <div className="space-y-8">
            {/* Application analytics & business health */}
            <section>
                <SectionHeader
                    title="Application Overview"
                    subtitle="Traffic, audience, users, and content health at a glance"
                    action={
                        <Link
                            href="/admin/statistics"
                            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[#EEEAE2] bg-white px-4 py-2 text-[12px] font-medium text-[#26262B] transition-colors hover:bg-[#F6F4EF] sm:inline-flex"
                        >
                            Full statistics
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    }
                />
                <ApplicationOverview />
            </section>

            {/* Divider between the two domains */}
            <div className="border-t border-[#E4DFD6]" />

            {/* Personal development activity (GitHub) */}
            <section>
                <SectionHeader
                    title="GitHub Activity"
                    subtitle="Your public development activity and open-source stats"
                    action={
                        <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-[#26262B] px-4 py-2 text-[12px] font-medium text-white sm:inline-flex">
                            <Github className="h-3.5 w-3.5 text-[#F4C63D]" />
                            Developer insights
                        </span>
                    }
                />
                <GitHubActivity />
            </section>
        </div>
    );
}
