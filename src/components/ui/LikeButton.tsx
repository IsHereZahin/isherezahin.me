'use client';

import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { blogLikes } from '@/lib/api';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface LikeButtonProps {
  readonly slug: string;
  readonly maxUserLikes?: number;
}

export default function LikeButton({ slug, maxUserLikes = 3 }: LikeButtonProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [totalLikes, setTotalLikes] = useState(0);
  const [userLikes, setUserLikes] = useState(0);

  const { data } = useQuery({
    queryKey: ['blog-likes', slug],
    queryFn: () => blogLikes.getLikes(slug),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data) {
      setTotalLikes(data.totalLikes ?? 0);
      setUserLikes(data.userLikes ?? 0);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => blogLikes.addLike(slug),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['blog-likes', slug] });

      setUserLikes(prev => prev + 1);
      setTotalLikes(prev => prev + 1);

      queryClient.setQueryData(['blog-likes', slug], (old: any) => ({
        totalLikes: (old?.totalLikes ?? totalLikes) + 1,
        userLikes: (old?.userLikes ?? userLikes) + 1,
      }));
    },

    onSuccess: (serverData) => {
      setTotalLikes(serverData.totalLikes ?? 0);
      setUserLikes(serverData.userLikes ?? 0);

      if ((serverData.userLikes ?? userLikes + 1) >= maxUserLikes && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const { clientWidth, clientHeight } = document.documentElement;

        confetti({
          particleCount: 100,
          spread: 80,
          origin: {
            x: (rect.left + rect.width / 2) / clientWidth,
            y: (rect.top + rect.height / 2) / clientHeight,
          },
          shapes: [confetti.shapeFromText({ text: '❤️', scalar: 2 })],
          zIndex: 9999,
        });
      }
    },

    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-likes', slug] });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-likes', slug] });
    },
  });

  const handleLike = () => {
    if (userLikes >= maxUserLikes) return;

    mutation.mutate();
  };

  const fillPercentage = Math.min((userLikes / maxUserLikes) * 100);

  const isDisabled = userLikes >= maxUserLikes;

  const getLikeText = () => {
    if (userLikes >= maxUserLikes) {
      return user ? 'Liked (Max)' : 'Device Max';
    }
    if (userLikes > 0) {
      return `Liked ${userLikes}/${maxUserLikes}`;
    }
    return 'Like';
  };

  return (
    <div className="mt-8 sm:mt-12 flex flex-col items-center gap-2">
      <motion.button
        ref={buttonRef}
        onClick={handleLike}
        whileTap={{ scale: isDisabled ? 1 : 0.97 }}
        disabled={isDisabled}
        type="button"
        className={`flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-base sm:text-lg font-medium transition-colors duration-300
          ${isDisabled
            ? 'bg-zinc-900 text-zinc-500 cursor-not-allowed'
            : 'bg-neutral-800/40 backdrop-blur-sm text-white hover:bg-neutral-700 cursor-pointer'
          }`}
      >
        <div className="relative w-7 h-7">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.566z" />
          </svg>

          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 0)' }}
            initial={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' }}
            animate={{ clipPath: `polygon(0 100%, 100% 100%, 100% ${100 - fillPercentage}%, 0 ${100 - fillPercentage}%)` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="#ef4444"
              stroke="none"
            >
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.566z" />
            </svg>
          </motion.div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span>{getLikeText()}</span>
          <AnimatedNumber value={totalLikes} />
        </div>
      </motion.button>

      {user?.email && (
        <span className="text-xs text-muted-foreground">
          Signed in as {user.email}
        </span>
      )}
      {!user && userLikes > 0 && (
        <span className="text-xs text-muted-foreground">
          Sign in to keep your likes across devices
        </span>
      )}
    </div>
  );
}