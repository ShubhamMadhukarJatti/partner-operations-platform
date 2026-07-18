'use client'

import React, { useRef } from 'react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform
} from 'motion/react'

import { GoogleGeminiEffect } from '@/components/ui/google-gemini-effect'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { FileUploadIcon, LockIcon } from '@/components/icons/icons'
import { FullLogo } from '@/components/icons/logo'

import {
  Line1,
  Line2,
  Line3,
  Line4,
  Line5,
  Line6,
  Line7,
  Line8,
  Line9,
  Line10
} from './GeminiLines'

const transition = {
  duration: 0,
  ease: 'linear'
}

const GeminiEffect = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  // These transforms will help create a "sticky" effect
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 1], // Position on the scroll
    [1, 1, 0.8, 0] // Opacity values
  )

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 1],
    [1, 1, 0.95, 0.9]
  )

  const y = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 100])
  return (
    <MaxWidthWrapper className='hidden w-full max-w-[1440px] lg:block'>
      <div className='relative mb-[180px]'>
        <div className='relative' ref={containerRef}>
          <h2 className='mb-[100px] text-center text-2xl font-bold lg:text-4xl'>
            Turning Complex Data Into Clarity
          </h2>
          <motion.div
            className='h-[850px]'
            style={{ opacity: opacity, scale: scale, y: y }}
          >
            <GoogleGeminiEffect />
          </motion.div>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}

export default GeminiEffect
