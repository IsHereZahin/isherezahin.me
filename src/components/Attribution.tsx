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
            text: "(Nelson)[https://github.com/nelsonlaidev] Many components were adapted from his blog.",
        },
        {
            text: "(Clarence)[https://github.com/theodorusclarence] Inspired by his blog and the micro-interactions in his portfolio.",
        },
        {
            text: "(Delba de Oliveira)[https://www.linkedin.com/in/delbaoliveira/] Design ideas, including testimonial, BlurImage, and project sections, were adapted from her work.",
        },
    ];

    const tools = [
        { text: "(Next.js)[https://nextjs.org/] a React framework for building modern web applications." },
        { text: "(Tailwind CSS)[https://tailwindcss.com/] a utility-first CSS framework for styling." },
        { text: "(TypeScript)[https://www.typescriptlang.org/] for type-safe, scalable code." },
        { text: "(GitHub)[https://github.com/] source code management and version control." },
        { text: "(Giscus)[https://giscus.app/] comment integration via GitHub Discussions." },
        { text: "(ESLint)[https://eslint.org/] code quality and consistency tooling." },
        { text: "(NextAuth.js)[https://next-auth.js.org/] authentication and session management." },
        { text: "(Framer Motion)[https://framer.com/motion/] interactive animations and transitions." },
        { text: "(Lucide React)[https://lucide.dev/] modern icon library." },
        { text: "(React Simple Icons)[https://react-icons.github.io/react-icons/] brand and social icons." },
        { text: "(Cobe)[https://cobe.vercel.app/] interactive 3D globe visualizations." },
    ];

    return (
        <Section id="attribution" animate className="mt-[-50px] py-16 max-w-[700px]">
            {/* Greeting */}
            <p className="text-foreground text-xl font-medium mb-6">Hey there!👋</p>

            {/* Project Overview */}
            <div className="font-normal text-secondary-foreground mb-6 leading-relaxed">
                This website was originally created by{" "}
                <ReferralLink
                    href="https://github.com/isherezahin"
                    className="text-foreground font-medium transition-opacity"
                >
                    Zahin
                </ReferralLink>{" "}
                as an open-source portfolio template built with Next.js and Tailwind CSS.
                The complete source code is available on{" "}
                <ReferralLink
                    href="https://github.com/isherezahin/isherezahin.me"
                    className="text-foreground font-medium transition-opacity"
                >
                    GitHub
                </ReferralLink>
                , licensed for free use with proper attribution. This project is intended for
                personal and educational purposes.
            </div>

            {/* Project History */}
            <div className="font-normal text-secondary-foreground mb-6 leading-relaxed">
                Development began with the first commit on <b>October 1, 2025</b>. The project
                remains actively maintained as an open-source resource, with ongoing improvements
                and feature enhancements.
            </div>

            {/* Attribution Philosophy */}
            <div className="font-normal text-secondary-foreground mb-8 leading-relaxed">
                This project stands on the shoulders of countless developers who share their work
                openly. During development, over <b>500</b> websites were reviewed for inspiration,
                design patterns, and technical approaches. The following individuals made particularly
                significant contributions to the web development community that influenced this work.
            </div>

            {/* Developers List */}
            <div className="font-normal text-secondary-foreground mb-6 leading-relaxed">
                Key inspirations and acknowledgments:
            </div>
            <ul className="space-y-3 mb-12 ml-6">
                <ReferralListItem listItems={developers} />
            </ul>

            {/* Tools List */}
            <div className="font-normal text-secondary-foreground mb-6 leading-relaxed">
                Technologies and tools used:
            </div>
            <ul className="space-y-3 mb-12 ml-6">
                <ReferralListItem listItems={tools} />
            </ul>

            {/* Closing */}
            <div className="font-normal text-secondary-foreground mb-8 leading-relaxed">
                If you use or extend this project, please maintain this attribution section and
                add your own credits as appropriate. Open-source thrives on recognition and mutual support.
            </div>

            <p className="mb-8 font-medium text-secondary-foreground">
                Thank you for respecting the open-source community.
            </p>

            {/* Signature */}
            <p className="mb-8 font-bold">Best,</p>
            <div className="font-normal text-secondary-foreground mt-[-40px]">
                <Signature className="size-30" />
            </div>

            {/* Optional Contact Section */}
            <div className="font-normal text-secondary-foreground border-t border-border pt-8">
                <div className="text-sm text-secondary-foreground leading-relaxed">
                    For questions about this project or collaboration inquiries, contact{" "}
                    <a
                        href="mailto:isherezahin@gmail.com"
                        className="text-foreground font-medium underline hover:text-primary transition-opacity"
                    >
                        isherezahin@gmail.com
                    </a>
                    .
                </div>
            </div>
        </Section>
    );
}