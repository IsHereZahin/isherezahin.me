"use client";

import { AnimatePresence, motion, easeIn, easeOut } from "framer-motion";
import { ReactNode } from "react";

interface MotionPopupProps {
    isOpen: boolean;
    children: ReactNode;
    className?: string;
    origin?: string;
}

const variants = {
    open: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { duration: 0.15, ease: easeOut } 
    },
    closed: { 
        opacity: 0, 
        scale: 0.95, 
        y: -10,
        transition: { duration: 0.15, ease: easeIn } 
    },
};

export default function MotionPopup({ 
    isOpen, 
    children, 
    className = "", 
    origin = "top-right" 
}: Readonly<MotionPopupProps>) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={className}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={variants}
                    style={{ transformOrigin: origin }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}