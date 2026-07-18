'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

function FadeIn(props: {
  children: React.ReactNode
  direction: 'left' | 'right'
}) {
  const [isVisible, setVisible] = useState(false)
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setVisible(entry.isIntersecting))
    })

    if (domRef.current) {
      observer.observe(domRef.current)
    }

    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current)
      }
    }
  }, [])

  return (
    <div
      className={`fade-in-${props.direction} ${isVisible ? 'is-visible' : ''}`}
      ref={domRef}
    >
      {props.children}
    </div>
  )
}

const partnershipProcess = [
  {
    miniTitle: 'ONBOARD PARTNERS',
    title: 'Find your Ideal Partner Profile(IPP)',
    description:
      'Expand your Partner Networking by finding Right Partners from pool of 7100+ Startups using filters to start your journey.',
    image: '/feature-1.webp'
  },
  {
    miniTitle: 'REWARD PARTNERS',
    title: 'Generate leads from Referral & Affiliate Programs',
    description:
      'Track down your Partnership success journey by metrics with our all in one partnership dashboard',
    image: '/feature-2.webp'
  },
  {
    miniTitle: 'COMMUNITY PARTNERS',
    title: 'Realistic Mapping of Customer Persona',
    description: `CRM is configured to estimate customer persona's mapped with your preferred company so you can get the best out of the partnership with one's with more relevant audience.`,
    image: '/feature-3.webp'
  },
  {
    miniTitle: 'REWARD PARTNERS',
    title: `Platform generated MOU's`,
    description:
      'No more MOU would automatically be generated & co-signed by your upcoming partner on partnership establishment.',
    image: '/feature-4.webp'
  },
  {
    miniTitle: 'STRATEGIC PARTNERS',
    title: 'Automating Partner Manangement via Drip Email Campaigns',
    description:
      'Start managing your partnerships by conditions based email campaigns enabling engagement and keep the word going.',
    image: '/feature-5.webp'
  }
]

function SharkdomFeatures() {
  return (
    <div className='relative w-full p-8 lg:pt-20'>
      <div>
        <h3 className='text-center text-3xl font-bold text-black sm:text-4xl md:text-5xl'>
          Making Partnerships Fun and Rewarding
        </h3>
      </div>
      <MaxWidthWrapper className='max-w-6xl py-4 md:py-10'>
        <div className='relative flex flex-col gap-12 md:gap-20'>
          {partnershipProcess.map((process, index) => {
            return (
              <div
                key={index}
                className='relative flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-12'
              >
                <FadeIn direction={index % 2 === 0 ? 'right' : 'left'}>
                  <Image
                    src={process.image}
                    width={500}
                    height={356.93}
                    alt={process.title}
                    className='h-auto w-full rounded-md object-cover'
                  />
                </FadeIn>
                <div
                  className={`flex flex-col justify-center ${index % 2 === 0 ? 'md:order-first' : ''}`}
                >
                  <p className='text-shark-base font-medium text-text-100'>
                    {process.miniTitle}
                  </p>
                  <h2 className='mt-2 text-left text-xl font-bold text-text-100 sm:mt-4 sm:text-2xl md:text-3xl lg:text-4xl'>
                    {process.title}
                  </h2>
                  <p className='mt-2 max-w-lg text-sm font-light text-text-80 sm:mt-4 sm:text-base'>
                    {process.description}
                  </p>
                  <Link
                    className='mt-4 flex flex-row items-center gap-2 text-blue-500 transition duration-300 ease-in-out hover:border-b hover:border-b-blue-500'
                    href={'#'}
                    target='_blank'
                  >
                    Learn more <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </MaxWidthWrapper>
    </div>
  )
}

export default SharkdomFeatures
