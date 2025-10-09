"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ImageWithFallback } from "../ImageWithFallback";

export default function HeroV2() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setDark(document.documentElement.classList.contains("dark"));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        // initial check
        setDark(document.documentElement.classList.contains("dark"));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden mt-[-5rem]">
            <div className="absolute inset-0 z-0">
                <ImageWithFallback
                    src="https://images.unsplash.com/photo-1681662410751-0b6382f135c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZ3JhZGllbnQlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc1OTkxMTA0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Background"
                    className="w-full h-full object-cover opacity-10 mask-[linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]"
                />

                <div
                    className={`
                            absolute inset-0 mask-[linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]
                            ${dark
                            ? 'bg-gradient-to-b from-[#111111]/80 via-[#111111]/90 to-[#111111]'
                            : 'bg-gradient-to-b from-[#f5f5f5]/80 via-[#f5f5f5]/90 to-[#f5f5f5]'
                        }
                    `}
                />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto text-center">
                {/* Profile Photo with Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-8"
                >
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image
                            width={1080}
                            height={1080}
                            src="https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTg1NTEyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover mx-auto grayscale hover:grayscale-0 transition-all duration-500 ring-4 ring-black/5 hover:ring-[#4ade80]/30"
                        />
                    </motion.div>
                </motion.div>

                {/* Main Heading with Stagger Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-4"
                >
                    <h1 className="text-5xl md:text-6xl mb-2">
                        Hey, I&apos;m Mia Carter.
                    </h1>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-4xl md:text-5xl"
                    >
                        Dreamer & ☕ Designer
                    </motion.h2>
                </motion.div>

                {/* Description with Animation */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-xl text-secondary-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
                >
                    Crafting seamless experiences and bold visuals. High school student by day, creative thinker, and aspiring innovator by ☕ night.
                </motion.p>

                {/* CTA Buttons with Animation and Hover Effects */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-foreground text-background px-8 py-3 rounded-full hover:bg-foreground/90 transition-colors"
                    >
                        Book a Call
                    </motion.button>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 cursor-pointer"
                    >
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-primary/20"
                        />
                        <span className="text-sm text-foreground">Available for new project</span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}