import React from 'react'
import Image from 'next/image'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

import BookDemoForm from '../../book-demo/_components/book-demo-form'

type Props = {}

const BookDemoSection = (props: Props) => {
  return (
    <section className=' bg-white py-16'>
      <MaxWidthWrapper className=' flex   flex-col  px-6 xl:px-0 '>
        <div className='flex justify-center gap-10'>
          <div className='flex max-w-[531px] flex-col  gap-4'>
            <CredibilityRevenueCard />
            <TestimonialCard />
          </div>

          <BookDemoForm />
        </div>
      </MaxWidthWrapper>
    </section>
  )
}

export default BookDemoSection

const CredibilityRevenueCard = () => {
  return (
    <div className='mx-auto max-w-xl rounded-lg bg-white p-8 shadow-md'>
      <h2 className='mb-2 text-4xl font-bold'>
        Grow Credibility + Revenue faster
      </h2>
      <p className='mb-6 text-gray-600'>
        Sharkdom is your go-to-market growth platform for onboarding new
        partners to drive traffic, bringing you qualified leads and fine Right
        Partners at Right Time.
      </p>
      <p className='mb-4 text-gray-600'>
        Let&apos;s chat about how we can grow your partner network, as
        we&apos;ve done for other clients:
      </p>
      <ul className='space-y-2'>
        <li className='flex items-center'>
          <svg
            className='mr-2 h-5 w-5 text-blue-500'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
              clipRule='evenodd'
            />
          </svg>
          <span className='font-medium'>750% Increase in Active Partners</span>
        </li>
        <li className='flex items-center'>
          <svg
            className='mr-2 h-5 w-5 text-blue-500'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
              clipRule='evenodd'
            />
          </svg>
          <span className='font-medium'>
            350% YoY Increase in Partner Program Sales
          </span>
        </li>
        <li className='flex items-center'>
          <svg
            className='mr-2 h-5 w-5 text-blue-500'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
              clipRule='evenodd'
            />
          </svg>
          <span className='font-medium'>
            27% Of New Trials Driven by Partnerships (Teamwork)
          </span>
        </li>
      </ul>
    </div>
  )
}

const TestimonialCard = () => {
  return (
    <div className='mx-auto flex w-full flex-col items-center overflow-hidden rounded-2xl bg-white p-8 shadow-md'>
      <Image
        src='/testimonial.png'
        alt='Winred Beily'
        width={164}
        height={209}
      />
      <div className='px-6 py-4 text-center'>
        <p className='mb-4 text-base text-gray-700'>
          &quot;Sharkdom is the best ecosystem platform on the market.
          We&apos;ve done a lot of research, and no other tool can bring
          together agencies, influencers, distributors, customer referrals, and
          affiliate partnerships all in one place.&quot;
        </p>
        <div className='mb-2 text-xl font-bold'>Winred Beily</div>
        <p className='text-sm text-gray-600'>
          Strategic Partnership Specialist
        </p>
      </div>
    </div>
  )
}
