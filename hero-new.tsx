'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

const NewHero = () => {
  return (
    <MaxWidthWrapper>
      <section className=' flex flex-col items-center gap-12 py-12 md:py-24 lg:flex-row '>
        <div className='flex flex-col gap-3 '>
          <HeroHighlight>
            <motion.h1
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: [20, -5, 0]
              }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1]
              }}
              className='mx-auto space-y-4 text-pretty px-2 text-4xl font-bold leading-normal text-[#0A1566] sm:px-4 md:text-5xl md:leading-snug'
            >
              Automating <br /> Technicalities in
              <Highlight className='ml-1 flex text-nowrap font-extrabold text-white'>
                Partnerships
              </Highlight>
              <p className='text-balance text-lg font-medium text-[#0000007D] lg:text-xl'>
                Finding Partnerships have never been easier before, We use
                Ecosystem Led Growth to grow the businesses by using Result
                Driven Engaging approach with lesser technicalities.
              </p>
            </motion.h1>
          </HeroHighlight>
        </div>

        <div className='flex shrink-0  '>
          <Image
            src={'/assets/HeroNew.png'}
            alt='hero-img'
            height={900}
            width={580}
            className='w-full lg:-mt-12'
          />
        </div>
      </section>
    </MaxWidthWrapper>
  )
}

export default NewHero
