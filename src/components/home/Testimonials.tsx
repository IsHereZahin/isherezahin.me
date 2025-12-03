import Testimonial, { TestimonialType } from "../Testimonial";
import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";

export type TestimonialsProps = {
    testimonials: TestimonialType[];
}

export default function Testimonials({ testimonials }: Readonly<TestimonialsProps>) {
    return (
        <Section id="testimonials" animate={true}>
            <SectionHeader
                tag="04"
                title="Nice words"
                subtitle="Some feedback from people that I've had the privilege of working with."
            />
            <div className="space-y-6 sm:space-y-8">
                {testimonials.map((testimonial) => (
                    <Testimonial key={testimonial.id} {...testimonial} />
                ))}
            </div>
        </Section>
    );
}