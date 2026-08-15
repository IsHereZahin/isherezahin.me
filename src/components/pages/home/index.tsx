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
 * Everything renders from `src/data/pages/home.ts` except the Blogs and
 * Projects strips, which stay database-driven. Those two are the only async
 * parts, so they sit behind their own `<Suspense>` boundaries: the static
 * content paints immediately and the database-backed strips stream in behind
 * it, instead of the whole route waiting on Mongo before it can render.
 */
export default function HomeIndex() {
    return (
        <>
            {HERO_SECTION_ID === "1" && <ProfileHero />}
            {HERO_SECTION_ID === "2" && <Hero />}
            <AboutCards />
            <Suspense fallback={<BlogsSectionFallback />}>
                <BlogsSection />
            </Suspense>
            <Suspense fallback={<ProjectsSectionFallback />}>
                <ProjectsSection />
            </Suspense>
            <Testimonials />
            <GetInTouch />
        </>
    );
}
