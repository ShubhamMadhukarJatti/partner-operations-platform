'use client'

import { useState } from 'react'
import Image from 'next/image'
import fallbackImage from '@/../public/assets/placeholder.jpg'

import { cn } from '@/lib/utils'

interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  width: number
  height: number
  fallbackSrc?: string
  className?: string
}

export function ImageFallback({
  src,
  fallbackSrc = fallbackImage.src,
  width,
  height,
  className,
  ...rest
}: ImageFallbackProps) {
  const [imgSrc, set_imgSrc] = useState<any>(src)

  return (
    <Image
      {...rest}
      alt={rest.alt!}
      width={width}
      height={height}
      src={imgSrc}
      onLoad={(result) => {
        if (result.currentTarget.naturalWidth === 0) {
          // Broken image
          set_imgSrc(fallbackSrc)
        }
      }}
      onError={() => {
        set_imgSrc(fallbackSrc)
      }}
      className={cn('size-16 object-cover object-center p-px', className, {
        'object-contain': imgSrc === fallbackSrc
      })}
    />
  )
}
