import type { HomeContent } from "@/data/pages/home";
import { HERO_SECTION_ID } from "@/lib/constants";
import { Suspense } from "react";
import AboutCards from "./sections/AboutCards";
import BlogsSection, { BlogsSectionFallback } from "./sections/BlogsSection";
import GetInTouch from "./sections/GetInTouch";
import Hero from "./sections/Hero";
import ProfileHero from "./sections/ProfileHero";
import ProjectsSection, { ProjectsSectionFallback } from "./sections/ProjectsSection";
import Testimonials from "./sections/Testimonials";

/**
 * Home page composition.
 *
 * Everything renders from the active locale's dictionary except the Blogs and
 * Projects strips, which stay database-driven. Those two are the only async
 * parts, so they sit behind their own `<Suspense>` boundaries: the static
 * content paints immediately and the database-backed strips stream in behind it.
 */
export default function HomeIndex({ content }: { readonly content: HomeContent }) {
    return (
        <>
            {HERO_SECTION_ID === "1" && <ProfileHero {...content.profileHero} />}
            {HERO_SECTION_ID === "2" && <Hero {...content.hero} />}
            <AboutCards cards={content.cards} />
            <Suspense fallback={<BlogsSectionFallback heading={content.blogs} />}>
                <BlogsSection heading={content.blogs} />
            </Suspense>
            <Suspense fallback={<ProjectsSectionFallback heading={content.projects} />}>
                <ProjectsSection heading={content.projects} />
            </Suspense>
            <Testimonials {...content.testimonials} />
            <GetInTouch {...content.contact} />
        </>
    );
}
