'use client'

import { useAnimate } from 'motion/react'
import { useEffect } from 'react'
import Logo from '../ui/Logo'
import Section from '../ui/Section'

const GetInTouch = () => {
    const [scope, animate] = useAnimate()

    useEffect(() => {
        animate(
            [
                ['#pointer', { left: 200, top: 60 }, { duration: 0 }],
                ['#javascript', { opacity: 1 }, { duration: 0.3 }],
                ['#pointer', { left: 50, top: 102 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
                ['#javascript', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
                ['#react-js', { opacity: 1 }, { duration: 0.3 }],
                ['#pointer', { left: 224, top: 170 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
                ['#react-js', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
                ['#typescript', { opacity: 1 }, { duration: 0.3 }],
                ['#pointer', { left: 88, top: 198 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
                ['#typescript', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
                ['#next-js', { opacity: 1 }, { duration: 0.3 }],
                ['#pointer', { left: 200, top: 60 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
                ['#next-js', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }]
            ],
            {
                repeat: Number.POSITIVE_INFINITY
            }
        )
    }, [animate])

    return (
        <Section id="get-in-touch" animate={true}>
            <div className='flex flex-col gap-6 p-4 lg:p-6 rounded-xl shadow-feature-card'>
                <div className='flex gap-12 max-md:flex-col'>
                    <div className='relative size-64 max-md:mx-auto' ref={scope}>
                        <Logo
                            size={60}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[20px] p-4 bg-background/30"
                        />
                        <div
                            id='next-js'
                            className='absolute bottom-12 left-14 rounded-3xl border bg-accent px-2 py-1.5 text-xs opacity-40'
                        >
                            Next.js
                        </div>
                        <div
                            id='react-js'
                            className='absolute top-20 left-2 rounded-3xl border bg-accent px-2 py-1.5 text-xs opacity-40'
                        >
                            React.js
                        </div>
                        <div
                            id='typescript'
                            className='absolute right-1 bottom-20 rounded-3xl border bg-accent px-2 py-1.5 text-xs opacity-40'
                        >
                            TypeScript
                        </div>
                        <div
                            id='javascript'
                            className='absolute top-10 right-8 rounded-3xl border bg-accent px-2 py-1.5 text-xs opacity-40'
                        >
                            JavaScript
                        </div>

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
                            <span className='relative left-4 rounded-3xl bg-red-500 px-2 py-0.5 text-xs text-white'>isherezahin</span>
                        </div>
                    </div>

                    <div className='flex flex-col justify-center px-4'>
                        <p className="font-bold text-3xl leading-snug
                            bg-gradient-to-r from-primary via-foreground to-border
                            bg-clip-text text-transparent
                            dark:from-secondary-foreground dark:via-[#afaeae] dark:to-[#666666]"
                        >
                            Any questions about software?
                        </p>

                        <p className="text-foreground">
                            Feel free to reach out to me!{' '}
                            <span className="text-gray-500">I&apos;m available for collaboration.</span>
                        </p>
                        <div className="my-4">
                            <a
                                href="mailto:isherezahin@gmail.com"
                                className="inline-block text-white px-4 py-2 rounded-full text-sm bg-gradient-to-b from-red-500 to-red-600 border border-red-500 hover:from-red-600 hover:to-red-700 hover:border-red-600 transition-all duration-300"
                            >
                                isherezahin@gmail.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    )
}

export default GetInTouch
