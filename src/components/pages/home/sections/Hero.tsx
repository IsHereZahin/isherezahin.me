import MotionWrapper from "@/components/motion/MotionWrapper";
import HeroBanner from "@/components/pages/home/components/HeroBanner";
import {
    BlurImage,
    Button,
    HighlightedWord,
    ReferralLink,
    RichText,
    Section,
} from "@/components/ui";
import type { HomeContent } from "@/data/pages/home";
import { ArrowDown } from "lucide-react";

export default function Hero({
    badge,
    headingLead,
    name,
    paragraphs,
    portrait,
    portraitAlt,
    actions,
}: Readonly<HomeContent["hero"]>) {

    return (
        <Section id="hero" animate={true}>
            <div className="flex flex-row items-center gap-6 sm:gap-8 lg:gap-12">
                <div className="flex-1 min-w-0">
                    {/* Badge */}
                    <MotionWrapper direction="top" delay={0.2}>
                        <div className="rounded-l-full p-2 sm:p-3 inline-flex bg-gradient-to-r from-primary/10 dark:from-primary/20 to-transparent -ml-2 sm:-ml-3 mb-4 sm:mb-6">
                            <div className="rounded-l-full px-3 py-2 sm:px-6 sm:py-3.5 inline-flex items-center gap-2 sm:gap-4 bg-gradient-to-r from-primary/70 to-transparent">
                                <span className="shrink-0 rounded-full block size-1.5 sm:size-2 bg-background shadow-[0_0_5px_rgba(var(--primary-rgb),0.4),0_0_10px_rgba(var(--primary-rgb),0.3)]"></span>
                                <div className="text-xs sm:text-sm md:text-base text-background flex gap-1.5 flex-wrap items-center">
                                    <span className="shrink-0">{badge.label}</span>
                                    <ReferralLink href={badge.companyUrl} className="font-medium text-primary">
                                        {badge.company}
                                    </ReferralLink>
                                    <BlurImage
                                        alt={`${badge.company} Logo`}
                                        loading="lazy"
                                        width={20}
                                        height={20}
                                        className="w-3 sm:w-4 rounded"
                                        src={badge.logo}
                                        suppressHydrationWarning={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </MotionWrapper>

                    {/* Heading */}
                    <MotionWrapper direction="top" delay={0.3}>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2 sm:mb-4 text-foreground flex flex-wrap">
                            <span className="mr-2">{headingLead}</span>
                            <HighlightedWord>{name}</HighlightedWord>
                        </h1>
                    </MotionWrapper>

                    {/* Description */}
                    <MotionWrapper direction="top" delay={0.4}>
                        <div className="space-y-2 sm:space-y-4 leading-relaxed">
                            {paragraphs.map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className="text-sm sm:text-base md:text-lg text-muted-foreground hover:text-foreground/80 transition-colors"
                                >
                                    <RichText text={paragraph} />
                                </p>
                            ))}
                        </div>
                    </MotionWrapper>

                    {/* Buttons */}
                    <MotionWrapper direction="top" delay={0.5}>
                        <div className="mt-6 sm:mt-8 flex gap-2 sm:gap-4 flex-wrap">
                            {actions.map((action) => (
                                <Button
                                    key={action.href}
                                    href={action.href}
                                    text={action.text}
                                    icon={action.arrow ? <ArrowDown className="size-[70%] text-foreground" /> : undefined}
                                />
                            ))}
                        </div>
                    </MotionWrapper>
                </div>

                {/* Profile Image */}
                <MotionWrapper direction="right" delay={0.2}>
                    <div className="hidden md:flex items-center justify-center w-full max-w-[150px] sm:max-w-[1800px] md:max-w-[200px] lg:max-w-[250px] flex-shrink-0">
                        <HeroBanner
                            src={portrait}
                            alt={portraitAlt}
                            className="w-full h-auto rounded-full object-cover shadow-lg ring-1 ring-border dark:ring-border/50"
                        />
                    </div>
                </MotionWrapper>
            </div>
        </Section>
    );
}
