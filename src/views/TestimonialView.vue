<script setup>
import Testimonial from '../components/testi-monial.vue'
</script>

<template>
  <section id="testimonial" style="margin-top: 70px">
    <div class="container">
      <img src="../assets/img/home/about-shape-3.svg" loading="lazy" alt="" class="shape shape-3">
      <!-- Page Head -->
      <div class="row page-head gap-2">
        <h1 class="white-head fw-bold text-green-800">Testimonials</h1>
        <p>Read what others have to say about my commitment to quality, creativity, and collaboration in software development and design.</p>
      </div>
    </div>
  </section>

  <main id="main">
    <Testimonial />
  </main>
</template>
