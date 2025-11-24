import MotionWrapper from "@/components/motion/MotionWrapper";
import ReferralLink from "@/components/ui/ReferralLink";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import { workExperience, WorkExperienceItemProps } from "@/data";
import Image from "next/image";
import ReferralListItem from "../ui/ReferralListItem";

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
        <MotionWrapper delay={0.2} className="grid md:grid-cols-[120px,1fr] gap-6 p-6 md:p-8 rounded-2xl shadow-feature-card bg-background transition-all duration-300">
            {/* Timeline / Date */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {start} <span className="mx-1 text-primary">—</span> {end}
                </p>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-3">
                {/* Company + Logo */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Image
                            src={logo}
                            alt={`${company} logo`}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-md object-contain"
                        />
                        <ReferralLink
                            href={companyUrl}
                            className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                        >
                            {company}
                        </ReferralLink>
                    </div>
                    <span className="text-sm text-muted-foreground">{location}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-foreground">{title}</h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">{description}</p>

                {/* Highlights */}
                <ul className="list-disc pl-0 sm:ml-20 mt-2 sm:mt-5 space-y-2 text-muted-foreground marker:text-secondary-foreground">
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
            <SectionHeader title="Work Experience" />
            {workExperience.map((item, index) => (
                <WorkExperienceItem key={index + 1} {...item} />
            ))}
        </Section>
    );
}