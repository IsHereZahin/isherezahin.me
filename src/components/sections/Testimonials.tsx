import Testimonial from "../Testimonial";
import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";

export default function Testimonials({ testimonials }: Readonly<TestimonialsProps>) {
    return (
        <Section id="testimonials">
            <SectionHeader
                title="Nice words"
                subtitle="Some feedback from people that I've had the privilege of working with."
            />
            <div className="space-y-8">
                {testimonials.map((testimonial) => (
                    <Testimonial key={testimonial.id} testimonial={testimonial} />
                ))}
            </div>
        </Section>
    );
}