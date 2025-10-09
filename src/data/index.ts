import { TestimonialType } from "@/components/Testimonial";
import { ThemeColor } from "@/utils";

const projects = [
    {
        id: "1",
        title: "Beam Treasury",
        slug: "beam-treasury",
        status: "Work-in-progress",
        description: "A product designed to accelerate a team or organization's treasury management process by unifying it into a single intuitive interface. We wanted to create a product that would help.",
        image: "https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjBpbnRlcmZhY2UlMjBkZXNpZ258ZW58MXx8fHwxNzU5MzEzNTI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        url: "https://www.beamtreasury.com"
    },
    {
        id: "2",
        title: "Contra",
        slug: "contra",
        status: "Work-in-progress",
        description: "An app that allows users to track digital products they've bought and quickly access the purchase receipts. It's focused on creating a single source of truth.",
        image: "https://images.unsplash.com/photo-1627542557169-5ed71c66ed85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBzY3JlZW5zfGVufDF8fHx8MTc1OTMxMzI4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        url: "https://www.contra.app"
    },
    {
        id: "3",
        title: "Bali / Rekso",
        slug: "bali-rekso",
        status: "Work-in-progress",
        description: "An e-commerce platform where designers or small business owners can set up a shop and sell their merchandise.",
        image: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwbW9ja3VwfGVufDF8fHx8MTc1OTMxMjQxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        url: "https://www.balirekso.com",
    },
    {
        id: "4",
        title: "Twitter for Goodfellaz",
        slug: "twitter-for-goodfellaz",
        status: "Work-in-progress",
        description: "Twitter interface designed for The Goodfellaz. It's meant to be much more minimal than the current Twitter interface, with a heavier focus on great typography.",
        image: "https://images.unsplash.com/photo-1759215524472-1b0686fdbd87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMGludGVyZmFjZXxlbnwxfHx8fDE3NTkzMTM1MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        url: null
    }
];

const blogs = [
    {
        id: 1,
        date: "October 02, 2025",
        readTime: 5,
        views: 89,
        title: "Tools I'm currently enjoying and ones I'm excited to try",
        href: "/blogs/tools-im-currently-enjoying",
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
        href: "/blogs/mental-models",
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
        quote: "I had no college of watching more web posts today while trying to sift to I create progress with the biggest of digital content. It was horrible and totally messy, and it worked so well I could move from one end of the web to the other in hours rather than days...Instead, it was fine all the year. Is there an info or filter on these tags? I see she has more time than to see at lower tier once there has compensated me ever since I signed up with here how is there good and how I like it. Oh such good time is truly more than the time just to be sure. How much it to good there has more.",
        name: "Aaron Beck",
        role: "Teacher | UGA",
    },
    {
        id: 2,
        quote: "I think with the joy of the best part for Javascript and blogs, providing knowledge to my first package of the project. She went a really have got started.Or like these much more motivation having to be about as well. Definitely how a student does now and I am so glad they created an amazing support and incredible and her students does making the way again the great.",
        name: "Aaron Beck",
        role: "Teacher | UGA",
    },
];

export { availableThemes, blogs, languages, projects, testimonials };