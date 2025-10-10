"use client";

import Article from "@/components/Article";
import PageTitle from "@/components/layouts/PageTitle";
import Section from "@/components/ui/Section";
import Tags from "@/components/ui/Tags";
import { blogs } from "@/data";

export default function BlogsPage() {
    return (
        <Section id="blogs">
            <PageTitle title="The Blogs" subtitle="Discover my website and blog, where I share tutorials, notes, and experiences as a full-stack engineer based in Hong Kong. I began web dev as a hobby in Dec 2020. Explore my journey!" />
            <Tags
                tags={["nextjs", "react", "css", "tailwind", "javascript", "typescript", "css"]}
                selected={["nextjs", "css", "react"]}
                clickableTags={["nextjs", "css", "react", "tailwind"]}
                onTagClick={(tag) => console.log("Clicked tag:", tag)}
                className="mb-4"
            />
            <div className="space-y-8">
                {blogs.map((blog) => (
                    <Article key={blog.id} {...blog} />
                ))}
            </div>
        </Section>
    );
}
