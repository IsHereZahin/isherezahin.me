<template>
    <section class="testimonials-section">
        <div class="title">
            <p class="subtitle">SUCCESS STORIES</p>
            <h2>Words from Our Clients</h2>
        </div>
        <div class="testimonials-grid">
            <div
                class="testimonial-card"
                v-for="(testimonial, index) in testimonials"
                :key="index"
            >
                <p class="testimonial-text">{{ testimonial.text }}</p>
                <div class="testimonial-author">
                    <img :src="testimonial.img" :alt="testimonial.author" class="testimonial-img" />
                    <div>
                        <strong>{{ testimonial.author }}</strong><br />
                        <span class="author-title">{{ testimonial.title }}</span>
                    </div>
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
                    text: "I absolutely valued working with Strakzat. The team is complementary and critical to our success. Their professionalism is unparalleled.",
                    author: "Martijn Bovée",
                    title: "Manager at auto.nl",
                    img: "https://via.placeholder.com/40",
                },
                {
                    text: "Working with the team has transformed our business strategies. Their insights and dedication have proven invaluable.",
                    author: "Rients Hoeksema",
                    title: "Growth Hacker at De Kweker",
                    img: "https://via.placeholder.com/40",
                },
                {
                    text: "An exceptional experience from start to finish. Their expertise has significantly contributed to our project’s success.",
                    author: "Anna Johnson",
                    title: "CEO at Tech Innovations",
                    img: "https://via.placeholder.com/40",
                },
                {
                    text: "Professional, responsive, and highly skilled. I can't recommend their services enough.",
                    author: "David Smith",
                    title: "Product Manager at Global Tech",
                    img: "https://via.placeholder.com/40",
                },
                {
                    text: "I absolutely valued working with Strakzat. The team is complementary and critical to our success. Their professionalism is unparalleled.",
                    author: "Martijn Bovée",
                    title: "Manager at auto.nl",
                    img: "https://via.placeholder.com/40",
                },
                {
                    text: "Working with the team has transformed our business strategies. Their insights and dedication have proven invaluable.",
                    author: "Rients Hoeksema",
                    title: "Growth Hacker at De Kweker",
                    img: "https://via.placeholder.com/40",
                },
                {
                    text: "An exceptional experience from start to finish. Their expertise has significantly contributed to our project’s success.",
                    author: "Anna Johnson",
                    title: "CEO at Tech Innovations",
                    img: "https://via.placeholder.com/40",
                },
                {
                    text: "Professional, responsive, and highly skilled. I can't recommend their services enough.",
                    author: "David Smith",
                    title: "Product Manager at Global Tech",
                    img: "https://via.placeholder.com/40",
                },
                // More testimonials...
            ],
        };
    },
};
</script>

<style scoped>
.testimonials-section {
    color: #fff;
    padding: 50px 20px;
}

.title {
    text-align: center;
    margin-bottom: 40px;
}

.subtitle {
    color: #222425;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 2px;
    font-weight: bold; /* Added for emphasis */
}

h2 {
    font-size: 2.5rem;
    color: white;
}

.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-auto-rows: auto;
    gap: 20px;
}

.testimonial-card {
    background-color: #1c212b;
    padding: 32px;
    color: #adb3c1;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* Enhanced shadow */
    transition: transform 0.3s, box-shadow 0.3s; /* Added box-shadow transition */
    align-content: flex-start;
    align-items: flex-start;
    border-radius: 24px;
    display: flex;
    flex: none;
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 16px;
    height: auto;
    justify-content: flex-start;
    overflow: visible;
    padding: 32px;
    position: relative;
    width: 100%;
}

.testimonial-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4); /* Shadow on hover */
}

.testimonial-text {
    margin-bottom: 20px;
    font-size: 1rem; /* Increased font size for readability */
    line-height: 1.6;
    color: #cfcfcf;
    flex-grow: 1; /* Allow text to grow and take space */
}

.testimonial-author {
    display: flex;
    align-items: center;
}

.testimonial-img {
    width: 50px; /* Increased image size for better visibility */
    height: 50px;
    border-radius: 50%;
    margin-right: 15px; /* Increased margin for spacing */
    object-fit: cover;
}

.testimonial-author strong {
    font-size: 1.1rem; /* Increased font size */
    color: white;
}

.author-title {
    font-size: 0.9rem; /* Increased font size */
    color: #4f6182;
}
</style>
