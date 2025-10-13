import { StaticImageData } from "next/image";

import BlurImage from "@/components/ui/BlurImage";
import ImageZoom from "../ui/ImageZoom";

export interface HeroBannerProps {
  src: string | StaticImageData;
  alt: string;
  className?: string;
}

export default function HeroBanner({ src, alt, className = "" }: Readonly<HeroBannerProps>) {
  return (
    <figure
      className={`relative group w-full max-w-[400px] mx-auto overflow-visible rotate-[7deg] perspective-[1000px] ${className}`}
    >
      {/* Decorative angled background */}
      <div
        className="
          before:content-[''] 
          before:absolute before:bottom-[-40px] before:left-[-15%] 
          before:w-[90%] before:h-full before:bg-primary/30 
          before:transition-colors before:duration-300 
          dark:before:bg-primary/40 
          before:z-[-1] before:rotate-[-15deg] 
          before:rounded-lg 
          group-hover:before:bg-primary/50 dark:group-hover:before:bg-primary/60
        "
      />
      <ImageZoom>
        <BlurImage
          src={src}
          alt={alt}
          priority
          className="rounded-lg"
        />
      </ImageZoom>
    </figure>
  );
}
