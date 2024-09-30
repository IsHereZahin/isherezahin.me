<template>
    <section id="blog">
        <div class="container">
            <div class="row flex-column-reverse flex-md-row justify-content-between gap-4">
                <h1 class="headline">Latest Blog</h1>
            </div>
            <div class="row blog-posts">
                <div class="container">
                    <div class="row gy-4">
                        <div class="col-md-6 col-lg-4" v-for="blog in blogs" :key="blog.id">
                            <div class="post-entry" data-aos-delay="100">
                                <a href="#" class="thumb d-block">
                                    <img :src="blog.image" alt="Blog" class="img-fluid rounded">
                                </a>
                                <div class="post-content">
                                    <div class="meta">
                                        <a href="#" class="cat">{{ blog.type }}</a> •
                                        <span class="date">{{ blog.date }}</span>
                                    </div>
                                    <h3>
                                        <a :href="blog.link" target="blank">{{ truncate(blog.title, 50) }}</a>
                                    </h3>
                                    <p>{{ truncate(blog.excerpt, 100) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="custom-btn">
                    <RouterLink to="/blog" class="custom-button">See all blog</RouterLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import blogImage1 from '../../assets/img/blog/blog1.jpg';
import blogImage2 from '../../assets/img/blog/blog2.jpg';
import blogImage3 from '../../assets/img/blog/blog3.jpg';

export default {
    name: 'BlogSection',
    data() {
        return {
            blogs: [
                {
                    id: 1,
                    date: 'August 17, 2024',
                    title: 'Anti-discrimination Students Movement',
                    excerpt: 'The Anti-discrimination Students Movement is a student organization in Bangladesh that was formed during the 2024 Bangladesh quota reform movement. The group led the movement advocating for anti-discrimination policies.',
                    image: blogImage1,
                    link: '/bd-anti-discrimination-student-movement',
                    type: 'Article',
                    categories: ['Movement', 'Students', 'power', 'Article'],
                },
                {
                    id: 2,
                    date: 'March 26, 2024',
                    title: 'Mastering Laravel & Vue.js',
                    excerpt: 'The web development landscape is constantly evolving, and developers need to adapt to stay ahead of the curve. Two powerful frameworks, Laravel (backend) and Vue.js (frontend), have emerged as popular choices for building dynamic and interactive web applications. Mastering this combination can significantly enhance your full-stack development skills and open doors to exciting job opportunities.',
                    image: blogImage2,
                    link: 'https://www.linkedin.com/pulse/how-unlock-your-web-development-superpowers-mastering-abu-zahin-sycic/',
                    type: 'Article',
                    categories: ['laravel', 'Vue', 'Article'],
                },
                {
                    id: 3,
                    date: 'May 10, 2024',
                    title: "A Beginner's Guide to Laravel Project Testing",
                    excerpt: 'As a budding Laravel developer, diving into the world of testing might seem daunting. But fear not! Robust testing practices are the cornerstone of any successful Laravel project, and this guide will equip you with the essentials to get started.',
                    image: blogImage3,
                    link: 'https://www.linkedin.com/pulse/beginners-guide-laravel-project-testing-zahin--m31sc/',
                    type: 'Article',
                    categories: ['testing', 'Article'],
                },
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
.blog-posts .post-entry .thumb {
  margin-bottom: 20px;
}

.blog-posts .post-entry .thumb img {
  transition: 0.3s all ease;
}

.blog-posts .post-entry .thumb:hover img {
  opacity: 0.8;
}

.blog-posts .post-entry .meta {
  font-size: 12px;
  margin-bottom: 20px;
}

.blog-posts .post-entry .meta .cat {
  text-transform: uppercase;
  font-weight: normal;
  color: var(--color-text);
}

.blog-posts .post-entry .meta .date {
  color: color-mix(in srgb, var(--color-text), transparent 25%);
}

.blog-posts .post-entry .post-content {
  padding-left: 30px;
  padding-right: 30px;
}

.blog-posts .post-entry .post-content h3 {
  font-size: 18px;
  line-height: 1.2;
}

.blog-posts .post-entry .post-content h3 a {
  color: var(--color-text);
}

.blog-posts .post-entry .post-content h3 a:hover {
  color: var(--color-border-hover);
}

.blog-posts .post-entry .post-content p{
  font-size: 15px;
  color: var(--color-background-soft);
  padding-left: 5px;
  padding-right: 5px;
}
</style>
