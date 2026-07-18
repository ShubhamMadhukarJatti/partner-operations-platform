'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import AmitIcon from '@/../public/icons/amit-agrwal.svg'
import JsonIcon from '@/../public/icons/jason.svg'
import NandanIcon from '@/../public/icons/nandan.svg'

import { MarketingGradientFrame } from './MarketingGradientFrame'
import { TRUSTED_COMPANIES } from './trusted-partner-logos'

const testimonials = [
  {
    icon: AmitIcon,
    text: 'Sharkdom made it easier for us to keep all our partners journey at one single place with exclusive portal access for all our partners',
    name: 'Amit Aggarwal, Head of GTM Operation'
  },
  {
    icon: NandanIcon,
    text: "With Sharkdom, As soon as we connected our CRM, we were able to see KPI's which let us find our Ideal partners, opportunities at a much faster pace",
    name: 'Nandhan V., Chief Strategy Officer'
  },
  {
    icon: JsonIcon,
    text: 'Sharkdom made it real easy to onboard co-selling and co-marketing partners with fully transparent partner activity visibility',
    name: 'Jason B., Head of GTM Operation'
  }
]

export default function MakeYourBusiness() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className='my-8 px-2 pb-4 md:px-4'>
      <MarketingGradientFrame className='relative px-4 py-14 md:px-8 md:py-20'>
        <div
          aria-hidden
          className='pointer-events-none absolute bottom-8 left-[72px] z-[2] flex size-7 items-center justify-center md:left-28'
        >
          <div className='size-5 -rotate-45 bg-[#f5f5f5]' />
        </div>
        <div
          aria-hidden
          className='pointer-events-none absolute bottom-8 right-[72px] z-[2] flex size-7 items-center justify-center md:right-28'
        >
          <div className='size-5 -rotate-45 bg-[#f5f5f5]' />
        </div>

        <div className='relative z-[1] mx-auto flex max-w-[1200px] flex-col items-center gap-12'>
          <div className='flex flex-col items-center gap-6 text-center text-[#2a3241]'>
            <h2 className='max-w-[1100px] font-sansGeneral text-4xl font-medium leading-tight md:text-5xl md:leading-[66px] lg:text-[60px]'>
              Join the bandwagon of our customers
            </h2>
            <p className='max-w-[700px] font-sansGeneral text-lg font-normal leading-7 text-[#2a3241]/90 md:text-[18px]'>
              Sharkdom helps you tackle data bottlenecks, streamline analysis,
              and make smarter decisions with ease.
            </p>
          </div>

          <div className='relative w-full max-w-3xl px-2'>
            <div className='relative flex min-h-[280px] items-center justify-center md:min-h-[260px]'>
              {testimonials.map((user, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex flex-col items-center justify-center px-2 text-center transition-opacity duration-700 ease-in-out ${
                    index === current ? 'z-10 opacity-100' : 'z-0 opacity-0'
                  }`}
                >
                  <div className='mb-4'>
                    <Image
                      src={user.icon}
                      alt=''
                      height={80}
                      width={80}
                      className='rounded-full shadow-md ring-2 ring-white/80'
                    />
                  </div>
                  <p className='max-w-2xl px-2 font-sansGeneral text-lg font-medium leading-relaxed text-[#1F1C2B] md:text-xl'>
                    &ldquo;{user.text}&rdquo;
                  </p>
                  <p className='mt-4 font-sansGeneral text-sm italic text-[#2a3241]/80'>
                    {user.name}
                  </p>
                </div>
              ))}
            </div>

            <div className='absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2'>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type='button'
                  onClick={() => setCurrent(index)}
                  aria-label={`Show testimonial ${index + 1}`}
                  className={`h-3 w-3 rounded-full transition-all ${
                    index === current
                      ? 'bg-[#6054EC] ring-2 ring-[#6054EC]/30'
                      : 'bg-[#2a3241]/25 hover:bg-[#2a3241]/40'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className='w-full overflow-x-auto pb-2'>
            <div
              className='flex w-max gap-4 px-2 sm:gap-6 md:justify-center'
              style={{
                animation: 'makeYourBusinessMarquee 32s linear infinite'
              }}
            >
              {Array.from({ length: 6 }).map((_, setIndex) => (
                <React.Fragment key={setIndex}>
                  {TRUSTED_COMPANIES.map((company) => (
                    <div
                      key={`${setIndex}-${company.altText}`}
                      className='flex h-[63px] w-[188px] shrink-0 items-center justify-center rounded-[10px] bg-white px-4 shadow-[0px_7px_20px_0px_rgba(0,0,0,0.07)]'
                    >
                      <Image
                        src={company.thumbnailUrl}
                        alt={company.altText}
                        width={140}
                        height={48}
                        className='h-10 w-auto max-w-[140px] object-contain'
                      />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </MarketingGradientFrame>

      <style jsx>{`
        @keyframes makeYourBusinessMarquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-16.666%);
          }
        }
      `}</style>
    </div>
  )
}
