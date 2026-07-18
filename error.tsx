'use client'

import { Bebas_Neue, DM_Sans } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FullLogo } from '@/components/icons/logo'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin']
})

const dmSans = DM_Sans({
  weight: '400',
  subsets: ['latin']
})

export default function Error({
  error
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const supportUrl = `mailto:support@sharkdom.com?subject=${encodeURIComponent('Error Report')}&body=${encodeURIComponent(
    `${error.message}${error.digest ? ` (${error.digest})` : ''}`
  )}`

  return (
    <div className='relative mx-auto flex h-screen max-w-[1440px] flex-col justify-between overflow-hidden'>
      <div className='flex h-[60px] items-center justify-start border border-b border-[#0076C2] pl-[40px]'>
        <FullLogo className='w-[138px]' />
      </div>

      <div className='flex items-start justify-center px-4'>
        <div>
          <h2
            className={`${dmSans.className} pt-[80px] text-center text-[70.41px] font-normal leading-normal text-[#305177]`}
          >
            Something went wrong.
          </h2>
          <p
            className={`${dmSans.className} text-center text-[24.702px] font-normal leading-normal text-[#305177]`}
          >
            We encountered an expected problem, please try again after few
            minutes.
          </p>

          <div className='mt-[47px] flex flex-col justify-center gap-4 sm:flex-row'>
            <Button asChild className='min-w-[236px] rounded-[8px]'>
              <Link href='/dashboard'>
                Go to dashboard <ArrowRightIcon className='h-4 w-4' />
              </Link>
            </Button>
            <Button
              asChild
              variant='outline'
              className='min-w-[236px] rounded-[8px]'
            >
              <Link href='mailto:support@sharkdom.com'>
                Need help? Contact us
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Image
        src='/errorbg.png'
        alt='Error background'
        width={2000}
        height={2000}
        className='h-full w-full object-cover pt-[60px]'
        priority
      />
    </div>
  )
}
