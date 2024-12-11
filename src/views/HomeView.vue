<template>
  <main id="main">
    <HeroSection/>
    <ProjectSection />
    <AboutMe />
    <Capable />
    <BlogSection />
    <Testimonial />
    <AnyQuestion />
  </main>
</template>

<script setup lang="ts">
// import HeroSection from '../components/home/HeroSection.vue';
import HeroSection from '../components/home/HeroSectionPlus.vue';
import AboutMe from '../components/home/AboutMe.vue';
import ProjectSection from '../components/home/ProjectSection.vue';
import BlogSection from '../components/home/BlogSection.vue';
import Capable from '../components/home/cap-able.vue';
import Testimonial from '../components/home/testi-monial.vue';
import AnyQuestion from '../components/home/AnyQuestion.vue';
</script>
