<template>
  <div class="portfolio-container">
    <!-- Actual Portfolio View -->
    <section class="min-vh-100 d-flex align-items-center py-5 animate-fade-in">
      <div class="container">
        <div class="row g-5 align-items-center">
          <div class="col-lg-7">
            <header class="animate-fade-in">
              Hello! I'm Zahin, a
              <span class="sky-bg">developer</span> based in
              Bangladesh.
            </header>
            <div class="mt-4">
              <p>
                I specialize in building <span class="text-user-bg">user-friendly</span>,
                <span class="text-user-bg">efficient</span>, and
                <span class="text-user-bg">scalable</span> web applications.
                My philosophy? Technology should simplify life, not complicate it.
              </p>
              <p>
                I started learning to code in <span class="soft-bg">2019</span> when I was
                <span class="soft-bg">16</span>. Over time, I turned it into a career. Today, I work extensively with
                <span class="laravel">Laravel</span>,
                <span class="vue">Vue.js</span>,
                <span class="docker" style="font-weight: 500;">Docker</span>,
                <span class="nextjs" style="font-weight: 500;">Next.js</span>, and
                <span class="sky-bg" style="font-weight: 500;">React.js</span>.
              </p>
              <p>
                I'm currently working at
                <a href="https://www.iconicsolutionsbd.com/" target="_blank" class="sky-bg">
                  Iconic Solutions Pvt. Ltd.</a>
              </p>
              <p>
                Feel free to drop me a message or say hello on my
                <router-link to="/guestbook" exact-active-class="active-link" class="guestbook-bg"
                  style="background-color: #fef9c3; color: #272727;">GuestBook</router-link>.
                I'd love to connect!
              </p>
            </div>
            <div class="mt-4 d-flex flex-wrap gap-3 animate-fade-in">
              <a href="https://drive.google.com/file/d/1eyATMUtOFCjnTeAWKQi_H7VylCTrloQC/view?usp=sharing"
                class="custom-btn">Download Resume</a>
              <a href="https://github.com/isherezahin" target="_blank" class="custom-btn">View GitHub</a>
            </div>
          </div>
          <div class="col-lg-5 text-center">
            <img src="../../assets/img/me/home-image.jpg" alt="Profile" class="img-fluid rounded-3"
              style="width: 70%; height: auto; object-position: center;" />
          </div>
        </div>
      </div>
      <img src="../../assets/img/home/about-shape-3.svg" loading="lazy" alt="" class="shape shape-3">
    </section>
  </div>
</template>

<script>
export default {
  // Empty component with no data or methods
}
</script>

<style scoped>
header {
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 700;
}

.sky-bg {
  background-color: var(--highlight-blue);
  padding: 0 0.25rem;
  font-weight: 700;
}


.docker {
  background: #2496ed;
  color: white;
  padding: 0 0.25rem;
  font-weight: 700;
}

.nextjs {
  background: #000000;
  color: white;
  padding: 0 0.25rem;
  font-weight: 700;
}

.text-user-bg {
  background-color: var(--highlight-yellow);
  padding: 0 0.25rem;
}

.laravel {
  background: #ff2d20;
  color: white;
  padding: 0 0.25rem;
}

.vue {
  background-color: var(--highlight-green);
  padding: 0 0.25rem;
}

.soft-bg {
  background-color: var(--highlight-gray);
  color: var(--text-color);
  padding: 0 0.25rem;
}

.guestbook-bg {
  background-color: var(--highlight-yellow);
  padding: 0 0.25rem;
}

/* Fade-in Animation */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Button Styles */
.custom-btn {
  color: white;
  font-weight: 400;
  text-decoration: none;
  padding: 0.5rem 2rem;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 transparent), var(--tw-ring-shadow, 0 0 transparent), var(--tw-shadow);
  border-radius: 50px;
  background-color: var(--button-bg);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.custom-btn:hover {
  background-color: var(--button-bg-hover);
}

.text-decoration-line-through {
  color: var(--cut);
}

/* Hover Animation for Images */
.img-fluid {
  transition: transform 0.3s ease-in-out;
}

.img-fluid:hover {
  cursor: pointer;
  transform: scale(1.05);
}

/* Animation Keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }

  to {
    opacity: 1;
    transform: translateX(0px);
  }
}

/* Media Queries */
@media (max-width: 570px) {
  .img-fluid {
    width: 60% !important;
    height: auto;
  }

  header {
    font-size: 1.5rem;
    line-height: 1.5rem;
    font-weight: 600;
  }
}

@media (max-width: 450px) {
  .img-fluid {
    width: 90% !important;
    height: auto;
  }
}

@media (max-width: 991px) {
  section {
    margin-top: 5vh;
  }
}
</style>
