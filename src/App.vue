<template>
    <SpeedInsights />
    <Navbar/>
    <RouterView />
    <Footer />
    <a href="#" class="scroll-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>
    <div id="preloader">
        <div class="line"></div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { SpeedInsights } from '@vercel/speed-insights/vue';
import Navbar from './components/layout/nav-bar.vue';
import Footer from './components/layout/foo-ter.vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../public/assets/vendor/swiper/swiper-bundle.min.css';
import '../public/assets/vendor/glightbox/css/glightbox.min.css';
import '../public/assets/vendor/aos/aos.css';
import '../public/assets/css/main.css'
import Swal from 'sweetalert2';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../public/assets/vendor/swiper/swiper-bundle.min.js';
import '../public/assets/vendor/glightbox/js/glightbox.min.js';
import '../public/assets/vendor/php-email-form/validate.js';
import '../public/assets/js/main.js';


onMounted(() => {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (prefersDarkMode) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
});
// document.addEventListener('DOMContentLoaded', () => {
//     // Show SweetAlert message with custom content
//     Swal.fire({
//         title: 'Pray for us (Bangladeshi students) 🇧🇩🤲',
//         html: `
//             <div style="max-width: 100%; overflow: hidden;">
//                 <p style="font-size: 16px;"><mark>The quota system benefits the children of pro-government groups, and we demand its abolition. I am a Bangladeshi student seeking international attention right now. We do not want any quota in the education sector. Our brothers are protesting for their rights. Pro-government groups are attacking us. Already, up to six of our brothers have died. We want freedom.</mark></p>
//                 <div style="position: relative; overflow: hidden; padding-top: 56.25%; margin-bottom: 10px;">
//                     <iframe width="100%" height="100%" src="https://www.youtube.com/embed/OElKYADvjpE?si=RZjEcyvMwbj9nIl-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
//                 </div>
//                 <p style="font-size: 14px;">Date: July 15, 2024</p>
//                 <p style="font-size: 14px;">Recent news: <a href="https://www.aljazeera.com/news/2024/7/16/at-least-one-student-killed-during-anti-quota-protests-in-bangladesh" target="_blank" style="text-decoration: none; color: #007BFF;">Read news</a></p>
//             </div>
//         `,
//         icon: 'info',
//         showConfirmButton: false,
//         customClass: {
//             popup: 'alert-class', // Customize alert styling if needed
//         }
//     });

//     // Your existing shape animation delay
//     setTimeout(() => {
//         const shape = document.querySelector('.shape-3');
//         shape.style.opacity = '1';
//     }, 1500);
// });

// Disable right-click
// document.addEventListener('contextmenu', function(e) {
//     e.preventDefault();
//     Swal.fire({
//         icon: 'warning',
//          text: 'Inspecting this page is not allowed!',
//         showClass: {
//             popup: 'animate__animated animate__fadeInDown'
//         },
//         hideClass: {
//             popup: 'animate__animated animate__fadeOutUp'
//         }
//     });
// });

// Disable F12, Ctrl+Shift+I, Ctrl+U
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Inspecting this page is not allowed!',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    }
});
</script>

<script>
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        const shape = document.querySelector('.shape-3');
        shape.style.opacity = '1';
      }, 1500); // 1.5 seconds delay
    });
</script>
