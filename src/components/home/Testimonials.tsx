"use client";

import Testimonial from "@/components/Testimonial";
import { Section, SectionHeader, Skeleton } from "@/components/ui";
import { testimonials as staticTestimonials } from "@/data";
import { testimonials as testimonialsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface TestimonialData {
    _id: string;
    quote: string;
    name: string;
    role: string;
    isActive: boolean;
}

export default function Testimonials() {
    const { data, isLoading } = useQuery<TestimonialData[]>({
        queryKey: ["testimonials"],
        queryFn: () => testimonialsApi.getAll(),
    });

    const displayTestimonials = data && data.length > 0
        ? data.map((t, idx) => ({ id: idx + 1, quote: t.quote, name: t.name, role: t.role }))
        : staticTestimonials;

    return (
        <Section id="testimonials" animate={true}>
            <SectionHeader
                tag="04"
                title="Nice words"
                subtitle="Some feedback from people that I've had the privilege of working with."
            />
            {isLoading ? (
                <div className="space-y-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="pl-12 space-y-2">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-6 sm:space-y-8">
                    {displayTestimonials.map((testimonial) => (
                        <Testimonial key={testimonial.id} {...testimonial} />
                    ))}
                </div>
            )}
        </Section>
    );
}