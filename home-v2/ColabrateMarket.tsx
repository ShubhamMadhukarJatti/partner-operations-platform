'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CollabrativeIcon from '@/../public/icons/collabrate-image.svg'
import { ArrowRight } from 'lucide-react'
import { Default } from 'node_modules/react-toastify/dist/utils'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

import PartnershipsSection from './SuparchargePartner'

const ColabrateAndComarket = () => {
  return (
    <div className='bg-white py-8'>
      <PartnershipsSection />
      <MaxWidthWrapper className='mx-auto w-full max-w-7xl px-4'>
        {/* Card */}
        <div className='overflow-hidden rounded-2xl border border-[#E4E4E4] bg-white'>
          <div className='grid grid-cols-1 items-center gap-6 md:grid-cols-3'>
            {/* Left: copy */}
            <div className='col-span-1 flex flex-col p-10'>
              <p className='text-3xl font-medium leading-tight '>
                Segment your Partners for Automated workflows
              </p>
              <p className='mt-3 max-w-lg text-base text-gray-500'>
                Manage grain level permissions to your partners
              </p>
            </div>

            {/* Right: screenshot */}
            <div className='col-span-2 flex justify-end pt-10'>
              <Image src={CollabrativeIcon} alt='img' />
            </div>
          </div>
        </div>

        {/* centered "See More Features" button below the card (optional) */}
        <Link href='/features'>
          <div className='mt-6 flex items-center justify-center gap-2 text-[#6863FB]'>
            <p className='text-base font-medium'>See More Features</p>{' '}
            <ArrowRight size={20} />
          </div>{' '}
        </Link>
      </MaxWidthWrapper>
      <style jsx>{`
        @keyframes seamlessScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-12.5%);
          }
        }
      `}</style>
    </div>
  )
}
export default ColabrateAndComarket
