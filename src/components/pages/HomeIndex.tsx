import AboutMe from "@/components/about/AboutMe";
import Blogs from "@/components/home/Blogs";
import GetInTouch from "@/components/home/GetInTouch";
import Hero from "@/components/home/Hero";
import Projects from "@/components/home/Projects";
import Testimonials from "@/components/home/Testimonials";
import Skills from "@/components/home/Skills";

export default function HomeIndex() {
    return (
        <>
            <Hero />
            {/* <Skills /> */}
            <AboutMe />
            <Blogs />
            <Projects />
            <Testimonials />
            <GetInTouch />
        </>
    );
}