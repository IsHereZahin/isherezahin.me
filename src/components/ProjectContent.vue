<template>
  <section id="project" style="margin-top: 70px">
    <div class="container">
      <!-- Page Head -->
      <div class="row page-head gap-2">
        <h1 class="white-head fw-bold text-green-800">Project</h1>
        <p>The list of my projects. Everything was made with <span style="color: var(--rad);">❤️</span>.</p>
      </div>
      <img src="../assets/img/home/about-shape-3.svg" loading="lazy" alt="" class="shape shape-3">
      <!-- Search and Filters -->
      <div class="row filters mt-4">
        <div class="col-md-9">
          <p>{{ filteredProjects.length }} out of {{ projects.length }} projects displayed</p>
        </div>
        <div class="col-md-3">
          <div class="text-end input-group custom-input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input type="text"
                  v-model="searchQuery"
                  placeholder="Search project"
                  class="form-control"
                  data-bs-toggle="tooltip"
                  title="Search by title, category, type, date, month..."
                  data-bs-placement="bottom" />
          </div>
        </div>
      </div>

      <!-- Project Cards -->
      <div class="row">
        <div class="col-md-6 mt-4" v-for="project in paginatedProjects" :key="project.id">
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
                            <span v-for="language in project.categories" :key="language">{{ language }}</span>
                          </span>
                        </p>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Not Found Message -->
        <div v-if="filteredProjects.length === 0" class="col-12 text-center mt-5">
          <p><span style="color: var(--rad);">{{ searchQuery }}</span> not found.</p>
        </div>
      </div>

      <!-- Pagination Section -->
      <div class="row" v-if="filteredProjects.length > 0">
        <div class="page-pagination">
          <button :disabled="currentPage === 1" @click="currentPage--" class="pagination-btn">Previous</button>
          <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
          <span class="pagination-select">
            <select v-model="projectsPerPage" class="form-control">
              <option :value="5">5 per page</option>
              <option :value="10">10 per page</option>
              <option :value="20">20 per page</option>
            </select>
          </span>
          <button :disabled="currentPage === totalPages" @click="currentPage++" class="pagination-btn">Next</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import appImage1 from '../assets/img/project/project1.jpg';
import appImage2 from '../assets/img/project/project2.jpg';
import image3 from '../assets/img/project/project-3.jpg';
import image4 from '../assets/img/project/project-4.jpg';
import image5 from '../assets/img/project/project-5.jpg';
import image6 from '../assets/img/project/project-6.jpg';

