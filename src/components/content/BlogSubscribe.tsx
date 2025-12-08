/**
 * BlogSubscribe Component
 *
 * Design inspired by Theodorus Clarence (https://theodorusclarence.com)
 * GitHub: https://github.com/theodorusclarence
 *
 * Credits to Theodorus Clarence for the original design concept
 * of the stacked notification cards and subscribe section layout.
 */

"use client";

import { Check, ChevronRight, Flame, Loader2, Mail, Podcast } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { newsletter } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";

const DecorativeSVG = ({ className, id }: { className?: string; id: string }) => (
    <svg
        width="535"
        height="251"
        viewBox="0 0 535 251"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <g opacity="1">
            <mask id={`path-1-inside-${id}`} fill="white">
                <path d="M362.691 101.828C362.691 86.4405 375.165 73.9668 390.552 73.9668H416.091C431.478 73.9668 443.952 86.4405 443.952 101.828V127.367C443.952 142.754 431.478 155.228 416.091 155.228H390.552C375.165 155.228 362.691 142.754 362.691 127.367V101.828Z" />
                <path d="M453.239 11.2798C453.239 -4.10732 465.713 -16.5811 481.1 -16.5811H506.639C522.026 -16.5811 534.5 -4.10732 534.5 11.2798V36.8189C534.5 52.2061 522.026 64.6798 506.639 64.6798H481.1C465.713 64.6798 453.239 52.2061 453.239 36.8189V11.2798Z" />
                <path d="M181.596 11.2798C181.596 -4.10732 194.069 -16.5811 209.457 -16.5811H234.996C250.383 -16.5811 262.857 -4.10732 262.857 11.2798V36.8189C262.857 52.2061 250.383 64.6798 234.996 64.6798H209.457C194.069 64.6798 181.596 52.2061 181.596 36.8189V11.2798Z" />
                <path d="M0.5 101.828C0.5 86.4405 12.9737 73.9668 28.3609 73.9668H53.9C69.2871 73.9668 81.7609 86.4405 81.7609 101.828V127.367C81.7609 142.754 69.2871 155.228 53.9 155.228H28.3609C12.9737 155.228 0.5 142.754 0.5 127.367V101.828Z" />
                <path d="M0.5 192.375C0.5 176.988 12.9737 164.515 28.3609 164.515H53.9C69.2871 164.515 81.7609 176.988 81.7609 192.375V217.915C81.7609 233.302 69.2871 245.775 53.9 245.775H28.3609C12.9737 245.775 0.5 233.302 0.5 217.915V192.375Z" />
                <path d="M91.0478 101.828C91.0478 86.4405 103.522 73.9668 118.909 73.9668H144.448C159.835 73.9668 172.309 86.4405 172.309 101.828V217.915C172.309 233.302 159.835 245.775 144.448 245.775H118.909C103.522 245.775 91.0478 233.302 91.0478 217.915V101.828Z" />
                <path d="M209.457 155.228C194.069 155.228 181.596 142.754 181.596 127.367V101.828C181.596 86.4405 194.069 73.9668 209.457 73.9668H325.543C340.931 73.9668 353.404 86.4405 353.404 101.828V127.367C353.404 142.754 340.931 155.228 325.543 155.228H209.457Z" />
                <path d="M300.004 64.6798C284.617 64.6798 272.143 52.2061 272.143 36.8189V11.2798C272.143 -4.10732 284.617 -16.5811 300.004 -16.5811H416.091C431.478 -16.5811 443.952 -4.10732 443.952 11.2798V36.8189C443.952 52.2061 431.478 64.6798 416.091 64.6798H300.004Z" />
                <path d="M28.3609 64.6798C12.9737 64.6798 0.5 52.2061 0.5 36.8189V11.2798C0.5 -4.10732 12.9737 -16.5811 28.3609 -16.5811H144.448C159.835 -16.5811 172.309 -4.10732 172.309 11.2798V36.8189C172.309 52.2061 159.835 64.6798 144.448 64.6798H28.3609Z" />
            </mask>
            <path d="M362.691 101.828C362.691 86.4405 375.165 73.9668 390.552 73.9668H416.091C431.478 73.9668 443.952 86.4405 443.952 101.828V127.367C443.952 142.754 431.478 155.228 416.091 155.228H390.552C375.165 155.228 362.691 142.754 362.691 127.367V101.828Z" stroke={`url(#paint0_radial_${id})`} strokeWidth="2.4" mask={`url(#path-1-inside-${id})`} />
            <path d="M453.239 11.2798C453.239 -4.10732 465.713 -16.5811 481.1 -16.5811H506.639C522.026 -16.5811 534.5 -4.10732 534.5 11.2798V36.8189C534.5 52.2061 522.026 64.6798 506.639 64.6798H481.1C465.713 64.6798 453.239 52.2061 453.239 36.8189V11.2798Z" stroke={`url(#paint1_radial_${id})`} strokeWidth="2.4" mask={`url(#path-1-inside-${id})`} />
            <path d="M181.596 11.2798C181.596 -4.10732 194.069 -16.5811 209.457 -16.5811H234.996C250.383 -16.5811 262.857 -4.10732 262.857 11.2798V36.8189C262.857 52.2061 250.383 64.6798 234.996 64.6798H209.457C194.069 64.6798 181.596 52.2061 181.596 36.8189V11.2798Z" stroke={`url(#paint2_radial_${id})`} strokeWidth="2.4" mask={`url(#path-1-inside-${id})`} />
            <path d="M0.5 101.828C0.5 86.4405 12.9737 73.9668 28.3609 73.9668H53.9C69.2871 73.9668 81.7609 86.4405 81.7609 101.828V127.367C81.7609 142.754 69.2871 155.228 53.9 155.228H28.3609C12.9737 155.228 0.5 142.754 0.5 127.367V101.828Z" stroke={`url(#paint3_radial_${id})`} strokeWidth="2.4" mask={`url(#path-1-inside-${id})`} />
            <path d="M0.5 192.375C0.5 176.988 12.9737 164.515 28.3609 164.515H53.9C69.2871 164.515 81.7609 176.988 81.7609 192.375V217.915C81.7609 233.302 69.2871 245.775 53.9 245.775H28.3609C12.9737 245.775 0.5 233.302 0.5 217.915V192.375Z" stroke={`url(#paint4_radial_${id})`} strokeWidth="2.4" mask={`url(#path-1-inside-${id})`} />
            <path d="M91.0478 101.828C91.0478 86.4405 103.522 73.9668 118.909 73.9668H144.448C159.835 73.9668 172.309 86.4405 172.309 101.828V217.915C172.309 233.302 159.835 245.775 144.448 245.775H118.909C103.522 245.775 91.0478 233.302 91.0478 217.915V101.828Z" stroke={`url(#paint5_radial_${id})`} strokeWidth="2.4" mask={`url(#path-1-inside-${id})`} />
            <path d="M209.457 155.228C194.069 155.228 181.596 142.754 181.596 127.367V101.828C181.596 86.4405 194.069 73.9668 209.457 73.9668H325.543C340.931 73.9668 353.404 86.4405 353.404 101.828V127.367C353.404 142.754 340.931 155.228 325.543 155.228H209.457Z" stroke={`url(#paint6_radial_${id})`} strokeWidth="2.4" mask={`url(#path-1-inside-${id})`} />
            <path d="M300.004 64.6798C284.617 64.6798 272.143 52.2061 272.143 36.8189V11.2798C272.143 -4.10732 284.617 -16.5811 300.004 -16.5811H416.091C431.478 -16.5811 443.952 -4.10732 443.952 11.2798V36.8189C443.952 52.2061 431.478 64.6798 416.091 64.6798H300.004Z" stroke={`url(#paint7_radial_${id})`} strokeWidth="2.4" mask={`url(#path-1-inside-${id})`} />
            <path d="M28.3609 64.6798C12.9737 64.6798 0.5 52.2061 0.5 36.8189V11.2798C0.5 -4.10732 12.9737 -16.5811 28.3609 -16.5811H144.448C159.835 -16.5811 172.309 -4.10732 172.309 11.2798V36.8189C172.309 52.2061 159.835 64.6798 144.448 64.6798H28.3609Z" stroke={`url(#paint8_radial_${id})`} strokeWidth="2.4" mask={`url(#path-1-inside-${id})`} />
        </g>
        <defs>
            {[...Array(9)].map((_, i) => (
                <radialGradient
                    key={i}
                    id={`paint${i}_radial_${id}`}
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(270.989 252.319) rotate(45) scale(377.595 743.631)"
                >
                    <stop stopColor="currentColor" />
                    <stop offset="0.465" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
            ))}
        </defs>
    </svg>
);

