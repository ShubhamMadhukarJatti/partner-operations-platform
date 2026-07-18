'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'

import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from '@/components/ui/carousel'

import slide1 from '../../../../public/onBoarding-v2.1/first-corousal-image.jpg'
import slide2 from '../../../../public/onBoarding-v2.1/second-corousal-image.jpg'
import slide3 from '../../../../public/onBoarding-v2.1/third-corousal-image.jpg'

const testimonials = [
  {
    id: 1,
    name: 'Henley Shepherd',
    image: slide1
  },
  {
    id: 2,
    name: 'Caitlyn King',
    image: slide2
  },
  {
    id: 3,
    name: 'Caitlyn King',
    image: slide3
  }
]

export function AuthNewSlider() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  // Sync dots with active slide
  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap()) // set initial
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div
      className='relative w-full overflow-hidden bg-cover bg-center'
      style={{ backgroundImage: 'url("/loginBackgound.svg")' }}
    >
      {/* Dots top-left */}
      <div className='absolute left-4 top-4 z-10 flex items-center gap-2'>
        {testimonials.map((_, i) => (
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
        className='w-full overflow-hidden'
      >
        <CarouselContent>
          {testimonials.map((testimonial: any) => (
            <CarouselItem
              key={testimonial.id}
              className='relative h-screen w-full px-0' // set your desired height
            >
              <div className='flex h-full w-full items-center justify-center'>
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  priority
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
