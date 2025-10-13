'use client'

import NextImage, { StaticImageData } from 'next/image'
import { useEffect, useState } from 'react'

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4="

type ImageProps = {
  imageClassName?: string
  lazy?: boolean
  priority?: boolean
  alt?: string
  src: string | StaticImageData
  className?: string
  width?: number
  height?: number
} & React.ComponentProps<typeof NextImage>

export default function BlurImage({
  alt,
  src,
  className = '',
  imageClassName = '',
  lazy = true,
  priority = false,
  width,
  height,
  ...rest
}: ImageProps) {
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [didError, setDidError] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    // Render a static placeholder during SSR
    return (
      <div className={`overflow-hidden ${className}`} style={{ width: width ?? 1000, height: height ?? 1000 }} />
    )
  }

  const imgWidth = width ?? 1000
  const imgHeight = height ?? 1000
  let loadingValue: 'lazy' | 'eager' | undefined;
  if (priority) {
    loadingValue = undefined;
  } else if (lazy) {
    loadingValue = 'lazy';
  } else {
    loadingValue = 'eager';
  }

  return (
    <div className={`overflow-hidden ${isLoading ? 'animate-pulse' : ''} ${className}`}>
      <NextImage
        className={`
          ${imageClassName}
          ${isLoading ? 'scale-[1.02] blur-xl grayscale' : 'scale-100 blur-0 grayscale-0'}
        `}
        style={{ transition: 'filter 700ms ease, transform 700ms ease' }}
        src={didError ? ERROR_IMG_SRC : src}
        alt={alt || (didError ? "Image failed to load" : "")}
        priority={priority}
        loading={loadingValue}
        width={imgWidth}
        height={imgHeight}
        quality={100}
        onLoad={() => setIsLoading(false)}
        onError={() => setDidError(true)}
        {...rest}
      />
    </div>
  )
}