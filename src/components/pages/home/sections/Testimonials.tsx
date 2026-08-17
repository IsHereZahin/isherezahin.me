import { Section, SectionHeader } from "@/components/ui";
import type { HomeContent } from "@/data/pages/home";
import Testimonial from "../components/Testimonial";

export default function Testimonials({
    heading,
    items,
}: Readonly<HomeContent["testimonials"]>) {
    if (items.length === 0) return null;

    return (
        <Section id="testimonials" animate={true}>
            <SectionHeader tag={heading.tag} title={heading.title} subtitle={heading.subtitle} />
            <div className="space-y-6 sm:space-y-8">
                {items.map((testimonial) => (
                    <Testimonial key={testimonial.id} {...testimonial} />
                ))}
            </div>
        </Section>
    );
}
