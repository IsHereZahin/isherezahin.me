<template>
    <section id="testimonials">
      <div class="container">
        <div class="row flex-column-reverse flex-md-row justify-content-between gap-4">
          <h1 class="headline">Latest Testimonials</h1>
        </div>
  
        <div class="testimonial-slider">
          <div class="testimonial" v-for="(testimonial, index) in testimonials" :key="index">
            <img :src="testimonial.img" alt="testimonial" class="testimonial-img" />
            <p class="testimonial-text">{{ testimonial.text }}</p>
            <h3 class="testimonial-name">
              <a :href="testimonial.link" target="_blank">{{ testimonial.name }}</a>
            </h3>
            <p class="testimonial-designation">{{ testimonial.designation }}</p>
          </div>
        </div>

        <div class="row">
          <div class="custom-btn">
            <RouterLink to="/project" class="custom-button">See all testimonials</RouterLink>
          </div>
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
          img: "https://media.licdn.com/dms/image/v2/D5603AQFrBLZl3QYUVg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1664544255834?e=1733961600&v=beta&t=o2DtKXZCZ9XtwFhnftkPBCv5NjFGWMjcKR2mDK0iDhs",
          text: "I highly recommend Zahin for his outstanding quality assurance. He approaches challenges creatively and is always looking for effective solutions. Zahin's friendly nature and active involvement make a pleasure to work with him. His dedication to quality and collaboration truly sets him apart. Any organization would be happy to have him!",
          name: "Md. Najib Islam",
          designation: "Senior Full Stack Developer, Iconic Solutions (Pvt.) Ltd",
          link: "https://github.com/developernajib"
        },
        {
          img: "https://scontent.fdac5-1.fna.fbcdn.net/v/t39.30808-6/310999414_2040491229674452_112112446647755116_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=05_MyzxPXIoQ7kNvgEzJC2k&_nc_ht=scontent.fdac5-1.fna&_nc_gid=AVW1Ev5XSHUJZX-QoPrpjed&oh=00_AYCFuQDum-NrAzE1Wpyt3Ihf_wVKvxKPP78d-NcTv00lsQ&oe=670AC29F",
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
  .testimonial-slider {
    display: flex;
    overflow-x: auto;
    padding: 20px;
    border-radius: 10px;
    gap: 15px;
    scroll-snap-type: x mandatory;
  }
  
  .testimonial {
    min-width: 300px;
    text-align: center;
    color: var(--color-text);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid var(--border);    
    transition: transform 0.3s;
    scroll-snap-align: center;
  }
  
  .testimonial:hover {
    transform: scale(1.05);
  }
  
  .testimonial-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
    border: 2px solid var(--theme);
  }
  
  .testimonial-text {
    font-size: 15px;
    margin: 10px 0;
    color: var(--grey);
  }
  
  .testimonial-name {
    font-size: 1.2em;
    font-weight: bold;
    color: var(--white);
  }
  
  .testimonial-designation {
    font-size: 0.9em;
    color: var(--grey);
  }
  
  /* Ensure responsiveness */
  @media (max-width: 768px) {
    .testimonial-slider {
      flex-direction: column;
      align-items: center;
    }
  
    .testimonial {
      margin: 15px 0;
      max-width: 90%;
      width: 100%;
    }
  }
  
  @media (max-width: 576px) {
    .testimonial-slider {
      padding: 10px;
    }
  
    .testimonial {
      padding: 10px;
    }
  
    .testimonial-text {
      font-size: 1em;
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