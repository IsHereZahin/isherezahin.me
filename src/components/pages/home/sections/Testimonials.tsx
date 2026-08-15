import { Section, SectionHeader } from "@/components/ui";
import { HOME_TESTIMONIALS } from "@/data";
import Testimonial from "../components/Testimonial";

export default function Testimonials() {
    const { heading, items } = HOME_TESTIMONIALS;

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
