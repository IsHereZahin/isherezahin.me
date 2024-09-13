<template>
    <SpeedInsights />
    <!-- ======= Header ======= -->
    <header id="header" class="header d-flex align-items-center fixed-top">
        <div class="container-fluid d-flex align-items-center justify-content-between">
            <RouterLink to="/" class="logo d-flex align-items-center me-auto me-lg-0">
                <img src="./assets/img/home/logo.png" alt="Zahin">
            </RouterLink>

            <nav id="navbar" class="navbar">
                <ul>
                    <li><RouterLink to="/" exact-active-class="active-link">Home</RouterLink></li>
                    <li><RouterLink to="/about" exact-active-class="active-link">About</RouterLink></li>
                    <li><RouterLink to="/project" exact-active-class="active-link">Project</RouterLink></li>
                    <li><RouterLink to="/blog" exact-active-class="active-link">Blog</RouterLink></li>
                    <li><RouterLink to="/guestbook" exact-active-class="active-link">GuestBook</RouterLink></li>
                    <li><RouterLink to="/services" exact-active-class="active-link">Services</RouterLink></li>
                    <li><RouterLink to="/uses" exact-active-class="active-link">Uses</RouterLink></li>
                </ul>
            </nav>
            <!-- .navbar -->

            <div class="header-social-links">
                <a href="https://www.github.com/IsHereZahin/" target="_blank" class="github"><i class="bi bi-github"></i></a>
                <a href="https://www.linkedin.com/in/isherezahin/" target="_blank" class="linkedin"><i class="bi bi-linkedin"></i></a>
                <a href="https://www.youtube.com/@IsHereZahin" target="_blank" class="youtube"><i class="bi bi-youtube"></i></a>
                <a href="https://www.twitter.com/IsHereZahin/" target="_blank" class="twitter"><i class="bi bi-twitter"></i></a>
            </div>
            <i class="mobile-nav-toggle mobile-nav-show bi bi-list"></i>
            <i class="mobile-nav-toggle mobile-nav-hide d-none bi bi-x"></i>
        </div>
    </header>
    <!-- End Header -->

    <RouterView />

    <!-- ======= Footer ======= -->
    <footer id="footer" class="footer" ref="footer">
        <div class="container">

            <div class="tech-stack footer-nav">
                <div class="tech">
                    <a href="https://github.com/IsHereZahin/isherezahin.me" target="_blank" exact class="link-a">Source Code</a>
                    <div class="tooltip"><span class="tech-name">Source Code:</span> Access the open-source code for this website.</div>
                </div>
                <div class="tech">
                    <a href="https://github.com/IsHereZahin/isherezahin.me" target="_blank" exact class="link-a">Contribute</a>
                    <div class="tooltip"><span class="tech-name">Contribute:</span> Contribute to enhancing this website's features.</div>
                </div>
                <div class="tech">
                    <RouterLink to="/about" exact class="link-a">About</RouterLink>
                    <div class="tooltip"><span class="tech-name">About:</span> Learn more about my background and experience.</div>
                </div>
                <div class="tech">
                    <RouterLink to="/design" exact class="link-a">Design</RouterLink>
                    <div class="tooltip"><span class="tech-name">Design:</span> Explore the design process behind this portfolio website.</div>
                </div>
                <div class="tech">
                    <RouterLink to="/guestbook" exact class="link-a">Guestbook</RouterLink>
                    <div class="tooltip"><span class="tech-name">Guestbook:</span> I'd love to hear from you! Share your thoughts and feedback on my guestbook page.</div>
                </div>
                <div class="tech">
                    <RouterLink to="/project" exact class="link-a">Projects</RouterLink>
                    <div class="tooltip"><span class="tech-name">Projects:</span> View and explore my professional projects.</div>
                </div>
                <div class="tech">
                    <RouterLink to="/bd-anti-discrimination-student-movement" exact class="link-a">BD-24</RouterLink>
                    <div class="tooltip"><span class="tech-name">BD-24:</span> Learn about the Bangladesh Anti-Discrimination Student Movement and its advocacy for equality and anti-discrimination.</div>
                </div>
                <div class="tech">
                    <RouterLink to="/uses" exact class="link-a">Uses</RouterLink>
                    <div class="tooltip"><span class="tech-name">Uses:</span> Discover the tools and technologies I use in my work.</div>
                </div>
            </div>

            <div class="copyright">
                &copy; Copyright <strong><span>ZAHIN</span></strong> 2024 • Got any feedback?
            </div>
            <div class="social-links d-flex justify-content-center">
                <a href="https://www.github.com/IsHereZahin/" target="_blank"><i class="bi bi-github"></i></a>
                <a href="https://www.linkedin.com/in/isherezahin/" target="_blank"><i class="bi bi-linkedin"></i></a>
                <a href="https://www.youtube.com/@IsHereZahin" target="_blank"><i class="bi bi-youtube"></i></a>
                <a href="https://www.twitter.com/IsHereZahin/" target="_blank"><i class="bi bi-twitter"></i></a>
            </div>
            <div class="credits">
                For inquiries, contact me on 
                <a href="https://join.skype.com/invite/xeu3lGYMM8So" target="_blank" rel="noopener noreferrer">
                    Skype
                </a>
            </div>
        </div>
    </footer>
    <!-- End Footer -->

    <a href="#" class="scroll-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>
    <div id="preloader">
        <div class="line"></div>
    </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { SpeedInsights } from '@vercel/speed-insights/vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../public/assets/vendor/swiper/swiper-bundle.min.css';
import '../public/assets/vendor/glightbox/css/glightbox.min.css';
import '../public/assets/vendor/aos/aos.css';
import '../public/assets/css/main.css'
// import Swal from 'sweetalert2';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../public/assets/vendor/swiper/swiper-bundle.min.js';
import '../public/assets/vendor/glightbox/js/glightbox.min.js';
import '../public/assets/vendor/php-email-form/validate.js';
import '../public/assets/js/main.js';

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

// //Disable right-click
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

// // Disable F12, Ctrl+Shift+I, Ctrl+U
// document.addEventListener('keydown', function(e) {
//     if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'U')) {
//         e.preventDefault();
//         Swal.fire({
//             icon: 'warning',
//             title: 'Oops...',
//             text: 'Inspecting this page is not allowed!',
//             showClass: {
//                 popup: 'animate__animated animate__fadeInDown'
//             },
//             hideClass: {
//                 popup: 'animate__animated animate__fadeOutUp'
//             }
//         });
//     }
// });
</script>

<script>
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        const shape = document.querySelector('.shape-3');
        shape.style.opacity = '1';
      }, 1500); // 1.5 seconds delay
    });
</script>

<style scoped>
.active-link {
    color: var(--theme); /* Example active link color */
    font-weight: bold; /* Example active link font weight */
}
.tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    margin: 10px 0;
}
</style>
