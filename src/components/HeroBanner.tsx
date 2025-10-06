"use client";

import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';
import ImageModal from './ui/ImageModal';

export interface HeroBannerProps {
  src: string | StaticImageData;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function HeroBanner({ src, alt, width, height, className = '' }: Readonly<HeroBannerProps>) {

  const [transform, setTransform] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Reduce rotation
    const rotateX = ((y - centerY) / centerY) * 5;
    const rotateY = ((x - centerX) / centerX) * 5;

    // Reduce scale
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
    const scale = 1 + (1 - distance / maxDistance) * 0.02;

    setTransform(`perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`);
  };

  const handleMouseLeave = () => {
    setTransform("");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const wrapperClasses = 'group w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] mx-auto overflow-visible rotate-[7deg] relative perspective-[1000px]';

  const imageClasses = 'w-full h-auto object-cover rounded-md transition-all duration-300 ease-in-out shadow-lg cursor-pointer';

  const decorativeClasses = 'before:content-[\' \'] before:absolute before:bottom-[-40px] before:left-[-15%] before:w-[90%] before:h-full before:bg-primary/30 before:transition-colors duration-300 dark:before:bg-primary/40 before:z-[-1] before:rotate-[-15deg] before:rounded-lg group-hover:before:bg-primary/50 dark:group-hover:before:bg-primary/60';

  return (
    <>
      <figure
        className={`${wrapperClasses} ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className={decorativeClasses} />
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={imageClasses}
          style={transform ? { transform } : undefined}
          onClick={openModal}
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          suppressHydrationWarning={true}
        />
      </figure>
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        src={src}
        alt={alt}
      />
    </>
  );
}