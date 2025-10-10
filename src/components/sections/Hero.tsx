"use client";

import { motion, useInView } from 'motion/react';
import Link from "next/link";
import { useRef } from 'react';
import iconicLogo from "../../../public/assets/iconic.png";
import src from "../../../public/assets/profile.png";
import HeroBanner from "../HeroBanner";
import BlurImage from "../ui/BlurImage";
import CustomLink from "../ui/CustomLink";
import HighlightedWord from "../ui/HighlightedWord";
import HoverButton from "../ui/HoverButton";
import Section from "../ui/Section";

const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
} as const;

const itemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" as const },
    },
} as const;

const imageVariants = {
    hidden: { scale: 0.8, opacity: 0, rotate: -5 },
    visible: {
        scale: 1,
        opacity: 1,
        rotate: 0,
        transition: {
            duration: 0.7,
            ease: "easeOut" as const,
            type: "spring",
            stiffness: 100,
            damping: 12,
        },
    },
} as const;

export default function Hero() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <Section
            id="hero"
            animate={true}
        >
            <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="flex flex-row items-center gap-8 sm:gap-12"
            >
                <motion.div
                    variants={itemVariants}
                    className="flex-1 min-w-0"
                >
                    <motion.div
                        variants={itemVariants}
                        className="rounded-l-full p-3 inline-flex bg-gradient-to-r from-primary/10 dark:from-primary/20 to-transparent -ml-3 mb-4 sm:mb-6"
                    >
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
                    </motion.div>
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl lg:text-6xl font-bold leading-tight mb-2 sm:mb-4 text-foreground flex"
                    >
                        <span className="mr-2">Hi! I&apos;m</span><HighlightedWord>Zahin</HighlightedWord>
                    </motion.h1>
                    <motion.div
                        variants={itemVariants}
                        className="space-y-3 sm:space-y-4 text-sm sm:text-[15px] leading-relaxed text-muted-foreground"
                    >
                        <motion.p
                            variants={itemVariants}
                            className="text-xl md:text-md"
                            style={{ marginBottom: '1rem' }} // Ensures proper spacing in stagger
                        >
                            I work with <span className="text-primary font-medium">React</span> & <span className="text-primary font-medium">Laravel</span> Ecosystem, and write to teach people how to rebuild and redefine fundamental concepts through mental models.
                        </motion.p>
                        <motion.div
                            variants={itemVariants}
                            className="text-muted-foreground text-lg md:text-md"
                        >
                            Need a modern web app that stands out?{' '}
                            <span className="relative inline-block">
                                <CustomLink href="/contact">
                                    Hire me?
                                </CustomLink>
                            </span>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="mt-6 sm:mt-10 flex gap-2 sm:gap-4"
                            data-fade="3"
                        >
                            <HoverButton href="/blog-intro" title="Resume" />
                            <Link
                                href="/about"
                                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 shadow-feature-card rounded-xl bg-foreground text-background font-medium transition-all duration-200 hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                More about me
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
                <motion.div
                    variants={imageVariants}
                    className="hidden md:flex items-center justify-center w-full max-w-[150px] sm:max-w-[1800px] md:max-w-[200px] lg:max-w-[250px] flex-shrink-0"
                >
                    <HeroBanner
                        src={src}
                        alt="Zahin"
                        width={300}
                        height={300}
                        className="w-full h-auto rounded-full object-cover shadow-lg ring-1 ring-border dark:ring-border/50"
                    />
                </motion.div>
            </motion.div>
        </Section>
    );
}