import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2Icon } from 'lucide-react'

import { Input } from '@/components/ui/input'

import EBook from '../_components/home/e-book'
import IntegrationTools from '../_components/home/integration-tools'
import TrustedCompanies from '../_components/home/trusted-companies'

export const metadata: Metadata = {
  title: `Sharkdom Guide | Modern day partner ops platform`,
  description:
    'Catch our E-book drafted by partnership experts to Grow and Scale your Partnership Strategy',
  robots: {
    index: true, // Allows crawling
    follow: true // Allows following links
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/e-book'
  }
}

function EBookPage() {
  return (
    <React.Fragment>
      <EBook />
      <TrustedCompanies />

      <section className='bg-gradient-to-b from-[#0F172A] via-[#121A2F] to-[#000000]'>
        <div className='m-auto flex max-w-screen-xl flex-col items-center justify-center p-6 lg:p-20'>
          <span className='mb-6 text-xs uppercase text-white'>
            Dive-in.Sharkdom
          </span>
          <h2 className='mb-4 text-center text-4xl font-bold text-white lg:text-5xl'>
            Introducing Sharkdom Co-pilot
          </h2>
          <p className='mb-6 text-center text-xl text-white'>
            Get your hands on early access of our Co-pilot to see how partnering
            with Ideal suited companies can impact positively to your business
          </p>
          <div className='m-auto max-w-3xl rounded-t-lg bg-[#EEF0FD]'>
            <div className='flex flex-col items-center justify-between gap-8 p-6 lg:flex-row lg:p-10'>
              <div className='basis-3/5'>
                <h4 className='mb-4 text-2xl font-bold text-black lg:text-3xl'>
                  Get free Ecosystem advice from Sharkdom Co-pilot
                </h4>
                <p className='text-[#4E5059]'>
                  Sign up for our newsletter to enjoy premium partnerships and
                  ecosystem content you can&apos;t get anywhere else.
                </p>
              </div>
              <div className='relative h-72 w-72'>
                <Image
                  src={'/assets/platform-overview.png'}
                  alt='ecosystem-advice-banner'
                  fill
                />
              </div>
            </div>
            <div>
              <Input
                type='text'
                className='w-3/5 p-4 focus:outline-none'
                placeholder='Enter your email'
              />
              <button className='w-2/5 border-none bg-[#434DE1] py-4 font-semibold text-white outline-none'>
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-[#F8FBFF] p-10 lg:p-20'>
        <div className='m-auto flex max-w-screen-lg flex-col items-center gap-8 lg:flex-row lg:gap-40'>
          <div className='flex flex-col gap-4'>
            <h2 className='text-3xl font-bold text-[#042C59]'>
              Marketplace with over 8000+ Companies, Open for Partnerships 24x7
            </h2>
            <p className='text-[#0D192A]'>
              Sharkdom is GTM Platform automating the partnership process from
              weeks to hours without requirement of having any prior experience
              or professionalism on how partnerships are initiated. Giving more
              Gamified and Easy-to-use Solution.
            </p>

            <Link
              href={'/register'}
              className='w-fit rounded-lg bg-[#042C59] px-5 py-2 text-sm font-semibold text-white'
            >
              Sign Up
            </Link>
          </div>
          <Image
            src={'/assets/top-10-partnership-solution-2024.png'}
            alt='top-10-partnership-solution-2024'
            width={200}
            height={240}
          />
        </div>
      </section>
      <IntegrationTools />
      <section className='m-auto my-12 max-w-screen-xl bg-white'>
        <div className='mx-4 flex flex-col items-center justify-center gap-10 rounded-3xl bg-gradient-to-r from-[#095C37] via-[#1849A9] to-[#A11043] p-10 lg:mx-0 lg:px-24 lg:py-12'>
          <h2 className='text-center text-3xl font-bold text-white'>
            Don&apos;t Take our Word for it. See Sharkdom in Action for Yourself
          </h2>
          <Link
            href={'/register'}
            className='w-fit rounded-lg bg-[#040514] px-5 py-2 text-white'
          >
            Start Your Free Trial
          </Link>

          <div className='w-100 flex flex-col justify-between gap-4 lg:flex-row'>
            <p className='flex items-center gap-2 text-white'>
              <CheckCircle2Icon color='#73E2A3' size={22} />
              No Credit Card Required
            </p>
            <p className='flex items-center gap-2 text-white'>
              <CheckCircle2Icon color='#73E2A3' size={22} />
              Upto 14 days free trial
            </p>
            <p className='flex items-center gap-2 text-white'>
              <CheckCircle2Icon color='#73E2A3' size={22} />
              Upto 14 months historical data
            </p>
            <p className='flex items-center gap-2 text-white'>
              <CheckCircle2Icon color='#73E2A3' size={22} />
              All features included
            </p>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}

export default EBookPage
