<template>
    <section id="testimonials">
        <div class="row justify-content-center">
          <h1 class="headline">Latest Testimonials</h1>
        </div>
  
        <div class="testimonials">
          <div class="testimonial" v-for="(testimonial, index) in testimonials" :key="index">
            <img :src="testimonial.img" alt="testimonial" class="testimonial-img" />
            <p class="testimonial-text">{{ testimonial.text }}</p>
  
            <div class="testimonial-footer">
              <h3 class="testimonial-name">
                <a :href="testimonial.link" target="_blank">{{ testimonial.name }}</a>
              </h3>
              <p class="testimonial-designation">{{ testimonial.designation }}</p>
            </div>
          </div>
        </div>
  
        <div class="row justify-content-center" style="margin-top: -30px;">
          <div class="custom-btn">
            <RouterLink to="/testimonial" class="custom-button">See all testimonials</RouterLink>
          </div>
        </div>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        testimonials: [
          {
            img: "https://avatars.githubusercontent.com/u/135975917?v=4",
            text: "Zahin excels in Figma design and software testing, ensuring that every aspect of the product is user-friendly and visually appealing. His meticulous attention to detail and thorough testing processes guarantee high-quality results. Collaborating with him enhances project outcomes and fosters a culture of excellence.",
            name: "Tawsif Tamim",
            designation: "UI/UX Designer, Iconic Solutions (Pvt.) Ltd",
            link: "https://github.com/developer-tamim"
          },
          {
            img: "https://avatars.githubusercontent.com/u/148049184?v=4",
            text: "I am impressed by Zahin's adaptability and problem-solving skills. He approaches each project with a fresh perspective, quickly mastering new technologies. His passion for learning and sharing insights fosters an innovative work environment, making him a standout team member.",
            name: "Putul Sen Tongchangya",
            designation: "Full-Stack Laravel Developer",
            link: "https://github.com/developerputul"
          },
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  .testimonials {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
  }

  .testimonial {
    text-align: center;
    background-color: var(--color-bg);
    color: var(--color-text);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid var(--border);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .testimonial:hover {
    transform: translateY(-5px);
  }

  .testimonial-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto 10px auto;
    border: 2px solid var(--theme);
  }

  .testimonial-text {
    font-size: 16px;
    color: var(--grey);
    margin-bottom: 10px;
  }

  .testimonial-name {
    font-size: 1.2em;
    font-weight: bold;
    color: var(--white);
  }

  .testimonial-name a {
    text-decoration: none;
    color: inherit;
  }

  .testimonial-footer {
    margin-top: auto;
    padding-top: 15px;
  }

  .testimonial-designation {
    font-size: 0.9em;
    color: var(--grey);
  }

  .testimonial:hover .testimonial-name {
    color: var(--theme);
  }

  @media (max-width: 768px) {
    .testimonial-text {
      font-size: 14px;
    }

    .testimonial-name {
      font-size: 1.1em;
    }

    .testimonial-img {
      width: 80px;
      height: 80px;
    }
  }
</style>