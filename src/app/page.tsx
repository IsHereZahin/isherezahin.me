import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/Skills";
import Blogs from "@/components/sections/Blogs";
import Projects from "@/components/sections/Projects";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { blogs, projects, testimonials } from "@/data";

export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Blogs blogs={blogs} />
      <Projects projects={projects} />
      <Testimonials testimonials={testimonials} />
      <Contact />
      <Footer />
    </>
  );
}