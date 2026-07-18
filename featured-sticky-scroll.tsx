'use client'

import React, { useRef } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

export const StickyScroll = ({
  content,
  contentClassName
}: {
  content: {
    title: string
    description: string
    content?: React.ReactNode | any
  }[]
  contentClassName?: string
}) => {
  const [activeCard, setActiveCard] = React.useState(0)

  const ref = useRef<any>(null)
  const { scrollYProgress } = useScroll({
    // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
    target: ref,
    container: ref,
    offset: ['start start', 'end start']
  })
  const cardLength = content.length

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength)
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint)
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index
        }
        return acc
      },
      0
    )
    setActiveCard(closestBreakpointIndex)
  })

  return (
    <motion.div
      animate={{}}
      className='hide-scrollbar   flex h-[35rem] w-full  justify-between gap-12 space-x-10 overflow-y-auto rounded-md p-10 '
      ref={ref}
    >
      <div className='div relative flex flex-shrink-0 items-start px-4'>
        <div className='max-w-3xl'>
          {content.map((item, index) => (
            <div key={item.title + index} className='my-20'>
              <motion.h2
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.2
                }}
                className='max-w-lg text-3xl leading-relaxed'
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.2
                }}
                className=' mb-6 mt-3 max-w-lg leading-relaxed  text-muted-foreground'
              >
                {item.description}
              </motion.p>

              <motion.div
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.2
                }}
                className='text-kg mt-10 max-w-sm text-slate-300'
              >
                <div>
                  <ul className='flex flex-col gap-4 text-muted-foreground'>
                    <li className='flex items-center gap-4'>
                      <span className='rounded-full bg-primary p-1'>
                        <Check className='h-4 w-4  text-white' />
                      </span>
                      <p>Avoid Proposal Spaming</p>
                    </li>
                    <li className='flex items-center gap-4'>
                      <span className='rounded-full bg-primary p-1'>
                        <Check className='h-4 w-4  text-white' />
                      </span>
                      <p>Autoreply bot to proposals</p>
                    </li>
                    <li className='flex items-center gap-4'>
                      <span className='rounded-full bg-primary p-1'>
                        <Check className='h-4 w-4  text-white' />
                      </span>
                      <p>Instant Meeting Requests</p>
                    </li>

                    <li className='flex items-center gap-4'>
                      <span className='rounded-full bg-primary p-1'>
                        <Check className='h-4 w-4  text-white' />
                      </span>
                      <p>Setting Restrictions</p>
                    </li>
                    <li className='flex items-center gap-4'>
                      <span className='rounded-full bg-primary p-1'>
                        <Check className='h-4 w-4  text-white' />
                      </span>
                      <p>Automated Partnership Meetings</p>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          ))}
          <div className='h-40' />
        </div>
      </div>
      <motion.div
        className={cn(
          'sticky top-10 hidden h-full w-full  overflow-hidden rounded-md bg-white lg:block',
          contentClassName
        )}
      >
        <video
          className='aspect-video w-full max-w-3xl rounded-lg border-[12px] border-muted object-cover'
          loop
          autoPlay
          muted
        >
          <source src={content[activeCard].content} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      </motion.div>
    </motion.div>
  )
}
