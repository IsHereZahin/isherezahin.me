"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import { ReferralLink, ReferralText } from "@/components/ui";
import type { WorkExperienceItem } from "@/data/types";
import { Briefcase, ChevronDown, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ExperienceItem({
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
}: Readonly<WorkExperienceItem>) {
    const [isOpen, setIsOpen] = useState(false);
    const hasDetails = Boolean(description || highlights?.length > 0 || location || type);

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

                            {highlights?.length > 0 && (
                                <ul className="space-y-2.5 text-[0.9375rem] text-muted-foreground leading-[1.65]">
                                    {highlights.map((highlight) => (
                                        <li key={highlight.text} className="flex gap-3">
                                            <span className="mt-[0.65rem] h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />
                                            <span className="flex-1">
                                                <ReferralText text={highlight.text} />
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
