"use client";

import Article from "@/components/Article";
import PageTitle from "@/components/ui/PageTitle";
import Tags from "@/components/ui/Tags";
import { blogs } from "@/data";
import MotionWrapper from "../motion/MotionWrapper";
import Section from "../ui/Section";

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
