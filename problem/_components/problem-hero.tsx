import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

type Props = {}

const ProblemHero = (props: Props) => {
  return (
    <section className='bg-background-ghost-white p-10  pb-0 lg:pb-0 lg:pt-24'>
      <MaxWidthWrapper className='flex  flex-col items-start justify-between gap-12 px-8 md:flex-row  '>
        <div className='flex flex-col gap-5'>
          <h1 className='text-3xl font-bold leading-[135%] text-[#042C59] lg:text-6xl'>
            Still using <br />
            spread-sheets to manage <br /> your Partnerships?
          </h1>
          <p className='max-w-full lg:max-w-96'>
            Talk to our team about how we can get you out of spreadsheet hell.
          </p>
          <Link
            href='/register'
            className='flex h-12 w-fit items-center gap-2 rounded-lg bg-primary-light-blue px-8 text-shark-sm font-bold text-background-white text-white hover:bg-primary-light-blue hover:text-white'
          >
            Speak with our team
            <ArrowRight size={20} />
          </Link>
        </div>
        <Image
          src={'/problem-hero.png'}
          alt='problem-hero'
          width={620}
          height={486}
        />
      </MaxWidthWrapper>
    </section>
  )
}

export default ProblemHero
