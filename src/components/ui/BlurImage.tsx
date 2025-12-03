'use client'

import NextImage, { StaticImageData } from 'next/image'
import { useState } from 'react'

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjE2MCIgaGVpZ2h0PSI5MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7Ij4KICA8dGV4dCB4PSI4MCIgeT0iNDIiIGZvbnQtZmFtaWx5PSJjdXJzaXZlLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5UaGlzIGltYWdlIGRvZXMgbm90IGV4aXN0PC90ZXh0PgogIDx0ZXh0IHg9IjgwIiB5PSI1OCIgZm9udC1mYW1pbHk9ImN1cnNpdmUsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPm9yIG5vdCBhbGxvd2VkIHRvIHNob3c8L3RleHQ+Cjwvc3ZnPg==";

type ImageProps = {
  imageClassName?: string
  lazy?: boolean
  alt?: string
  src: string | StaticImageData
  className?: string
  sizes?: string
} & React.ComponentProps<typeof NextImage>

export default function BlurImage(props: ImageProps) {
  const { 
    alt, 
    src, 
    className, 
    imageClassName, 
    lazy = true, 
    fill, 
    width, 
    height,
    sizes,
    ...rest 
  } = props
  
  const [isLoading, setIsLoading] = useState(true)
  const [didError, setDidError] = useState(false)

  // Determine if we should use fill mode
  const useFill = fill || (!width && !height)
  
  // Prepare layout props
  const layoutProps = useFill
    ? { fill: true as const }
    : { width, height }

  // Determine appropriate sizes prop
  const getSizes = () => {
    if (sizes) return sizes
    if (!useFill) return undefined
    
    // Default responsive sizes for better performance
    return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  }

  return (
    <div 
      className={`overflow-hidden ${isLoading ? 'animate-pulse' : ''} ${className || ''}`}
      style={{ 
        position: useFill ? 'relative' : undefined,
        ...(useFill && !className?.includes('h-') && !className?.includes('aspect-') && { height: '100%', width: '100%' })
      }}
    >
      <NextImage
        className={`
          ${isLoading ? 'scale-[1.02] blur-xl grayscale' : ''} 
          ${useFill ? 'object-cover' : ''}
          ${imageClassName || ''}
        `.trim()}
        style={{
          transition: 'filter 700ms ease, transform 150ms ease'
        }}
        src={didError ? ERROR_IMG_SRC : src}
        alt={alt || (didError ? 'Image failed to load' : '')}
        loading={lazy ? 'lazy' : undefined}
        priority={!lazy}
        quality={100}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setDidError(true)
          setIsLoading(false)
        }}
        sizes={getSizes()}
        {...layoutProps}
        {...rest}
      />
    </div>
  )
}