<template>
  <section class="section hero" id="hero" aria-label="hero me">
    <div class="container">
      <div class="hero-content">
        <h2 class="h2 section-title" data-reveal="right">
          Hi. I’m <br>Abu <span class="information-color section-title">Zahin
            <span class="tooltip"><span class="tooltip-text">Zahin:</span> This is my nickname.</span>
          </span> Mohammad Nowsin <br>
        </h2>
        <span class="user-title">SQA Engineer at 
          <a href="https://iconicsolutionsbd.com/" target="blank">
            <span class="information-color" style="font-size: 1rem; margin-top: -200px;" color="var(--theme)">ICONIC
              <span class="tooltip"><span class="tooltip-text">ICONIC SOLUTIONS PVT. LTD </span>is a premier IT firm in Chittagong, Bangladesh, offering software, IT consulting, and financial services (USA-Boston Appraisal Services).</span></span>
          </a>
        </span>
        <div class="wrapper" data-reveal="right">
          <div class="row">
            <div class="col-2"><span class="span">"</span></div>
            <div class="col-10">
              <p>
                As a dedicated <span class="information-color">QA Professional
                  <span class="tooltip"><span class="tooltip-text">QA Professional:</span> A specialist in ensuring the quality of software through both functional and automated testing.</span>
                </span> with expertise in <span class="information-color">Functional & Automated Testing
                  <span class="tooltip"><span class="tooltip-text">Functional & Automated Testing:</span> Techniques used to ensure software performs correctly and meets requirements through manual and automated tests.</span>
                </span>, and familiar with <span class="information-color">Laravel
                  <span class="tooltip"><span class="tooltip-text">Laravel:</span> A PHP framework for web artisans.</span>
                </span>, <span class="information-color">Vue.js
                  <span class="tooltip"><span class="tooltip-text">Vue.js:</span> A progressive framework for building user interfaces.</span>
                </span>, <span class="information-color">Selenium
                  <span class="tooltip"><span class="tooltip-text">Selenium:</span> A tool for automating web browsers.</span>
                </span>, <span class="information-color">Puppeteer
                  <span class="tooltip"><span class="tooltip-text">Puppeteer:</span> A Node.js library for controlling headless Chrome or Chromium browsers.</span>
                </span>, <span class="information-color">Pest
                  <span class="tooltip"><span class="tooltip-text">Pest:</span> A testing framework with a focus on simplicity.</span>
                </span>, and <span class="information-color">Figma
                  <span class="tooltip"><span class="tooltip-text">Figma:</span> A web-based design tool for creating user interfaces and prototypes.</span>
                </span>, I am committed to delivering high-quality solutions and leveraging my skills to create impactful software applications.
              </p>
              <p>
                Don't forget to visit my <span class="information-color"><RouterLink to="/guestbook" exact-active-class="active-link" style="color: var(--theme);">GuestBook</RouterLink></span>!
              </p>
            </div>
          </div>
          <img src="../assets/img/home/signature.png" loading="lazy" alt="signature" class="img right">
        </div>
      </div>

      <figure class="hero-banner" data-reveal="left">
        <div class="img-holder has-before">
          <img src="../assets/img/me/home-image.jpg" loading="lazy" alt="Zahin" class="img-cover">
        </div>
        <div class="shape shape-1">
          <img src="../assets/img/home/about-shape-1.png" loading="lazy" alt="" class="shape-image">
        </div>
        <img src="../assets/img/home/about-shape-2.svg" loading="lazy" alt="" class="shape shape-2">
      </figure>

      <img src="../assets/img/home/about-shape-3.svg" loading="lazy" alt="" class="shape shape-3">
    </div>
  </section>

  <!-- Main content -->
  <main id="main">
    <ProjectSection />
    <AboutMe />
    <Capable />
    <BlogSection />
    <Testimonial />
    <AnyQuestion />
  </main>
</template>

<script setup lang="ts">
import AboutMe from '../components/home/AboutMe.vue';
import ProjectSection from '../components/home/ProjectSection.vue';
import BlogSection from '../components/home/BlogSection.vue';
import Capable from '../components/home/cap-able.vue';
import Testimonial from '../components/home/testi-monial.vue';
import AnyQuestion from '../components/home/AnyQuestion.vue';
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&family=LXGW+WenKai+TC&family=Tiro+Telugu:ital@0;1&display=swap');
@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&family=LXGW+WenKai+TC&display=swap');
.hero {
  padding: 80px 0;
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.hero-content {
  order: 1;
}

.hero-banner {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
  animation: moving 30s linear infinite;
}
.user-title {
  font-size: 1rem;
  color: var(--white);
  margin-bottom: 70px;
  display: inline-block;
}

.img-cover {
  margin-top: 20px;
  max-width: 100%;
  height: auto;
}

.section-title {
  font-family: "IM Fell English SC", serif; 
  font-size: 2rem;
  line-height: 1.3;
}
.wrapper p {
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-size: 1.5rem;
  color: var(--text-default);
}

.span {
  font-family: "IM Fell English SC", serif; 
  font-size: 80px;
  margin-top: -110px;
  transform: rotate(-180deg);
  display: inline-block;
}

.img {
  display: block;
  width: 200px;
  height: auto;
  margin-top: 20px;
  position: relative;
}

.right {
  margin-left: auto;
}

@media (max-width: 768px) {
  .img {
    width: 150px;
  }
}

@media (max-width: 480px) {
  .img {
    width: 100px;
  }
}

.shape {
  position: relative;
}

.shape-1 {
  width: 178px;
  height: 178px;
  overflow: hidden;
  border-radius: 50%;
  margin-top: -200px;
  animation: moving 60s linear infinite;
}

.shape-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.shape-2 {
  position: absolute;
  bottom: -20px;
  left: 0;
  width: 100%;
  animation: moving 8s linear infinite;
}

.shape-3 {
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  animation: moving 20s linear infinite;
}

@media (max-width: 1000px) {
  .shape-3 {
    display: none;
  }
}

@keyframes moving {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(30px);
  }
}

@media (max-width: 990px) {
  .shape-1 {
    margin-top: -100px;
    width: 100px;
    height: 100px;
  }
  .img-cover {
    margin-top: 10px;
  }
}

@media (max-width: 768px) {
  .hero .container {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 0 20px;
  }

  .hero-banner {
    max-width: 100%;
    margin: 0;
  }

  .section-title {
    text-align: center;
    margin-bottom: 50px;
  }
  .shape-1 {
    margin-top: -150px;
    width: 130px;
    height: 130px;
  }

  .img-cover {
    margin-top: 5px;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 2.5rem;
  }

  .span {
    font-size: 60px;
  }

  .shape-1 {
    margin-top: -100px;
    width: 100px;
    height: 100px;
  }
  .img-cover {
    margin-top: 0px;
  }
}
</style>