interface NotificationCardProps {
    icon: React.ElementType;
    title: string;
    time: string;
    description: string;
    index: number;
    isInView: boolean;
}

const NotificationCard = ({
    icon: Icon,
    title,
    time,
    description,
    index,
    isInView,
}: NotificationCardProps) => {
    // Animation variants for each card
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: -50,
            x: 30,
            scale: 0.8,
            rotateX: -15,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            scale: index === 0 ? 1 : index === 1 ? 0.9 : 0.78,
            rotateX: 0,
            rotate: index === 0 ? 0 : index === 1 ? -1 : 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 15,
                delay: index * 0.15,
            },
        },
    };

    const brightnessClass = index === 0 ? "" : index === 1 ? "brightness-[85%]" : "brightness-[70%]";
    const zIndex = 30 - index * 10;
    const marginTop = index === 0 ? "" : index === 1 ? "-mt-7" : "-mt-10";

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`rounded-[1.25rem] p-3 bg-neutral-300 flex items-center gap-3 max-w-[22rem] relative ${marginTop} ${brightnessClass}`}
            style={{ zIndex }}
        >
            <motion.div
                className="flex items-center bg-neutral-950 rounded-xl p-3 shadow-md"
                initial={{ scale: 0, rotate: -180 }}
                animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: index * 0.15 + 0.2,
                }}
            >
                <Icon className="text-neutral-100" strokeWidth={1} size={24} />
            </motion.div>
            <div className="flex-grow overflow-hidden">
                <motion.div
                    className="flex items-center justify-between gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.15 + 0.3, duration: 0.4 }}
                >
                    <p className="text-sm font-semibold text-neutral-950">{title}</p>
                    <p className="text-xs text-neutral-700">{time}</p>
                </motion.div>
                <motion.p
                    className="text-xs text-neutral-700"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.15 + 0.4, duration: 0.4 }}
                >
                    {description}
                </motion.p>
            </div>
        </motion.div>
    );
};

