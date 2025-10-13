import HeroBanner from "@/components/home/HeroBanner";
import MotionWrapper from "@/components/motion/MotionWrapper";
import BlurImage from "@/components/ui/BlurImage";
import CustomLink from "@/components/ui/CustomLink";
import HighlightedWord from "@/components/ui/HighlightedWord";
import HoverButton from "@/components/ui/HoverButton";
import Section from "@/components/ui/Section";
import Link from "next/link";
import iconicLogo from "../../../public/assets/iconic.png";
import src from "../../../public/assets/profile.png";

export default function Hero() {
    return (
        <Section id="hero" animate={true}>
            <div className="flex flex-row items-center gap-8 sm:gap-12">
                <div className="flex-1 min-w-0">
                    {/* Badge */}
                    <MotionWrapper direction="left" distance={10} duration={0.5}>
                        <div className="rounded-l-full p-3 inline-flex bg-gradient-to-r from-primary/10 dark:from-primary/20 to-transparent -ml-3 mb-4 sm:mb-6">
                            <div className="rounded-l-full px-4 py-2.5 sm:px-6 sm:py-3.5 inline-flex items-center gap-4 bg-gradient-to-r from-primary/70 to-transparent">
                                <span className="shrink-0 rounded-full block size-2 bg-white shadow-[0_0_5px_rgba(var(--primary-rgb),0.4),0_0_10px_rgba(var(--primary-rgb),0.3)]"></span>
                                <div className="text-sm sm:text-base text-white flex gap-1.5 flex-wrap items-center">
                                    <span className="shrink-0">Crafting Experiences at</span>
                                    <CustomLink
                                        href="http://www.iconicsolutionsbd.com/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-medium text-white hover:text-primary"
                                    >
                                        Iconic
                                    </CustomLink>
                                    <BlurImage
                                        alt="Iconic Logo"
                                        loading="lazy"
                                        width={20}
                                        height={20}
                                        className="w-4 rounded"
                                        src={iconicLogo}
                                        suppressHydrationWarning={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </MotionWrapper>

                    {/* Heading */}
                    <MotionWrapper direction="left" distance={20} duration={0.6}>
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-2 sm:mb-4 text-foreground flex">
                            <span className="mr-2">Hi! I&apos;m</span>
                            <HighlightedWord>Zahin</HighlightedWord>
                        </h1>
                    </MotionWrapper>

                    {/* Description */}
                    <MotionWrapper direction="left" distance={20} duration={0.6} delay={0.1}>
                        <div className="space-y-3 sm:space-y-4 text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
                            <p className="text-xl md:text-md mb-4">
                                I work with <span className="text-primary font-medium">React</span> & <span className="text-primary font-medium">Laravel</span> Ecosystem, and write to teach people how to rebuild and redefine fundamental concepts through mental models.
                            </p>
                            <div className="text-muted-foreground text-lg md:text-md">
                                Need a modern web app that stands out?{' '}
                                <span className="relative inline-block">
                                    <CustomLink href="/contact">Hire me?</CustomLink>
                                </span>
                            </div>
                        </div>
                    </MotionWrapper>

                    {/* Buttons */}
                    <MotionWrapper direction="left" distance={20} duration={0.6} delay={0.2}>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                            <div className="mt-6 sm:mt-10 flex gap-2 sm:gap-4">
                                <HoverButton href="/blog-intro" title="Resume" />
                                <Link
                                    href="/about"
                                    className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 shadow-feature-card rounded-xl bg-foreground text-background font-medium transition-all duration-200 hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                >
                                    More about me
                                </Link>
                            </div>
                        </div>
                    </MotionWrapper>
                </div>

                {/* Profile Image */}
                <MotionWrapper direction="right" distance={20} duration={0.7} delay={0.3}>
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