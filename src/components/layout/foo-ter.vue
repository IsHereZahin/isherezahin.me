<template>
  <footer class="footer" ref="footer">
    <div class="container">
        <div class="tech-stack footer-nav" style="justify-content: center;">
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
</template>

<script>
</script>

<style>
.tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    margin: 10px 0;
}

.footer {
  margin-top: 30px;
  padding: 30px 0;
  font-size: 14px;
  border-top: 1px solid var(--blackly);
}

.footer .copyright {
  margin-top: 30px;
  margin-bottom: -10px;
  text-align: center;
  color: var(--text);
}

.credits {
  color: var(--text);
  margin-top: 20px;
  text-align: center;
}

.credits a {
  color: #00aff0; /* Skype blue color */  
  text-decoration: none;
  font-weight: bold;
}

.credits a:hover {
  text-decoration: underline;
}

.footer .social-links {
  margin-top: 20px;
}

.footer .social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--text);
  font-size: 16px;
  color: var(--text);
  margin: 0 5px;
  transition: 0.3s;
}

.footer .social-links a:hover {
  color: var(--theme);
  border-color: var(--theme);
}
</style>