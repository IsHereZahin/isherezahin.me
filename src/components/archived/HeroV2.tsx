"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import { useEffect, useState } from "react";
import BlurImage from "../ui/BlurImage";

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

        setDark(document.documentElement.classList.contains("dark"));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden mt-[-5rem]">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <BlurImage
                    src="https://images.unsplash.com/photo-1681662410751-0b6382f135c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZ3JhZGllbnQlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc1OTkxMTA0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Background"
                    className="w-full h-full object-cover opacity-10 mask-[linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]"
                />
                <div
                    className={`
            absolute inset-0 mask-[linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]
            ${dark
                            ? "bg-gradient-to-b from-[#111111]/80 via-[#111111]/90 to-[#111111]"
                            : "bg-gradient-to-b from-[#f5f5f5]/80 via-[#f5f5f5]/90 to-[#f5f5f5]"
                        }
            `}
                />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto text-center">
                {/* Profile Photo */}
                <MotionWrapper direction="bottom" distance={20} duration={0.6} className="mb-8">
                    <div className="inline-block">
                        <BlurImage
                            width={1080}
                            height={1080}
                            src="https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTg1NTEyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover mx-auto grayscale hover:grayscale-0 transition-all duration-500 ring-4 ring-black/5 hover:ring-[#4ade80]/30"
                        />
                    </div>
                </MotionWrapper>

                {/* Main Heading */}
                <MotionWrapper direction="bottom" distance={20} duration={0.6} className="mb-4">
                    <h1 className="text-5xl md:text-6xl mb-2">Hey, I&apos;m Mia Carter.</h1>
                    <h2 className="text-4xl md:text-5xl">
                        Dreamer & ☕ Designer
                    </h2>
                </MotionWrapper>

                {/* Description */}
                <MotionWrapper direction="bottom" distance={20} duration={0.6} className="mb-8">
                    <p className="text-xl text-secondary-foreground max-w-2xl mx-auto leading-relaxed">
                        Crafting seamless experiences and bold visuals. High school student by day, creative thinker, and aspiring innovator by ☕ night.
                    </p>
                </MotionWrapper>

                {/* CTA Buttons */}
                <MotionWrapper direction="bottom" distance={20} duration={0.6} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="bg-foreground text-background px-8 py-3 rounded-full hover:bg-foreground/90 transition-colors">
                        Book a Call
                    </button>
                    <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 cursor-pointer">
                        <span className="w-2 h-2 rounded-full bg-primary/20 animate-pulse" />
                        <span className="text-sm text-foreground">Available for new project</span>
                    </div>
                </MotionWrapper>
            </div>
        </section>
    );
}