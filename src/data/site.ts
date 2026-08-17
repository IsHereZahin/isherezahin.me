// src/data/site.ts
//
// Site-wide data that is not tied to a single page.

import { BASE_URL } from "@/lib/constants";
import type { ThemeColor } from "./types";

/**
 * Branding artwork, served from `public/assets/images`.
 *
 * These are checked into the repo on purpose — swap the files (or these paths)
 * to rebrand. Nothing here reads from the environment.
 *
 * The `*Url` variants are absolute because email clients, Open Graph tags and
 * JSON-LD cannot resolve a site-relative path.
 */
export const SITE_ASSETS = {
    /** Standalone mark, used for avatars, the favicon and social previews. */
    logo: "/assets/images/logoicon.png",
    /** Wordmark shown on a light background. */
    logoDark: "/assets/images/darkLogo.png",
    /** Wordmark shown on a dark background. */
    logoLight: "/assets/images/lightLogo.png",
    /** Portrait used by the hero and about page. */
    profileImage: "/assets/images/profile.png",

    logoUrl: `${BASE_URL}/assets/images/logoicon.png`,
    profileImageUrl: `${BASE_URL}/assets/images/profile.png`,
} as const;

// Note: If you add a new theme, don't forget to also add it to the `globals.css` file.
export const availableThemes: ThemeColor[] = [
    { name: "violet", lightPrimary: "#8B5CF6", darkPrimary: "#A78BFA", lightPrimaryRgb: "139,92,246", darkPrimaryRgb: "167,139,250", textColorClass: "text-violet-500 dark:text-violet-400" },
    { name: "teal", lightPrimary: "#14B8A6", darkPrimary: "#5EEAD4", lightPrimaryRgb: "20,184,166", darkPrimaryRgb: "94,234,212", textColorClass: "text-teal-500 dark:text-teal-400" },
    { name: "orange", lightPrimary: "#F97316", darkPrimary: "#FDBA74", lightPrimaryRgb: "249,115,22", darkPrimaryRgb: "253,186,116", textColorClass: "text-orange-500 dark:text-orange-400" },
    { name: "red", lightPrimary: "#EF4444", darkPrimary: "#FCA5A5", lightPrimaryRgb: "239,68,68", darkPrimaryRgb: "252,165,165", textColorClass: "text-red-500 dark:text-red-400" },
    { name: "blue", lightPrimary: "#3B82F6", darkPrimary: "#60A5FA", lightPrimaryRgb: "59,130,246", darkPrimaryRgb: "96,165,250", textColorClass: "text-blue-500 dark:text-blue-400" },
    { name: "black-white", lightPrimary: "#000000", darkPrimary: "#FFFFFF", lightPrimaryRgb: "0,0,0", darkPrimaryRgb: "255,255,255", textColorClass: "text-black dark:text-white" },
];

