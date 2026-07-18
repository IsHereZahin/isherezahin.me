import AboutMe from "@/components/about/AboutMe";
import Blogs from "@/components/home/Blogs";
import GetInTouch from "@/components/home/GetInTouch";
import Hero from "@/components/home/Hero";
import ProfileHero from "@/components/home/ProfileHero";
import Projects from "@/components/home/Projects";
import Testimonials from "@/components/home/Testimonials";
import { getPublishedBlogsPage, getPublishedProjectsPage } from "@/lib/cached-queries";
import { HERO_SECTION_ID } from "@/lib/constants";

export default async function HomeIndex() {
    // Seed the Blogs/Projects sections on the server so they render with content
    // immediately instead of fetching after the page hydrates.
    const [blogsInitial, projectsInitial] = await Promise.all([
        getPublishedBlogsPage(2),
        getPublishedProjectsPage(2),
    ]);

    return (
        <>
            {HERO_SECTION_ID === "1" && <ProfileHero />}
            {HERO_SECTION_ID === "2" && <Hero />}
            {/* <Skills /> */}
            <AboutMe />
            <Blogs initialData={blogsInitial} />
            <Projects initialData={projectsInitial} />
            <Testimonials />
            <GetInTouch />
        </>
    );
}