import Image from 'next/image'
import { ArrowRight } from 'iconsax-react'

import { Button } from '@/components/ui/button'

import { FAQ } from '../_components/home/faq'
import FreeGuideNew from '../_components/home/free-quide-new'
import { Hero } from '../_components/home/hero'
import ThirdPartyReviews from '../_components/home/third-party-reviews'
import JourneyOverYears from '../_components/journey-over-years'
import { ACHIEVEMENTS } from '../integration/page'

function AboutUs() {
  return (
    <>
      <Hero />

      <section className='mx-auto my-20 grid max-w-5xl grid-cols-1 items-center gap-4 rounded-2xl bg-[#181818] px-8 py-5 lg:grid-cols-2'>
        <div>
          <span className='text-sm uppercase text-white'>For Companies</span>
          <h2 className='mb-2 text-5xl font-bold leading-[1.1] text-white'>
            Turn Growth Partnerships into #1 Revenue Source
          </h2>
          <p className='mb-5 text-white'>
            Get Started within a minute with minimum input in order for us to
            find you your Ideal Partner within secs. Did we mention it’s free?
          </p>
          <Button
            variant={'ghost'}
            className='flex gap-4 bg-transparent px-0 text-sm uppercase text-[#EEFF8B] hover:bg-transparent hover:text-white'
          >
            Sign up Now
            <ArrowRight />
          </Button>
        </div>
        <div className='w-100 relative aspect-[39/28]'>
          <Image
            src={'/assets/partnership-banner.png'}
            alt='partnership-banner'
            fill
          />
        </div>
      </section>

      <JourneyOverYears />
      <FAQ />

      <FreeGuideNew />

      <ThirdPartyReviews />

      <section className='m-auto flex max-w-4xl flex-col items-center justify-between gap-6 px-20 py-12 lg:flex-row lg:gap-0'>
        {ACHIEVEMENTS &&
          ACHIEVEMENTS.map((ele) => (
            <Image
              key={ele.altText}
              src={ele?.imgSrc}
              alt={ele?.altText}
              width={ele?.width}
              height={ele?.height}
            />
          ))}
      </section>
    </>
  )
}

export default AboutUs
