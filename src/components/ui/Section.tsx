'use client'

import { ReactNode, useRef, RefObject } from "react";
import { motion, useInView } from 'motion/react';

export interface SectionProps {
    id: string;
    children: ReactNode;
    animate?: boolean;
    variants?: {
        initial: { y: number; opacity: number };
        animate: { y: number; opacity: number };
    };
    cardsRef?: RefObject<HTMLDivElement>;
    transition?: { duration: number };
}

export default function Section({ 
    id, 
    children, 
    animate = false, 
    variants: customVariants,
    cardsRef: customCardsRef,
    transition: customTransition 
}: Readonly<SectionProps>) {
    // Default variants for fade-in animation
    const defaultVariants = {
        initial: {
            y: 40,
            opacity: 0
        },
        animate: {
            y: 0,
            opacity: 1
        }
    };

    // Use custom or default variants
    const variants = customVariants || defaultVariants;

    // Create internal ref if not provided
    const internalRef = useRef<HTMLDivElement>(null);
    const finalRef = customCardsRef || internalRef;

    const isInView = useInView(finalRef, { once: true, margin: '-100px' });

    // Default transition
    const defaultTransition = { duration: 0.5 };
    const finalTransition = customTransition || defaultTransition;

    if (!animate) {
        // Plain section if animation is disabled
        return (
            <section id={id} className="max-w-[1000px] mx-auto px-6 py-16 relative">
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
            <section id={id} className="max-w-[1000px] mx-auto px-6 py-16 relative">
                {children}
            </section>
        </motion.div>
    );
}