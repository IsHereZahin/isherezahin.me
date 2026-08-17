'use client'

import { HOME_ABOUT_CARDS } from '@/data'
import { MapPinIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

// WebGL plus a continuous render loop, and below the fold — fetched only once
// the card is scrolled near, keeping it out of the initial JS.
const Globe = dynamic(() => import('./Globe'), { ssr: false })

export default function LocationCard() {
    const { location } = HOME_ABOUT_CARDS
    const ref = useRef<HTMLDivElement>(null)
    const [showGlobe, setShowGlobe] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el || typeof IntersectionObserver === 'undefined') {
            setShowGlobe(true)
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShowGlobe(true)
                    observer.disconnect()
                }
            },
            // Start loading slightly before it scrolls into view.
            { rootMargin: '200px' }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={ref}
            className='relative flex h-52 sm:h-60 flex-col gap-4 sm:gap-6 overflow-hidden rounded-xl p-4 shadow-feature-card lg:p-6'
        >
            <div className='flex items-center gap-2'>
                <MapPinIcon className='size-4 sm:size-[18px]' />
                <h2 className='text-xs sm:text-sm font-medium text-muted-foreground'>{location.label}</h2>
            </div>
            {/* Fixed-size slot: reserved whether or not the globe has loaded, so
                nothing shifts when it appears. */}
            <div className='absolute inset-x-0 bottom-[-190px] mx-auto aspect-square h-[388px] [@media(max-width:420px)]:bottom-[-140px] [@media(max-width:420px)]:h-[320px] [@media(min-width:768px)_and_(max-width:858px)]:h-[350px]'>
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        placeItems: 'center',
                        placeContent: 'center',
                        overflow: 'visible'
                    }}
                >
                    {showGlobe && <Globe marker={location.marker} />}
                </div>
            </div>
        </div>
    )
}
