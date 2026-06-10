"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import {
    ReferralLink,
    ReferralText,
    Section,
    SectionHeader,
    Skeleton,
} from "@/components/ui";
import { workExperience as staticWorkExperience, WorkExperienceItemProps } from "@/data";
import { workExperience as workExperienceApi } from "@/lib/api";
import { formatMonthYear } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, ChevronDown, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface WorkExperienceData {
    _id: string;
    start: string;
    end: string;
    title: string;
    company: string;
    companyUrl: string;
    location: string;
    type: string;
    description: string;
    highlights: { text: string }[];
    logo: string;
    isActive: boolean;
}

export function WorkExperienceItem({
    start,
    end = "Present",
    title,
    company,
    companyUrl,
    location,
    type,
    description,
    highlights,
    logo,
}: Readonly<WorkExperienceItemProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const hasDetails = Boolean(description || (highlights && highlights.length > 0) || location || type);

    // Drop a trailing "(TYPE)" from the location when it just repeats the type badge
    // (e.g. location "Chittagong, BD (On Site)" + type "On Site").
    const cleanLocation = location
        ? location.replace(/\s*\(([^)]+)\)\s*$/, (full, inner) =>
            inner.trim().toLowerCase() === (type ?? "").trim().toLowerCase() ? "" : full).trim()
        : location;

    return (
        <MotionWrapper delay={0.2} className="group/item border-b border-border/50 last:border-b-0">
            <button
                type="button"
                onClick={() => hasDetails && setIsOpen(v => !v)}
                disabled={!hasDetails}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-4 py-5 text-left cursor-pointer disabled:cursor-default"
            >
                <Image
                    src={logo}
                    alt={`${company} logo`}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-contain bg-muted/40 p-1.5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <span onClick={(e) => e.stopPropagation()} className="inline-block">
                        <ReferralLink
                            href={companyUrl}
                            className="text-[1.0625rem] font-semibold text-foreground tracking-tight"
                        >
                            {company}
                        </ReferralLink>
                    </span>
                    <p className="text-[0.8125rem] text-muted-foreground mt-0.5">{title}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[0.8125rem] text-muted-foreground whitespace-nowrap tabular-nums">
                        {start} - {end}
                    </span>
                    {hasDetails && (
                        <ChevronDown
                            className={`h-4 w-4 text-muted-foreground/60 transition-all duration-300 ${isOpen ? "rotate-180 text-foreground" : "group-hover/item:text-foreground/80"}`}
                        />
                    )}
                </div>
            </button>

            {hasDetails && (
                <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                    <div className="overflow-hidden">
                        <div className="pl-14 pb-6 pr-2 space-y-4">
                            {(cleanLocation || type) && (
                                <div className="flex flex-wrap items-center gap-y-1.5 text-[0.75rem] text-muted-foreground/80 uppercase tracking-wide">
                                    {cleanLocation && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3 h-3 shrink-0" />
                                            <span>{cleanLocation}</span>
                                        </div>
                                    )}
                                    {cleanLocation && type && (
                                        <span className="mx-4 h-1 w-1 rounded-full bg-muted-foreground/40" aria-hidden="true" />
                                    )}
                                    {type && (
                                        <div className="flex items-center gap-1.5">
                                            <Briefcase className="w-3 h-3 shrink-0" />
                                            <span>{type}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {description && (
                                <p className="text-[0.9375rem] text-muted-foreground leading-[1.7]">
                                    <ReferralText text={description} />
                                </p>
                            )}

                            {highlights && highlights.length > 0 && (
                                <ul className="space-y-2.5 text-[0.9375rem] text-muted-foreground leading-[1.65]">
                                    {highlights.map((h, i) => (
                                        <li key={i} className="flex gap-3">
                                            <span className="mt-[0.65rem] h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />
                                            <span className="flex-1">
                                                <ReferralText text={h.text} />
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </MotionWrapper>
    );
}

export default function WorkExperience() {
    const { data, isLoading } = useQuery<WorkExperienceData[]>({
        queryKey: ["work-experience"],
        queryFn: () => workExperienceApi.getAll(),
    });

    const displayExperience = data && data.length > 0
        ? data.map(e => ({
            start: formatMonthYear(e.start),
            end: formatMonthYear(e.end || "Present"),
            title: e.title,
            company: e.company,
            companyUrl: e.companyUrl,
            location: e.location,
            type: e.type,
            description: e.description,
            highlights: e.highlights?.map(h => ({ text: h.text })) || [],
            logo: e.logo,
        }))
        : staticWorkExperience;

    return (
        <Section id="work-experience" animate delay={0.2} className="px-6 py-10 max-w-[1000px]">
            <SectionHeader tag="02" title="Work Experience" subtitle="A little bit about my work experience" />
            {isLoading ? (
                <div>
                    {[1].map((i) => (
                        <div key={i} className="flex items-center gap-4 py-5 border-b border-border/50 last:border-b-0">
                            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-3 w-24" />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    {displayExperience.map((item, index) => (
                        <WorkExperienceItem key={index + 1} {...item} />
                    ))}
                </div>
            )}
        </Section>
    );
}
