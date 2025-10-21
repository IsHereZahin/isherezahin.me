// NOTICE: If you are using the is-here-zahin.me project, please respect this attribution and do not remove or modify it.
// You are welcome to add additional credits if you extend or modify the project, but please retain this original attribution.

import ReferralLink from "@/components/ui/ReferralLink";
import ReferralListItem from "@/components/ui/ReferralListItem";
import Signature from "@/components/ui/Signature";
import MotionWrapper from "./motion/MotionWrapper";
import Section from "./ui/Section";

export default function Attribution() {
    const developers = [
        {
            text: "(Nelson)[https://github.com/nelsonlaidev] Many components were adapted from his open-source blog.",
        },
        {
            text: "(Clarence)[https://github.com/theodorusclarence] Inspired by his blog and the micro-interactions in his portfolio.",
        },
        {
            text: "(Delba de Oliveira)[https://www.linkedin.com/in/delbaoliveira/] Design ideas, including testimonial sections, were adapted from her project.",
        },
    ];

    const tools = [
        { text: "(Next.js)[https://nextjs.org/] a React framework used to build this website." },
        { text: "(Tailwind CSS)[https://tailwindcss.com/] a CSS library for styling." },
        { text: "(TypeScript)[https://www.typescriptlang.org/] for writing type-safe, scalable code." },
        { text: "(Vercel)[https://vercel.com/] platform used to deploy and host the website." },
        { text: "(GitHub)[https://github.com/] for source code management and version control." },
        { text: "(Giscus)[https://giscus.app/] for comment integration via GitHub Discussions." },
        { text: "(ESLint)[https://eslint.org/] to maintain clean, consistent code quality." },
        { text: "(NextAuth.js)[https://next-auth.js.org/] for authentication and secure user sessions." },
        { text: "(Framer Motion)[https://framer.com/motion/] for creating interactive animations." },
        { text: "(Lucide React)[https://lucide.dev/] for icons." },
        { text: "(React Simple Icons)[https://react-icons.github.io/react-icons/] for icons." },
        { text: "(Cobe)[https://cobe.vercel.app/] for creating interactive 3D globe animations." },
    ];

    return (
        <Section id="attribution">
            {/* Greeting */}
            <MotionWrapper delay={0.1}>
                <p className="text-foreground text-xl font-medium mb-6">Hello! 👋</p>
            </MotionWrapper>

            {/* Intro */}
            <MotionWrapper delay={0.2}>
                <div className="font-normal text-secondary-foreground mb-6 leading-relaxed">
                    This website was originally created by{" "}
                    <ReferralLink
                        href="https://github.com/isherezahin"
                        className="text-foreground font-medium transition-opacity"
                    >
                        (Zahin)
                    </ReferralLink>{" "}
                    using Next.js and Tailwind CSS, and is now hosted on Vercel. The full source code is available on{" "}
                    <ReferralLink
                        href="https://github.com/isherezahin/isherezahin.me"
                        className="text-foreground font-medium transition-opacity"
                    >
                        GitHub
                    </ReferralLink>
                    . This is a free and open-source project, not intended for commercial use. Feel free to explore the repository to learn about the structure and technologies used.
                </div>
            </MotionWrapper>

            {/* Contribution Info */}
            <MotionWrapper delay={0.3}>
                <div className="font-normal text-secondary-foreground mb-6 leading-relaxed">
                    My first contribution to this project began on <b>October 1, 2025</b>. It will always remain open-source, with plans for continuous improvements and feature additions.
                </div>
            </MotionWrapper>

            {/* Appreciation */}
            <MotionWrapper delay={0.4}>
                <div className="font-normal text-secondary-foreground mb-8 leading-relaxed">
                    I sincerely appreciate the developers whose work inspired this project. Over <b>500</b> websites were explored for ideas, inspiration, and resources. Credit belongs not only to me but also to the many developers who influenced this journey.
                </div>
            </MotionWrapper>

            {/* Developers List */}
            <MotionWrapper delay={0.5}>
                <div className="font-normal text-secondary-foreground mb-6 leading-relaxed">
                    Some of the developers who inspired this project (non-exhaustive list):
                </div>
                <ul className="space-y-3 mb-12 ml-6">
                    <ReferralListItem listItems={developers} />
                </ul>
            </MotionWrapper>

            {/* Tools List */}
            <MotionWrapper delay={0.7}>
                <div className="font-normal text-secondary-foreground mb-6 leading-relaxed">
                    Tools and technologies used in this project:
                </div>
                <ul className="space-y-3 mb-12 ml-6">
                    <ReferralListItem listItems={tools} />
                </ul>
            </MotionWrapper>

            {/* Signature */}
            <MotionWrapper delay={1.2}>
                <p className="mb-8 font-bold">Best,</p>
                <div className="font-normal text-secondary-foreground mt-[-40px]">
                    <Signature className="size-30" />
                </div>
            </MotionWrapper>

            {/* Footer Contact */}
            <MotionWrapper delay={1.3}>
                <div className="font-normal text-secondary-foreground border-t border-border pt-8">
                    <div className="text-sm text-secondary-foreground leading-relaxed">
                        *Wina and I are also available for freelance work to help create your dream website{" "}
                        <span className="inline-block">🧑‍💻</span>. If you’re looking for a clean and modern website, contact me at{" "}
                        <ReferralLink
                            href="mailto:isherezahin@gmail.com"
                            className="text-foreground font-medium underline transition-opacity"
                        >
                            isherezahin@gmail.com
                        </ReferralLink>
                        .
                    </div>
                </div>
            </MotionWrapper>
        </Section>
    );
}