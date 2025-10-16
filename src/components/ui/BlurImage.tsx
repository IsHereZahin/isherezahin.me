'use client'

import NextImage, { StaticImageData } from 'next/image'
import { useState } from 'react'

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4="

type ImageProps = {
  imageClassName?: string
  lazy?: boolean
  alt?: string
  src: string | StaticImageData
  className?: string
} & React.ComponentProps<typeof NextImage>

export default function BlurImage(props: ImageProps) {
  const { alt, src, className, imageClassName, lazy = true, fill, width, height, ...rest } = props
  const [isLoading, setIsLoading] = useState(true)
  const [didError, setDidError] = useState(false)

  const useFill = fill || (!width && !height)
  const layoutProps = useFill
    ? { fill: true }
    : { width, height }

  return (
    <div className={`overflow-hidden ${isLoading ? 'animate-pulse' : ''} ${className || ''}`}>
      <NextImage
        className={`${isLoading ? 'scale-[1.02] blur-xl grayscale' : ''} ${imageClassName || ''}`}
        style={{
          transition: 'filter 700ms ease, scale 150ms ease'
        }}
        src={didError ? ERROR_IMG_SRC : src}
        alt={alt || (didError ? 'Image failed to load' : '')}
        loading={lazy ? 'lazy' : undefined}
        priority={!lazy}
        quality={100}
        onLoad={() => setIsLoading(false)}
        onError={() => setDidError(true)}
        {...rest}
        {...layoutProps}
      />
    </div>
  )
}