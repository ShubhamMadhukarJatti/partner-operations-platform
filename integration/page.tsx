import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

import Integrations from './_components/Integrations'

export const metadata: Metadata = {
  title: 'Sharkdom Integrations | HubSpot, Slack, Pipedrive and More',
  description:
    'Sync Sharkdom with HubSpot, Pipedrive, Slack, Zoom and more. Keep your CRM as the source of truth while Sharkdom handles the full partnership layer. No duplicate data entry.',
  keywords: [
    'partner platform integrations',
    'HubSpot partner management integration',
    'CRM sync'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/integration'
  }
}

export const ACHIEVEMENTS = [
  {
    imgSrc: '/assets/most-implementable-summer-2024.png',
    altText: 'most-implementable-summer-2024',
    width: 200,
    height: 200
  },
  {
    imgSrc: '/assets/top-10-partnership-solution-2024.png',
    altText: 'top-10-partnership-solution-2024',
    width: 200,
    height: 200
  },
  {
    imgSrc: '/assets/best-results-summer-2024.png',
    altText: 'best-results-summer-2024',
    width: 200,
    height: 200
  },
  {
    imgSrc: '/assets/leader-summer-2024.png',
    altText: 'leader-summer-2024',
    width: 200,
    height: 200
  }
]

function IntegrationsPage() {
  return (
    <React.Fragment>
      <section className='bg-[#F7F9FC] p-10 lg:p-20'>
        <div className='m-auto flex max-w-7xl flex-col items-center justify-between gap-12 md:flex-row lg:gap-56'>
          <div className='flex flex-col gap-5'>
            <h1 className='text-5xl font-bold text-[#042C59] lg:text-7xl'>
              Sharkdom <br /> Integrations
            </h1>
            <p className='max-w-full lg:max-w-96'>
              Source, influence, and convert more partnership pipeline by
              syncing Crossbeam insights with your team&apos;s tech stack.
            </p>
            <Link
              href='/register'
              className='flex w-fit gap-2 rounded-[100px] bg-black px-6 py-2 text-white hover:bg-black hover:text-white'
            >
              Signup for Free
              <ArrowRight />
            </Link>
          </div>
          <Image
            src={'/assets/sharkdom-integrations.webp'}
            alt='sharkdom-integrations'
            width={300}
            height={300}
          />
        </div>
      </section>

      <Integrations />

      <section className='grid grid-cols-1 lg:grid-cols-2'>
        <div className='relative col-span-1 h-[500px]'>
          <Image
            src={'/integration-bg-banner.png'}
            alt='integration-bg-banner'
            fill
          />
          <div className='ml-auto flex h-full flex-col justify-center px-6 lg:mr-24 lg:max-w-[60%] lg:px-0'>
            <p className='relative mb-8 text-2xl font-bold text-[#0D192A] lg:mb-12 lg:text-3xl'>
              “Sharkdom have paved way for us to tap into Indian Market thus
              expanding our partnering channels from single digit to dozens
              withing months.”
            </p>
            <div className='flex gap-8'>
              <Image
                src={'/mandy-hyuk-profile-photo.png'}
                alt='mandy-hyuk-profile-photo'
                width={100}
                height={120}
                className='relative rounded-[46px]'
              />
              <div className='relative flex flex-col justify-end pb-2'>
                <h6>Mandy Hyuk</h6>
                <p>
                  <strong>CRO</strong> at FinStart, Singapore
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='col-span-1 flex flex-col justify-center p-6 lg:max-w-[70%] lg:p-0'>
          <span className='uppercase text-[#7C808D]'>
            Trusted BY HYPERGROWTH COMPANIES
          </span>
          <h2 className='mb-2 text-4xl font-bold leading-[1.1] text-black lg:text-5xl'>
            Marketplace with over 8000+ Companies, Open for Partnerships 24x7
          </h2>
          <p className='mb-5 text-[#38393E]'>
            Sharkdom is GTM Platform automating the partnership process from
            weeks to hours without requirement of having any prior experience or
            professionalism on how partnerships are initiated. Giving more
            Gamified and Easy-to-use Solution.
          </p>
          <Link
            href={'/register'}
            className='flex w-fit items-center gap-2 rounded-lg bg-[#042C59] px-6 py-2 text-sm text-white'
          >
            Sign Up
            <ArrowRight width={20} height={20} />
          </Link>
        </div>
      </section>

      <section className='m-auto flex max-w-4xl flex-col items-center justify-between gap-6 p-20 lg:flex-row lg:gap-0'>
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

      <section className='m-auto mb-20 grid max-w-5xl grid-cols-1 items-center gap-4 rounded-2xl bg-[#181818] px-8 py-5 lg:grid-cols-2'>
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

      <section className='items-center bg-[#EEF0FD]'>
        <div className='m-auto grid max-w-5xl grid-cols-1 gap-4 p-6 lg:grid-cols-2 lg:gap-24 lg:p-0'>
          <div className='flex flex-col justify-center'>
            <span className='uppercase text-[#7C808D]'>
              Subscribe to updates
            </span>
            <h2 className='mb-2 text-5xl font-bold leading-[1.1] text-black'>
              Learn how as a founder you can use the power of partnerships?
            </h2>
            <p className='mb-5 text-[#38393E]'>
              Get partnerships materials, case studies and our ongoing AI
              solution from CXPO’s in driving revenue for your startups with
              partnerships.
            </p>
            <Button
              variant={'ghost'}
              className='flex w-fit gap-4 rounded-md bg-[#434DE1] text-sm text-white'
            >
              Get Free Guide
              <ArrowRight />
            </Button>
          </div>
          <div className='w-100 relative aspect-[426/602] h-[500px]'>
            <Image
              src={'/assets/power-partnerships.png'}
              alt='power-partnerships'
              fill
            />
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}

export default IntegrationsPage
