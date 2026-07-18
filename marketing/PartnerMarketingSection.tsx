import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

type TrustedCompany = {
  thumbnailUrl: string
  altText: string
}

const PartnerMarketingSection = () => {
  const TRUSTED_COMPANIES: TrustedCompany[] = [
    {
      thumbnailUrl: '/icons/relokart-grey.svg',
      altText: 'relokart'
    },
    {
      thumbnailUrl: '/icons/whalesbook-grey.svg',
      altText: 'whalesbook'
    },
    {
      thumbnailUrl: '/icons/vipas-ai-grey.svg',
      altText: 'vipas-ai'
    },
    {
      thumbnailUrl: '/icons/chums-ai-grey.svg',
      altText: 'chums-ai'
    }
  ]

  return (
    <section className='container mx-auto px-4 py-12 md:py-20'>
      {/* Heading Section */}
      <div className='mb-16 text-center'>
        <h2 className='fds-heading leading-tight tracking-tight md:text-4xl'>
          <span className='text-[#00AD3C]'>Partner Marketing</span> using Common
          Overlaps!
        </h2>
        <p className='mt-2 text-lg text-muted-foreground'>
          Fully Encrypted Escrow Environment in Sharkdom&apos;s Ecosystem
        </p>
      </div>

      {/* Central Data Sharing Section */}
      <div className='mb-16 grid grid-cols-1 gap-8 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-xl md:grid-cols-3 md:p-12'>
        {/* Left: Permissions Title */}
        <div className='flex items-center justify-center md:col-span-1 md:justify-start'>
          <h3 className='fds-text-lead-semibold text-center text-gray-800 md:text-left'>
            Partner data-sharing
            <br />
            Permissions
          </h3>
        </div>

        {/* Right: Partner List */}
        <div className='space-y-4 md:col-span-2'>
          <Image
            src='/assets/partner-marketing-section.svg'
            alt='Partner Marketing Section'
            width={1000}
            height={1000}
          />
          {/* Example Row */}
          {/* <div className='flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0'>
            <div className='flex items-center space-x-3'>
              {/* Placeholder for icon, replace with actual if needed */}
          {/* <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-200'> */}
          {/* <span className='text-sm text-blue-800'>📈</span> */}
          {/* </div> */}
          {/* <span className='font-medium'>Steady Partners</span> */}
          {/* </div> */}
          {/* <div className='flex items-center space-x-4 text-sm text-gray-600'> */}
          {/* <span className='rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800'> */}
          {/* Full access */}
          {/* </span> */}
          {/* <span>14/03/23 by you</span> */}
          {/* </div> */}
          {/* </div> */}
          {/* Repeat for other partners */}
          {/* <div className='flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0'>
            <div className='flex items-center space-x-3'>
              {/* Placeholder for icon, replace with actual if needed */}
          {/* <div className='flex h-8 w-8 items-center justify-center rounded-full bg-yellow-200'> */}
          {/* <span className='text-sm text-yellow-800'>🟡</span> */}
          {/* </div> */}
          {/* <span className='font-medium'>Inactive Partners</span> */}
          {/* </div> */}
          {/* <div className='flex items-center space-x-4 text-sm text-gray-600'> */}
          {/* <span className='rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800'> */}
          {/* Only count */}
          {/* </span> */}
          {/* <span>14/03/23 by you</span> */}
          {/* </div> */}
          {/* </div> */}
          {/* <div className='flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0'> */}

          {/* </div> */}
          {/* <div className='flex items-center justify-between'> */}

          {/* </div> */}
        </div>
      </div>

      {/* Metrics and CTA Section */}
      <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-3'>
        {/* Metric Card 1 */}
        <Card className='flex flex-col items-start p-6'>
          <CardContent className='mb-2 flex items-center space-x-2 p-0'>
            <span className='text-4xl font-bold'>4x</span>
            <ArrowUpRight className='h-6 w-6 text-green-500' />
          </CardContent>
          <CardDescription className='text-base'>
            New Customer Signups
          </CardDescription>
        </Card>

        {/* Metric Card 2 */}
        <Card className='flex flex-col items-start p-6'>
          <CardContent className='mb-2 flex items-center space-x-2 p-0'>
            <span className='text-4xl font-bold'>245%</span>
            <ArrowUpRight className='h-6 w-6 text-green-500' />
          </CardContent>
          <CardDescription className='text-base'>
            Increase in revenue
          </CardDescription>
        </Card>

        {/* CTA Card */}
        <Card className='flex flex-col items-center justify-center bg-blue-600 p-6 text-white'>
          <CardTitle className='fds-text-lead-semibold mb-4 text-center text-white'>
            Use modern day approach to
            <br />
            partner via Sharkdom
          </CardTitle>
          <Link
            href='/book-demo'
            className='px-8 py-3 text-center font-semibold text-white transition hover:bg-[#3B82F6]'
          >
            <Button
              variant='secondary'
              size='lg'
              className='bg-white px-8 text-blue-600 hover:bg-gray-100'
            >
              Get a free demo
            </Button>
          </Link>
        </Card>
      </div>

      {/* Trusted By Section */}
      <div className='my-8 w-full sm:my-12'>
        <p className='fds-text text-center text-[#757575] sm:text-shark-lg'>
          Trusted by <span className=''>1,342</span> companies for discovering
          and enabling impactful partnerships.
        </p>
        <div className='w-full max-w-5xl overflow-hidden'>
          <div
            className='mt-8 flex flex-wrap items-center justify-center gap-6 transition-transform duration-500 ease-in-out sm:mt-12 sm:gap-x-10 '
            style={{
              animation: 'marquee 10s linear infinite'
            }}
          >
            {TRUSTED_COMPANIES &&
              TRUSTED_COMPANIES.map((company) => (
                <div className='flex-shrink-0' key={company.altText}>
                  <Image
                    src={company.thumbnailUrl}
                    alt={company.altText}
                    width={80}
                    height={80}
                    className='h-auto w-full max-w-20 object-contain sm:max-w-28'
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PartnerMarketingSection
