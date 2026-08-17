'use client'

import createGlobe from 'cobe'
import { useMotionValue, useSpring } from 'motion/react'
import { useEffect, useRef } from 'react'

const FADE_MASK = 'radial-gradient(circle at 50% 50%, rgb(0, 0, 0) 60%, rgb(0, 0, 0, 0) 70%)'

/**
 * The interactive WebGL globe. Split out of `LocationCard` so it can be loaded
 * on demand — it pulls in `cobe` and runs a continuous render loop, neither of
 * which should be on the critical path for the home page's first paint.
 */
export default function Globe({ marker }: { readonly marker: [number, number] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pointerInteracting = useRef<number | null>(null)
    const pointerInteractionMovement = useRef(0)

    const rotation = useMotionValue(0)
    const springRotation = useSpring(rotation, { stiffness: 280, damping: 40, mass: 1 })

    const [markerLat, markerLng] = marker

    useEffect(() => {
        let width = 0

        const onResize = () => {
            if (canvasRef.current && (width = canvasRef.current.offsetWidth)) {
                window.addEventListener('resize', onResize)
            }
        }
        onResize()

        if (!canvasRef.current) return

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 2,
            mapSamples: 16_000,
            mapBrightness: 2,
            baseColor: [0.8, 0.8, 0.8],
            markerColor: [1, 1, 1],
            glowColor: [0.5, 0.5, 0.5],
            markers: [{ location: [markerLat, markerLng], size: 0.1 }],
            scale: 1.05,
            onRender: (state) => {
                state.phi = 2.75 + springRotation.get()
                state.width = width * 2
                state.height = width * 2
            }
        })

        return () => {
            globe.destroy()
            window.removeEventListener('resize', onResize)
        }
    }, [springRotation, markerLat, markerLng])

    return (
        <div
            style={{
                width: '100%',
                aspectRatio: '1/1',
                maxWidth: 800,
                WebkitMaskImage: FADE_MASK,
                maskImage: FADE_MASK
            }}
        >
            <canvas
                ref={canvasRef}
                onPointerDown={(e) => {
                    pointerInteracting.current = e.clientX - pointerInteractionMovement.current
                    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing'
                }}
                onPointerUp={() => {
                    pointerInteracting.current = null
                    if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
                }}
                onPointerOut={() => {
                    pointerInteracting.current = null
                    if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
                }}
                onMouseMove={(e) => {
                    if (pointerInteracting.current !== null) {
                        const delta = e.clientX - pointerInteracting.current
                        pointerInteractionMovement.current = delta
                        rotation.set(delta / 200)
                    }
                }}
                onTouchMove={(e) => {
                    if (pointerInteracting.current !== null && e.touches[0]) {
                        const delta = e.touches[0].clientX - pointerInteracting.current
                        pointerInteractionMovement.current = delta
                        rotation.set(delta / 100)
                    }
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    contain: 'layout paint size',
                    cursor: 'auto',
                    userSelect: 'none'
                }}
            />
        </div>
    )
}
