'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Box, Button, Typography } from '@mui/material'

import { Input } from '@/components/ui/input'

import CheckPublicCompability from './CheckPublicCompability'

type Props = {
  code: number
  publicOrg: any // We'll pass this from the server component
}

const PublicProfile = ({ code, publicOrg }: Props) => {
  console.log('publicOrg', publicOrg)
  const [showCompability, setShowCompability] = useState(false)

  const handleClick = () => {
    setShowCompability(true)
  }

  return (
    <div
      className='flex min-h-screen w-full flex-col items-center bg-gray-50'
      onClick={handleClick}
    >
      {/* Header */}
      {/* <div className="w-full flex justify-between items-center px-8 py-4 border-b bg-white">
        <span className="text-2xl font-bold text-blue-700 tracking-wide">SHARKDOM</span>
        <div className="flex gap-4">
          <button className="text-blue-700 font-medium hover:underline">Login</button>
          <button className="bg-blue-100 text-blue-700 font-semibold px-4 py-1 rounded-lg hover:bg-blue-200">Try for free</button>
        </div>
      </div> */}
      {/* Main Content */}
      <div className='mt-8 flex w-full max-w-7xl flex-col gap-2 px-4 lg:flex-row'>
        {/* Left: Past Partnerships */}
        <div className='w-full lg:w-[260px] lg:flex-shrink-0'>
          <div className='mb-4 rounded-xl bg-white p-4 shadow'>
            <h3 className='mb-2 pl-2 font-semibold text-[#2A3241] text-gray-600'>
              Past Partnerships
            </h3>
            <div className='flex flex-col'>
              <Image
                src='/public-profile-past-partnerships.svg'
                alt='dashboard'
                width={1000}
                height={1000}
                className='opacity-50 blur-sm'
              />
            </div>

            <p className='mb-2 text-[14px] text-xs text-[#2A3241] text-gray-500'>
              Checkout complete partnership journey of the Partner.
            </p>
            <div className='relative'>
              <Input
                type='text'
                placeholder='Search your Company'
                className='w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'
              />
              <span className='absolute right-3 top-2.5 text-gray-400'>
                <svg width='16' height='16' fill='none' viewBox='0 0 24 24'>
                  <path
                    d='M21 21l-4.35-4.35'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <circle
                    cx='11'
                    cy='11'
                    r='7'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
        {/* Center: Company Card */}
        <div className='flex flex-1 flex-col gap-4'>
          {/* Company Card - Pixel Perfect */}
          <div className='mx-auto flex w-full max-w-[650px] flex-col gap-0 rounded-2xl bg-white p-4 shadow lg:p-6'>
            {/* Top Row */}
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start'>
              <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-[#F3F4F6]'>
                <Image
                  src={
                    publicOrg?.logoUrl ||
                    'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
                  }
                  width={48}
                  height={48}
                  alt='org-logo'
                  className='object-cover'
                />
              </div>
              <div className='flex-1'>
                <div className='mb-1 flex flex-wrap items-center gap-2'>
                  <span className='text-lg font-bold text-gray-900'>
                    {publicOrg?.name || 'the Partner'}
                  </span>
                  <span className='rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700'>
                    {publicOrg?.preferredPartnershipTypes?.length > 0
                      ? publicOrg?.preferredPartnershipTypes[0]?.area
                      : 'Tech'}
                  </span>
                  {/* <span className='rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700'>
                    B2B2C
                  </span> */}
                  {/* <span className='rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700'>
                    70% match
                  </span> */}
                </div>
                <div className='mb-2 text-[15px] leading-snug text-gray-700'>
                  {publicOrg?.briefDescription || ''}
                </div>
                <div className='mb-2 grid grid-cols-1 gap-2 text-xs text-gray-500 sm:grid-cols-3'>
                  <div>
                    <span className='block font-medium text-gray-500'>
                      Member since
                    </span>
                    <span className='mt-0.5 block font-semibold text-gray-900'>
                      {/* Sep 24, 2016 */}-
                    </span>
                  </div>
                  <div>
                    <span className='block font-medium text-gray-500'>
                      Website
                    </span>
                    <a href='#' className='mt-0.5 block font-semibold'>
                      -
                    </a>
                  </div>
                  <div>
                    <span className='block font-medium text-gray-500'>
                      Active Partnerships
                    </span>
                    <span className='mt-0.5 block font-semibold text-gray-900'>
                      -
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Divider */}
            <div className='my-4 border-t border-gray-200' />
            {/* Bottom Row */}
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2 text-xs text-gray-700'>
                <Image
                  src='/icons/lock-element.svg'
                  alt='dashboard'
                  width={10}
                  height={10}
                />
                <span className='mr-1 font-medium text-[#2A3241]'>
                  Open for:
                </span>
                {publicOrg?.preferredSectors?.length > 0 ? (
                  <div className='flex flex-nowrap gap-1'>
                    {publicOrg.preferredSectors.map((type: any) => (
                      <span
                        key={type.id}
                        className='rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-[#2A3241]'
                      >
                        {type.area}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className='flex flex-nowrap gap-1'>
                    <span className='rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-[#2A3241]'>
                      Referral Program
                    </span>
                    <span className='rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-[#2A3241]'>
                      Strategic
                    </span>
                    <span className='rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-[#2A3241]'>
                      Technology
                    </span>
                    <span className='rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-[#2A3241]'>
                      Content
                    </span>
                  </div>
                )}
                <Link href='#' className='ml-2 text-blue-500 hover:underline'>
                  Less Info
                </Link>
              </div>
              <div className='mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4'>
                <div className='flex flex-col'>
                  <span className='text-xs text-gray-500'>Founded On</span>
                  <span className='mt-0.5 text-sm font-bold text-gray-900'>
                    {publicOrg?.foundedOn || '-'}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-xs text-gray-500'>Accessible APIs</span>
                  <span className='mt-0.5 cursor-pointer text-sm font-bold text-blue-600 hover:underline'>
                    {publicOrg?.accessibleApis || '-'}
                    {/* <span className='font-normal'>View</span> */}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-xs text-gray-500'>
                    Meeting success rate
                  </span>
                  <span className='mt-0.5 text-sm font-bold text-gray-900'>
                    {publicOrg?.meetingSuccessRate || '-'}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-xs text-gray-500'>
                    Acknowledgement time
                  </span>
                  <span className='mt-0.5 text-sm font-bold text-gray-900'>
                    {publicOrg?.acknowledgmentTime + ' hr' || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Locked/Blurred Section (part of main flow) */}
          <div className='relative'>
            {/* Blurred dashboard content (placeholder) */}
            <Image
              src='/public-profile-blur.svg'
              alt='dashboard'
              width={1000}
              height={1000}
            />
          </div>
        </div>
        {/* Right: Sidebar */}
        <div className='flex w-full flex-col gap-4 lg:w-[300px] lg:flex-shrink-0'>
          <div className='mb-2 rounded-xl bg-white p-4 shadow'>
            <p className='mb-2 font-semibold text-[#2A3241] text-gray-600'>
              Not sure which companies to partner with?
            </p>
            <div>
              <Image
                src='/public-profile-partner-with.svg'
                alt='dashboard'
                width={1000}
                height={1000}
                className='opacity-50 blur-sm'
              />
            </div>
            <p className='text-400 mb-1 text-[14px] font-semibold text-[#2A3241]'>
              Your IPP is just a few Clicks Away!
            </p>
            <p className='mt-1 cursor-pointer text-xs text-blue-600 hover:underline'>
              Get AI recommendations
            </p>
          </div>
          {/* MUI Card for Partner Marketing */}
          <Box
            sx={{
              background: '#2563eb',
              borderRadius: 3,
              p: 3,
              color: 'white',
              boxShadow: 2,
              width: '100%',
              mt: 1,
              backgroundImage:
                "url('/public-profile-partner-marketing-background.svg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Typography fontWeight='bold' fontSize='1.1rem' mb={1}>
              Do More With Less — Use Partner Marketing
            </Typography>
            <Typography fontSize='0.95rem' mb={3}>
              Partner-led marketing helps you grow without spending more — no
              cuts, just smarter moves.
            </Typography>
            <Link href='/book-demo'>
              <Button
                variant='contained'
                sx={{
                  background: 'white',
                  color: 'black',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': { background: '#f3f4f6' }
                }}
              >
                Book Demo
              </Button>
            </Link>
          </Box>
        </div>
      </div>
      {showCompability && (
        <div
          className='z-1 fixed inset-0 flex h-screen w-[100vw] items-end justify-center'
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 65%, #FFFFFF 73.5%, #FFFFFF 100%)'
          }}
        >
          <CheckPublicCompability />
        </div>
      )}
    </div>
  )
}

export default PublicProfile
