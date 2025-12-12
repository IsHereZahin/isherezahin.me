"use client";

import BlurImage from "./BlurImage";

export interface StyledImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    overlayColor?: string;
    overlayRotation?: string;
    overlayBorderRadius?: string;
    overlayPosition?: {
        bottom?: string;
        left?: string;
        width?: string;
        height?: string;
    };
}

export default function StyledImage({
    src,
    alt,
    width,
    height,
    className = "",
    overlayColor = "var(--primary)",
    overlayRotation = "rotate(-15deg)",
    overlayBorderRadius = "var(--radius-10, 10px)",
    overlayPosition = {
        bottom: "-40px",
        left: "-95px",
        width: "90%",
        height: "100%",
    },
}: Readonly<StyledImageProps>) {
    return (
        <figure
            className={`img-holder has-before relative ${className}`}
            style={{
                "--width": width,
                "--height": height,
                "--overlay-color": overlayColor,
                "--overlay-rotation": overlayRotation,
                "--overlay-border-radius": overlayBorderRadius,
                "--overlay-bottom": overlayPosition.bottom,
                "--overlay-left": overlayPosition.left,
                "--overlay-width": overlayPosition.width,
                "--overlay-height": overlayPosition.height,
            } as React.CSSProperties}
        >
            <BlurImage
                src={src}
                width={width}
                height={height}
                alt={alt}
                className="img-cover w-full h-full object-cover"
                priority={className.includes("hero-banner")}
            />
        </figure>
    );
}