const notificationData = [
    {
        icon: Mail,
        title: "New Blog Post",
        time: "20m ago",
        description: "Mastering Gradient Borders in CSS 🌈✨",
    },
    {
        icon: Podcast,
        title: "A talk is happening",
        time: "2h ago",
        description: "Sharing My 2023 Retrospective",
    },
    {
        icon: Flame,
        title: "New Blog Post",
        time: "4h ago",
        description: "and many more!",
    },
];

export default function BlogSubscribe() {
    const { user, status } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [checkingSubscription, setCheckingSubscription] = useState(false);

    const cardsRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardsRef, { once: true, amount: 0.3 });

    // Check subscription status when user is authenticated
    useEffect(() => {
        const checkSubscription = async () => {
            if (status === "authenticated" && user?.email) {
                setCheckingSubscription(true);
                try {
                    const data = await newsletter.checkSubscription(user.email);
                    setIsSubscribed(data.isSubscribed);
                } catch (error) {
                    console.error("Error checking subscription:", error);
                } finally {
                    setCheckingSubscription(false);
                }
            }
        };
        checkSubscription();
    }, [status, user?.email]);

    const handleSubscribe = async (emailToSubscribe: string) => {
        setIsLoading(true);
        try {
            const data = await newsletter.subscribe(emailToSubscribe);

            if (data.alreadySubscribed) {
                toast.info("You're already subscribed! 🎉");
                setIsSubscribed(true);
            } else if (data.success) {
                toast.success("Successfully subscribed! 🎉");
                setIsSubscribed(true);
            }
            setIsModalOpen(false);
            setEmail("");
        } catch (error) {
            console.error("Error subscribing:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleButtonClick = () => {
        if (status === "authenticated" && user?.email) {
            handleSubscribe(user.email);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            handleSubscribe(email);
        }
    };

    return (
        <>
            <div className="rounded-xl border md:p-12 p-6 dark:border-neutral-900 border-neutral-200 flex md:flex-row flex-col-reverse items-center justify-between gap-8 relative overflow-hidden mt-12">
                {/* Left decorative SVG */}
                <DecorativeSVG id="left" className="absolute top-0 -left-20 opacity-30 dark:opacity-20 text-neutral-500 dark:text-white" />

                {/* Right decorative SVG (hidden on mobile) */}
                <DecorativeSVG id="right" className="absolute -right-20 rotate-180 opacity-30 dark:opacity-20 hidden md:block text-neutral-500 dark:text-white" />

                {/* Content */}
                <motion.div
                    className="z-10"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {isSubscribed ? (
                        <>
                            <h3 className="text-xl md:text-2xl font-semibold">You&apos;re subscribed! 🎉</h3>
                            <p className="mt-2 text-neutral-400">
                                Thanks for subscribing! You&apos;ll get notified when new posts are published.
                            </p>
                            <motion.div
                                className="inline-flex items-center gap-3 mt-6 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                                <Check className="size-5" />
                                Subscribed
                            </motion.div>
                        </>
                    ) : (
                        <>
                            <h3 className="text-xl md:text-2xl font-semibold">Enjoying this post?</h3>
                            <p className="mt-2 text-neutral-400">
                                Don&apos;t miss out 😉. Get an email whenever I post, no spam.
                            </p>
                            <button
                                onClick={handleButtonClick}
                                disabled={isLoading || checkingSubscription}
                                className="relative group px-4 py-3 rounded-xl backdrop-blur-sm border border-foreground/10 hover:border-foreground/20 inline-flex items-center gap-3 mt-6 transition-all duration-200 hover:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isLoading || checkingSubscription ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        {checkingSubscription ? "Checking..." : "Subscribing..."}
                                    </>
                                ) : (
                                    <>
                                        Subscribe Now
                                        <div className="size-6 rounded-lg flex items-center justify-center bg-foreground/5 backdrop-blur-sm border border-foreground/10">
                                            <ChevronRight className="size-4" />
                                        </div>
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </motion.div>

                {/* Notification cards stack with animations */}
                <div
                    ref={cardsRef}
                    className="isolate flex flex-col md:min-w-[22rem] z-10"
                    style={{ perspective: "1000px" }}
                >
                    {notificationData.map((notification, index) => (
                        <NotificationCard
                            key={notification.title + index}
                            {...notification}
                            index={index}
                            isInView={isInView}
                        />
                    ))}
                </div>
            </div>

            {/* Subscribe Modal for non-authenticated users */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Subscribe to Newsletter</DialogTitle>
                        <DialogDescription>
                            Enter your email to get notified when new blog posts are published. No spam, unsubscribe anytime.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleModalSubmit} className="space-y-4 mt-2">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-12 rounded-xl px-4 bg-neutral-100 border-neutral-200 focus:border-neutral-300 dark:bg-neutral-900 dark:border-neutral-800 dark:focus:border-neutral-700"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full h-12 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Subscribing...
                                </>
                            ) : (
                                "Subscribe"
                            )}
                        </button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
