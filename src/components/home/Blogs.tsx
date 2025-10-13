import Article, { Blog } from "../Article";
import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";
import SeeMore from "../ui/SeeMore";

export interface BlogsProps {
    blogs: Blog[];
}

export default function Blogs({ blogs }: Readonly<BlogsProps>) {
    return (
        <Section id="blogs" animate={true}>
            <SectionHeader title="Blogs" subtitle="Thoughts on what I'm learning and building in web development" />
            <div className="space-y-8">
                {blogs.map((blog) => (
                    <Article key={blog.id} {...blog} />
                ))}
            </div>
            <div className="flex justify-center">
                <SeeMore href="/blogs" text="See all blogs" className="mt-16" />
            </div>
        </Section>
    );
}