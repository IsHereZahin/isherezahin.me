import AboutMe from "@/components/about/AboutMe";
import Blogs from "@/components/home/Blogs";
import GetInTouch from "@/components/home/GetInTouch";
import Hero from "@/components/home/Hero";
import ProfileHero from "@/components/home/ProfileHero";
import Projects from "@/components/home/Projects";
// import Skills from "@/components/sections/Skills";
import Testimonials from "@/components/home/Testimonials";
import { blogs, projects, testimonials } from "@/data";
import { HERO_SECTION_ID } from "@/lib/constants";

export default function App() {
  return (
    <>
      {HERO_SECTION_ID === "1" && <ProfileHero />}
      {HERO_SECTION_ID === "2" && <Hero />}
      {/* <Skills /> */}
      <AboutMe />
      <Blogs blogs={blogs} />
      <Projects projects={projects} />
      <Testimonials testimonials={testimonials} />
      <GetInTouch />
    </>
  );
}