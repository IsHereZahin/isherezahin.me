// NOTICE: If you are using the is-here-zahin.me project, please respect this attribution and do not remove or modify it.
// You are welcome to add additional credits if you extend or modify the project, but please retain this original attribution.

import {
    ReferralLink,
    ReferralListItem,
    Section,
    Signature,
} from "@/components/ui";

export default function Attribution() {
    const developers = [
        {
            text: "(Nelson Lai)[https://github.com/nelsonlaidev] Component architecture and blog implementation patterns.",
        },
        {
            text: "(Clarence)[https://github.com/theodorusclarence] Micro-interaction design and portfolio UX patterns.",
        },
        {
            text: "(Delba de Oliveira)[https://www.linkedin.com/in/delbaoliveira/] Visual design language for testimonials, imagery, and project showcases.",
        },
    ];

    const tools = [
        { text: "(Next.js)[https://nextjs.org/] React framework for production-grade web applications." },
        { text: "(Tailwind CSS)[https://tailwindcss.com/] Utility-first CSS framework." },
        { text: "(TypeScript)[https://www.typescriptlang.org/] Static type checking and enhanced developer experience." },
        { text: "(GitHub)[https://github.com/] Version control and source code management." },
        { text: "(GitHub Discussions)[https://docs.github.com/en/discussions] Community engagement via GraphQL API integration." },
        { text: "(ESLint)[https://eslint.org/] Code quality and consistency enforcement." },
        { text: "(NextAuth.js)[https://next-auth.js.org/] Authentication and session management." },
        { text: "(Motion)[https://motion.dev/] Declarative animations and transitions." },
        { text: "(Lucide React)[https://lucide.dev/] Consistent icon system." },
        { text: "(Simple Icons)[https://simpleicons.org/] Brand and platform iconography." },
        { text: "(Cobe)[https://cobe.vercel.app/] Interactive 3D globe visualizations." },
        { text: "(MongoDB)[https://www.mongodb.com/] Document-based data persistence." },
        { text: "(Firebase)[https://firebase.google.com/] Real-time database and backend infrastructure." },
        { text: "(Radix UI)[https://www.radix-ui.com/] Accessible, unstyled component primitives." },
        { text: "(shadcn/ui)[https://ui.shadcn.com/] Pre-built component library extending Radix UI." },
        { text: "(TanStack Query)[https://tanstack.com/query/] Server state management and caching." },
        { text: "(Zod)[https://zod.dev/] Runtime schema validation." },
        { text: "(React Hook Form)[https://react-hook-form.com/] Performant form state management." },
        { text: "(Sonner)[https://sonner.emilkowal.ski/] Toast notification system." },
        { text: "(dnd kit)[https://dndkit.com/] Drag and drop interactions." },
        { text: "(Cloudinary)[https://cloudinary.com/] Media asset management and optimization." },
    ];

    return (
        <Section id="attribution" animate className="mt-[-50px] py-16 max-w-[700px]">
            {/* Header */}
            <h2 className="text-foreground text-2xl font-semibold mb-8">
                Acknowledgments & Attribution
            </h2>

            {/* Project Overview */}
            <div className="font-normal text-secondary-foreground mb-6 leading-relaxed">
                This portfolio was developed by{" "}
                <ReferralLink
                    href="https://github.com/isherezahin"
                    className="text-foreground font-medium transition-opacity"
                >
                    Zahin
                </ReferralLink>{" "}
                as an open-source template built with Next.js and Tailwind CSS.
                The source code is publicly available on{" "}
                <ReferralLink
                    href="https://github.com/isherezahin/isherezahin.me"
                    className="text-foreground font-medium transition-opacity"
                >
                    GitHub
                </ReferralLink>
                {" "}and licensed for personal and educational use with proper attribution.
            </div>

            {/* Project History */}
            <div className="font-normal text-secondary-foreground mb-6 leading-relaxed">
                Initial development began on <span className="text-foreground font-medium">October 1, 2025</span>.
                The project is actively maintained with continuous improvements and new features.
            </div>

            {/* Attribution Philosophy */}
            <div className="font-normal text-secondary-foreground mb-8 leading-relaxed">
                Building on the work of the open-source community, this project draws inspiration
                from hundreds of portfolios, design systems, and technical implementations.
                The following contributors have made notable impact on the web development
                ecosystem and influenced this work.
            </div>

            {/* Developers List */}
            <h3 className="text-foreground text-lg font-medium mb-4">
                Design & Development Inspiration
            </h3>
            <ul className="space-y-3 mb-12 ml-6">
                <ReferralListItem listItems={developers} />
            </ul>

            {/* Tools List */}
            <h3 className="text-foreground text-lg font-medium mb-4">
                Technology Stack
            </h3>
            <ul className="space-y-3 mb-12 ml-6">
                <ReferralListItem listItems={tools} />
            </ul>

            {/* License Notice */}
            <div className="font-normal text-secondary-foreground mb-8 leading-relaxed">
                This project is released under an open-source license. If you fork or extend
                this template, please retain this attribution section and acknowledge any
                additional contributors appropriately.
            </div>

            {/* Signature */}
            <p className="mb-8 font-bold">Best,</p>
            <div className="font-normal text-secondary-foreground mt-[-40px]">
                <Signature className="size-30" />
            </div>

            {/* Contact Section */}
            <div className="border-t border-border pt-8">
                <p className="text-sm text-secondary-foreground leading-relaxed">
                    For inquiries regarding this project or potential collaborations, reach out at{" "}
                    <a
                        href="mailto:isherezahin@gmail.com"
                        className="text-foreground font-medium hover:underline transition-opacity"
                    >
                        isherezahin@gmail.com
                    </a>
                </p>
            </div>
        </Section>
    );
}