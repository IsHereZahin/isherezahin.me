// src/data/pages/attribution.ts
//
// Content for the attribution page (`/attribution`). Edit here — the sections
// in `src/components/pages/attribution` only lay this out.
//
// NOTICE: If you are using the is-here-zahin.me project, please respect this
// attribution and do not remove or modify it. You are welcome to add additional
// credits if you extend or modify the project, but please retain this original
// attribution.

import type { PageHeading, RichListItem } from "../types";

export const ATTRIBUTION_PAGE_HEADING: PageHeading = {
    title: "Attribution",
    subtitle: "Journey to create this personal portfolio.",
};

export const ATTRIBUTION_INTRO = {
    title: "Acknowledgments & Attribution",
    /** Paragraphs accept inline markdown — see `RichText`. */
    paragraphs: [
        "This portfolio was developed by [Zahin](https://github.com/isherezahin) as an open-source template built with Next.js and Tailwind CSS. The source code is publicly available on [GitHub](https://github.com/isherezahin/isherezahin.me) and licensed for personal and educational use with proper attribution.",
        "Initial development began on **October 1, 2025**. The project is actively maintained with continuous improvements and new features.",
        "Building on the work of the open-source community, this project draws inspiration from hundreds of portfolios, design systems, and technical implementations. The following contributors have made notable impact on the web development ecosystem and influenced this work.",
    ],
};

export const ATTRIBUTION_PEOPLE: { title: string; items: RichListItem[] } = {
    title: "Design & Development Inspiration",
    items: [
        {
            text: "[Nelson Lai](https://github.com/nelsonlaidev) Component architecture and blog implementation patterns.",
        },
        {
            text: "[Clarence](https://github.com/theodorusclarence) Micro-interaction design and portfolio UX patterns.",
        },
        {
            text: "[Delba de Oliveira](https://www.linkedin.com/in/delbaoliveira/) Visual design language for testimonials, imagery, and project showcases.",
        },
    ],
};

export const ATTRIBUTION_TOOLS: { title: string; items: RichListItem[] } = {
    title: "Technology Stack",
    items: [
        { text: "[Next.js](https://nextjs.org/) React framework for production-grade web applications." },
        { text: "[Tailwind CSS](https://tailwindcss.com/) Utility-first CSS framework." },
        { text: "[TypeScript](https://www.typescriptlang.org/) Static type checking and enhanced developer experience." },
        { text: "[GitHub](https://github.com/) Version control and source code management." },
        { text: "[GitHub Discussions](https://docs.github.com/en/discussions) Community engagement via GraphQL API integration." },
        { text: "[ESLint](https://eslint.org/) Code quality and consistency enforcement." },
        { text: "[NextAuth.js](https://next-auth.js.org/) Authentication and session management." },
        { text: "[Motion](https://motion.dev/) Declarative animations and transitions." },
        { text: "[Lucide React](https://lucide.dev/) Consistent icon system." },
        { text: "[Simple Icons](https://simpleicons.org/) Brand and platform iconography." },
        { text: "[Cobe](https://cobe.vercel.app/) Interactive 3D globe visualizations." },
        { text: "[MongoDB](https://www.mongodb.com/) Document-based data persistence." },
        { text: "[Firebase](https://firebase.google.com/) Real-time database and backend infrastructure." },
        { text: "[Radix UI](https://www.radix-ui.com/) Accessible, unstyled component primitives." },
        { text: "[shadcn/ui](https://ui.shadcn.com/) Pre-built component library extending Radix UI." },
        { text: "[TanStack Query](https://tanstack.com/query/) Server state management and caching." },
        { text: "[Zod](https://zod.dev/) Runtime schema validation." },
        { text: "[React Hook Form](https://react-hook-form.com/) Performant form state management." },
        { text: "[Sonner](https://sonner.emilkowal.ski/) Toast notification system." },
        { text: "[dnd kit](https://dndkit.com/) Drag and drop interactions." },
        { text: "[Cloudinary](https://cloudinary.com/) Media asset management and optimization." },
    ],
};

export const ATTRIBUTION_OUTRO = {
    license:
        "This project is released under an open-source license. If you fork or extend this template, please retain this attribution section and acknowledge any additional contributors appropriately.",
    signOff: "Best,",
    contact: {
        lead: "For inquiries regarding this project or potential collaborations, reach out at",
        email: "isherezahin@gmail.com",
    },
};
