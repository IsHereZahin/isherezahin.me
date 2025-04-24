<template>
  <h1 class="headline">About Me</h1>
  <div class="row">

    <div class="col-md-6">
      <div class="row borderli">
        <div class="location">
          <div class="row">
            <div class="location-title">
              <p><i class="bi bi-geo-alt-fill"></i> Bangladesh, Chittagong (UTC +06:00)</p>
            </div>
          </div>
          <div class="row">
            <div class="map">
              <img src="../../assets/img/Bangladesh_(orthographic_projection).svg.png" alt="Bangladesh - Orthographic Projection Map" title="Bangladesh" height="200px" class="img-fluid">
            </div>
          </div>
        </div>
      </div>

      <div class="row borderli">
        <div class="stacks">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap size-[18px]">
                <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
            </svg>
            Languages and Tools
        </div>

        <div class="icon-marquee">
          <div class="flex flex-col overflow-hidden p-4">
            <!-- Left Marquee Container -->
            <div class="flex justify-around gap-3 mb-3 first-marquee-container move-left-to-right">
              <img v-for="(icon, index) in firstMarqueeIcons" :key="index" :src="icon.src" :alt="icon.alt" class="size-10 icon">
            </div>

            <!-- Right Marquee Container -->
            <div class="flex justify-around gap-3 second-marquee-container move-right-to-left">
              <img v-for="(icon, index) in secondMarqueeIcons" :key="'second-' + index" :src="icon.src" :alt="icon.alt" class="size-10 icon">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-6">

      <div class="row">
          <div class="connect borderli">
            <div class="d-flex align-items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;" class="lucide lucide-link">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>Connect
              </svg>
              <h2 style="color: var(--white); font-size: 15px; margin-top: 10px;">Connect</h2>
            </div>
            <ul style="padding: 20px;">
              <li><a href="https://www.github.com/IsHereZahin/" target="_blank"><i class="bi bi-github"></i> Github</a></li>
              <li><a href="https://www.linkedin.com/in/isherezahin/" target="_blank"><i class="bi bi-linkedin"></i> LinkedIn</a></li>
              <li><a href="https://www.youtube.com/@IsHereZahin" target="_blank"><i class="bi bi-youtube"></i> YouTube</a></li>
              <li><a href="https://www.twitter.com/IsHereZahin/" target="_blank"><i class="bi bi-twitter"></i> Twitter</a></li>
              <li><a href="https://join.skype.com/invite/xeu3lGYMM8So" target="_blank"><i class="bi bi-skype"></i> Skype</a></li>
            </ul>
          </div>
      </div>

      <div class="row">
        <div class="col-sm-6">
            <div class="borderli flex flex-col gap-6">
              <div class="d-flex align-items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock size-[60px]"> <!-- Adjusted size here -->
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <h2 class="text-sm font-light m-0">Coding hours</h2>
              </div>
              <div class="hours text-center">4583hrs</div>
            </div>
        </div>

        <div class="col-sm-6">
            <div class="borderli flex flex-col gap-6">
              <div class="d-flex align-items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart size-[18px]">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
                <h2 class="text-sm font-light m-0">Fav. framework</h2>
              </div>
              <div class="d-flex align-items-center justify-content-center gap">
                <div class="tech-stack">
                  <div class="tech">
                    <img src="../../assets/img/home/laravel.png" alt="Laravel Logo" width="100" height="100">
                    <div class="tooltip">
                      <span class="tech-name">Laravel:</span> A PHP framework for web artisans.
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>

    </div>

  </div>

  <div class="row">
    <div class="custom-btn">
      <RouterLink to="/about" class="custom-button">Know more about me</RouterLink>
    </div>
  </div>
</template>

