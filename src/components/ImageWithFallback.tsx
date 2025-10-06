"use client";

import Image from "next/image";
import { useState } from "react";

export interface ImageWithFallbackProps {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
}

const ERROR_IMG_SRC =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4=";

export function ImageWithFallback({
    src,
    alt,
    className,
    style,
    ...rest
}: Readonly<ImageWithFallbackProps>) {
    const [didError, setDidError] = useState(false);

    return (
        <div className={`relative ${className ?? ""}`} style={style}>
            <Image
                src={didError ? ERROR_IMG_SRC : src}
                alt={alt || (didError ? "Image failed to load" : "")}
                fill
                className={`object-cover ${didError ? "opacity-50" : ""}`}
                onError={() => setDidError(true)}
                {...rest}
            />
        </div>
    );
}
