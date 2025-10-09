import AboutMe from "@/components/about/AboutMe";
import Blogs from "@/components/sections/Blogs";
import GetInTouch from "@/components/sections/GetInTouch";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
// import Skills from "@/components/sections/Skills";
import Testimonials from "@/components/sections/Testimonials";
import { blogs, projects, testimonials } from "@/data";

export default function App() {
  return (
    <>
      <Hero />
      {/* <Skills /> */}
      <AboutMe />
      <Blogs blogs={blogs} />
      <Projects projects={projects} />
      <Testimonials testimonials={testimonials} />
      <GetInTouch />
    </>
  );
}