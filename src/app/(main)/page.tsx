import AboutMe from "@/components/about/AboutMe";
import Blogs from "@/components/home/Blogs";
import GetInTouch from "@/components/home/GetInTouch";
import Hero from "@/components/home/Hero";
import Projects from "@/components/home/Projects";
// import Skills from "@/components/sections/Skills";
import Testimonials from "@/components/home/Testimonials";
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