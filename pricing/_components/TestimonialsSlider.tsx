import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const testimonials = [
  {
    avatar: '/testimonials/Nityam_Adhikari.svg',
    quote:
      "We always had a huge entry barrier when it comes to communicating with our partner's team but using partner space and other channels did got us better results as both are teams were in sync",
    name: 'Nityam Adhikari, Head of Partnerships',
    company: 'Dweepkart'
  },
  {
    avatar: '/testimonials/Arun_Karikota.svg',
    quote:
      'Having small partnership team was always havoc to do detail research on each potential partner which was really soughted ou by the platform reducing our efforts on researching on partnerships with lower results.',
    name: 'Arun Karikota, GTM strategist',
    company: 'Mercep.io'
  }
  // Add more testimonials as needed
]

const TestimonialsSlider = () => {
  const [current, setCurrent] = useState(0)
  const total = testimonials.length

  const prev = () => setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1))
  const next = () => setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1))

  const testimonial = testimonials[current]

  return (
    <section className='mx-auto flex w-full max-w-6xl flex-col items-center justify-between px-4 py-8 sm:px-6 sm:py-12 md:flex-row md:px-8 md:py-1'>
      {/* Left: Heading */}
      <div className='mb-6 flex-1 text-center sm:mb-8 md:mb-0 md:mr-8 md:text-left'>
        <p className='mb-2 text-xs font-semibold text-gray-400 sm:text-sm'>
          TESTIMONIALS
        </p>
        <h2 className='mb-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl'>
          What our <span className='text-green-600'>customers say</span>
        </h2>
      </div>
      {/* Right: Testimonial Card */}
      <div className='relative flex min-h-[240px] w-full max-w-xl flex-1 flex-col justify-between rounded-2xl bg-blue-600 p-6 sm:min-h-[220px] sm:p-8'>
        <div className='flex flex-col items-start gap-4 sm:flex-row'>
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            width={64}
            height={64}
            className='h-12 w-12 flex-shrink-0 rounded-full border-4 border-white object-cover shadow sm:h-16 sm:w-16'
          />
          <p className='text-sm leading-relaxed text-white sm:text-base'>
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </div>
        <div className='mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-0'>
          <div className='text-center sm:text-left'>
            <p className='text-sm font-semibold leading-tight text-white'>
              {testimonial.name}
            </p>
            <p className='text-xs text-blue-100'>{testimonial.company}</p>
          </div>
          <div className='flex justify-center gap-2 sm:justify-end'>
            <button
              aria-label='Previous testimonial'
              onClick={prev}
              className='flex h-10 w-10 items-center justify-center rounded bg-white text-blue-600 transition hover:bg-blue-100 sm:h-8 sm:w-8'
            >
              <ArrowLeft size={18} className='sm:size-[18px]' />
            </button>
            <button
              aria-label='Next testimonial'
              onClick={next}
              className='flex h-10 w-10 items-center justify-center rounded bg-white text-blue-600 transition hover:bg-blue-100 sm:h-8 sm:w-8'
            >
              <ArrowRight size={18} className='sm:size-[18px]' />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSlider
