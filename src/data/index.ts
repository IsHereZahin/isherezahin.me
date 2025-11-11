import { TestimonialType } from "@/components/Testimonial";
import { ThemeColor } from "@/utils";

export interface WorkExperienceItemProps {
    start: string;
    end?: string;
    title: string;
    company: string;
    companyUrl: string;
    location: string;
    type: string;
    description: string;
    highlights: { text: string }[];
    logo: string;
}

export const workExperience: WorkExperienceItemProps[] = [
    {
        start: "Sep 2023",
        end: "Present",
        title: "Frontend Developer & SQA",
        company: "Iconic Solutions (Pvt) Ltd",
        companyUrl: "http://www.iconicsolutionsbd.com",
        location: "Chittagong, BD",
        type: "On Site",
        logo: "/assets/images/iconic.png",
        description:
            "Progressed from Web Developer Intern to Software Quality Assurance Engineer, and now Frontend Developer, contributing to SaaS applications and real-world projects by combining development and testing expertise.",
        highlights: [
            {
                text: "Developed responsive frontend interfaces using React.js, Next.js, Vue.js, and integrated APIs via Postman and Inertia.js.",
            },
            {
                text: "Collaborated with backend teams on Laravel for API development, CRUD operations, and feature integration.",
            },
            {
                text: "Performed manual and automated testing using Postman, Puppeteer, Selenium, and Pest.",
            },
            {
                text: "Reviewed and enhanced UI/UX in Figma to improve user experience across platforms.",
            },
            {
                text: "Built dynamic web projects during internship, practiced API integration, responsive design, and version control (Git).",
            },
            {
                text: "Contributed to deploying production-ready SaaS applications and gained full-stack development experience.",
            },
        ]
    }
];

const currentStatus: { text: string }[] = [
    {
        text: "Currently employed as a Frontend Developer and SQA at (Iconic)[http://www.iconicsolutionsbd.com], working on a File Manager web application.",
    },
    {
        text: "Also contributing to the frontend of a SaaS platform at (Iconic)[http://www.iconicsolutionsbd.com] designed for real estate appraisers, making it simple and user-friendly.",
    },
    {
        text: "Continuously researching and learning new technologies to stay up-to-date.",
    },
    {
        text: "I also love playing badminton and doing home workouts for fitness.",
    }
]

const projects = [
        {
        id: 1,
        date: "April 15, 2025",
        title: "RefrigiX-Global",
        slug: "refrigix-global",
        status: true,
        shortDescription: "RefrigiX Global is a modern brand shop website built with Laravel 12, Vue 3, and Inertia.js. It offers a seamless shopping experience for customers and a robust admin dashboard.",
        image: "https://res.cloudinary.com/dsh30sjju/image/upload/v1760462239/project-9_hq4kuy.png",
        url: "https://github.com/IsHereZahin",
        categories: "Full-Stack Development",
        tags: ["Laravel", "Vue.js", "Inertia.js", "Web Application"],
    },
    {
        id: 2,
        date: "October 7, 2023",
        title: "E-commerce website",
        slug: "e-commerce-website",
        status: true,
        shortDescription: "I enjoy working on e-commerce websites; this is my favorite project too.",
        image: "https://res.cloudinary.com/dsh30sjju/image/upload/v1760462238/project2_v10n3q.png",
        url: "https://food-e-commerce-v1.netlify.app/",
        categories: "UI/UX Design",
        tags: ["ui", "ux", "e-commerce"],
    },
    {
        id: 3,
        date: "Jun 7, 2024",
        title: "Food E-Commerce UI",
        slug: "food-e-commerce-ui",
        status: true,
        shortDescription: "Crafted a seamless and intuitive UI/UX for a food e-commerce service, prioritizing user experience and visual appeal through Figma.",
        image: "https://res.cloudinary.com/dsh30sjju/image/upload/v1760462236/project-3_auobs5.jpg",
        url: "https://www.figma.com/proto/ANTQk9PrZb2LYm2eRZ0qEZ/FOOD-CO?node-id=32-2&node-type=frame&t=FSHaCu0HiJvstuuc-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1",
        categories: "UI/UX Design",
        tags: ["ui", "ux", "e-commerce"],
    },
    {
        id: 4,
        date: "January 10, 2025",
        title: "Multi-Vendor E-Com Platform",
        slug: "multi-vendor-e-com-platform",
        status: true,
        shortDescription: "This multi-vendor e-commerce platform allows vendors to efficiently manage and sell products in a unified online marketplace.",
        image: "https://res.cloudinary.com/dsh30sjju/image/upload/v1760462236/project-4_jbr1ev.jpg",
        url: "https://github.com/IsHereZahin/Multi-Vendor-Ecommerce-Application",
        categories: "Full-Stack Development",
        tags: [
            "E-Commerce",
            "Laravel",
            "Multi-Vendor",
            "Marketplace",
            "Web Application",
        ],
    },
    {
        id: 7,
        date: "January 27, 2025",
        title: "Simple Ride Share App",
        slug: "simple-ride-share-app",
        status: false,
        shortDescription: "A simple ride-sharing application built with Laravel and Vue.js, currently in progress.",
        image: "https://res.cloudinary.com/dsh30sjju/image/upload/v1760462236/project-7_qa3e0h.png",
        url: "https://github.com/IsHereZahin/Ride-Share-App",
        categories: "Full-Stack Development",
        tags: ["Laravel", "Web Application"],
    },
    {
        id: 8,
        date: "Dec 12, 2024",
        title: "Testing Management System",
        slug: "testing-management-system",
        status: true,
        shortDescription: "A testing management tool to organize test steps, manage projects, and export data in Excel or CSV.",
        image: "https://res.cloudinary.com/dsh30sjju/image/upload/v1760462237/project-8_o1e2zp.png",
        url: "https://github.com/IsHereZahin/testing-management-system",
        categories: "Full-Stack Development",
        tags: ["Laravel", "Web Application"],
    },
];

