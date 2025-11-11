'use client'

import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import AnimatedNumber from '@/components/ui/AnimatedNumber'

interface LikeButtonProps {
  readonly likes?: number
  readonly maxUserLikes?: number
}

export default function LikeButton({ likes = 118, maxUserLikes = 3 }: LikeButtonProps) {
  const [totalLikes, setTotalLikes] = useState(likes)
  const [userLikes, setUserLikes] = useState(0)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleLike = () => {
    if (userLikes >= maxUserLikes) return

    const newUserLikes = userLikes + 1
    setUserLikes(newUserLikes)
    setTotalLikes(totalLikes + 1)

    if (newUserLikes === maxUserLikes && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const { clientWidth, clientHeight } = document.documentElement

      confetti({
        zIndex: 999,
        particleCount: 100,
        spread: 80,
        origin: {
          x: (rect.x + rect.width / 2) / clientWidth,
          y: (rect.y + rect.height / 2) / clientHeight,
        },
        shapes: [confetti.shapeFromText({ text: '❤️', scalar: 2 })],
      })
    }
  }

  const progress = Math.min(userLikes / maxUserLikes, 1) * 100

  return (
    <div className="mt-8 sm:mt-12 flex justify-center">
      <motion.button
        ref={buttonRef}
        onClick={handleLike}
        whileTap={{ scale: 0.97 }}
        disabled={userLikes >= maxUserLikes}
        type="button"
        className={`flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-base sm:text-lg font-medium transition-colors duration-300
          ${userLikes >= maxUserLikes
            ? 'bg-zinc-900 text-zinc-500 cursor-not-allowed hover:bg-zinc-900'
            : 'bg-neutral-800/40 backdrop-blur-sm text-white hover:bg-neutral-700 cursor-pointer'}`}
      >
        {/* Heart Fill */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 sm:w-8 sm:h-8 relative overflow-hidden"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="#ef4444"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <clipPath id="heart-clip">
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
            </clipPath>
          </defs>

          <path
            d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
            stroke="#ef4444"
          />

          <g clipPath="url(#heart-clip)">
            <motion.rect
              x="0"
              y="0"
              width="24"
              height="24"
              fill="#ef4444"
              initial={{ y: '100%' }}
              animate={{ y: `${100 - progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </g>
        </svg>

        {/* Professional Like Count */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-base sm:text-lg">Like</span>
          <AnimatedNumber value={totalLikes} />
        </div>
      </motion.button>
    </div>
  )
}