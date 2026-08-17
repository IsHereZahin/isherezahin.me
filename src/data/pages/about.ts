// src/data/pages/about.ts
//
// Structure for the about page: images, links and logos. All copy lives in
// `src/i18n/dictionaries` — `getAboutContent(dict)` merges the two.

import type { Dictionary } from "@/i18n/dictionaries/en";
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

/** Social badges overlaid on the profile photo. */
const PROFILE_SOCIALS: { href: string; label: string; icon: IconComponent }[] = [
    { href: SITE_LINKEDIN_URL, label: "LinkedIn", icon: LinkedinIcon },
    { href: SITE_GITHUB_URL, label: "GitHub", icon: GithubIcon },
    { href: SITE_YOUTUBE_URL, label: "YouTube", icon: YoutubeIcon },
];

const PROFILE = {
    name: MY_FULL_NAME,
    /** Small badge on the photo. Leave empty to hide it. */
    age: "23Y",
    imageSrc: profileImage as ImageSource,
    socials: PROFILE_SOCIALS,
};

const WORK_EXPERIENCE = [
    {
        start: "Sep 2023",
        end: "Present",
        company: "Iconic Solutions (Pvt) Ltd",
        companyUrl: "http://www.iconicsolutionsbd.com",
        logo: "/assets/images/iconic.png" as ImageSource,
    },
];

const EDUCATION = [
    {
        // TODO: fill in `start` — the date range only renders once it is set.
        institution: "East Delta University",
        institutionUrl: "https://www.eastdelta.edu.bd",
        logo: "/assets/images/east-delta-university.jpg" as ImageSource,
    },
];

export interface AboutContent {
    heading: PageHeading;
    profile: typeof PROFILE & { title: string; location: string; paragraphs: string[] };
    currentStatus: { title: string; items: RichListItem[] };
    workExperience: { heading: SectionHeading; items: WorkExperienceItem[] };
    education: { heading: SectionHeading; items: EducationItem[] };
}

export function getAboutContent(dict: Dictionary): AboutContent {
    const t = dict.about;

    return {
        heading: t.heading,
        profile: { ...PROFILE, ...t.profile, paragraphs: [...t.profile.paragraphs] },
        currentStatus: {
            title: t.currentStatus.title,
            items: t.currentStatus.items.map((text) => ({ text })),
        },
        workExperience: {
            heading: { tag: "02", title: t.workExperience.title, subtitle: t.workExperience.subtitle },
            items: WORK_EXPERIENCE.map((role, index) => {
                const copy = t.workExperience.items[index];
                return {
                    ...role,
                    title: copy.title,
                    location: copy.location,
                    type: copy.type,
                    description: copy.description,
                    highlights: copy.highlights.map((text) => ({ text })),
                };
            }),
        },
        education: {
            heading: { tag: "03", title: t.education.title, subtitle: t.education.subtitle },
            items: EDUCATION.map((school, index) => ({
                ...school,
                degree: t.education.items[index].degree,
            })),
        },
    };
}
