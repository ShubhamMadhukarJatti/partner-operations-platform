'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'

import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from '@/components/ui/carousel'

export const AuthRightScouting = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className='relative h-full min-h-[700px] w-full overflow-hidden rounded-[32px]'>
      <div className='absolute left-8 top-8 z-10 flex items-center gap-2'>
        {[0, 1].map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-2 rounded-full transition-all',
              i === current ? 'w-10 bg-white' : 'w-2 bg-white/30'
            )}
          />
        ))}
      </div>

      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 5000
          })
        ]}
        className='h-full w-full overflow-hidden rounded-3xl'
      >
        <CarouselContent className='h-full'>
          <CarouselItem className='relative h-full w-full px-0'>
            <div className='relative flex h-full w-full items-center justify-center'>
              <img
                src='/assets/login/img1.svg'
                alt='Agentic Scouting'
                className='h-full w-full object-cover'
              />
            </div>
          </CarouselItem>
          <CarouselItem className='relative h-full w-full px-0'>
            <div className='relative flex h-full w-full items-center justify-center'>
              <img
                src='/assets/login/img2.svg'
                alt='Partner Mapping'
                className='h-full w-full object-cover'
              />
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  )
}
