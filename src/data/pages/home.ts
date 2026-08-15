// src/data/pages/home.ts
//
// Content for the home page (`/`). Edit here — the sections in
// `src/components/pages/home` only lay this out.
//
// The Blogs and Projects strips are the one exception: they stay
// database-driven and are not configured from this file.

import { MY_NAME, MY_USERNAME } from "@/lib/constants";
import {
    SiBootstrap,
    SiCloudflare,
    SiDocker,
    SiFigma,
    SiFirebase,
    SiGit,
    SiJavascript,
    SiLaravel,
    SiLinux,
    SiMarkdown,
    SiMongodb,
    SiMysql,
    SiNextdotjs,
    SiNodedotjs,
    SiPhp,
    SiPostman,
    SiPython,
    SiReact,
    SiRedux,
    SiTailwindcss,
    SiTypescript,
    SiVite,
    SiVuedotjs,
} from "@icons-pack/react-simple-icons";
import iconicLogo from "../../../public/assets/images/iconic.png";
import profileImage from "../../../public/assets/images/profile.png";
import type {
    ImageSource,
    PageAction,
    SectionHeading,
    StackIcon,
    TestimonialItem,
} from "../types";

/** Shared by both hero variants. */
const HERO_ACTIONS: PageAction[] = [
    { href: "#about-me", text: "Learn More", arrow: true },
    { href: "/about", text: "More about me" },
];

/**
 * Hero variant 1 — the avatar + heading layout.
 * Selected with `NEXT_PUBLIC_HERO_SECTION_ID=1` (the default).
 */
export const HOME_PROFILE_HERO = {
    avatar: profileImage as ImageSource,
    /** Rendered on two lines; `{name}` is replaced with the primary-coloured name. */
    headingLead: "Hey, I’m",
    name: MY_NAME,
    headingTrail: "Coder & Thinker",
    description:
        "I work with **React** & **Laravel** Ecosystem, and write to teach people how to rebuild and redefine fundamental concepts through mental models.",
    actions: HERO_ACTIONS,
};

/**
 * Hero variant 2 — the badge + side portrait layout.
 * Selected with `NEXT_PUBLIC_HERO_SECTION_ID=2`.
 */
export const HOME_HERO = {
    badge: {
        label: "Crafting Experiences at",
        company: "Iconic",
        companyUrl: "http://www.iconicsolutionsbd.com",
        logo: iconicLogo as ImageSource,
    },
    headingLead: "Hi! I'm",
    name: MY_NAME,
    paragraphs: [
        "I work with **React** & **Laravel** Ecosystem, and write to teach people how to rebuild and redefine fundamental concepts through mental models.",
        "Need a modern web app that stands out? [Hire me?](/contact)",
    ],
    portrait: profileImage as ImageSource,
    portraitAlt: "Zahin",
    actions: HERO_ACTIONS,
};

/** The bento grid under the hero. */
export const HOME_ABOUT_CARDS = {
    location: {
        label: "Cox's Bazar, Bangladesh",
        /** [latitude, longitude] of the globe marker. */
        marker: [22.3384, 91.8317] as [number, number],
    },
    codingHours: {
        label: "Coding Hours",
        value: "15,600 hrs",
    },
    favoriteFramework: {
        label: "Favorite Framework",
        /** Shown by default; swaps to `hovered` on pointer-over. */
        title: "Next.js & Laravel",
        resting: SiNextdotjs,
        hovered: SiLaravel,
    },
    connect: {
        label: "Connect",
    },
    stacks: {
        label: "Languages and Tools",
        /** Scrolls left. */
        rowOne: [
            { icon: SiReact, title: "React" },
            { icon: SiRedux, title: "Redux" },
            { icon: SiNextdotjs, title: "Next.js" },
            { icon: SiMongodb, title: "MongoDB" },
            { icon: SiLaravel, title: "Laravel" },
            { icon: SiVuedotjs, title: "Vue.js" },
            { icon: SiJavascript, title: "JavaScript" },
            { icon: SiTypescript, title: "TypeScript" },
            { icon: SiDocker, title: "Docker" },
            { icon: SiLinux, title: "Linux" },
            { icon: SiGit, title: "Git" },
            { icon: SiFigma, title: "Figma" },
        ] as StackIcon[],
        /** Scrolls right. */
        rowTwo: [
            { icon: SiTailwindcss, title: "Tailwind CSS" },
            { icon: SiBootstrap, title: "Bootstrap" },
            { icon: SiPython, title: "Python" },
            { icon: SiPhp, title: "PHP" },
            { icon: SiMysql, title: "MySQL" },
            { icon: SiFirebase, title: "Firebase" },
            { icon: SiVite, title: "Vite" },
            { icon: SiCloudflare, title: "Cloudflare" },
            { icon: SiMarkdown, title: "Markdown" },
            { icon: SiPostman, title: "Postman" },
            { icon: SiNodedotjs, title: "Node.js" },
        ] as StackIcon[],
    },
    seeMore: { href: "/about", text: "Know more about me" },
};

export const HOME_TESTIMONIALS: {
    heading: SectionHeading;
    items: TestimonialItem[];
} = {
    heading: {
        tag: "04",
        title: "Nice words",
        subtitle: "Some feedback from people that I've had the privilege of working with.",
    },
    items: [
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
    ],
};

/**
 * The closing "get in touch" card.
 *
 * Set `email` to show a mailto button instead of the in-site message composer.
 * `skills` drives the orbiting pointer animation — the first four are used.
 */
export const HOME_CONTACT = {
    headline: "Any questions about software?",
    subheadline: "Feel free to reach out to me!",
    /** Optional accent appended after the subheadline. */
    highlightText: "",
    /** Leave empty to keep the "Send Message" button. */
    email: "",
    pointerLabel: MY_USERNAME,
    skills: ["Next.js", "React.js", "TypeScript", "Laravel"],
};
