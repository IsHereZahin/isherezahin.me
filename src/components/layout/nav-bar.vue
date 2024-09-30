<template>
    <header id="header" class="header d-flex align-items-center fixed-top">
        <div class="container-fluid d-flex align-items-center justify-content-between">
            <RouterLink to="/" class="logo d-flex align-items-center me-auto me-lg-0">
                <img src="../../assets/img/home/logo.png" alt="Zahin" class="logo-dark">
                <img src="../../assets/img/home/logo-light.png" alt="Zahin" class="logo-light">
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
</template>

<script>
export default {
    name: 'nav-bar'
}
</script>
<style>
.active-link {
    color: var(--theme);
    font-weight: bold;
}
.logo-dark {
    display: none;
}

body.dark-theme .logo-light {
    display: none;
}

body.dark-theme .logo-dark {
    display: block;
}
.header {
  transition: all 0.5s;
  z-index: 997;
  padding: 15px 0;
  background-color: var(--color-bg);
}

.header .logo {
  transition: 0.3s;
}

.header .logo img {
  max-height: 40px;
  margin-right: 8px;
}

.header .logo h1 {
  font-size: 32px;
  margin: 0;
  font-weight: 400;
  color: var(--white);
  font-family: var(--font-secondary);
}

.header .logo i {
  font-size: 32px;
  margin-right: 8px;
  line-height: 0;
}

@media (max-width: 575px) {
  .header .logo h1 {
    font-size: 26px;
  }

  .header .logo i {
    font-size: 24px;
  }
}

.header .header-social-links {
  padding-right: 15px;
}

.header .header-social-links a {
  color: var(--text);
  padding-left: 15px;
  display: inline-block;
  line-height: 0px;
  transition: 0.3s;
  font-size: 16px;
}

.header .header-social-links a:hover {
  color: var(--white);
}

@media (max-width: 575px) {
  .header .header-social-links a {
    padding-left: 5px;
  }
}
</style>