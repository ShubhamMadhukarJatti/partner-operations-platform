'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import {
  motion,
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform
} from 'motion/react'

import { FileUploadIcon, LockIcon } from '@/components/icons/icons'
import { FullLogo } from '@/components/icons/logo'

const transition = {
  duration: 0,
  ease: 'linear' as const
}

export const GoogleGeminiEffect = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const [showBeam, setShowBeam] = useState(false)
  const [showBeam2, setShowBeam2] = useState(false)
  const [showBeam3, setShowBeam3] = useState(false)
  const [showBeam4, setShowBeam4] = useState(false)
  const [showBeam6, setShowBeam6] = useState(false)
  const [showBeam7, setShowBeam7] = useState(false)
  const [showBeam8, setShowBeam8] = useState(false)
  const [showBeam9, setShowBeam9] = useState(false)
  const [showBeam10, setShowBeam10] = useState(false)
  const [showBeam11, setShowBeam11] = useState(false)

  const pathLengths = [
    useTransform(scrollYProgress, [0, 0.15], [0, 1]), // Line1
    useTransform(scrollYProgress, [0, 0.3], [0, 1]), // Line2 (larger duration)
    useTransform(scrollYProgress, [0, 0.15], [0, 1]), // Line3
    useTransform(scrollYProgress, [0.15, 0.3], [0, 1]), // Line4 (same as Line5)
    useTransform(scrollYProgress, [0.15, 0.3], [0, 1]), // Line5 (same as Line4)
    useTransform(scrollYProgress, [0.3, 0.45], [0, 1]), // Line6 (same as 7,8,9,10)
    useTransform(scrollYProgress, [0.3, 0.45], [0, 1]), // Line7 (same as 6,8,9,10)
    useTransform(scrollYProgress, [0.3, 0.45], [0, 1]), // Line8 (same as 6,7,9,10)
    useTransform(scrollYProgress, [0.3, 0.45], [0, 1]), // Line9 (same as 6,7,8,10)
    useTransform(scrollYProgress, [0.3, 0.45], [0, 1]) // Line10 (same as 6,7,8,9)
  ]

  useMotionValueEvent(pathLengths[0], 'change', (latest) => {
    setShowBeam(latest >= 1)
  })

  useEffect(() => {
    if (pathLengths[0]) {
      const unsub = pathLengths[0].on('change', (val) => {
        setShowBeam(val >= 1)
      })
    }

    if (pathLengths[1]) {
      const unsub = pathLengths[1].on('change', (val) => {
        setShowBeam2(val >= 1)
      })
    }

    if (pathLengths[2]) {
      const unsub = pathLengths[2].on('change', (val) => {
        setShowBeam3(val >= 1)
      })
    }

    if (pathLengths[3]) {
      const unsub = pathLengths[3].on('change', (val) => {
        setShowBeam4(val >= 1)
      })
    }

    if (pathLengths[5]) {
      const unsub = pathLengths[5].on('change', (val) => {
        setShowBeam6(val >= 1)
      })
    }

    if (pathLengths[6]) {
      const unsub = pathLengths[6].on('change', (val) => {
        setShowBeam7(val >= 1)
      })
    }

    if (pathLengths[7]) {
      const unsub = pathLengths[7].on('change', (val) => {
        setShowBeam8(val >= 1)
      })
    }

    if (pathLengths[8]) {
      const unsub = pathLengths[8].on('change', (val) => {
        setShowBeam9(val >= 1)
      })
    }

    if (pathLengths[9]) {
      const unsub = pathLengths[9].on('change', (val) => {
        setShowBeam10(val >= 1)
      })
    }

    if (pathLengths[10]) {
      const unsub = pathLengths[10].on('change', (val) => {
        setShowBeam11(val >= 1)
      })
    }
  }, [pathLengths])

  console.log('pathLengths[0].get()', pathLengths[0].get())

  return (
    <div className='sticky top-80 h-[925px]'>
      <div className='relative h-full'>
        <div className='bg-red-transparent absolute -top-6 flex w-full items-center justify-center'>
          <div
            className='relative z-10 mx-auto mt-8 w-fit overflow-hidden rounded-full border border-[#92A0B9] bg-white px-[62px] py-[42px] text-xs font-bold text-black shadow-md md:mt-24 md:text-base'
            style={{ backgroundImage: "url('/assets/encryption.png')" }}
          >
            <div className='absolute inset-0 z-0 bg-white/90' />
            <div className='relative z-10 flex flex-col items-center justify-center gap-4'>
              <LockIcon />
              <FullLogo className='w-[158px]' />
              <p className='text-[24px] font-normal text-[#3B475D]'>
                encrypted escrow environment
              </p>
            </div>
          </div>
        </div>

        {/* Animated SVG Lines */}
        <div className='absolute inset-0' ref={containerRef}>
          {/* Line1 */}
          <svg
            width='635'
            height='200'
            viewBox='0 0 635 200'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <defs>
              <linearGradient
                id='beamGradient1'
                x1='0%'
                y1='0%'
                x2='100%'
                y2='0%'
              >
                <stop offset='0%' stopColor='#8A2BE2' />
                <stop offset='16.6%' stopColor='#4B0082' />
                <stop offset='33.3%' stopColor='#0000FF' />
                <stop offset='50%' stopColor='#00FF00' />
                <stop offset='66.6%' stopColor='#FFFF00' />
                <stop offset='83.3%' stopColor='#FF7F00' />
                <stop offset='100%' stopColor='#FF0000' />
              </linearGradient>
            </defs>

            <motion.path
              d='M1 4.78188C71.3333 -0.701886 232.2 -1.79864 313 37.6844C414 87.0383 401.5 186.65 470.5 192.761C525.7 197.649 602.5 198.244 634 197.931'
              stroke='#FCAA3F'
              strokeWidth='4'
              fill='none'
              initial={{ pathLength: 0 }}
              style={{ pathLength: pathLengths[0] }}
              transition={transition}
            />

            {showBeam && (
              <motion.path
                d='M1 4.78188C71.3333 -0.701886 232.2 -1.79864 313 37.6844C414 87.0383 401.5 186.65 470.5 192.761C525.7 197.649 602.5 198.244 634 197.931'
                stroke='url(#beamGradient1)'
                strokeWidth='4'
                fill='none'
                strokeDasharray='100 1200'
                strokeLinecap='round'
                animate={{
                  strokeDashoffset: [1200, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            )}
          </svg>

          {/* Line2 */}
          <motion.svg
            width='1439'
            height='4'
            viewBox='0 0 1439 4'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <defs>
              <linearGradient
                id='beamGradient2'
                x1='0%'
                y1='0%'
                x2='100%'
                y2='0%'
              >
                <stop offset='0%' stopColor='#8A2BE2' />
                <stop offset='16.6%' stopColor='#4B0082' />
                <stop offset='33.3%' stopColor='#0000FF' />
                <stop offset='50%' stopColor='#00FF00' />
                <stop offset='66.6%' stopColor='#FFFF00' />
                <stop offset='83.3%' stopColor='#FF7F00' />
                <stop offset='100%' stopColor='#FF0000' />
              </linearGradient>
            </defs>

            <motion.line
              x1='0'
              y1='2'
              x2='1439'
              y2='2'
              stroke='#F94F2F'
              strokeWidth='4'
              initial={{ pathLength: 0 }}
              style={{ pathLength: pathLengths[1] }}
              transition={transition}
            />

            {/* {showBeam2 && (
              <motion.line
                x1='0'
                y1='2'
                x2='1439'
                y2='2'
                stroke='#5D3FD3'
                strokeWidth='4'
                strokeDasharray='100 1500'
                strokeLinecap='round'
                animate={{ strokeDashoffset: [0, 500] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            )} */}
          </motion.svg>

          {/* Line3 */}
          <motion.svg
            width='635'
            height='200'
            viewBox='0 0 635 200'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <defs>
              <linearGradient
                id='beamGradient3'
                x1='0%'
                y1='0%'
                x2='100%'
                y2='0%'
              >
                <stop offset='0%' stopColor='#8A2BE2' />
                <stop offset='16.6%' stopColor='#4B0082' />
                <stop offset='33.3%' stopColor='#0000FF' />
                <stop offset='50%' stopColor='#00FF00' />
                <stop offset='66.6%' stopColor='#FFFF00' />
                <stop offset='83.3%' stopColor='#FF7F00' />
                <stop offset='100%' stopColor='#FF0000' />
              </linearGradient>
            </defs>

            <motion.path
              d='M1 195.218C71.3333 200.702 232.2 201.799 313 162.316C414 112.962 401.5 13.3498 470.5 7.23933C525.7 2.35095 602.5 1.75556 634 2.06892'
              stroke='#046EFF'
              strokeWidth='4'
              fill='none'
              initial={{ pathLength: 0 }}
              style={{ pathLength: pathLengths[2] }}
              transition={transition}
            />

            {showBeam3 && (
              <motion.path
                d='M1 195.218C71.3333 200.702 232.2 201.799 313 162.316C414 112.962 401.5 13.3498 470.5 7.23933C525.7 2.35095 602.5 1.75556 634 2.06892'
                stroke='url(#beamGradient3)'
                strokeWidth='4'
                fill='none'
                strokeDasharray='100 1200'
                strokeLinecap='round'
                animate={{ strokeDashoffset: [1200, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            )}
          </motion.svg>

          {/* Line4 */}
          <span className='absolute right-0 top-0'>
            <motion.svg
              width='635'
              height='200'
              viewBox='0 0 635 200'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <defs>
                <linearGradient
                  id='beamGradient4'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='0%'
                >
                  <stop offset='0%' stopColor='#FF0000' />
                  <stop offset='16.6%' stopColor='#FF7F00' />
                  <stop offset='33.3%' stopColor='#FFFF00' />
                  <stop offset='50%' stopColor='#00FF00' />
                  <stop offset='66.6%' stopColor='#0000FF' />
                  <stop offset='83.3%' stopColor='#4B0082' />
                  <stop offset='100%' stopColor='#8A2BE2' />
                </linearGradient>
              </defs>

              <motion.path
                d='M1 197.931C32.5 198.244 109.3 197.649 164.5 192.761C233.5 186.65 221 87.0383 322 37.6844C402.8 -1.79864 563.667 -0.701886 634 4.78188'
                stroke='#FCAA3F'
                strokeWidth='4'
                fill='none'
                initial={{ pathLength: 0 }}
                style={{ pathLength: pathLengths[3] }}
                transition={transition}
              />

              {showBeam4 && (
                <motion.path
                  d='M1 197.931C32.5 198.244 109.3 197.649 164.5 192.761C233.5 186.65 221 87.0383 322 37.6844C402.8 -1.79864 563.667 -0.701886 634 4.78188'
                  stroke='url(#beamGradient4)'
                  strokeWidth='4'
                  fill='none'
                  strokeDasharray='100 1200'
                  strokeLinecap='round'
                  animate={{ strokeDashoffset: [0, 1200] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              )}
            </motion.svg>
          </span>

          {/* Line5 */}
          <span className='absolute right-0 top-[calc(22%+1px)]'>
            <motion.svg
              width='635'
              height='200'
              viewBox='0 0 635 200'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <defs>
                <linearGradient
                  id='beamGradient5'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='0%'
                >
                  <stop offset='0%' stopColor='#FF0000' />
                  <stop offset='16.6%' stopColor='#FF7F00' />
                  <stop offset='33.3%' stopColor='#FFFF00' />
                  <stop offset='50%' stopColor='#00FF00' />
                  <stop offset='66.6%' stopColor='#0000FF' />
                  <stop offset='83.3%' stopColor='#4B0082' />
                  <stop offset='100%' stopColor='#8A2BE2' />
                </linearGradient>
              </defs>

              <motion.path
                d='M1 2.06892C32.5 1.75556 109.3 2.35095 164.5 7.23933C233.5 13.3498 221 112.962 322 162.316C402.8 201.799 563.667 200.702 634 195.218'
                stroke='#046EFF'
                strokeWidth='4'
                fill='none'
                initial={{ pathLength: 0 }}
                style={{ pathLength: pathLengths[5] }}
                transition={transition}
              />

              {showBeam6 && (
                <motion.path
                  d='M1 2.06892C32.5 1.75556 109.3 2.35095 164.5 7.23933C233.5 13.3498 221 112.962 322 162.316C402.8 201.799 563.667 200.702 634 195.218'
                  stroke='url(#beamGradient5)'
                  strokeWidth='4'
                  fill='none'
                  strokeDasharray='100 1200'
                  strokeLinecap='round'
                  animate={{ strokeDashoffset: [0, 1200] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              )}
            </motion.svg>
          </span>

          {/* Line6 */}
          <span className='absolute left-[20%] top-[30%]'>
            <motion.svg
              width='444'
              height='425'
              viewBox='0 0 444 425'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <defs>
                <linearGradient
                  id='beamGradient6'
                  x1='0'
                  y1='0'
                  x2='444'
                  y2='0'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop offset='0%' stopColor='#FF0000' />
                  <stop offset='16.6%' stopColor='#FF7F00' />
                  <stop offset='33.3%' stopColor='#FFFF00' />
                  <stop offset='50%' stopColor='#00FF00' />
                  <stop offset='66.6%' stopColor='#0000FF' />
                  <stop offset='83.3%' stopColor='#4B0082' />
                  <stop offset='100%' stopColor='#8A2BE2' />
                </linearGradient>
              </defs>

              <motion.path
                d='M441.845 0.999986C442.549 22.0497 441.212 73.3711 430.238 110.258C416.521 156.367 192.902 148.014 82.1079 215.507C-6.52756 269.501 -4.06546 377 8.24503 424'
                stroke='#FCAA3F'
                strokeWidth='4'
                fill='none'
                initial={{ pathLength: 0 }}
                style={{ pathLength: pathLengths[6] }}
                transition={transition}
              />

              {showBeam7 && (
                <motion.path
                  d='M441.845 0.999986C442.549 22.0497 441.212 73.3711 430.238 110.258C416.521 156.367 192.902 148.014 82.1079 215.507C-6.52756 269.501 -4.06546 377 8.24503 424'
                  stroke='url(#beamGradient6)'
                  strokeWidth='4'
                  fill='none'
                  strokeDasharray='100 1400'
                  strokeLinecap='round'
                  animate={{ strokeDashoffset: [1400, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              )}
            </motion.svg>
          </span>

          {/* Line7 */}
          <span className='absolute left-[21%] top-[34%]'>
            <motion.svg
              width='500'
              height='405'
              viewBox='0 0 500 405'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <defs>
                <linearGradient
                  id='beamGradient7'
                  x1='0'
                  y1='0'
                  x2='444'
                  y2='0'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop offset='0%' stopColor='#FF0000' />
                  <stop offset='16.6%' stopColor='#FF7F00' />
                  <stop offset='33.3%' stopColor='#FFFF00' />
                  <stop offset='50%' stopColor='#00FF00' />
                  <stop offset='66.6%' stopColor='#0000FF' />
                  <stop offset='83.3%' stopColor='#4B0082' />
                  <stop offset='100%' stopColor='#8A2BE2' />
                </linearGradient>
              </defs>

              <motion.path
                d='M497.829 1.00001C498.603 20.5071 497.133 68.0673 485.061 102.251C469.972 144.981 223.992 137.24 102.118 199.787C4.61918 249.824 -6.04282 360.444 7.49871 404'
                stroke='#F94F2F'
                strokeWidth='4'
                fill='none'
                initial={{ pathLength: 0 }}
                style={{ pathLength: pathLengths[7] }}
                transition={transition}
              />

              {showBeam8 && (
                <motion.path
                  d='M497.829 1.00001C498.603 20.5071 497.133 68.0673 485.061 102.251C469.972 144.981 223.992 137.24 102.118 199.787C4.61918 249.824 -6.04282 360.444 7.49871 404'
                  stroke='url(#beamGradient7)'
                  strokeWidth='4'
                  fill='none'
                  strokeDasharray='100 1400'
                  strokeLinecap='round'
                  animate={{ strokeDashoffset: [1400, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              )}
            </motion.svg>
          </span>

          {/* Line8 */}
          <span className='absolute right-[21%] top-[34%]'>
            <motion.svg
              width='500'
              height='405'
              viewBox='0 0 500 405'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <defs>
                <linearGradient
                  id='beamGradient8'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='0%'
                >
                  <stop offset='0%' stopColor='#8A2BE2' />
                  <stop offset='16.6%' stopColor='#4B0082' />
                  <stop offset='33.3%' stopColor='#0000FF' />
                  <stop offset='50%' stopColor='#00FF00' />
                  <stop offset='66.6%' stopColor='#FFFF00' />
                  <stop offset='83.3%' stopColor='#FF7F00' />
                  <stop offset='100%' stopColor='#FF0000' />
                </linearGradient>
              </defs>

              <motion.path
                d='M2.17078 1.00001C1.39698 20.5071 2.8672 68.0673 14.9385 102.251C30.0277 144.981 276.008 137.24 397.882 199.787C495.381 249.824 506.043 360.444 492.501 404'
                stroke='#F94F2F'
                strokeWidth='4'
                fill='none'
                initial={{ pathLength: 0 }}
                style={{ pathLength: pathLengths[8] }}
                transition={transition}
              />

              {showBeam9 && (
                <motion.path
                  d='M2.17078 1.00001C1.39698 20.5071 2.8672 68.0673 14.9385 102.251C30.0277 144.981 276.008 137.24 397.882 199.787C495.381 249.824 506.043 360.444 492.501 404'
                  stroke='url(#beamGradient8)'
                  strokeWidth='4'
                  fill='none'
                  strokeDasharray='100 1400'
                  strokeLinecap='round'
                  animate={{ strokeDashoffset: [1400, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              )}
            </motion.svg>
          </span>

          {/* Line9 */}
          <span className='absolute right-[20%] top-[30%]'>
            <motion.svg
              width='444'
              height='425'
              viewBox='0 0 444 425'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <defs>
                <linearGradient
                  id='beamGradient9'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='0%'
                >
                  <stop offset='0%' stopColor='#8A2BE2' />
                  <stop offset='16.6%' stopColor='#4B0082' />
                  <stop offset='33.3%' stopColor='#0000FF' />
                  <stop offset='50%' stopColor='#00FF00' />
                  <stop offset='66.6%' stopColor='#FFFF00' />
                  <stop offset='83.3%' stopColor='#FF7F00' />
                  <stop offset='100%' stopColor='#FF0000' />
                </linearGradient>
              </defs>

              <motion.path
                d='M2.15475 0.999986C1.45129 22.0497 2.78787 73.3711 13.7618 110.258C27.4792 156.367 251.098 148.014 361.892 215.507C450.528 269.501 448.065 377 435.755 424'
                stroke='#FCAA3F'
                strokeWidth='4'
                fill='none'
                initial={{ pathLength: 0 }}
                style={{ pathLength: pathLengths[9] }}
                transition={transition}
              />

              {showBeam10 && (
                <motion.path
                  d='M2.15475 0.999986C1.45129 22.0497 2.78787 73.3711 13.7618 110.258C27.4792 156.367 251.098 148.014 361.892 215.507C450.528 269.501 448.065 377 435.755 424'
                  stroke='url(#beamGradient9)'
                  strokeWidth='4'
                  fill='none'
                  strokeDasharray='100 1400'
                  strokeLinecap='round'
                  animate={{ strokeDashoffset: [1400, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              )}
            </motion.svg>
          </span>

          {/* Line10 */}
          <span className='absolute right-[50%] top-[35%]'>
            <motion.svg
              width='4'
              height='381'
              viewBox='0 0 4 381'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <defs>
                <linearGradient
                  id='beamGradient10'
                  x1='0%'
                  y1='0%'
                  x2='0%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#8A2BE2' />
                  <stop offset='16.6%' stopColor='#4B0082' />
                  <stop offset='33.3%' stopColor='#0000FF' />
                  <stop offset='50%' stopColor='#00FF00' />
                  <stop offset='66.6%' stopColor='#FFFF00' />
                  <stop offset='83.3%' stopColor='#FF7F00' />
                  <stop offset='100%' stopColor='#FF0000' />
                </linearGradient>
              </defs>

              <motion.line
                x1='2'
                y1='0'
                x2='2'
                y2='381'
                stroke='#046EFF'
                strokeWidth='4'
                initial={{ pathLength: 0 }}
                style={{ pathLength: pathLengths[9] }}
                transition={transition}
              />

              {true && (
                <motion.line
                  x1='2'
                  y1='0'
                  x2='2'
                  y2='381'
                  stroke='url(#beamGradient10)'
                  strokeWidth='4'
                  strokeLinecap='round'
                  strokeDasharray='100 381'
                  animate={{ strokeDashoffset: [381, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              )}
            </motion.svg>
          </span>
        </div>

        {/* UI Elements */}
        <div className='absolute left-10 top-[calc(18%+4px)] flex w-fit gap-2 rounded-lg bg-[#F94F2F] p-4'>
          <FileUploadIcon />{' '}
          <p className='text-base font-semibold text-white'>
            Secure Data Upload A
          </p>
        </div>
        <div className='absolute right-10 top-[calc(18%+4px)] flex w-fit gap-2 rounded-lg bg-[#FFB707] p-4'>
          <FileUploadIcon />{' '}
          <p className='text-base font-semibold text-white'>
            Secure Data Upload B
          </p>
        </div>

        <div className='absolute bottom-0 left-[170px] w-[262px] overflow-hidden rounded-xl shadow-sm'>
          <div className='flex items-center gap-2 bg-[#151552] p-4 text-base font-normal text-white'>
            <Search size={24} fill='#ffffff' /> Prospects
          </div>
          <div className='rounded-b-xl border border-[#92A0B9] bg-[#FFFFFF] p-4 pb-6 shadow-sm'>
            <p className='mb-6 text-[20px] font-semibold'>SAAS CRM</p>
            <div className='flex gap-1'>
              <div className='h-2 w-2 rounded-full bg-[#484848]' />
              <div className='h-2 w-[179px] rounded-full bg-[#484848]' />
            </div>
            <div className='mt-6 flex gap-1'>
              <div className='h-2 w-2 rounded-full bg-[#484848]' />
              <div className='h-2 w-[179px] rounded-full bg-[#484848]' />
            </div>
            <div className='mt-6 flex gap-1'>
              <div className='h-2 w-2 rounded-full bg-[#484848]' />
              <div className='h-2 w-[179px] rounded-full bg-[#484848]' />
            </div>
          </div>
        </div>

        <div className='absolute bottom-0 right-[170px] w-[262px] overflow-hidden rounded-xl shadow-sm'>
          <div className='flex items-center gap-2 bg-[#151552] p-4 text-base font-normal text-white'>
            <Search size={24} fill='#ffffff' /> Open Opurtunities
          </div>
          <div className='rounded-b-xl border border-[#92A0B9] bg-[#FFFFFF] p-4 pb-6 shadow-sm'>
            <p className='mb-6 text-[20px] font-semibold'>
              Marketing automation
            </p>
            <div className='flex gap-1'>
              <div className='h-2 w-2 rounded-full bg-[#484848]' />
              <div className='h-2 w-[179px] rounded-full bg-[#484848]' />
            </div>
            <div className='mt-6 flex gap-1'>
              <div className='h-2 w-2 rounded-full bg-[#484848]' />
              <div className='h-2 w-[179px] rounded-full bg-[#484848]' />
            </div>
            <div className='mt-6 flex gap-1'>
              <div className='h-2 w-2 rounded-full bg-[#484848]' />
              <div className='h-2 w-[179px] rounded-full bg-[#484848]' />
            </div>
          </div>
        </div>

        <div className='absolute bottom-0 left-[37%] w-[388px] overflow-hidden rounded-lg border border-[#92A0B9] bg-white shadow-md'>
          <div className='p-4 text-lg font-semibold text-[#242424] '>
            Matrix view
          </div>
          <table className=' text-sm/6 text-[#242424]'>
            <tbody>
              <tr>
                <td className=' invisible font-normal'>SAAS CRM</td>
                <td className='w-[100px] border border-[#C8CFDC] px-3 text-center text-sm font-normal'>
                  SAAS CRM
                </td>
                <td className='border border-[#C8CFDC] p-4 text-center text-sm font-normal'>
                  Marketing automation platform
                </td>
              </tr>
              <tr>
                <td className='border border-[#C8CFDC] p-4'>Open</td>
                <td className='border border-[#C8CFDC] p-4 text-center'>150</td>
                <td className='border border-[#C8CFDC] p-4 text-center'>50</td>
              </tr>
              <tr>
                <td className='border border-[#C8CFDC] p-4'>Customers</td>
                <td className='border border-[#C8CFDC] p-4 text-center'>30</td>
                <td className='border border-[#C8CFDC] p-4 text-center'>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
