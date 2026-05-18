"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import { ReferralLink, Section, SectionHeader, Skeleton } from "@/components/ui";
import { EducationItemProps } from "@/data";
import { education as educationApi } from "@/lib/api";
import { formatMonthYear } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

interface EducationData {
    _id: string;
    start: string;
    end: string;
    degree: string;
    institution: string;
    institutionUrl: string;
    logo: string;
    isActive: boolean;
}

export function EducationItem({
    start,
    end = "Present",
    degree,
    institution,
    institutionUrl,
    logo,
}: Readonly<EducationItemProps>) {
    const InstitutionLabel = institutionUrl ? (
        <ReferralLink
            href={institutionUrl}
            className="text-[1.0625rem] font-semibold text-foreground tracking-tight"
        >
            {institution}
        </ReferralLink>
    ) : (
        <span className="text-[1.0625rem] font-semibold text-foreground tracking-tight">
            {institution}
        </span>
    );

    return (
        <MotionWrapper
            delay={0.2}
            className="flex items-center gap-4 py-5 border-b border-border/50 last:border-b-0"
        >
            <Image
                src={logo}
                alt={`${institution} logo`}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-contain bg-muted/40 p-1.5 shrink-0"
            />
            <div className="flex-1 min-w-0">
                {InstitutionLabel}
                <p className="text-[0.8125rem] text-muted-foreground mt-0.5 truncate">{degree}</p>
            </div>
            <span className="text-[0.8125rem] text-muted-foreground whitespace-nowrap shrink-0 tabular-nums">
                {start} - {end}
            </span>
        </MotionWrapper>
    );
}

export default function Education() {
    const { data, isLoading } = useQuery<EducationData[]>({
        queryKey: ["education"],
        queryFn: () => educationApi.getAll(),
    });

    if (!isLoading && (!data || data.length === 0)) return null;

    const displayEducation = (data ?? []).map(e => ({
        start: formatMonthYear(e.start),
        end: formatMonthYear(e.end || "Present"),
        degree: e.degree,
        institution: e.institution,
        institutionUrl: e.institutionUrl,
        logo: e.logo,
    }));

    return (
        <Section id="education" animate delay={0.2} className="px-6 py-10 max-w-[1000px]">
            <SectionHeader tag="03" title="Education" subtitle="Where I studied and grew academically" />
            {isLoading ? (
                <div>
                    {[1].map((i) => (
                        <div key={i} className="flex items-center gap-4 py-5 border-b border-border/50 last:border-b-0">
                            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                            <Skeleton className="h-3 w-24" />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    {displayEducation.map((item, index) => (
                        <EducationItem key={index + 1} {...item} />
                    ))}
                </div>
            )}
        </Section>
    );
}
