// src/data/pages/about.ts
//
// Content for the about page (`/about`). Edit here — the sections in
// `src/components/pages/about` only lay this out.

import {
    MY_FULL_NAME,
    SITE_GITHUB_URL,
    SITE_LINKEDIN_URL,
    SITE_YOUTUBE_URL,
} from "@/lib/constants";
import { GithubIcon, LinkedinIcon, YoutubeIcon } from "lucide-react";
import profileImage from "../../../public/assets/images/profile.png";
import type {
    EducationItem,
    IconComponent,
    ImageSource,
    PageHeading,
    RichListItem,
    SectionHeading,
    WorkExperienceItem,
} from "../types";

export const ABOUT_PAGE_HEADING: PageHeading = {
    title: "About Me",
    subtitle: "How I explored, learned, and finally found my place in tech",
};

/** Social badges overlaid on the profile photo. */
const PROFILE_SOCIALS: { href: string; label: string; icon: IconComponent }[] = [
    { href: SITE_LINKEDIN_URL, label: "LinkedIn", icon: LinkedinIcon },
    { href: SITE_GITHUB_URL, label: "GitHub", icon: GithubIcon },
    { href: SITE_YOUTUBE_URL, label: "YouTube", icon: YoutubeIcon },
];

/**
 * The intro block: portrait on the left, prose on the right.
 * `paragraphs` accept inline markdown — see `RichText`.
 */
export const ABOUT_PROFILE = {
    name: MY_FULL_NAME,
    title: "Software Developer | Frontend Focused",
    location: "Khulshi, Chittagong, BD (UTC+6)",
    /** Small badge on the photo. Leave empty to hide it. */
    age: "23Y",
    imageSrc: profileImage as ImageSource,
    socials: PROFILE_SOCIALS,
    paragraphs: [
        "I work with the **React & Laravel ecosystem**, building robust web applications, dashboards, and internal tools. I focus on creating intuitive user experiences, clean interfaces, and maintainable code that performs reliably in real-world scenarios.",
        "Beyond coding, I write to teach and help others rethink fundamental concepts through mental models. My goal is to simplify complex ideas, inspire new ways of thinking, and empower developers to build smarter solutions.",
        "With **2+ years** of experience, I leverage tools like **TypeScript**, **Tailwind CSS**, **Bootstrap**, **Figma**, **Postman**, **Docker**, and **Git** to deliver scalable and high-quality software. I pay attention to details because even small improvements can make a significant difference in usability and performance.",
    ],
};

/** The "What I'm up to now" card. Bullets accept inline markdown links. */
export const ABOUT_CURRENT_STATUS: { title: string; items: RichListItem[] } = {
    title: "What I'm up to now",
    items: [
        {
            text: "Currently employed as a Frontend Developer and SQA at [Iconic](http://www.iconicsolutionsbd.com), working on a File Manager web application.",
        },
        {
            text: "BSE in CSE student at [East Delta University](https://www.eastdelta.edu.bd).",
        },
        {
            text: "Occasionally work on outsourcing & freelance projects.",
        },
        {
            text: "Continuously learning modern technologies to stay up to date.",
        },
    ],
};

export const ABOUT_WORK_EXPERIENCE: {
    heading: SectionHeading;
    items: WorkExperienceItem[];
} = {
    heading: {
        tag: "02",
        title: "Work Experience",
        subtitle: "A little bit about my work experience",
    },
    items: [
        {
            start: "Sep 2023",
            end: "Present",
            title: "Frontend Developer & SQA",
            company: "Iconic Solutions (Pvt) Ltd",
            companyUrl: "http://www.iconicsolutionsbd.com",
            location: "Chittagong, BD (On Site)",
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
            ],
        },
    ],
};

export const ABOUT_EDUCATION: {
    heading: SectionHeading;
    items: EducationItem[];
} = {
    heading: {
        tag: "03",
        title: "Education",
        subtitle: "Where I studied and grew academically",
    },
    items: [
        {
            // TODO: fill in `start` — the date range only renders once it is set.
            degree: "BSc in Computer Science & Engineering",
            institution: "East Delta University",
            institutionUrl: "https://www.eastdelta.edu.bd",
            logo: "/assets/images/east-delta-university.jpg",
        },
    ],
};