<script>
export default {
  name: "IconMarquee",
  data() {
    return {
      firstMarqueeIcons: [
      { src: "https://skillicons.dev/icons?i=html", alt: "HTML Icon" },
        { src: "https://skillicons.dev/icons?i=css", alt: "CSS Icon" },
        { src: "https://skillicons.dev/icons?i=bootstrap", alt: "Bootstrap Icon" },
        { src: "https://skillicons.dev/icons?i=tailwind", alt: "Tailwind CSS Icon" },
        { src: "https://skillicons.dev/icons?i=js", alt: "JavaScript Icon" },
        { src: "https://skillicons.dev/icons?i=php", alt: "PHP Icon" },
        { src: "https://skillicons.dev/icons?i=py", alt: "Python Icon" },
        { src: "https://skillicons.dev/icons?i=vue", alt: "Vue.js Icon" },
        { src: "https://skillicons.dev/icons?i=laravel", alt: "Laravel Icon" },
        { src: "https://skillicons.dev/icons?i=selenium", alt: "Selenium Icon" },
        { src: "https://skillicons.dev/icons?i=visualstudio", alt: "VS Code Icon" },
      { src: "https://skillicons.dev/icons?i=html", alt: "HTML Icon" },
        { src: "https://skillicons.dev/icons?i=css", alt: "CSS Icon" },
        { src: "https://skillicons.dev/icons?i=bootstrap", alt: "Bootstrap Icon" },
        { src: "https://skillicons.dev/icons?i=tailwind", alt: "Tailwind CSS Icon" },
        { src: "https://skillicons.dev/icons?i=js", alt: "JavaScript Icon" },
        { src: "https://skillicons.dev/icons?i=php", alt: "PHP Icon" },
        { src: "https://skillicons.dev/icons?i=py", alt: "Python Icon" },
        { src: "https://skillicons.dev/icons?i=vue", alt: "Vue.js Icon" },
        { src: "https://skillicons.dev/icons?i=laravel", alt: "Laravel Icon" },
        { src: "https://skillicons.dev/icons?i=selenium", alt: "Selenium Icon" },
        { src: "https://skillicons.dev/icons?i=visualstudio", alt: "VS Code Icon" },
      { src: "https://skillicons.dev/icons?i=html", alt: "HTML Icon" },
        { src: "https://skillicons.dev/icons?i=css", alt: "CSS Icon" },
        { src: "https://skillicons.dev/icons?i=bootstrap", alt: "Bootstrap Icon" },
        { src: "https://skillicons.dev/icons?i=tailwind", alt: "Tailwind CSS Icon" },
        { src: "https://skillicons.dev/icons?i=js", alt: "JavaScript Icon" },
        { src: "https://skillicons.dev/icons?i=php", alt: "PHP Icon" },
        { src: "https://skillicons.dev/icons?i=py", alt: "Python Icon" },
        { src: "https://skillicons.dev/icons?i=vue", alt: "Vue.js Icon" },
        { src: "https://skillicons.dev/icons?i=laravel", alt: "Laravel Icon" },
        { src: "https://skillicons.dev/icons?i=selenium", alt: "Selenium Icon" },
        { src: "https://skillicons.dev/icons?i=visualstudio", alt: "VS Code Icon" },
      { src: "https://skillicons.dev/icons?i=html", alt: "HTML Icon" },
        { src: "https://skillicons.dev/icons?i=css", alt: "CSS Icon" },
        { src: "https://skillicons.dev/icons?i=bootstrap", alt: "Bootstrap Icon" },
        { src: "https://skillicons.dev/icons?i=tailwind", alt: "Tailwind CSS Icon" },
        { src: "https://skillicons.dev/icons?i=js", alt: "JavaScript Icon" },
        { src: "https://skillicons.dev/icons?i=php", alt: "PHP Icon" },
        { src: "https://skillicons.dev/icons?i=py", alt: "Python Icon" },
        { src: "https://skillicons.dev/icons?i=vue", alt: "Vue.js Icon" },
        { src: "https://skillicons.dev/icons?i=laravel", alt: "Laravel Icon" },
        { src: "https://skillicons.dev/icons?i=selenium", alt: "Selenium Icon" },
        { src: "https://skillicons.dev/icons?i=visualstudio", alt: "VS Code Icon" },
      { src: "https://skillicons.dev/icons?i=html", alt: "HTML Icon" },
        { src: "https://skillicons.dev/icons?i=css", alt: "CSS Icon" },
        { src: "https://skillicons.dev/icons?i=bootstrap", alt: "Bootstrap Icon" },
        { src: "https://skillicons.dev/icons?i=tailwind", alt: "Tailwind CSS Icon" },
        { src: "https://skillicons.dev/icons?i=js", alt: "JavaScript Icon" },
        { src: "https://skillicons.dev/icons?i=php", alt: "PHP Icon" },
        { src: "https://skillicons.dev/icons?i=py", alt: "Python Icon" },
        { src: "https://skillicons.dev/icons?i=vue", alt: "Vue.js Icon" },
        { src: "https://skillicons.dev/icons?i=laravel", alt: "Laravel Icon" },
        { src: "https://skillicons.dev/icons?i=selenium", alt: "Selenium Icon" },
        { src: "https://skillicons.dev/icons?i=visualstudio", alt: "VS Code Icon" },
      { src: "https://skillicons.dev/icons?i=html", alt: "HTML Icon" },
        { src: "https://skillicons.dev/icons?i=css", alt: "CSS Icon" },
        { src: "https://skillicons.dev/icons?i=bootstrap", alt: "Bootstrap Icon" },
        { src: "https://skillicons.dev/icons?i=tailwind", alt: "Tailwind CSS Icon" },
        { src: "https://skillicons.dev/icons?i=js", alt: "JavaScript Icon" },
        { src: "https://skillicons.dev/icons?i=php", alt: "PHP Icon" },
        { src: "https://skillicons.dev/icons?i=py", alt: "Python Icon" },
        { src: "https://skillicons.dev/icons?i=vue", alt: "Vue.js Icon" },
        { src: "https://skillicons.dev/icons?i=laravel", alt: "Laravel Icon" },
        { src: "https://skillicons.dev/icons?i=selenium", alt: "Selenium Icon" },
        { src: "https://skillicons.dev/icons?i=visualstudio", alt: "VS Code Icon" },
      { src: "https://skillicons.dev/icons?i=html", alt: "HTML Icon" },
        { src: "https://skillicons.dev/icons?i=css", alt: "CSS Icon" },
        { src: "https://skillicons.dev/icons?i=bootstrap", alt: "Bootstrap Icon" },
        { src: "https://skillicons.dev/icons?i=tailwind", alt: "Tailwind CSS Icon" },
        { src: "https://skillicons.dev/icons?i=js", alt: "JavaScript Icon" },
        { src: "https://skillicons.dev/icons?i=php", alt: "PHP Icon" },
        { src: "https://skillicons.dev/icons?i=py", alt: "Python Icon" },
        { src: "https://skillicons.dev/icons?i=vue", alt: "Vue.js Icon" },
        { src: "https://skillicons.dev/icons?i=laravel", alt: "Laravel Icon" },
        { src: "https://skillicons.dev/icons?i=selenium", alt: "Selenium Icon" },
        { src: "https://skillicons.dev/icons?i=visualstudio", alt: "VS Code Icon" },
      { src: "https://skillicons.dev/icons?i=html", alt: "HTML Icon" },
        { src: "https://skillicons.dev/icons?i=css", alt: "CSS Icon" },
        { src: "https://skillicons.dev/icons?i=bootstrap", alt: "Bootstrap Icon" },
        { src: "https://skillicons.dev/icons?i=tailwind", alt: "Tailwind CSS Icon" },
        { src: "https://skillicons.dev/icons?i=js", alt: "JavaScript Icon" },
        { src: "https://skillicons.dev/icons?i=php", alt: "PHP Icon" },
        { src: "https://skillicons.dev/icons?i=py", alt: "Python Icon" },
        { src: "https://skillicons.dev/icons?i=vue", alt: "Vue.js Icon" },
        { src: "https://skillicons.dev/icons?i=laravel", alt: "Laravel Icon" },
        { src: "https://skillicons.dev/icons?i=selenium", alt: "Selenium Icon" },
        { src: "https://skillicons.dev/icons?i=visualstudio", alt: "VS Code Icon" },
      { src: "https://skillicons.dev/icons?i=html", alt: "HTML Icon" },
        { src: "https://skillicons.dev/icons?i=css", alt: "CSS Icon" },
        { src: "https://skillicons.dev/icons?i=bootstrap", alt: "Bootstrap Icon" },
        { src: "https://skillicons.dev/icons?i=tailwind", alt: "Tailwind CSS Icon" },
        { src: "https://skillicons.dev/icons?i=js", alt: "JavaScript Icon" },
        { src: "https://skillicons.dev/icons?i=php", alt: "PHP Icon" },
        { src: "https://skillicons.dev/icons?i=py", alt: "Python Icon" },
        { src: "https://skillicons.dev/icons?i=vue", alt: "Vue.js Icon" },
        { src: "https://skillicons.dev/icons?i=laravel", alt: "Laravel Icon" },
        { src: "https://skillicons.dev/icons?i=selenium", alt: "Selenium Icon" },
        { src: "https://skillicons.dev/icons?i=visualstudio", alt: "VS Code Icon" },
      { src: "https://skillicons.dev/icons?i=html", alt: "HTML Icon" },
        { src: "https://skillicons.dev/icons?i=css", alt: "CSS Icon" },
        { src: "https://skillicons.dev/icons?i=bootstrap", alt: "Bootstrap Icon" },
        { src: "https://skillicons.dev/icons?i=tailwind", alt: "Tailwind CSS Icon" },
        { src: "https://skillicons.dev/icons?i=js", alt: "JavaScript Icon" },
        { src: "https://skillicons.dev/icons?i=php", alt: "PHP Icon" },
        { src: "https://skillicons.dev/icons?i=py", alt: "Python Icon" },
        { src: "https://skillicons.dev/icons?i=vue", alt: "Vue.js Icon" },
        { src: "https://skillicons.dev/icons?i=laravel", alt: "Laravel Icon" },
        { src: "https://skillicons.dev/icons?i=selenium", alt: "Selenium Icon" },
        { src: "https://skillicons.dev/icons?i=visualstudio", alt: "VS Code Icon" },
      ],
      secondMarqueeIcons: [
        { src: "https://skillicons.dev/icons?i=mysql", alt: "MySQL Icon" },
        { src: "https://skillicons.dev/icons?i=firebase", alt: "Firebase Icon" },
        { src: "https://skillicons.dev/icons?i=figma", alt: "Figma Icon" },
        { src: "https://skillicons.dev/icons?i=git", alt: "Git Icon" },
        { src: "https://skillicons.dev/icons?i=github", alt: "GitHub Icon" },
        { src: "https://skillicons.dev/icons?i=postman", alt: "Postman Icon" },
        { src: "https://skillicons.dev/icons?i=vercel", alt: "Vercel Icon" },
        { src: "https://skillicons.dev/icons?i=windows", alt: "Windows Icon" },
        { src: "https://skillicons.dev/icons?i=linux", alt: "Linux Icon" },
        { src: "https://skillicons.dev/icons?i=discord", alt: "Discord Icon" },
        { src: "https://skillicons.dev/icons?i=mysql", alt: "MySQL Icon" },
        { src: "https://skillicons.dev/icons?i=nextjs", alt: "Next.js Icon" },
        { src: "https://skillicons.dev/icons?i=firebase", alt: "Firebase Icon" },
        { src: "https://skillicons.dev/icons?i=figma", alt: "Figma Icon" },
        { src: "https://skillicons.dev/icons?i=git", alt: "Git Icon" },
        { src: "https://skillicons.dev/icons?i=github", alt: "GitHub Icon" },
        { src: "https://skillicons.dev/icons?i=postman", alt: "Postman Icon" },
        { src: "https://skillicons.dev/icons?i=vercel", alt: "Vercel Icon" },
        { src: "https://skillicons.dev/icons?i=windows", alt: "Windows Icon" },
        { src: "https://skillicons.dev/icons?i=linux", alt: "Linux Icon" },
        { src: "https://skillicons.dev/icons?i=discord", alt: "Discord Icon" },
        { src: "https://skillicons.dev/icons?i=mysql", alt: "MySQL Icon" },
        { src: "https://skillicons.dev/icons?i=nextjs", alt: "Next.js Icon" },
        { src: "https://skillicons.dev/icons?i=firebase", alt: "Firebase Icon" },
        { src: "https://skillicons.dev/icons?i=figma", alt: "Figma Icon" },
        { src: "https://skillicons.dev/icons?i=git", alt: "Git Icon" },
        { src: "https://skillicons.dev/icons?i=github", alt: "GitHub Icon" },
        { src: "https://skillicons.dev/icons?i=postman", alt: "Postman Icon" },
        { src: "https://skillicons.dev/icons?i=vercel", alt: "Vercel Icon" },
        { src: "https://skillicons.dev/icons?i=windows", alt: "Windows Icon" },
        { src: "https://skillicons.dev/icons?i=linux", alt: "Linux Icon" },
        { src: "https://skillicons.dev/icons?i=discord", alt: "Discord Icon" },
        { src: "https://skillicons.dev/icons?i=mysql", alt: "MySQL Icon" },
        { src: "https://skillicons.dev/icons?i=nextjs", alt: "Next.js Icon" },
        { src: "https://skillicons.dev/icons?i=firebase", alt: "Firebase Icon" },
        { src: "https://skillicons.dev/icons?i=figma", alt: "Figma Icon" },
        { src: "https://skillicons.dev/icons?i=git", alt: "Git Icon" },
        { src: "https://skillicons.dev/icons?i=github", alt: "GitHub Icon" },
        { src: "https://skillicons.dev/icons?i=postman", alt: "Postman Icon" },
        { src: "https://skillicons.dev/icons?i=vercel", alt: "Vercel Icon" },
        { src: "https://skillicons.dev/icons?i=windows", alt: "Windows Icon" },
        { src: "https://skillicons.dev/icons?i=linux", alt: "Linux Icon" },
        { src: "https://skillicons.dev/icons?i=discord", alt: "Discord Icon" },
        { src: "https://skillicons.dev/icons?i=mysql", alt: "MySQL Icon" },
        { src: "https://skillicons.dev/icons?i=nextjs", alt: "Next.js Icon" },
        { src: "https://skillicons.dev/icons?i=firebase", alt: "Firebase Icon" },
        { src: "https://skillicons.dev/icons?i=figma", alt: "Figma Icon" },
        { src: "https://skillicons.dev/icons?i=git", alt: "Git Icon" },
        { src: "https://skillicons.dev/icons?i=github", alt: "GitHub Icon" },
        { src: "https://skillicons.dev/icons?i=postman", alt: "Postman Icon" },
        { src: "https://skillicons.dev/icons?i=vercel", alt: "Vercel Icon" },
        { src: "https://skillicons.dev/icons?i=windows", alt: "Windows Icon" },
        { src: "https://skillicons.dev/icons?i=linux", alt: "Linux Icon" },
        { src: "https://skillicons.dev/icons?i=discord", alt: "Discord Icon" },
        { src: "https://skillicons.dev/icons?i=mysql", alt: "MySQL Icon" },
        { src: "https://skillicons.dev/icons?i=nextjs", alt: "Next.js Icon" },
        { src: "https://skillicons.dev/icons?i=firebase", alt: "Firebase Icon" },
        { src: "https://skillicons.dev/icons?i=figma", alt: "Figma Icon" },
        { src: "https://skillicons.dev/icons?i=git", alt: "Git Icon" },
        { src: "https://skillicons.dev/icons?i=github", alt: "GitHub Icon" },
        { src: "https://skillicons.dev/icons?i=postman", alt: "Postman Icon" },
        { src: "https://skillicons.dev/icons?i=vercel", alt: "Vercel Icon" },
        { src: "https://skillicons.dev/icons?i=windows", alt: "Windows Icon" },
        { src: "https://skillicons.dev/icons?i=linux", alt: "Linux Icon" },
        { src: "https://skillicons.dev/icons?i=discord", alt: "Discord Icon" },
        { src: "https://skillicons.dev/icons?i=mysql", alt: "MySQL Icon" },
        { src: "https://skillicons.dev/icons?i=nextjs", alt: "Next.js Icon" },
        { src: "https://skillicons.dev/icons?i=firebase", alt: "Firebase Icon" },
        { src: "https://skillicons.dev/icons?i=figma", alt: "Figma Icon" },
        { src: "https://skillicons.dev/icons?i=git", alt: "Git Icon" },
        { src: "https://skillicons.dev/icons?i=github", alt: "GitHub Icon" },
        { src: "https://skillicons.dev/icons?i=postman", alt: "Postman Icon" },
        { src: "https://skillicons.dev/icons?i=vercel", alt: "Vercel Icon" },
        { src: "https://skillicons.dev/icons?i=windows", alt: "Windows Icon" },
        { src: "https://skillicons.dev/icons?i=linux", alt: "Linux Icon" },
        { src: "https://skillicons.dev/icons?i=discord", alt: "Discord Icon" },
        { src: "https://skillicons.dev/icons?i=mysql", alt: "MySQL Icon" },
        { src: "https://skillicons.dev/icons?i=nextjs", alt: "Next.js Icon" },
        { src: "https://skillicons.dev/icons?i=firebase", alt: "Firebase Icon" },
        { src: "https://skillicons.dev/icons?i=figma", alt: "Figma Icon" },
        { src: "https://skillicons.dev/icons?i=git", alt: "Git Icon" },
        { src: "https://skillicons.dev/icons?i=github", alt: "GitHub Icon" },
        { src: "https://skillicons.dev/icons?i=postman", alt: "Postman Icon" },
        { src: "https://skillicons.dev/icons?i=vercel", alt: "Vercel Icon" },
        { src: "https://skillicons.dev/icons?i=windows", alt: "Windows Icon" },
        { src: "https://skillicons.dev/icons?i=linux", alt: "Linux Icon" },
        { src: "https://skillicons.dev/icons?i=discord", alt: "Discord Icon" },
        { src: "https://skillicons.dev/icons?i=mysql", alt: "MySQL Icon" },
        { src: "https://skillicons.dev/icons?i=nextjs", alt: "Next.js Icon" },
        { src: "https://skillicons.dev/icons?i=firebase", alt: "Firebase Icon" },
        { src: "https://skillicons.dev/icons?i=figma", alt: "Figma Icon" },
        { src: "https://skillicons.dev/icons?i=git", alt: "Git Icon" },
        { src: "https://skillicons.dev/icons?i=github", alt: "GitHub Icon" },
        { src: "https://skillicons.dev/icons?i=postman", alt: "Postman Icon" },
        { src: "https://skillicons.dev/icons?i=vercel", alt: "Vercel Icon" },
        { src: "https://skillicons.dev/icons?i=windows", alt: "Windows Icon" },
        { src: "https://skillicons.dev/icons?i=linux", alt: "Linux Icon" },
        { src: "https://skillicons.dev/icons?i=discord", alt: "Discord Icon" },
        { src: "https://skillicons.dev/icons?i=mysql", alt: "MySQL Icon" },
        { src: "https://skillicons.dev/icons?i=nextjs", alt: "Next.js Icon" },
        { src: "https://skillicons.dev/icons?i=firebase", alt: "Firebase Icon" },
        { src: "https://skillicons.dev/icons?i=figma", alt: "Figma Icon" },
        { src: "https://skillicons.dev/icons?i=git", alt: "Git Icon" },
        { src: "https://skillicons.dev/icons?i=github", alt: "GitHub Icon" },
        { src: "https://skillicons.dev/icons?i=postman", alt: "Postman Icon" },
        { src: "https://skillicons.dev/icons?i=vercel", alt: "Vercel Icon" },
        { src: "https://skillicons.dev/icons?i=windows", alt: "Windows Icon" },
        { src: "https://skillicons.dev/icons?i=linux", alt: "Linux Icon" },
        { src: "https://skillicons.dev/icons?i=discord", alt: "Discord Icon" },
        { src: "https://skillicons.dev/icons?i=mysql", alt: "MySQL Icon" },
      ]
    };
  }
};
</script>

