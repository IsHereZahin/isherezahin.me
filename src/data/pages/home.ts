// src/data/pages/home.ts
//
// Structure for the home page: images, icons, links and coordinates. All copy
// lives in `src/i18n/dictionaries` — `getHomeContent(dict)` merges the two.
//
// The Blogs and Projects strips stay database-driven; only their headings come
// from here.

import type { Dictionary } from "@/i18n/dictionaries/en";
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
import type { ImageSource, SectionHeading, StackIcon, TestimonialItem } from "../types";

const HERO_ACTION_HREFS = { learnMore: "#about-me", moreAboutMe: "/about" };

const STACKS = {
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
};

export interface HomeContent {
    profileHero: {
        avatar: ImageSource;
        headingLead: string;
        name: string;
        headingTrail: string;
        description: string;
        actions: { href: string; text: string; arrow?: boolean }[];
    };
    hero: {
        badge: { label: string; company: string; companyUrl: string; logo: ImageSource };
        headingLead: string;
        name: string;
        paragraphs: string[];
        portrait: ImageSource;
        portraitAlt: string;
        actions: { href: string; text: string; arrow?: boolean }[];
    };
    cards: {
        location: { label: string; marker: [number, number] };
        codingHours: { label: string; value: string };
        favoriteFramework: { label: string; title: string };
        connect: { label: string };
        stacks: { label: string; rowOne: StackIcon[]; rowTwo: StackIcon[] };
        seeMore: { href: string; text: string };
    };
    blogs: SectionHeading & { seeAll: string };
    projects: SectionHeading & { seeAll: string };
    testimonials: { heading: SectionHeading; items: TestimonialItem[] };
    contact: {
        headline: string;
        subheadline: string;
        highlightText: string;
        sendMessage: string;
        /** Leave empty to keep the in-site message composer. */
        email: string;
        pointerLabel: string;
        skills: string[];
    };
}

export function getHomeContent(dict: Dictionary): HomeContent {
    const t = dict.home;

    const actions = [
        { href: HERO_ACTION_HREFS.learnMore, text: t.actions.learnMore, arrow: true },
        { href: HERO_ACTION_HREFS.moreAboutMe, text: t.actions.moreAboutMe },
    ];

    return {
        profileHero: {
            avatar: profileImage as ImageSource,
            headingLead: t.profileHero.headingLead,
            name: MY_NAME,
            headingTrail: t.profileHero.headingTrail,
            description: t.profileHero.description,
            actions,
        },
        hero: {
            badge: {
                label: t.hero.badgeLabel,
                company: "Iconic",
                companyUrl: "http://www.iconicsolutionsbd.com",
                logo: iconicLogo as ImageSource,
            },
            headingLead: t.hero.headingLead,
            name: MY_NAME,
            paragraphs: [...t.hero.paragraphs],
            portrait: profileImage as ImageSource,
            portraitAlt: MY_NAME,
            actions,
        },
        cards: {
            location: { label: t.cards.location, marker: [22.3384, 91.8317] },
            codingHours: { label: t.cards.codingHours, value: t.cards.codingHoursValue },
            favoriteFramework: { label: t.cards.favoriteFramework, title: "Next.js & Laravel" },
            connect: { label: t.cards.connect },
            stacks: { label: t.cards.stacks, ...STACKS },
            seeMore: { href: "/about", text: t.cards.seeMore },
        },
        blogs: { tag: "02", title: t.blogs.title, subtitle: t.blogs.subtitle, seeAll: t.blogs.seeAll },
        projects: { tag: "03", title: t.projects.title, subtitle: t.projects.subtitle, seeAll: t.projects.seeAll },
        testimonials: {
            heading: { tag: "04", title: t.testimonials.title, subtitle: t.testimonials.subtitle },
            items: t.testimonials.items.map((item, index) => ({ id: index + 1, ...item })),
        },
        contact: {
            headline: t.contact.headline,
            subheadline: t.contact.subheadline,
            highlightText: t.contact.highlightText,
            sendMessage: t.contact.sendMessage,
            email: "",
            pointerLabel: MY_USERNAME,
            skills: ["Next.js", "React.js", "TypeScript", "Laravel"],
        },
    };
}
