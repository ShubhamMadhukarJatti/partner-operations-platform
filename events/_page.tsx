/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Event1 from '@/../public/assets/event1.png'
import Ellipse from '@/../public/icons/Ellipse 434.png'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: `Sharkdom Events | Modern day partner ops platform`,
  description:
    'Catch Events hosted by partnership experts to grow and scale your Partnership Strategy'
}

function EventsPage() {
  return (
    <div className='flex flex-col p-4 sm:px-52 sm:py-12'>
      <div className='flex flex-col gap-x-4 gap-y-2 sm:flex-row'>
        <h1 className='text-4xl'>Startup Ecosystem Led Growth</h1>
        <Badge className='w-max bg-[#2BFFA0] px-6 text-2xl font-medium text-black'>
          upcoming
        </Badge>
      </div>
      <div className=''>
        <Image
          className='pt-8'
          src={Event1}
          width={1716}
          height={942}
          alt='startup ecosystem led growth'
        />
      </div>
      <div className='flex flex-col divide-y divide-black sm:flex-row sm:divide-x'>
        <div className='space-y-4 px-4 py-8'>
          <h1 className='text-3xl font-bold'>About the Event</h1>
          <ul className='space-y-2 text-xl font-medium text-[#101828A6]'>
            <li className='flex gap-x-4'>
              <Image
                className='h-min py-2'
                src={Ellipse}
                width={10}
                height={10}
                alt=''
              />
              Using Partnerships as revenue generating source for SAAS startups
            </li>
            <li className='flex gap-x-4'>
              <Image
                className='h-min py-2'
                src={Ellipse}
                width={10}
                height={10}
                alt=''
              />
              Using Startup Ecosystem as stepping stone for expanding to your
              partner's market segment
            </li>
            <li className='flex gap-x-4'>
              <Image
                className='h-min py-2'
                src={Ellipse}
                width={10}
                height={10}
                alt=''
              />
              Gamifying Partnering process
            </li>
            <li className='flex gap-x-4'>
              <Image
                className='h-min py-2'
                src={Ellipse}
                width={10}
                height={10}
                alt=''
              />
              What to look for in an Ideal Partner
            </li>
            <li className='flex gap-x-4'>
              <Image
                className='h-min py-2'
                src={Ellipse}
                width={10}
                height={10}
                alt=''
              />
              Strategies to expand your Partner Network
            </li>
          </ul>
          <div className='flex justify-center pt-12 sm:pt-28'>
            <Link href='https://www.linkedin.com/events/startupecosystemledgrowthforsha7194418570515136512/about/'>
              <Button className='px-12 text-xl font-semibold'>Add Event</Button>
            </Link>
          </div>
        </div>
        <div className='flex justify-center p-4 sm:flex-col sm:px-4'>
          <Link href='/book-demo'>
            <Button className='rounded-sm px-12 text-xl font-semibold'>
              Get FREE Demo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventsPage
