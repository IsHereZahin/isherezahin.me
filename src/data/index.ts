import { TestimonialType } from "@/components/Testimonial";
import { ThemeColor } from "@/utils";

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

const blogs = [
    {
        id: 1,
        date: "October 02, 2025",
        readTime: 5,
        views: 89,
        title: "Tools I'm currently enjoying and ones I'm excited to try",
        slug: "tools-im-currently-enjoying",
        excerpt: "Are you stuck in a rut? Not a tool rut mind you, but one of those actual life ruts?! There's a wealth of apps and books and apps that could solve all of your problems. Or if you're just looking for ways to power your way to greatness in an easier less uncomfortable way--you came to the right place.",
        tags: ["Tools", "Productivity"],
        imageSrc: "/assets/CommandPopup/Travel.jpg",
        alt: "Related to tools and productivity"
    },
    {
        id: 2,
        date: "September 15, 2025",
        readTime: 6,
        views: 76,
        title: "Mental Models: The Key to Smarter Decision-Making",
        slug: "mental-models",
        excerpt: "Mental models are frameworks that help us understand and interpret the world around us. They are simplified representations of complex concepts, systems, or processes that allow us to make better decisions and solve problems more effectively. By using mental models, we can improve our critical thinking skills and enhance our ability to learn and adapt to new situations.",
        tags: ["Mental Models", "Decision Making"],
        imageSrc: "/assets/CommandPopup/Adventure.jpg",
        alt: "Related to mental models and decision-making"
    }
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

export { availableThemes, blogs, languages, projects, testimonials };