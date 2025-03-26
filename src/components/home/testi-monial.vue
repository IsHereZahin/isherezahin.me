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
          text: "It’s been a true pleasure working alongside Zahin. As a Junior SQA, he consistently brings a keen eye for quality and a proactive approach to every project. His adaptability and strong work ethic, combined with his willingness to help others, make him a reliable team member. I’ve seen his growth firsthand and am excited to see how he continues to evolve in his role.",
          name: "Tawsif Tamim",
          designation: "UI/UX Designer, Iconic Solutions (Pvt.) Ltd",
          link: "https://github.com/developer-tamim"
        },
        {
          img: "https://avatars.githubusercontent.com/u/107980740?v=4",
          text: "Zahin is not only a talented developer, but also a fantastic individual to work with. His passion for coding is evident in everything he does, and he’s always eager to help others when needed. His positive attitude and strong work ethic make him a joy to collaborate with, and I’ve had the pleasure of watching him grow into an even better developer over time.",
          name: "Salman Faruk",
          designation: "BSc CSE Student, East Delta University",
          link: "https://github.com/sfsalmanfaruk"
        },
        {
          img: "https://avatars.githubusercontent.com/u/148049184?v=4",
          text: "Working alongside Zahin during my internship has been an incredibly valuable experience. He is a skilled and knowledgeable developer who is always willing to lend a helping hand. His patience and collaborative spirit make him an excellent mentor, and I’ve learned a great deal from his guidance. I truly appreciate his support throughout my learning journey.",
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