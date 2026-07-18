import React from 'react'
import Link from 'next/link'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { FullLogo } from '@/components/icons/logo'

type Props = {}

const StartupInfoHeader = (props: Props) => {
  return (
    <header className='z-100000 flex w-full items-center justify-between border-b bg-white px-8 py-4 sm:px-0 lg:px-6'>
      <MaxWidthWrapper className='flex max-w-5xl items-center justify-between gap-4 xl:max-w-5xl'>
        <Link href='/' className='flex items-center text-xl font-semibold'>
          <FullLogo className='h-6 w-full sm:h-8' />
        </Link>

        {/* <div className='flex items-center gap-2 lg:gap-12'>
          <Link href='/partner-programs' className='text-sm font-normal'>
            Partner Programs
          </Link>
          <Link href='/integrations' className='text-sm font-normal'>
            Integrations
          </Link>
          <Link href='/resources' className='text-sm font-normal'>
            Resources
          </Link>
        </div> */}

        <div className='flex gap-4'>
          <Link href='/login' className='text-sm font-normal'>
            <button className='font-medium text-blue-700 hover:underline'>
              Login
            </button>
          </Link>
          <Link href='/book-demo' className='text-sm font-normal'>
            <button className='rounded-lg bg-blue-100 px-4 py-1 font-semibold text-blue-700 hover:bg-blue-200'>
              Try for free
            </button>
          </Link>
        </div>
      </MaxWidthWrapper>
    </header>
  )
}

export default StartupInfoHeader
