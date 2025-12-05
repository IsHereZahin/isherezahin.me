import { AboutMe } from "@/components/about";
import {
    Blogs,
    GetInTouch,
    Hero,
    ProfileHero,
    Projects,
    Testimonials,
} from "@/components/home";
import { testimonials } from "@/data";
import { HERO_SECTION_ID } from "@/lib/constants";

export default function HomeIndex() {
    return (
        <>
            {HERO_SECTION_ID === "1" && <ProfileHero />}
            {HERO_SECTION_ID === "2" && <Hero />}
            {/* <Skills /> */}
            <AboutMe />
            <Blogs />
            <Projects />
            <Testimonials testimonials={testimonials} />
            <GetInTouch />
        </>
    );
}