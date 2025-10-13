import { BarChart3, BookOpen, Info } from "lucide-react";

import Link from "next/link";

import MotionPopup from "@/components/motion/MotionPopup";
import AdventureImg from "../../../public/assets/CommandPopup/Adventure.jpg";
import StudyImg from "../../../public/assets/CommandPopup/Desktop Setup.jpg";
import TravelImg from "../../../public/assets/CommandPopup/Travel.jpg";
import BlurImage from "../ui/BlurImage";

export default function CommandPopup() {
    return (
        <MotionPopup isOpen={true} className="z-50 rounded-xl bg-background/85 shadow-2xl outline-none backdrop-blur-sm border border-border p-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
            <Link className="group/header-link flex flex-col justify-end p-5 rounded-xl relative overflow-hidden md:col-span-1 lg:col-span-1" href="/uses">
                <div className="absolute inset-0 z-[-1] rounded-xl overflow-hidden">
                    <figure className="rounded shadow-lg dark:shadow-none isolate absolute inset-0 z-[-1] overflow-hidden select-none pointer-events-none">
                        <BlurImage
                            alt="A photo of my workspace"
                            title="A photo of my workspace"
                            loading="lazy"
                            src={StudyImg}
                            className="absolute left-0 top-0 object-cover group-hover/header-link:scale-110 transition-transform duration-300 ease-in-out"
                            style={{ color: "transparent" }}
                        />
                    </figure>
                </div>
                <div className="rounded-[11px] bg-gradient-to-b from-black/30 to-black/50 absolute inset-0 z-[-1] group-hover/header-link:opacity-0 opacity-100 transition-opacity duration-300"></div>
                <div className="rounded-md p-2 transition-all duration-300 z-10 relative">
                    <p className="text-sm font-semibold underline decoration-transparent group-hover/header-link:decoration-white/50 transition-colors text-white">Uses</p>
                    <p className="text-xs text-white/80">A peek into my digital workspace</p>
                </div>
            </Link>
            <Link className="group/header-link flex flex-col justify-end p-5 rounded-xl relative overflow-hidden md:col-span-1 lg:col-span-1" href="/bucket-list">
                <div className="absolute inset-0 z-[-1] rounded-xl overflow-hidden">
                    <figure className="rounded shadow-lg dark:shadow-none isolate absolute inset-0 z-[-1] overflow-hidden select-none pointer-events-none">
                        <BlurImage
                            alt="A photo of me skydiving"
                            title="A photo of me skydiving"
                            loading="lazy"
                            src={TravelImg}
                            className="absolute left-0 top-0 object-cover group-hover/header-link:scale-110 transition-transform duration-300 ease-in-out"
                            style={{ color: "transparent" }}
                        />
                    </figure>
                </div>
                <div className="rounded-[11px] bg-gradient-to-b from-black/30 to-black/50 absolute inset-0 z-[-1] group-hover/header-link:opacity-0 opacity-100 transition-opacity duration-300"></div>
                <div className="rounded-md p-2 transition-all duration-300 z-10 relative">
                    <p className="text-sm font-semibold underline decoration-transparent group-hover/header-link:decoration-white/50 transition-colors text-white">Bucket List</p>
                    <p className="text-xs text-white/80">Things to do at least once in life</p>
                </div>
            </Link>
            <div className="md:col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Link className="group/header-link flex flex-col justify-end p-5 rounded-xl relative overflow-hidden" href="/side-quests">
                    <div className="absolute inset-0 z-[-1] rounded-xl overflow-hidden">
                        <figure className="rounded shadow-lg dark:shadow-none isolate absolute inset-0 z-[-1] overflow-hidden select-none pointer-events-none">
                            <BlurImage
                                alt="A photo of me freediving"
                                title="A photo of me freediving"
                                loading="lazy"
                                src={AdventureImg}
                                className="absolute left-0 top-0 object-cover group-hover/header-link:scale-110 transition-transform duration-300 ease-in-out"
                                style={{ color: "transparent" }}
                            />
                        </figure>
                    </div>
                    <div className="rounded-[11px] bg-gradient-to-b from-black/30 to-black/50 absolute inset-0 z-[-1] group-hover/header-link:opacity-0 opacity-100 transition-opacity duration-300"></div>
                    <div className="rounded-md p-2 transition-all duration-300 z-10 relative">
                        <p className="text-sm font-semibold underline decoration-transparent group-hover/header-link:decoration-white/50 transition-colors text-white">Side Quests</p>
                        <p className="text-xs text-white/80">New skills and adventures</p>
                    </div>
                </Link>
                <div className="flex flex-col gap-2 justify-between h-full">
                    <Link className="group/header-link p-3 rounded-xl bg-muted/70 w-full flex items-start gap-3 transition-colors hover:bg-muted flex-1" href="/guestbook">
                        <div className="mt-0.5 p-3 bg-muted text-muted-foreground rounded-xl [&>svg]:size-4 [&>svg]:stroke-1">
                            <BookOpen className="size-4 stroke-1" />
                        </div>
                        <div className="grow">
                            <div className="flex items-center gap-2 justify-between">
                                <p className="text-sm font-semibold underline decoration-transparent group-hover/header-link:decoration-foreground/50 transition-colors text-foreground">Guest Book</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">Leave me a message</p>
                        </div>
                    </Link>
                    <Link className="group/header-link p-3 rounded-xl bg-muted/70 w-full flex items-start gap-3 transition-colors hover:bg-muted flex-1" href="/statistics">
                        <div className="mt-0.5 p-3 bg-muted text-muted-foreground rounded-xl [&>svg]:size-4 [&>svg]:stroke-1">
                            <BarChart3 className="size-4 stroke-1" />
                        </div>
                        <div className="grow">
                            <div className="flex items-center gap-2 justify-between">
                                <p className="text-sm font-semibold underline decoration-transparent group-hover/header-link:decoration-foreground/50 transition-colors text-foreground">Statistics</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">Crunched up numbers</p>
                        </div>
                    </Link>
                    <Link className="group/header-link p-3 rounded-xl bg-muted/70 w-full flex items-start gap-3 transition-colors hover:bg-muted flex-1" href="/attribution">
                        <div className="mt-0.5 p-3 bg-muted text-muted-foreground rounded-xl [&>svg]:size-4 [&>svg]:stroke-1">
                            <Info className="size-4 stroke-1" />
                        </div>
                        <div className="grow">
                            <div className="flex items-center gap-2 justify-between">
                                <p className="text-sm font-semibold underline decoration-transparent group-hover/header-link:decoration-foreground/50 transition-colors text-foreground">Attribution</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">Journey to create this site</p>
                        </div>
                    </Link>
                </div>
            </div>
        </MotionPopup>
    );
}