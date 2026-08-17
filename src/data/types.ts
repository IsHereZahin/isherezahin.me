// src/data/types.ts
//
// Shared shapes for the site's static content.
//
// Everything under `src/data` is plain, source-controlled data: no database and
// no runtime fetching. To change what a static page renders, edit the matching
// file in `src/data/pages/` — the components only lay the content out.

import type { StaticImageData } from "next/image";
import type { ComponentType, SVGProps } from "react";

/** Any icon component from lucide-react or simple-icons. */
export type IconComponent = ComponentType<
    SVGProps<SVGSVGElement> & { size?: number | string; title?: string }
>;

/** An image that is either a bundled import or a URL/public path. */
export type ImageSource = string | StaticImageData;

/**
 * A line of text that may contain inline markdown:
 * `**bold**`, `*italic*`, `` `code` `` and `[label](https://example.com)`.
 * Rendered by `<RichText />`.
 */
export interface RichListItem {
    text: string;
}

/** A call-to-action rendered as a `<Button />`. */
export interface PageAction {
    href: string;
    text: string;
    /** Show the trailing down-arrow (used by in-page "Learn More" jumps). */
    arrow?: boolean;
}

/** Heading block rendered by `<SectionHeader />`. */
export interface SectionHeading {
    tag?: string;
    title: string;
    subtitle?: string;
}

/** Heading block rendered by `<PageTitle />`. */
export interface PageHeading {
    title: string;
    subtitle: string;
}

export interface ThemeColor {
    name: string;
    lightPrimary: string;
    darkPrimary: string;
    lightPrimaryRgb: string;
    darkPrimaryRgb: string;
    textColorClass: string;
}

export interface Language {
    code: string;
    name: string;
    flag: string;
}

export interface TestimonialItem {
    id: number;
    quote: string;
    /** Attribution is optional: with no name the quote renders without a byline. */
    name?: string;
    role?: string;
}

export interface WorkExperienceItem {
    /** Human-readable, e.g. "Sep 2023". Rendered verbatim. */
    start: string;
    /** Omit for a role you still hold — renders as "Present". */
    end?: string;
    title: string;
    company: string;
    companyUrl: string;
    location: string;
    type: string;
    description: string;
    highlights: RichListItem[];
    logo: ImageSource;
}

export interface EducationItem {
    /** Human-readable, e.g. "Jan 2023". Omit to hide the date range. */
    start?: string;
    /** Omit for an ongoing degree — renders as "Present". */
    end?: string;
    degree: string;
    institution: string;
    institutionUrl?: string;
    /** Omit to fall back to a monogram tile built from the institution name. */
    logo?: ImageSource;
}

export interface QuestMedia {
    type: "image" | "video";
    /** Image URL, or a full YouTube watch URL for videos. */
    src: string;
    /** Poster image for `type: "video"`. */
    thumbnail?: string;
}

export interface QuestItem {
    id: string;
    /** Free-form, e.g. "Around 2009". Rendered verbatim. */
    date: string;
    title: string;
    location: string;
    description: string;
    media: QuestMedia[];
}

/** A single logo tile in the home page "Languages and Tools" marquee. */
export interface StackIcon {
    icon: IconComponent;
    title: string;
}

/** A named row in the `/uses` software list. */
export interface SoftwareEntry {
    icon: IconComponent;
    name: string;
    category: string;
    description: string;
}

export interface PeripheralEntry {
    icon: IconComponent;
    title: string;
    subtitle: string;
    description: string;
}

export interface SubscriptionEntry {
    icon: IconComponent;
    name: string;
    /** Plan/tier label shown under the name. */
    plan: string;
}
