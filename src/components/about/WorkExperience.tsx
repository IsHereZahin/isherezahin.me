import MotionWrapper from "@/components/motion/MotionWrapper";
import {
    ReferralLink,
    ReferralListItem,
    Section,
    SectionHeader,
} from "@/components/ui";
import { workExperience, WorkExperienceItemProps } from "@/data";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";

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
                            className="text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors"
                        >
                            {company}
                        </ReferralLink>
                    </div>
                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
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
                <p className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-all duration-200 leading-relaxed">{description}</p>

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
    return (
        <Section id="work-experience" animate delay={0.2} className="px-6 py-10 max-w-[1000px]">
            <SectionHeader tag="02" title="Work Experience" subtitle="A little bit about my work experience" />
            {workExperience.map((item, index) => (
                <WorkExperienceItem key={index + 1} {...item} />
            ))}
        </Section>
    );
}