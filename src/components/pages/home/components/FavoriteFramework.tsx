"use client";

import { HOME_ABOUT_CARDS } from '@/data';
import { HeartIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function FavoriteFramework() {
  const { favoriteFramework } = HOME_ABOUT_CARDS;
  const [hovered, setHovered] = useState(false);

  const Resting = favoriteFramework.resting;
  const Hovered = favoriteFramework.hovered;

  return (
    <div
      className="flex flex-col gap-4 sm:gap-6 rounded-xl p-4 shadow-feature-card lg:p-6"
      title={favoriteFramework.title}
    >
      <div className="flex items-center gap-2">
        <HeartIcon className="size-4 sm:size-[18px]" />
        <h2 className="text-xs sm:text-sm font-medium text-muted-foreground">
          {favoriteFramework.label}
        </h2>
      </div>

      <div className="flex items-center justify-center gap-4">
        <motion.div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          animate={{ scale: hovered ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex items-center justify-center w-[80px] h-[80px]"
        >
          {hovered ? (
            <Hovered size={80} className="text-foreground" />
          ) : (
            <Resting size={80} className="text-foreground" />
          )}
        </motion.div>
      </div>
    </div>
  );
}
