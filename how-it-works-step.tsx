import React, { useRef } from 'react'
import Image from 'next/image'
import { easeIn, motion, useInView } from 'framer-motion'

import { cn } from '@/lib/utils'

type Props = {}

const Steps = ({ step }: any) => {
  const ref = useRef<any>(null)

  const isInView = useInView(ref, { margin: '-40% 0px -60% 0px' })
  const variants = {
    visible: { x: 0, scale: 1.15, transition: { duration: 0.6, easeIn } },
    hidden: { x: 150, scale: 1, transition: { duration: 0.6, easeIn } } // Adjust the values as needed
  }

  return (
    <main className=''>
      <motion.div
        ref={ref}
        initial='hidden'
        animate={isInView ? 'visible' : 'hidden'}
        variants={variants}
        className={cn(
          'relative flex hidden flex-col items-center rounded-3xl bg-white p-2 shadow-md shadow-black sm:flex sm:flex-row'
        )}
      >
        {/* <p className={cn('absolute -top-2 left-0 text-4xl  text-white z-[-99]  leading-10 font-bold hidden', {
            "flex": isInView
        })} > Step {step.step}</p> */}
        <div className='flex flex-col justify-center space-y-2 sm:w-1/4'>
          <p className='text-center font-light'>Step {step.step}</p>
          <Image
            className='h-full max-h-32 w-full self-center'
            src={step.img}
            width={124}
            height={110}
            alt={step.alt}
          />
        </div>
        <span className='my-4 h-1 w-32 rounded-lg bg-[#201658] sm:h-32 sm:w-1'></span>
        <div className='h-full space-y-4 px-12 py-4'>
          <p className='align-middle text-3xl font-bold text-black'>
            {step.title}
          </p>
          <p className='text-lg font-medium text-[#333333C9]'>{step.desc}</p>
        </div>
      </motion.div>

      <div className='flex flex-col rounded-3xl bg-white shadow-md shadow-black sm:hidden'>
        <div className='flex flex-col justify-center space-y-2'>
          <p className='text-center font-light text-white'>Step {step.step}</p>
          <Image
            className='h-full max-h-32 w-full self-center'
            src={step.img}
            width={124}
            height={110}
            alt={step.alt}
          />
        </div>
        <span className='my-4 h-1 w-32 self-center rounded-lg bg-[#201658] sm:h-32 sm:w-1'></span>
        <div className='h-full space-y-4 px-2 py-4'>
          <p className='text-center text-3xl font-bold text-black'>
            {step.title}
          </p>
          <p className='text-center text-lg font-medium text-[#333333C9]'>
            {step.desc}
          </p>
        </div>
      </div>
    </main>
  )
}

export default Steps
