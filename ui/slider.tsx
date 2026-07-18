'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className='relative h-2 w-full grow overflow-hidden rounded-full bg-[#DDDCE0]'>
      <SliderPrimitive.Range className='bg-custom-gradient-vibrant absolute h-full' />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className='block h-3 w-3 rounded-full border border-[#B6B0D3] bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B6B0D3] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50' />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
