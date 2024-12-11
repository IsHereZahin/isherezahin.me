<template>
    <section id="project">
      <div class="container">
        <div class="row flex-column-reverse flex-md-row justify-content-between gap-4">
            <h1 class="headline">Latest Project</h1>
        </div>
        <div class="row">
          <div class="col-md-6" v-for="project in projects" :key="project.id">
            <div class="container mt-5">
              <div class="row flex-column-reverse flex-md-row justify-content-between gap-4">
                <div class="col-12">
                    <div class="visit">
                        <div class="project-card">
                            <div class="project-card__background">
                            <div class="card__background--wrapper">
                                <div class="card__background--main" :style="{ backgroundImage: `url(${project.image})` }">
                                </div>
                            </div>
                            </div>
                            <div class="project-card__info">
                              <a :href="project.link" target="_blank">
                                <h2 class="white-head">{{ truncate(project.title, 50) }}</h2>
                              </a>
                              <span class="white-head mb-2">{{project.date}}</span>                            
                              <p>{{ truncate(project.excerpt, 100) }}</p>
                              <p>
                                <span class="language">
                                  <span v-for="language in project.categories" :key="language" class="mt-2">{{ language }}</span>
                                </span>
                              </p>
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
            <RouterLink to="/project" class="custom-button">See all projects</RouterLink>
          </div>
        </div>
      </div>
    </section>
</template>

<script>
import appImage1 from '../../assets/img/project/project-4.jpg';
import appImage2 from '../../assets/img/project/project2.jpg';

export default {
  name: 'projectSection',
  data() {
    return {
      projects: [
      {
          id: 4,
          date: 'Mar 19, 2024 - In Progress',
          title: 'Multi-Vendor E-Com Platform',
          excerpt: "This multi-vendor e-commerce platform allows vendors to efficiently manage and sell products in a unified online marketplace.",
          image: appImage1,
          link: 'https://github.com/IsHereZahin/Multi-Vendor-Ecommerce-Application',
          categories: ['Laravel', 'E-Commerce'],
          tags: ['E-Commerce', 'Laravel', 'Multi-Vendor', 'Marketplace', 'Web Application']
        },
        {
          id: 2,
          date: 'October 7, 2023',
          title: 'E-commerce website',
          excerpt: "I enjoy working on e-commerce websites; this is my favorite project too.",
          image: appImage2,
          link: 'https://food-e-commerce-v1.netlify.app/',
          categories: ['Website', 'UI/UX'],
          type: ['ui', 'ux', 'e-commerce']
        }
      ]
    };
  },
  methods: {
    truncate(text, length) {
      return text.length > length ? text.substring(0, length) + '...' : text;
    }
  }
};
</script>

<style scoped>
#project {
  padding: 50px 0;
}

.project-card {
  padding: 30px;
  position: relative;
  border: 1px solid var(--border);
  transition: 300ms ease-in-out;
  border-radius: 10px;
  margin-top: -50px;
}
.project-card:hover 
.btn--with-icon i {
  background: var(--text);
}
.project-card {
  position: relative;
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.project-card__background {
  position: relative;
  overflow: hidden;
  padding: 20px 20px 20px 20px;
}

.card__background--main {
  background-size: cover;
  background-position: center;
  height: 300px;
  border-radius: 20px;
  transition: transform 0.5s ease; /* Hover animation duration */
}

.project-card:hover .card__background--main {
  transform: scale(1.2); /* Scale up on hover */
}

.project-card__info {
  background-color: var(--color-bg);
  padding: 20px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.project-card__info h2 {
  font-weight: 600;
  color: var(--text);
  margin-bottom: 10px;
}

.project-card__info p {
  color: var(--text);
  line-height: 1.6;
}

.language {
  display: inline-block;
  cursor: pointer;
}

.language span {
  font-size: 1rem;
  display: inline-block;
  color: var(--white);
  border: 1px solid transparent;
  background-color: var(--border);
  padding: .5rem 1rem;
  margin-right: 5px;
  border-radius: 50px;
  transition: background-color 0.3s ease;
}

.language span:hover {
  border: 1px solid var(--text);
  background-color: var(--blackly);
}
  
@media (max-width: 768px) {
  .project-card__info {
    padding: 0px;
  }
  .project-card {
    padding: 10px;
    margin-top: 3px;
  }
}
</style>
  