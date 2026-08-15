import { HERO_SECTION_ID } from "@/lib/constants";
import { getPublishedBlogsPage, getPublishedProjectsPage } from "@/lib/cached-queries";
import AboutCards from "./sections/AboutCards";
import Blogs from "./sections/Blogs";
import GetInTouch from "./sections/GetInTouch";
import Hero from "./sections/Hero";
import ProfileHero from "./sections/ProfileHero";
import Projects from "./sections/Projects";
import Testimonials from "./sections/Testimonials";

/**
 * Home page composition.
 *
 * Every section renders from `src/data/pages/home.ts` except Blogs and
 * Projects, which stay database-driven. Those two are seeded on the server so
 * they render with content immediately instead of fetching after hydration.
 */
export default async function HomeIndex() {
    const [blogsInitial, projectsInitial] = await Promise.all([
        getPublishedBlogsPage(2),
        getPublishedProjectsPage(2),
    ]);

    return (
        <>
            {HERO_SECTION_ID === "1" && <ProfileHero />}
            {HERO_SECTION_ID === "2" && <Hero />}
            <AboutCards />
            <Blogs initialData={blogsInitial} />
            <Projects initialData={projectsInitial} />
            <Testimonials />
            <GetInTouch />
        </>
    );
}
