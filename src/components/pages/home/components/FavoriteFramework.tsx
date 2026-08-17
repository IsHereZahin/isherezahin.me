"use client";

import { SiLaravel, SiNextdotjs } from '@icons-pack/react-simple-icons';
import { HeartIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

/**
 * The icons are imported here rather than passed in: this is a client
 * component, and component functions cannot cross the server boundary as props.
 */
export default function FavoriteFramework({
  label,
  title,
}: {
  readonly label: string;
  readonly title: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col gap-4 sm:gap-6 rounded-xl p-4 shadow-feature-card lg:p-6"
      title={title}
    >
      <div className="flex items-center gap-2">
        <HeartIcon className="size-4 sm:size-[18px]" />
        <h2 className="text-xs sm:text-sm font-medium text-muted-foreground">{label}</h2>
      </div>

      <div className="flex items-center justify-center gap-4">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex items-center justify-center w-[80px] h-[80px]"
        >
          {isHovered ? (
            <SiLaravel size={80} className="text-foreground" />
          ) : (
            <SiNextdotjs size={80} className="text-foreground" />
          )}
        </motion.div>
      </div>
    </div>
  );
}
