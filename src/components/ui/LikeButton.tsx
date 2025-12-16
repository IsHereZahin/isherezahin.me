'use client';

import { AnimatedNumber } from '@/components/ui';
import { blogLikes, projectLikes } from '@/lib/api';
import { discussionApi } from '@/lib/github/api';
import { useAuth } from '@/lib/hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface LikeButtonProps {
  slug: string;
  type?: string;
  maxUserLikes?: number;
}

export default function LikeButton({ slug, type, maxUserLikes = 3 }: Readonly<LikeButtonProps>) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [totalLikes, setTotalLikes] = useState(0);
  const [userLikes, setUserLikes] = useState(0);
  const [pendingLikes, setPendingLikes] = useState(0); // Track in-flight API calls
  const [discussionNumber, setDiscussionNumber] = useState<number | null>(null);
  const hasShownMaxToast = useRef(false);
  const hasAddedDiscussionReaction = useRef(false);

  const likesApi = type === 'project' ? projectLikes : blogLikes;
  const queryKey = [`${type || 'blog'}-likes`, slug];

  const { data } = useQuery({
    queryKey,
    queryFn: () => likesApi.getLikes(slug),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data) {
      setTotalLikes(data.totalLikes ?? 0);
      setUserLikes(data.userLikes ?? 0);
      setDiscussionNumber(data.discussionNumber ?? null);
      hasShownMaxToast.current = (data.userLikes ?? 0) >= maxUserLikes;
    }
  }, [data, maxUserLikes]);

  // Fire-and-forget API call
  const sendLikeToServer = async () => {
    setPendingLikes(prev => prev + 1);
    try {
      await likesApi.addLike(slug);
    } catch {
      // Rollback one like on failure
      setTotalLikes(prev => Math.max(0, prev - 1));
      setUserLikes(prev => Math.max(0, prev - 1));
      toast.error('Failed to save like', {
        description: 'Your like couldn\'t be saved. Please try again.',
      });
    } finally {
      setPendingLikes(prev => prev - 1);
    }
  };

  // Add heart reaction to GitHub discussion (for GitHub-authenticated users)
  const addDiscussionHeartReaction = async () => {
    if (!discussionNumber || !user?.provider || user.provider !== 'github' || hasAddedDiscussionReaction.current) {
      return;
    }

    hasAddedDiscussionReaction.current = true;
    try {
      await discussionApi.addHeartReaction(discussionNumber);
    } catch {
      // Silently fail - this is a bonus feature, not critical
      // Reset flag so user can try again on next like
      hasAddedDiscussionReaction.current = false;
    }
  };

  const triggerConfetti = () => {
    if (buttonRef.current) {
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
  };

  const handleLike = () => {
    // Check against local state immediately
    if (userLikes >= maxUserLikes) {
      toast.info(`Maximum likes reached`, {
        description: user
          ? `You've already liked this ${type} ${maxUserLikes} times. That's plenty of love! ❤️`
          : `This device has reached the maximum of ${maxUserLikes} likes. Sign in to like more!`,
      });

      // Add a gentle shake animation
      if (buttonRef.current) {
        buttonRef.current.animate(
          [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-4px)' },
            { transform: 'translateX(4px)' },
            { transform: 'translateX(-4px)' },
            { transform: 'translateX(4px)' },
            { transform: 'translateX(0)' },
          ],
          {
            duration: 400,
            easing: 'ease-in-out',
          }
        );
      }
      return;
    }

    // Instantly update local state
    const newUserLikes = userLikes + 1;
    setUserLikes(newUserLikes);
    setTotalLikes(prev => prev + 1);

    // Update cache for consistency
    queryClient.setQueryData(queryKey, (old: any) => ({
      totalLikes: (old?.totalLikes ?? totalLikes) + 1,
      userLikes: newUserLikes,
    }));

    // Show max toast and confetti when hitting the limit
    if (newUserLikes >= maxUserLikes && !hasShownMaxToast.current) {
      hasShownMaxToast.current = true;
      triggerConfetti();
      toast.success('Thank you for the love! 💖', {
        description: `You've reached the maximum of ${maxUserLikes} likes for this ${type}.`,
      });
    }

    // Fire API calls in background (no waiting)
    sendLikeToServer();

    // Also add heart reaction to GitHub discussion if user is GitHub-authenticated
    addDiscussionHeartReaction();
  };

  const fillPercentage = Math.min((userLikes / maxUserLikes) * 100);
  const isMaxed = userLikes >= maxUserLikes;

  const getLikeText = () => {
    if (isMaxed) {
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
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: isMaxed ? 1 : 1.02 }}
        type="button"
        className={`flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-base sm:text-lg font-medium transition-all duration-300
          ${isMaxed
            ? 'bg-zinc-800 backdrop-blur-sm text-zinc-400 shadow-md'
            : 'bg-zinc-800/80 backdrop-blur-sm text-white hover:bg-neutral-700 hover:shadow-lg'
          } cursor-pointer`}
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
            className="transition-colors duration-300"
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
              className="transition-colors duration-300"
            >
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.566z" />
            </svg>
          </motion.div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="transition-colors duration-300">{getLikeText()}</span>
          {(totalLikes ?? 0) > 0 ? (
            <AnimatedNumber value={totalLikes} />
          ) : (
            <span className="tabular-nums">--</span>
          )}
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