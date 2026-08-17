// src/data/pages/attribution.ts
//
// Structure for the attribution page: who and what is credited, with their
// links. The prose lives in `src/i18n/dictionaries`.
//
// NOTICE: If you are using the is-here-zahin.me project, please respect this
// attribution and do not remove or modify it. You are welcome to add additional
// credits if you extend or modify the project, but please retain this original
// attribution.

import type { Dictionary } from "@/i18n/dictionaries/en";
import type { PageHeading, RichListItem } from "../types";

/** Credited people, in the same order as the dictionary's descriptions. */
const PEOPLE = [
    { name: "Nelson Lai", href: "https://github.com/nelsonlaidev" },
    { name: "Clarence", href: "https://github.com/theodorusclarence" },
    { name: "Delba de Oliveira", href: "https://www.linkedin.com/in/delbaoliveira/" },
];

/** Technology stack, in the same order as the dictionary's descriptions. */
const TOOLS = [
    { name: "Next.js", href: "https://nextjs.org/" },
    { name: "Tailwind CSS", href: "https://tailwindcss.com/" },
    { name: "TypeScript", href: "https://www.typescriptlang.org/" },
    { name: "GitHub", href: "https://github.com/" },
    { name: "GitHub Discussions", href: "https://docs.github.com/en/discussions" },
    { name: "ESLint", href: "https://eslint.org/" },
    { name: "NextAuth.js", href: "https://next-auth.js.org/" },
    { name: "Motion", href: "https://motion.dev/" },
    { name: "Lucide React", href: "https://lucide.dev/" },
    { name: "Simple Icons", href: "https://simpleicons.org/" },
    { name: "Cobe", href: "https://cobe.vercel.app/" },
    { name: "MongoDB", href: "https://www.mongodb.com/" },
    { name: "Firebase", href: "https://firebase.google.com/" },
    { name: "Radix UI", href: "https://www.radix-ui.com/" },
    { name: "shadcn/ui", href: "https://ui.shadcn.com/" },
    { name: "TanStack Query", href: "https://tanstack.com/query/" },
    { name: "Zod", href: "https://zod.dev/" },
    { name: "React Hook Form", href: "https://react-hook-form.com/" },
    { name: "Sonner", href: "https://sonner.emilkowal.ski/" },
    { name: "dnd kit", href: "https://dndkit.com/" },
    { name: "Cloudinary", href: "https://cloudinary.com/" },
];

const CONTACT_EMAIL = "isherezahin@gmail.com";

export interface AttributionContent {
    heading: PageHeading;
    intro: { title: string; paragraphs: string[] };
    people: { title: string; items: RichListItem[] };
    tools: { title: string; items: RichListItem[] };
    outro: { license: string; signOff: string; contact: { lead: string; email: string } };
}

/** "[Name](href) description" — the shape ReferralListItem renders. */
const toListItems = (entries: { name: string; href: string }[], descriptions: readonly string[]) =>
    entries.map((entry, index) => ({ text: `[${entry.name}](${entry.href}) ${descriptions[index]}` }));

export function getAttributionContent(dict: Dictionary): AttributionContent {
    const t = dict.attribution;

    return {
        heading: t.heading,
        intro: { title: t.intro.title, paragraphs: [...t.intro.paragraphs] },
        people: { title: t.people.title, items: toListItems(PEOPLE, t.people.descriptions) },
        tools: { title: t.tools.title, items: toListItems(TOOLS, t.tools.descriptions) },
        outro: {
            license: t.outro.license,
            signOff: t.outro.signOff,
            contact: { lead: t.outro.contactLead, email: CONTACT_EMAIL },
        },
    };
}
