import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('../views/ServicesView.vue')
  },
  {
    path: '/article',
    name: 'article',
    component: () => import('../views/ArticleView.vue')
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/BlogContent.vue')
  },
  {
    path: '/project',
    name: 'project',
    component: () => import('../views/ProjectContent.vue')
  },
  {
    path: '/guestbook',
    name: 'guestbook',
    component: () => import('../views/GuestBookView.vue')
  },
  {
    path: '/testimonial',
    name: 'testimonial',
    component: () => import('../views/TestimonialView.vue')
  },
  {
    path: '/uses',
    name: 'uses',
    component: () => import('../views/UsesView.vue')
  },
  {
    path: '/design',
    name: 'design',
    component: () => import('../views/DesignView.vue')
  },
  {
    path: '/bd-anti-discrimination-student-movement',
    name: 'bd-anti-discrimination-student-movement',
    component: () => import('../views/MovementView.vue')
  },
  {
    path: '/bd-movement-media',
    name: 'bd-movement-media',
    component: () => import('../views/MovementMediaView.vue')
  },
  {
    // Catch-all 404 - this will match any route not defined above
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('../views/404View.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Scroll to top when navigating to a new route
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  const footer = document.querySelector('#footer');

  if (to.name === '404') {
    if (footer) footer.style.display = 'none';
  } else {
    if (footer) footer.style.display = 'block';
  }

  next();
});

export default router;