// Note: If you add a new theme, don't forget to also add it to the `globals.css` file.
const availableThemes: ThemeColor[] = [ 
    { name: "violet", lightPrimary: "#8B5CF6", darkPrimary: "#A78BFA", lightPrimaryRgb: "139,92,246", darkPrimaryRgb: "167,139,250", textColorClass: "text-violet-500 dark:text-violet-400" },
    { name: "teal", lightPrimary: "#14B8A6", darkPrimary: "#5EEAD4", lightPrimaryRgb: "20,184,166", darkPrimaryRgb: "94,234,212", textColorClass: "text-teal-500 dark:text-teal-400" },
    { name: "orange", lightPrimary: "#F97316", darkPrimary: "#FDBA74", lightPrimaryRgb: "249,115,22", darkPrimaryRgb: "253,186,116", textColorClass: "text-orange-500 dark:text-orange-400" },
    { name: "red", lightPrimary: "#EF4444", darkPrimary: "#FCA5A5", lightPrimaryRgb: "239,68,68", darkPrimaryRgb: "252,165,165", textColorClass: "text-red-500 dark:text-red-400" },
    { name: "blue", lightPrimary: "#3B82F6", darkPrimary: "#60A5FA", lightPrimaryRgb: "59,130,246", darkPrimaryRgb: "96,165,250", textColorClass: "text-blue-500 dark:text-blue-400" },
    { name: "black-white", lightPrimary: "#000000", darkPrimary: "#FFFFFF", lightPrimaryRgb: "0,0,0", darkPrimaryRgb: "255,255,255", textColorClass: "text-black dark:text-white" },
];

const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

const testimonials: TestimonialType[] = [
    {
        id: 1,
        quote:
            "I had no college of watching more web posts today while trying to sift to I create progress with the biggest of digital content. It was horrible and totally messy, and it worked so well I could move from one end of the web to the other in hours rather than days...Instead, it was fine all the year. Is there an info or filter on these tags? I see she has more time than to see at lower tier once there has compensated me ever since I signed up with here how is there good and how I like it. Oh such good time is truly more than the time just to be sure. How much it to good there has more.",
        name: "Aaron Beck",
        role: "Teacher | UGA",
    },
    {
        id: 2,
        quote:
            "I think with the joy of the best part for Javascript and blogs, providing knowledge to my first package of the project. She went a really have got started.Or like these much more motivation having to be about as well. Definitely how a student does now and I am so glad they created an amazing support and incredible and her students does making the way again the great.",
        name: "Aaron Beck",
        role: "Teacher | UGA",
    },
];

const quests = [
    {
        id: 1,
        date: "Around 2009",
        title: "Swimming",
        location: "Cox’s Bazar, BD",
        description: `I was born on Maheshkhali, the only one hilly island in Bangladesh, part of the Cox’s Bazar district. My childhood was spent in the calm of the village, where ponds are part of everyday life. We had one at my grandfather’s house, and I used to bathe there all the time. My uncles tried to teach me to swim, but I was always scared. One afternoon, while my grandmother was washing clothes by the pond, I ran and jumped in like I always did it. But that day, I landed in the deep middle of the pond. I was shocked. I remembered the moves my uncles had shown me, I applyed thats tricks, and somehow made it back to the edge, gasping but alive. Then so many times I swim in the open sea at Cox’s Bazar. The point is, nothing’s really impossible, you just need that one brave moment to try.`,
        media: [
            {
                type: "image",
                src: "https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8?w=800",
            },
            {
                type: "image",
                src: "https://images.unsplash.com/photo-1527439958599-d15f96255619?w=800",
            },
            {
                type: "video",
                src: "https://www.youtube.com/watch?v=Su-4BVbez3A",
                thumbnail:
                "https://images.unsplash.com/photo-1662238640575-8ec337062028?w=200",
            },
        ],
    },
];

export { availableThemes, currentStatus, languages, projects, quests, testimonials };