<style scoped>
/* Base styles */
.about {
  padding: 0 40px;
  margin-bottom: -60px;
}


.row {
  padding: 20px;
  display: flex;
}

.borderli {
  margin-top: 10px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 10px;
  animation: fadeIn 0.5s ease-in;
}

.location {
  align-items: left;
  color: var(--grey);
}

.location-title {
  color: var(--white);
  font-size: 15px;
  margin-bottom: -20px;
}

.map img {
  height: 200px;
  width: auto;
  margin: auto;
  display: block;
  animation: moving 16s linear infinite;
}

@keyframes moving {
  0% { transform: translateX(0); }
  50% { transform: translateX(20px); }
  100% { transform: translateX(0); }
}

.connect {
  font-size: 18px;
  margin: auto;
  gap: 1rem;
}

.connect ul {
  list-style-type: none;
  padding-left: .5rem;
  padding-right: .5rem;
  gap: 1rem;
}

.connect ul li {
  margin-bottom: 10px;
}

.connect ul li i {
  margin-right: 20px;
}

.connect ul li a {
  color: var(--grey);
  font-size: 15px;
  text-decoration: none;
}

.connect ul li a:hover {
  color: var(--white);
}

/* Tools */
.stacks {
  font-size: 15px;
  color: var(--white);
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

svg {
  margin: 10px;
  color: var(--white);
}

.flex-col {
  flex-direction: column;
}

.overflow-hidden {
  overflow: hidden;
}

.hours {
  font-size: 40px;
  padding: 33px 25px;
  font-weight: 600;
  color: var(--white);
}

.text-sm {
  font-size: 14px;
}

.font-light {
  font-weight: 300;
  color: var(--white);
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.icon-marquee {
  width: 100%;
  overflow: hidden;
  background-color: transparent;
  padding: 10px 0;
}

.size-10 {
  width: 40px;
  height: 40px;
}

.icon {
  width: 50px;
  height: 50px;
  margin: 0 5px;
}

.first-marquee-container {
  animation: moveLeftToRight 1000s linear infinite;
}

.second-marquee-container {
  animation: moveRightToLeft 1000s linear infinite;
}

@keyframes moveLeftToRight {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes moveRightToLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Responsive adjustments */
@media screen and (max-width: 992px) {
  .about {
    padding: 0 20px;
  }
  .location {
    text-align: center;
  }
  .map img {
    width: 100%;
    height: auto;
  }
}

@media screen and (max-width: 768px) {
  .borderli {
    padding: 10px;
  }
  .connect {
    font-size: 16px;
  }
}

@media screen and (max-width: 576px) {
  .hours {
    font-size: 40px;
  }

}

.custom-btn {
  margin-top: -30px;
}
</style>
