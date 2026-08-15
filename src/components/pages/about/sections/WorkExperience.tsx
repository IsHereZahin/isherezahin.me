import { Section, SectionHeader } from "@/components/ui";
import { ABOUT_WORK_EXPERIENCE } from "@/data";
import ExperienceItem from "../components/ExperienceItem";

export default function WorkExperience() {
    const { heading, items } = ABOUT_WORK_EXPERIENCE;

    if (items.length === 0) return null;

    return (
        <Section id="work-experience" animate delay={0.2} className="px-6 py-10 max-w-[1000px]">
            <SectionHeader tag={heading.tag} title={heading.title} subtitle={heading.subtitle} />
            <div>
                {items.map((item) => (
                    <ExperienceItem key={`${item.company}-${item.title}`} {...item} />
                ))}
            </div>
        </Section>
    );
}
