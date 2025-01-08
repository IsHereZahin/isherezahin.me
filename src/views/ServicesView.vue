<script setup>
import Services from '../components/ServicesInfo.vue'
</script>

<template>
  <section id="blog" style="margin-top: 70px">
    <div class="container">
      <img src="../assets/img/home/about-shape-3.svg" loading="lazy" alt="" class="shape shape-3">
      <!-- Page Head -->
      <div class="row page-head gap-2">
        <h1 class="white-head fw-bold text-green-800">Services</h1>
        <p class="text-gray-400">Offering expert web development, front-end, back-end solutions, and user-friendly designs tailored to meet your needs.</p>
      </div>
    </div>
  </section>

  <main id="main">
    <Services />
  </main>
</template>
