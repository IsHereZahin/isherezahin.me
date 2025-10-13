"use client";

import { HTMLMotionProps, motion } from "motion/react";

type Direction = "left" | "right" | "top" | "bottom";

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
    direction?: Direction;
    distance?: number;
    duration?: number;
    delay?: number;
    children: React.ReactNode;
}

export default function MotionWrapper({
    direction = "bottom",
    distance = 30,
    duration = 0.5,
    delay = 0,
    children,
    ...props
}: Readonly<MotionWrapperProps>) {
    const initialPosition = {
        left: { x: -distance, y: 0 },
        right: { x: distance, y: 0 },
        top: { x: 0, y: -distance },
        bottom: { x: 0, y: distance },
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...initialPosition[direction] }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration, delay, ease: "easeOut" }}
            {...props}
        >
            {children}
        </motion.div>
    );
}