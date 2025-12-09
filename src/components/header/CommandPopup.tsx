"use client";

import { BarChart3, BookOpen, Info } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import MotionPopup from "@/components/motion/MotionPopup";
import { BlurImage } from "@/components/ui";
import AdventureImg from "../../../public/assets/images/CommandPopup/Adventure.jpg";
import StudyImg from "../../../public/assets/images/CommandPopup/Desktop Setup.jpg";
import TravelImg from "../../../public/assets/images/CommandPopup/Travel.jpg";

interface CommandPopupProps {
    onClose: () => void;
}

export default function CommandPopup({ onClose }: Readonly<CommandPopupProps>) {
    const pathname = usePathname();

    const isActive = (href: string) => pathname.startsWith(href);

    const ActiveTag = () => (
        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-primary/20 text-primary">
            Current
        </span>
    );
    return (
        <MotionPopup isOpen={true} className="z-50 rounded-xl bg-background/85 shadow-2xl outline-none backdrop-blur-sm border border-border p-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
            <Link
                className="group/header-link flex flex-col justify-end p-5 rounded-xl relative overflow-hidden md:col-span-1 lg:col-span-1"
                href="/uses"
                onClick={onClose}
            >
                <div className="absolute inset-0 z-[-1] rounded-xl overflow-hidden">
                    <figure className="rounded shadow-lg dark:shadow-none isolate absolute inset-0 z-[-1] overflow-hidden select-none pointer-events-none">
                        <BlurImage
                            alt="A photo of my workspace"
                            title="A photo of my workspace"
                            src={StudyImg}
                        />
                    </figure>
                </div>
                <div className="rounded-[11px] bg-gradient-to-b from-black/30 to-black/50 absolute inset-0 z-[-1] group-hover/header-link:opacity-0 opacity-100 transition-opacity duration-300"></div>
                <div className="rounded-md p-2 transition-all duration-300 z-10 relative">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold underline decoration-transparent group-hover/header-link:decoration-white/50 transition-colors text-white">Uses</p>
                        {isActive("/uses") && <ActiveTag />}
                    </div>
                    <p className="text-xs text-white/80">A peek into my digital workspace</p>
                </div>
            </Link>
            <Link
                className="group/header-link flex flex-col justify-end p-5 rounded-xl relative overflow-hidden md:col-span-1 lg:col-span-1"
                href="/bucket-list"
                onClick={onClose}
            >
                <div className="absolute inset-0 z-[-1] rounded-xl overflow-hidden">
                    <figure className="rounded shadow-lg dark:shadow-none isolate absolute inset-0 z-[-1] overflow-hidden select-none pointer-events-none">
                        <BlurImage
                            alt="A photo of me skydiving"
                            title="A photo of me skydiving"
                            src={TravelImg}
                        />
                    </figure>
                </div>
                <div className="rounded-[11px] bg-gradient-to-b from-black/30 to-black/50 absolute inset-0 z-[-1] group-hover/header-link:opacity-0 opacity-100 transition-opacity duration-300"></div>
                <div className="rounded-md p-2 transition-all duration-300 z-10 relative">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold underline decoration-transparent group-hover/header-link:decoration-white/50 transition-colors text-white">Bucket List</p>
                        {isActive("/bucket-list") && <ActiveTag />}
                    </div>
                    <p className="text-xs text-white/80">Things to do at least once in life</p>
                </div>
            </Link>
            <div className="md:col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Link
                    className="group/header-link flex flex-col justify-end p-5 rounded-xl relative overflow-hidden"
                    href="/side-quests"
                    onClick={onClose}
                >
                    <div className="absolute inset-0 z-[-1] rounded-xl overflow-hidden">
                        <figure className="rounded shadow-lg dark:shadow-none isolate absolute inset-0 z-[-1] overflow-hidden select-none pointer-events-none">
                            <BlurImage
                                alt="A photo of me freediving"
                                title="A photo of me freediving"
                                src={AdventureImg}
                            />
                        </figure>
                    </div>
                    <div className="rounded-[11px] bg-gradient-to-b from-black/30 to-black/50 absolute inset-0 z-[-1] group-hover/header-link:opacity-0 opacity-100 transition-opacity duration-300"></div>
                    <div className="rounded-md p-2 transition-all duration-300 z-10 relative">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold underline decoration-transparent group-hover/header-link:decoration-white/50 transition-colors text-white">Side Quests</p>
                            {isActive("/side-quests") && <ActiveTag />}
                        </div>
                        <p className="text-xs text-white/80">New skills and adventures</p>
                    </div>
                </Link>
                <div className="flex flex-col gap-2 justify-between h-full">
                    <Link
                        className="group/header-link p-3 rounded-xl bg-muted/70 w-full flex items-start gap-3 transition-colors hover:bg-muted flex-1"
                        href="/guestbook"
                        onClick={onClose}
                    >
                        <div className="mt-0.5 p-3 bg-muted text-muted-foreground rounded-xl [&>svg]:size-4 [&>svg]:stroke-1">
                            <BookOpen className="size-4 stroke-1" />
                        </div>
                        <div className="grow">
                            <div className="flex items-center gap-2 justify-between">
                                <p className="text-sm font-semibold underline decoration-transparent group-hover/header-link:decoration-foreground/50 transition-colors text-foreground">Guest Book</p>
                                {isActive("/guestbook") && <ActiveTag />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">Leave me a message</p>
                        </div>
                    </Link>
                    <Link
                        className="group/header-link p-3 rounded-xl bg-muted/70 w-full flex items-start gap-3 transition-colors hover:bg-muted flex-1"
                        href="/statistics"
                        onClick={onClose}
                    >
                        <div className="mt-0.5 p-3 bg-muted text-muted-foreground rounded-xl [&>svg]:size-4 [&>svg]:stroke-1">
                            <BarChart3 className="size-4 stroke-1" />
                        </div>
                        <div className="grow">
                            <div className="flex items-center gap-2 justify-between">
                                <p className="text-sm font-semibold underline decoration-transparent group-hover/header-link:decoration-foreground/50 transition-colors text-foreground">Statistics</p>
                                {isActive("/statistics") && <ActiveTag />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">Crunched up numbers</p>
                        </div>
                    </Link>
                    <Link
                        className="group/header-link p-3 rounded-xl bg-muted/70 w-full flex items-start gap-3 transition-colors hover:bg-muted flex-1"
                        href="/attribution"
                        onClick={onClose}
                    >
                        <div className="mt-0.5 p-3 bg-muted text-muted-foreground rounded-xl [&>svg]:size-4 [&>svg]:stroke-1">
                            <Info className="size-4 stroke-1" />
                        </div>
                        <div className="grow">
                            <div className="flex items-center gap-2 justify-between">
                                <p className="text-sm font-semibold underline decoration-transparent group-hover/header-link:decoration-foreground/50 transition-colors text-foreground">Attribution</p>
                                {isActive("/attribution") && <ActiveTag />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">Journey to create this site</p>
                        </div>
                    </Link>
                </div>
            </div>
        </MotionPopup>
    );
}