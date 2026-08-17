'use client'

import { Logo, Section } from "@/components/ui"
import dynamic from 'next/dynamic'
import { HOME_CONTACT } from '@/data'
import { publicSettings } from '@/lib/api'
import { useAuth } from '@/lib/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { MessageCircle } from 'lucide-react'
import { useAnimate } from 'motion/react'
import { signIn } from 'next-auth/react'
import { useEffect, useMemo, useState } from 'react'

// Loaded on demand — this modal pulls in the Firebase realtime SDK.
const SendMessageModal = dynamic(() => import('@/components/chat/SendMessageModal'), {
    ssr: false,
})

interface PublicSettings {
    allowGitHubLogin: boolean;
    allowGoogleLogin: boolean;
    primaryLoginMethod: 'github' | 'google';
}

const SKILL_POSITIONS = [
    { className: 'absolute top-10 right-8' },
    { className: 'absolute top-20 left-2' },
    { className: 'absolute right-1 bottom-20' },
    { className: 'absolute bottom-12 left-14' },
];

/** Waypoints the animated cursor travels between, one per skill badge. */
const POINTER_STOPS = [
    { left: 200, top: 60 },
    { left: 50, top: 102 },
    { left: 224, top: 170 },
    { left: 88, top: 198 },
];

export default function GetInTouch() {
    const { headline, subheadline, highlightText, email, pointerLabel } = HOME_CONTACT;
    // Stable reference — the reveal animation below re-runs when it changes.
    const skills = useMemo(() => HOME_CONTACT.skills.slice(0, SKILL_POSITIONS.length), []);

    const [scope, animate] = useAnimate()
    const { user, status, openLoginModal, isAdmin } = useAuth()
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
    // Keeps the modal mounted after its first open so closing still animates.
    const [messageModalRequested, setMessageModalRequested] = useState(false)

    // Auth configuration — which sign-in providers are enabled. This is account
    // settings, not page content: the copy above renders without any fetching.
    const { data: settingsData } = useQuery<{ settings: PublicSettings }>({
        queryKey: ["publicSettings"],
        queryFn: publicSettings.get,
    });

    const handleSendMessageClick = () => {
        // Admin cannot send messages to themselves
        if (isAdmin) return;

        if (status === 'authenticated' && user) {
            setMessageModalRequested(true)
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
        if (!scope.current || skills.length < 2) return;

        const animationSequence = skills.flatMap((_, index) => {
            const pos = POINTER_STOPS[index % POINTER_STOPS.length];
            const nextIndex = (index + 1) % skills.length;
            const nextPos = POINTER_STOPS[nextIndex % POINTER_STOPS.length];

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
    }, [animate, skills, scope])

    return (
        <Section id="get-in-touch" animate={true}>
            <div className='flex flex-col gap-4 sm:gap-6 p-4 lg:p-6 rounded-xl shadow-feature-card'>
                <div className='flex gap-12 max-md:flex-col'>
                    <div className='relative size-64 max-md:mx-auto' ref={scope}>
                        <Logo
                            size={40}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl p-4 bg-foreground"
                        />
                        {skills.map((skill, index) => (
                            <div
                                key={skill}
                                id={`skill-${index}`}
                                className={`${SKILL_POSITIONS[index].className} rounded-3xl border bg-accent px-2 py-1.5 text-xs opacity-40`}
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
                            <span className='relative left-4 rounded-3xl bg-red-500 px-2 py-0.5 text-xs text-white'>{pointerLabel}</span>
                        </div>
                    </div>

                    <div className='flex flex-col justify-center px-4'>
                        <p
                            className="font-bold text-xl sm:text-2xl md:text-3xl leading-snug
                                bg-gradient-to-r from-foreground/90 to-foreground/60
                                bg-clip-text text-transparent"
                        >
                            {headline}
                        </p>
                        <p className="text-sm sm:text-base text-muted-foreground hover:text-foreground/80 transition-colors">
                            {subheadline}
                            {highlightText && (
                                <>
                                    {' '}
                                    <span className="text-primary font-medium">{highlightText}</span>
                                </>
                            )}
                        </p>
                        <div className="my-4">
                            {email ? (
                                <a
                                    href={`mailto:${email}`}
                                    target="_blank"
                                    className="inline-block text-white px-4 py-2 rounded-full text-sm bg-gradient-to-b from-red-600 to-red-400 hover:from-red-700 hover:to-red-400 transition-all duration-300"
                                >
                                    {email}
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

            {!isAdmin && messageModalRequested && (
                <SendMessageModal
                    open={isMessageModalOpen}
                    onOpenChange={setIsMessageModalOpen}
                    redirectToChat
                />
            )}
        </Section>
    )
}
