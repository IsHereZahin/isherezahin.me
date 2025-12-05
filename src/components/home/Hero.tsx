import { HeroBanner } from "@/components/home";
import { MotionWrapper } from "@/components/motion";
import {
    BlurImage,
    Button,
    HighlightedWord,
    ReferralLink,
    Section,
} from "@/components/ui";
import { MY_NAME } from "@/lib/constants";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import iconicLogo from "../../../public/assets/images/iconic.png";
import src from "../../../public/assets/images/profile.png";

export default function Hero() {
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
                                    <span className="shrink-0">Crafting Experiences at</span>
                                    <ReferralLink
                                        href="http://www.iconicsolutionsbd.com"
                                        className="font-medium text-primary"
                                    >
                                        Iconic
                                    </ReferralLink>
                                    <BlurImage
                                        alt="Iconic Logo"
                                        loading="lazy"
                                        width={20}
                                        height={20}
                                        className="w-3 sm:w-4 rounded"
                                        src={iconicLogo}
                                        suppressHydrationWarning={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </MotionWrapper>

                    {/* Heading */}
                    <MotionWrapper direction="top" delay={0.3}>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2 sm:mb-4 text-foreground flex flex-wrap">
                            <span className="mr-2">Hi! I&apos;m</span>
                            <HighlightedWord>{MY_NAME}</HighlightedWord>
                        </h1>
                    </MotionWrapper>

                    {/* Description */}
                    <MotionWrapper direction="top" delay={0.4}>
                        <div className="space-y-2 sm:space-y-4 leading-relaxed">
                            <p className="text-sm sm:text-base md:text-lg mb-3 sm:mb-4 text-muted-foreground hover:text-foreground/80 transition-colors">
                                I work with <span className="text-primary font-medium">React</span> & <span className="text-primary font-medium">Laravel</span> Ecosystem, and write to teach people how to rebuild and redefine fundamental concepts through mental models.
                            </p>
                            <p className="text-sm sm:text-base md:text-lg text-muted-foreground hover:text-foreground/80 transition-colors">
                                Need a modern web app that stands out?{' '}
                                <span className="relative inline-block">
                                    <Link href="/contact" className="text-primary hover:underline">Hire me?</Link>
                                </span>
                            </p>
                        </div>
                    </MotionWrapper>

                    {/* Buttons */}
                    <MotionWrapper direction="top" delay={0.5}>
                        <div className="mt-6 sm:mt-8 flex gap-2 sm:gap-4 flex-wrap">
                            <Button href="#about-me" text="Learn More" icon={<ArrowDown className="size-[70%] text-foreground" />} />
                            <Button href="/about" text="More about me" />
                        </div>
                    </MotionWrapper>
                </div>

                {/* Profile Image */}
                <MotionWrapper direction="right" delay={0.2}>
                    <div className="hidden md:flex items-center justify-center w-full max-w-[150px] sm:max-w-[1800px] md:max-w-[200px] lg:max-w-[250px] flex-shrink-0">
                        <HeroBanner
                            src={src}
                            alt="Zahin"
                            className="w-full h-auto rounded-full object-cover shadow-lg ring-1 ring-border dark:ring-border/50"
                        />
                    </div>
                </MotionWrapper>
            </div>
        </Section>
    );
}