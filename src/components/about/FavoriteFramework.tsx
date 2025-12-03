"use client";

import { SiLaravel, SiNextdotjs } from '@icons-pack/react-simple-icons';
import { HeartIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function FavoriteFramework() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex flex-col gap-4 sm:gap-6 rounded-xl p-4 shadow-feature-card lg:p-6"
      title="Next.js & Laravel"
    >
      <div className="flex items-center gap-2">
        <HeartIcon className="size-4 sm:size-[18px]" />
        <h2 className="text-xs sm:text-sm font-medium text-muted-foreground">Favorite Framework</h2>
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
            <SiLaravel size={80} className="text-foreground" />
          ) : (
            <SiNextdotjs size={80} className="text-foreground" />
          )}
        </motion.div>
      </div>
    </div>
  );
}
