<template>
  <section class="min-vh-100 d-flex align-items-center py-5">
    <div class="container">
      <div class="row g-5 align-items-center">
        <div class="col-lg-7">
          <header class="animate-fade-in">
            Hello! I’m Zahin, a
            <span class="highlighted-text-developer">developer</span> based in
            Bangladesh.
          </header>
          <div class="mt-4">
            <p>
              I love building tools that are
              <span class="highlighted-text-user-friendly">user-friendly</span>,
              <span class="highlighted-text-user-friendly">simple</span>, and
              <span class="highlighted-text-user-friendly">delightful</span>.
            </p>
            <p>
              I began my software journey at the age of 15 and pursued formal education in computer science since 2019.
              Since then, I have gained experience in
              <span class="highlighted-text-front-end">front-end</span> and
              <span class="highlighted-text-back-end">back-end web development</span>.
            </p>
            <p>
              I am currently employed as an SQA Engineer at <a href="https://www.iconicsolutionsbd.com/" target="_blank"
                class="highlighted-text-developer">Iconic Solutions Pvt. Ltd.</a>, where I focus on software testing.
              <span class="text-decoration-line-through">In addition, I contribute to UI/UX design using Figma and
                development in my spare time.</span>
            </p>
            <p>
              Through my experiences, I’ve had the opportunity to work with diverse teams and developed a working style
              focused on
              <span class="highlighted-text-flexibility">flexibility</span>,
              <span class="highlighted-text-flexibility">clarity</span>, and
              <span class="highlighted-text-flexibility">collaboration</span>.
            </p>
            <p>
              Don't forget to visit my
              <RouterLink to="/guestbook" exact-active-class="active-link" class="highlighted-text-hire-me"
                style="background-color: #fef9c3; color: #272727;">GuestBook</RouterLink>.
            </p>
          </div>
          <div class="mt-4 d-flex flex-wrap gap-3 animate-fade-in">
            <RouterLink to="/about" exact-active-class="active-link" class="custom-btn">View Resume</RouterLink>
            <a href="https://www.linkedin.com/in/isherezahin/" target="_blank" class="custom-btn">View LinkedIn</a>
          </div>
        </div>
        <div class="col-lg-5 text-center">
          <img src="../../assets/img/me/home-image.jpg" alt="Profile" class="img-fluid rounded-3"
            style="width: 70%; height: auto; object-position: center;"/>
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

.highlighted-text-developer {
  background-color: var(--highlight-blue);
  padding: 0 0.25rem;
  font-weight: 700;
}

.highlighted-text-user-friendly {
  background-color: var(--highlight-yellow);
  padding: 0 0.25rem;
}

.highlighted-text-front-end {
  background-color: var(--highlight-pink);
  padding: 0 0.25rem;
}

.highlighted-text-back-end {
  background-color: var(--highlight-green);
  padding: 0 0.25rem;
}

.highlighted-text-flexibility {
  background-color: var(--highlight-gray);
  color: var(--text-color);
  padding: 0 0.25rem;
}

.highlighted-text-hire-me {
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
