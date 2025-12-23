'use client'

import { SendMessageModal } from '@/components/chat'
import { Logo, Section, Skeleton } from "@/components/ui"
import { contactInfo as contactInfoApi } from '@/lib/api'
import { MY_USERNAME } from '@/lib/constants'
import { useAuth } from '@/lib/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { MessageCircle } from 'lucide-react'
import { useAnimate } from 'motion/react'
import { signIn } from 'next-auth/react'
import { useEffect, useMemo, useState } from 'react'

interface ContactInfoData {
    email?: string;
    headline: string;
    subheadline: string;
    highlightText?: string;
    skills: string[];
}

interface PublicSettings {
    allowGitHubLogin: boolean;
    allowGoogleLogin: boolean;
    primaryLoginMethod: 'github' | 'google';
}

const defaultSkills = ['Next.js', 'React.js', 'TypeScript', 'Laravel'];
const skillPositions = [
    { id: 'skill-0', className: 'absolute top-10 right-8' },
    { id: 'skill-1', className: 'absolute top-20 left-2' },
    { id: 'skill-2', className: 'absolute right-1 bottom-20' },
    { id: 'skill-3', className: 'absolute bottom-12 left-14' },
];

export default function GetInTouch() {
    const [scope, animate] = useAnimate()
    const { user, status, openLoginModal, isAdmin } = useAuth()
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)

    const { data, isLoading } = useQuery<ContactInfoData>({
        queryKey: ["contact-info"],
        queryFn: contactInfoApi.get,
    });

    const { data: settingsData } = useQuery<{ settings: PublicSettings }>({
        queryKey: ["public-settings"],
        queryFn: async () => {
            const res = await fetch('/api/admin/settings/public')
            return res.json()
        },
    });

    const contactData = useMemo(() => ({
        email: data?.email || undefined,
        headline: data?.headline || "Any questions about software?",
        subheadline: data?.subheadline || "Feel free to reach out to me!",
        highlightText: data?.highlightText || undefined,
        skills: data?.skills?.length ? data.skills.slice(0, 4) : defaultSkills,
    }), [data]);

    const handleSendMessageClick = () => {
        // Admin cannot send messages to themselves
        if (isAdmin) return;

        if (status === 'authenticated' && user) {
            setIsMessageModalOpen(true)
            return
        }

        const settings = settingsData?.settings
        const bothEnabled = settings?.allowGitHubLogin && settings?.allowGoogleLogin

        if (bothEnabled) {
            openLoginModal()
        } else {
            const provider = settings?.allowGitHubLogin ? 'github' : 'google'
            signIn(provider)
        }
    }

    useEffect(() => {
        if (!scope.current) return;

        const skills = contactData.skills;
        if (skills.length < 2) return;

        const positions = [
            { left: 200, top: 60 },
            { left: 50, top: 102 },
            { left: 224, top: 170 },
            { left: 88, top: 198 },
        ];

        const animationSequence = skills.flatMap((_, index) => {
            const pos = positions[index % positions.length];
            const nextIndex = (index + 1) % skills.length;
            const nextPos = positions[nextIndex % positions.length];

            const steps: [string, Record<string, unknown>, Record<string, unknown>?][] = [];

            if (index === 0) {
                steps.push(['#pointer', pos, { duration: 0 }]);
            }
            steps.push([`#skill-${index}`, { opacity: 1 }, { duration: 0.3 }]);
            steps.push(['#pointer', nextPos, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }]);
            steps.push([`#skill-${index}`, { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }]);

            return steps;
        });

        animate(animationSequence as Parameters<typeof animate>[0], { repeat: Number.POSITIVE_INFINITY });
    }, [animate, contactData.skills, scope])

    if (isLoading) {
        return (
            <Section id="get-in-touch" animate={true}>
                <div className='flex flex-col gap-4 sm:gap-6 p-4 lg:p-6 rounded-xl shadow-feature-card'>
                    <div className='flex gap-12 max-md:flex-col'>
                        <Skeleton className="size-64 rounded-xl" />
                        <div className='flex flex-col justify-center px-4 space-y-4'>
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-10 w-40 rounded-full" />
                        </div>
                    </div>
                </div>
            </Section>
        );
    }

    return (
        <Section id="get-in-touch" animate={true}>
            <div className='flex flex-col gap-4 sm:gap-6 p-4 lg:p-6 rounded-xl shadow-feature-card'>
                <div className='flex gap-12 max-md:flex-col'>
                    <div className='relative size-64 max-md:mx-auto' ref={scope}>
                        <Logo
                            size={40}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl p-4 bg-foreground"
                        />
                        {contactData.skills.map((skill, index) => (
                            <div
                                key={skill}
                                id={`skill-${index}`}
                                className={`${skillPositions[index]?.className || skillPositions[0].className} rounded-3xl border bg-accent px-2 py-1.5 text-xs opacity-40`}
                            >
                                {skill}
                            </div>
                        ))}

                        <div id='pointer' className='absolute'>
                            <svg
                                width='16.8'
                                height='18.2'
                                viewBox='0 0 12 13'
                                className='fill-red-500'
                                stroke='white'
                                strokeWidth='1'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M12 5.50676L0 0L2.83818 13L6.30623 7.86537L12 5.50676V5.50676Z'
                                />
                            </svg>
                            <span className='relative left-4 rounded-3xl bg-red-500 px-2 py-0.5 text-xs text-white'>{MY_USERNAME}</span>
                        </div>
                    </div>

                    <div className='flex flex-col justify-center px-4'>
                        <p
                            className="font-bold text-xl sm:text-2xl md:text-3xl leading-snug
                                bg-gradient-to-r from-foreground/90 to-foreground/60
                                bg-clip-text text-transparent"
                        >
                            {contactData.headline}
                        </p>
                        <p className="text-sm sm:text-base text-muted-foreground hover:text-foreground/80 transition-colors">
                            {contactData.subheadline}
                            {contactData.highlightText && (
                                <>
                                    {' '}
                                    <span className="text-primary font-medium">{contactData.highlightText}</span>
                                </>
                            )}
                        </p>
                        <div className="my-4">
                            {contactData.email ? (
                                <a
                                    href={`mailto:${contactData.email}`}
                                    target="_blank"
                                    className="inline-block text-white px-4 py-2 rounded-full text-sm bg-gradient-to-b from-red-600 to-red-400 hover:from-red-700 hover:to-red-400 transition-all duration-300"
                                >
                                    {contactData.email}
                                </a>
                            ) : !isAdmin ? (
                                <button
                                    onClick={handleSendMessageClick}
                                    className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm bg-gradient-to-b from-red-600 to-red-400 hover:from-red-700 hover:to-red-400 transition-all duration-300"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    Send Message
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            {!isAdmin && (
                <SendMessageModal
                    open={isMessageModalOpen}
                    onOpenChange={setIsMessageModalOpen}
                    redirectToChat
                />
            )}
        </Section>
    )
}