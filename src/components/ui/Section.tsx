'use client'

import { ReactNode } from "react";
import MotionWrapper from '@/components/motion/MotionWrapper';

export interface SectionProps {
    id: string;
    children: ReactNode;
    animate?: boolean;
    className?: string;
    direction?: "top" | "bottom" | "left" | "right";
    distance?: number;
    duration?: number;
}

export default function Section({
    id,
    children,
    animate = false,
    className = "px-6 py-16 max-w-[1000px]",
    direction = "bottom",
    distance = 20,
    duration = 0.5,
}: Readonly<SectionProps>) {
    const sectionContent = (
        <section id={id} className={`${className} mx-auto relative`}>
            {children}
        </section>
    );

    if (!animate) return sectionContent;

    return (
        <MotionWrapper direction={direction} distance={distance} duration={duration}>
            {sectionContent}
        </MotionWrapper>
    );
}