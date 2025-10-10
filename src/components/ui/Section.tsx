'use client'

import { motion, useInView } from 'motion/react';
import { ReactNode, RefObject, useRef } from "react";

export interface SectionProps {
    id: string;
    children: ReactNode;
    animate?: boolean;
    className?: string;
    variants?: {
        initial: { y: number; opacity: number };
        animate: { y: number; opacity: number };
    };
    cardsRef?: RefObject<HTMLDivElement>;
    transition?: { duration: number; delay?: number };
    delay?: number;
}

export default function Section({
    id,
    children,
    animate = false,
    className = "px-6 py-16 max-w-[1000px]",
    variants: customVariants,
    cardsRef: customCardsRef,
    transition: customTransition,
    delay = 0
}: Readonly<SectionProps>) {
    const defaultVariants = {
        initial: { y: 40, opacity: 0 },
        animate: { y: 0, opacity: 1 }
    };

    const variants = customVariants || defaultVariants;

    const internalRef = useRef<HTMLDivElement>(null);
    const finalRef = customCardsRef || internalRef;

    const isInView = useInView(finalRef, { once: true, margin: '-100px' });

    const defaultTransition = { duration: 0.5, delay };
    const finalTransition = { ...defaultTransition, ...customTransition };

    if (!animate) {
        return (
            <section
                id={id}
                className={`${className} mx-auto relative`}
            >
                {children}
            </section>
        );
    }

    return (
        <motion.div
            className='relative'
            initial='initial'
            animate={isInView ? 'animate' : 'initial'}
            variants={variants}
            ref={finalRef}
            transition={finalTransition}
        >
            <section
                id={id}
                className={`${className} mx-auto relative`}
            >
                {children}
            </section>
        </motion.div>
    );
}