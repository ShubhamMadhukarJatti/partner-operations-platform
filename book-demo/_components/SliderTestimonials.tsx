'use client'

import React from 'react'
import Image from 'next/image'

const testimonials: any = [
  {
    id: 1,
    review:
      'Made it real easy to use our partner channels to increase our market reach rather then wasting time on going back and forth.',
    image: '/testimonials/client-6.svg',
    name: 'Mark Scott',
    designation: 'GTM & head of Growth',
    logo: '/testimonials/whalesbook.png'
  },
  {
    id: 2,
    review:
      'For us finding partners that could drive our revenue and awareness was well soughted by Sharkdoms internal GTM approach solution.',
    image: '/testimonials/client-7.svg',
    name: 'Niketan Venkateshwar',
    designation: 'Head of Partnerships',
    logo: '/testimonials/whalesbook.png'
  }
]

const SliderTestimonials = () => {
  return (
    <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-2'>
      {testimonials.map((testimonial: any) => (
        <div
          key={testimonial.id}
          className='relative flex flex-col rounded-[24px] border border-gray-100 bg-white/50 p-8 shadow-sm backdrop-blur-sm'
        >
          {/* Quote Icon */}
          <div className='mb-6'>
            <svg
              width='28'
              height='20'
              viewBox='0 0 28 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M0 11.5385C0 5.16346 5.16346 0 11.5385 0V7.69231C9.41346 7.69231 7.69231 9.41346 7.69231 11.5385H11.5385V20H0V11.5385ZM15.3846 11.5385C15.3846 5.16346 20.5481 0 26.9231 0V7.69231C24.7981 7.69231 23.0769 9.41346 23.0769 11.5385H26.9231V20H15.3846V11.5385Z'
                fill='#6366F1'
              />
            </svg>
          </div>

          <div className='flex flex-1 flex-row items-start justify-between gap-6'>
            <p className='max-w-[70%] text-sm leading-relaxed text-gray-700'>
              {testimonial.review}
            </p>

            <div className='flex flex-col items-center text-center'>
              <div className='mb-2 h-14 w-14 overflow-hidden rounded-full shadow-md ring-2 ring-white'>
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={56}
                  height={56}
                  className='h-full w-full object-cover'
                />
              </div>
              <p className='text-[13px] font-bold leading-tight text-[#1A1A2E]'>
                {testimonial.name}
              </p>
              <p className='mt-0.5 text-[11px] leading-tight text-gray-500'>
                {testimonial.designation}
              </p>
              <p className='text-[11px] font-medium text-gray-400'>
                {testimonial.company || 'Stacktr'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SliderTestimonials
