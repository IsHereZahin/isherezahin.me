<template>
  <section id="project" style="margin-top: 70px">
  <div class="container">
    <!-- Page Head -->
    <div class="row page-head gap-2">
      <h1 class="white-head fw-bold text-green-800">About</h1>
      <p>👋 Hello! Assalamualikum; I'm Zahin, a passionate programmer who loves coding and tea.</p>
    </div>
    <img src="../assets/img/home/about-shape-3.svg" loading="lazy" alt="" class="shape shape-3">

    <h3 class="titlebar white-head text-decoration-none theme-color">WHO AM I</h3>

    <div class="container">
      <div class="row">
        <!-- Image Column -->
        <div class="col-md-4 d-flex justify-content-center align-items-center order-1 order-md-2">
          <img src="../assets/img/me/home-image.jpg" loading="lazy" title="Zahin" alt="Zahin" class="img-fluid shadow-sm">
        </div>

        <!-- Text Column -->
        <div class="col-md-8 order-2 order-md-1">
          <div class="w-100">
            <p class="text-gray-400">I’m an enthusiastic QA professional with a solid foundation in functional and automated testing. My expertise extends to working with tools and technologies such as <a class="tech-color" target="_blank" rel="noopener noreferrer" href="https://laravel.org/">Laravel</a>, <a class="tech-color" target="_blank" rel="noopener noreferrer" href="https://vuejs.org/">Vue.js</a>, <a class="tech-color" target="_blank" rel="noopener noreferrer" href="https://www.selenium.dev/">Selenium</a>, <a class="tech-color" target="_blank" rel="noopener noreferrer" href="https://pptr.dev/">Puppeteer</a>, <a class="tech-color" target="_blank" rel="noopener noreferrer" href="https://pestphp.com/">Pest</a>, and <a class="tech-color" target="_blank" rel="noopener noreferrer" href="https://www.figma.com/">Figma</a>.</p>
            <p class="text-gray-400">My journey in software began at the age of 15 with a keen interest in programming, which led me to pursue formal education in computer science starting in 2019. Through extensive self-learning on platforms like YouTube, particularly on channels like <a class="tech-color" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/@edurekaIN">edureka!</a>, I have developed a strong proficiency in various programming languages and technologies.</p>
          </div>

          <h5 class="titlebar white-head text-decoration-none">What I'm Up To?</h5>
          <ul>
            <li class="text-gray-400">SQA Engineer at <a class="tech-color" target="_blank" rel="noopener noreferrer" href="https://github.com/isherezahin">Iconic Solutions Pvt. Ltd.</a></li>
            <li class="text-gray-400">Traveling and enjoying time with friends when possible.</li>
            <li class="text-gray-400">Continuously learning and staying updated with new technology trends.</li>
          </ul>
        </div>
      </div>
    </div>

    <h4 class="titlebar white-head text-decoration-none">Social links</h4>
    <ul>
      <li class="text-gray-400"><a class="tech-color" target="_blank" rel="noopener noreferrer" href="https://github.com/isherezahin">GitHub</a></li>
      <li class="text-gray-400"><a class="tech-color" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/isherejahin/">Facebook</a></li>
      <li class="text-gray-400"><a class="tech-color" target="_blank" rel="noopener noreferrer" href="https://instagram.com/isherezahin">Instagram</a></li>
      <li class="text-gray-400"><a class="tech-color" target="_blank" rel="noopener noreferrer" href="https://x.com/isherezahin">X</a></li>
      <li class="text-gray-400"><a class="tech-color" target="_blank" rel="noopener noreferrer" href="https://youtube.com/@isherezahin">YouTube</a></li>
    </ul>
    
    <h4 class="titlebar white-head text-decoration-none">Tech Stack</h4>
    <div class="tech-stack">
      <div class="tech">
          <img src="https://skillicons.dev/icons?i=vscode" alt="Visual Studio Code"/>
          <div class="tooltip"><span class="tech-name">Visual Studio Code:</span> A source-code editor made by Microsoft.</div>
      </div>
      <div class="tech">
          <img src="https://skillicons.dev/icons?i=git" alt="Git"/>
          <div class="tooltip"><span class="tech-name">Git:</span> A distributed version control system for tracking changes in source code.</div>
      </div>
      <div class="tech">
          <img src="https://skillicons.dev/icons?i=cs" alt="C#"/>
          <div class="tooltip"><span class="tech-name">C#:</span> A modern, object-oriented programming language developed by Microsoft.</div>
      </div>
      <div class="tech">
          <img src="https://skillicons.dev/icons?i=laravel" alt="Laravel"/>
          <div class="tooltip"><span class="tech-name">Laravel:</span> A PHP framework for web artisans.</div>
      </div>
      <div class="tech">
          <img src="https://skillicons.dev/icons?i=vue" alt="Vue.js"/>
          <div class="tooltip"><span class="tech-name">Vue.js:</span> A progressive framework for building user interfaces.</div>
      </div>
      <div class="tech">
          <img src="https://skillicons.dev/icons?i=figma" alt="Figma"/>
          <div class="tooltip"><span class="tech-name">Figma:</span> A collaborative interface design tool.</div>
      </div>
      <div class="tech">
          <img src="https://skillicons.dev/icons?i=selenium" alt="Selenium"/>
          <div class="tooltip"><span class="tech-name">Selenium:</span> A portable framework for testing web applications.</div>
      </div>
      <div class="tech">
          <img src="https://skillicons.dev/icons?i=linux" alt="Linux"/>
          <div class="tooltip"><span class="tech-name">Linux:</span> An open-source Unix-like operating system.</div>
      </div>
      <div class="tech">
          <img src="https://skillicons.dev/icons?i=windows" alt="Windows"/>
          <div class="tooltip"><span class="tech-name">Windows:</span> A group of several proprietary graphical operating system families developed by Microsoft.</div>
      </div>
    </div>
    <h4 class="titlebar white-head text-decoration-none" style="margin-bottom: 4px;">Contact</h4>
    <p  class="text-gray-400">Do contact me if you need my opinion about software testing, web development, especially frontend works. <br>I’ll be happy to help! (find my Skype ID in the footer)</p>
  </div>
  </section>
</template>

<script>
export default {
name: 'AboutComponent',
// Add any necessary data, methods, or computed properties here
}
</script>

<style scoped>
.titlebar {
margin-top: 2rem;
margin-bottom: 2rem;
font-weight: 600;
}

.title {
color: var(--text);
}

.transition {
transition: opacity 0.2s ease-in-out;
}
.rounded {
border-radius: 0.5rem;
}

.text-gray-400 {
color: var(--text);
}

a, h4 {
  font-weight: 600;
}

.img-fluid {
max-width: 80%;
height: auto;
object-fit: cover;
transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
cursor: pointer;
box-shadow: 0 4px 8px var(--theme);
border-radius: 0.3rem;
margin-bottom: 2rem;
}

.img-fluid:hover {
transform: scale(1.05);
box-shadow: 0 8px 16px var(--theme);
}

@media (max-width: 768px) {
.img-fluid {
  max-width: 70%;
}
}

@media (max-width: 576px) {
.img-fluid {
  max-width: 70%;
  border-radius: 0.2rem;
}
}
.tech-stack{
justify-content: left;
}
</style>
