'use client'

import { motion, MotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

const fontSize = 18
const padding = 10
const height = fontSize + padding

interface AnimatedNumberProps {
    value: number
    className?: string
}

interface DigitProps {
    place: number
    value: number
}

interface NumberProps {
    mv: MotionValue<number>
    number: number
}

function Digit({ place, value }: Readonly<DigitProps>) {
    const valueRoundedToPlace = Math.floor(value / place)
    const animatedValue = useSpring(valueRoundedToPlace)

    useEffect(() => {
        animatedValue.set(valueRoundedToPlace)
    }, [animatedValue, valueRoundedToPlace])

    return (
        <div style={{ height }} className="relative w-[1ch] tabular-nums overflow-hidden">
            {[...Array(10).keys()].map((i) => (
                <CountNumber key={i} mv={animatedValue} number={i} />
            ))}
        </div>
    )
}

function CountNumber({ mv, number }: Readonly<NumberProps>) {
    const y = useTransform(mv, (latest) => {
        const placeValue = latest % 10
        const offset = (10 + number - placeValue) % 10
        let memo = offset * height
        if (offset > 5) memo -= 10 * height
        return memo
    })

    return (
        <motion.span
            style={{ y }}
            className="absolute inset-0 flex items-center justify-center font-bold text-lg"
        >
            {number}
        </motion.span>
    )
}

export default function AnimatedNumber({ value, className }: Readonly<AnimatedNumberProps>) {
    const numDigits = Math.max(1, Math.ceil(Math.log10(value + 1)))
    const places: number[] = []
    let p = Math.pow(10, numDigits - 1)
    while (p >= 1) {
        places.push(p)
        p /= 10
    }

    return (
        <div className={`flex space-x-0 overflow-hidden leading-none ${className ?? ''}`}>
            {places.map((place) => (
                <Digit key={place} place={place} value={value} />
            ))}
        </div>
    )
}