export default {
  name: 'ProjectSection',
  data() {
    return {
      projects: [
        {
          id: 1,
          date: 'April 23, 2024',
          title: 'Git Analyzer',
          excerpt: 'This application helps you Discover the value your Github code brings to the world.',
          image: appImage1,
          link: 'https://git-analyzer.netlify.app/',
          categories: ['Vue', 'Github'],
          tags: ['software', 'git']
        },
        {
          id: 2,
          date: 'October 7, 2023',
          title: 'E-commerce website',
          excerpt: "I enjoy working on e-commerce websites; this is my favorite project too.",
          image: appImage2,
          link: 'https://food-e-commerce-v1.netlify.app/',
          categories: ['Website', 'UI/UX'],
          tags: ['ui', 'ux', 'e-commerce']
        },
        {
          id: 3,
          date: 'Jun 7, 2024',
          title: 'Food E-Commerce UI',
          excerpt: "Crafted a seamless and intuitive UI/UX for a food e-commerce service, prioritizing user experience and visual appeal through Figma.",
          image: image3,
          link: 'https://www.figma.com/proto/ANTQk9PrZb2LYm2eRZ0qEZ/FOOD-CO?node-id=32-2&node-type=frame&t=FSHaCu0HiJvstuuc-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1',
          categories: ['Figma', 'UI/UX'],
          tags: ['ui', 'ux', 'e-commerce']
        },
        {
          id: 4,
          date: 'Mar 19, 2024 - In Progress',
          title: 'Multi-Vendor E-Com Platform',
          excerpt: "This multi-vendor e-commerce platform allows vendors to efficiently manage and sell products in a unified online marketplace.",
          image: image4,
          link: 'https://github.com/IsHereZahin/Multi-Vendor-Ecommerce-Application',
          categories: ['Laravel', 'E-Commerce'],
          tags: ['E-Commerce', 'Laravel', 'Multi-Vendor', 'Marketplace', 'Web Application']
        },
        {
          id: 5,
          date: 'Oct 30, 2023',
          title: 'Mentor Website',
          excerpt: "Built a dynamic website for an educational institute with Laravel 10, providing seamless content management.",
          image: image5,
          link: 'https://github.com/IsHereZahin/Mentor-app',
          categories: ['Laravel', 'Web Development'],
          tags: ['Laravel', 'Web Application', 'Dynamic Website', 'PHP', 'Education Technology']
        },
        {
          id: 6,
          date: 'Dec 17, 2023',
          title: 'Personal Portfolio Website',
          excerpt: "Developed a personal portfolio using Laravel 10, with an integrated admin backend for content management.",
          image: image6,
          link: 'https://github.com/IsHereZahin/Protfolio-App',
          categories: ['Portfolio', 'Laravel'],
          tags: ['Laravel', 'Portfolio Website', 'Personal Branding', 'Web Application', 'Admin Panel']
        },
      ],
      searchQuery: '',
      currentPage: 1,
      projectsPerPage: 10
    };
  },
  computed: {
    filteredProjects() {
      if (!this.searchQuery.trim()) {
        return this.sortProjects([...this.projects]); // Return all projects if searchQuery is empty
      }
      const keywords = this.searchQuery.toLowerCase().trim().split(' ');
      const filtered = this.projects.filter(project => {
        return keywords.every(keyword => {
          const titleMatch = project.title.toLowerCase().includes(keyword);
          const categoryMatch = project.categories.some(category => category.toLowerCase().includes(keyword));
          const dateMatch = project.date.toLowerCase().includes(keyword);
          const tagMatch = project.tags.some(tag => tag.toLowerCase().includes(keyword));
          return titleMatch || categoryMatch || dateMatch || tagMatch;
        });
      });
      return this.sortProjects(filtered); // Return sorted filtered projects
    },
    paginatedProjects() {
      const start = (this.currentPage - 1) * this.projectsPerPage;
      const end = this.currentPage * this.projectsPerPage;
      return this.filteredProjects.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProjects.length / this.projectsPerPage);
    }
  },
  methods: {
    truncate(text, length) {
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
    // Sorting function to prioritize "In Progress" projects and then sort by date in descending order
    sortProjects(projects) {
      return projects.sort((a, b) => {
        // Prioritize "In Progress" projects
        if (a.date.includes('In Progress') && !b.date.includes('In Progress')) return -1;
        if (!a.date.includes('In Progress') && b.date.includes('In Progress')) return 1;

        // Otherwise, sort by date (latest first)
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
    }
  }
};
</script>

<style scoped>
.page-headline {
  text-align: left;
  color: var(--text);
}
.page-head {
  border-bottom: 1px solid var(--border);
}
.custom-input-group {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 5px;
  width: 100%;
  transition: border-color 0.3s;
}

.custom-input-group:focus-within {
  border-color: var(--theme);
}

.custom-input-group .input-group-text {
  border: none; 
  padding: 10px 15px;
  background: transparent;
  color: var(--text);
}

.custom-input-group .input-group-text i {
  color: var(--text);
}

.custom-input-group .form-control {
  border: none;
  padding: 10px 15px;
  outline: none;
  color: var(--text);
  background: transparent;
  flex: 1;
}

.custom-input-group .form-control::placeholder {
  color: var(--grey);
}

@media (max-width: 575px) {
  .custom-input-group {
    width: 100%;
  }
}
.date__box {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text);
  border: 4px solid var(--text);
  font-weight: bold;
  padding: 5px 10px;
}
.date__day {
  font-size: 22px;
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
  color: var(--grey);
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
  border: 1px solid var(--grey);
  background-color: var(--blackly);
}
  
@media (max-width: 768px) {
  .project-card__info {
    padding: 15px;
  }
}
.page-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px;
  background: var(--color-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-btn {
  background: var(--color-bg);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}

.pagination-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--theme);
  color: var(--text);
}

.pagination-info {
  font-size: 0.9em;
  color: var(--grey);
}

.pagination-select .form-control {
  border: none;
  padding: 5px 10px;
  background: transparent;
  color: var(--grey);
}

.pagination-select .form-control option {
  background: var(--color-bg);
  color: var(--text);
}

@media (max-width: 575px) {
  .pagination-info {
    display: none;
  }
}
</style>
