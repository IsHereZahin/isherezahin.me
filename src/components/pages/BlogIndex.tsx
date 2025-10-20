"use client";

import Article from "@/components/Article";
import MotionWrapper from "@/components/motion/MotionWrapper";
import PageTitle from "@/components/ui/PageTitle";
import Section from "@/components/ui/Section";
import Tags from "@/components/ui/Tags";
import { blogs } from "@/data";

export default function BlogIndex() {
    return (
        <Section id="blogs">
            <PageTitle title="Ideas, insights, & inspiration" subtitle="Thoughts on web design, freelancing, and creative growth, shared to inform, encourage, and spark new perspectives" />
            <MotionWrapper direction="left" delay={0.2}>
                <Tags
                    tags={["nextjs", "react", "css", "tailwind", "javascript", "typescript", "css"]}
                    selected={["nextjs", "css", "react"]}
                    clickableTags={["nextjs", "css", "react", "tailwind"]}
                    onTagClick={(tag) => console.log("Clicked tag:", tag)}
                    className="mb-4"
                />
            </MotionWrapper>
            <div className="space-y-8">
                {blogs.map((blog) => (
                    <Article key={blog.id} {...blog} />
                ))}
            </div>
        </Section>
    );
}
