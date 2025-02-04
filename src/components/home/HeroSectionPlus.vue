<template>
  <section class="min-vh-100 d-flex align-items-center py-5">
    <div class="container">
      <div class="row g-5 align-items-center">
        <div class="col-lg-7">
          <header class="animate-fade-in">
            Hello! I’m Zahin, a  
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
              <span class="highlighted-text-front-end">Laravel</span>,  
              <span class="green-bg">Vue.js</span>, and  
              <span class="sky-bg" style="font-weight: 500;">Docker</span>
              <span class="text-decoration-line-through">—bringing ideas to life every day.</span>
            </p>
            <p>
              I’m currently working as a Junior SQA Engineer at  
              <a href="https://www.iconicsolutionsbd.com/" target="_blank" class="sky-bg">
                Iconic Solutions Pvt. Ltd.</a>
            </p>
            <p>
              Feel free to drop me a message or say hello on my  
              <RouterLink to="/guestbook" exact-active-class="active-link" class="guestbook-bg"
                style="background-color: #fef9c3; color: #272727;">GuestBook</RouterLink>.  
              I’d love to connect!
            </p>
          </div>
          <div class="mt-4 d-flex flex-wrap gap-3 animate-fade-in">
            <a href="https://drive.google.com/file/d/1Q56yq9Kvszi9Mc9vCUyyeSovTJ90RbLX/view?usp=drive_link" download class="custom-btn">View Resume</a>
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
</template>

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

.text-user-bg {
  background-color: var(--highlight-yellow);
  padding: 0 0.25rem;
}

.highlighted-text-front-end {
  background-color: var(--highlight-pink);
  padding: 0 0.25rem;
}

.green-bg {
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
