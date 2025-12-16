"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import {
    ReferralLink,
    ReferralListItem,
    ReferralText,
    Section,
    SectionHeader,
    Skeleton,
} from "@/components/ui";
import { workExperience as staticWorkExperience, WorkExperienceItemProps } from "@/data";
import { workExperience as workExperienceApi } from "@/lib/api";
import { formatMonthYear } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";

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
    description,
    highlights,
    logo,
}: Readonly<WorkExperienceItemProps>) {
    return (
        <MotionWrapper delay={0.2} className="grid md:grid-cols-[120px,1fr] gap-4 sm:gap-6 p-5 sm:p-6 md:p-8 rounded-2xl shadow-feature-card bg-background">
            {/* Details */}
            <div className="flex flex-col gap-3 sm:gap-4">
                {/* Company + Logo */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Image
                            src={logo}
                            alt={`${company} logo`}
                            width={40}
                            height={40}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-contain bg-muted/30 p-1"
                        />
                        <ReferralLink
                            href={companyUrl}
                            className="text-lg sm:text-xl font-bold text-foreground hover:text-foreground/80 transition-colors"
                        >
                            {company}
                        </ReferralLink>
                    </div>
                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground/10 text-foreground text-xs font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {start} - {end}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                            <MapPin className="w-3.5 h-3.5" />
                            {location}
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-semibold text-foreground/90">{title}</h3>

                {/* Description */}
                <p className="text-base text-muted-foreground hover:text-foreground transition-all duration-200 leading-relaxed">
                    <ReferralText text={description} />
                </p>

                {/* Highlights */}
                <ul className="list-disc pl-5 sm:pl-6 mt-2 space-y-1.5 text-base marker:text-muted-foreground">
                    <ReferralListItem listItems={highlights} />
                </ul>
            </div>
        </MotionWrapper>
    );
}

// Example WorkExperience Section
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
                <div className="space-y-4">
                    {[1].map((i) => (
                        <div key={i} className="p-6 rounded-2xl shadow-feature-card bg-background space-y-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-lg" />
                                <Skeleton className="h-6 w-40" />
                            </div>
                            <Skeleton className="h-5 w-60" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    ))}
                </div>
            ) : (
                displayExperience.map((item, index) => (
                    <WorkExperienceItem key={index + 1} {...item} />
                ))
            )}
        </Section>
    );
}