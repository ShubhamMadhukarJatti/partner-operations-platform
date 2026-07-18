import { NextPage } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { FullLogo } from '@/components/icons/logo'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin']
})

const dmSans = DM_Sans({
  weight: '400',
  subsets: ['latin']
})

export const NotFound: NextPage = () => {
  return (
    <div className='relative mx-auto flex h-screen max-w-[1440px] flex-col justify-between overflow-hidden'>
      <div className='flex h-[60px] items-center justify-start border border-b border-[#0076C2] pl-[40px]'>
        <FullLogo className='w-[138px]' />
      </div>
      <div className='flex items-start justify-center'>
        <div>
          <h1
            className={`${bebasNeue.className} text-center text-[106.765px] font-normal leading-normal text-[#7688A8]`}
          >
            404
          </h1>
          <h2
            className={`${dmSans.className} text-center text-[48.41px] font-normal leading-normal text-[#305177]`}
          >
            Page not found
          </h2>
          <p
            className={`${dmSans.className} text-center text-[24.702px] font-normal leading-normal text-[#305177]`}
          >
            Oops, we can’t find the page you are looking for.
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
        alt='Not Found'
        width={2000}
        height={2000}
        className='h-full max-h-[541px] w-full object-cover pt-[60px]'
        priority
      />
    </div>
  )
}

export default NotFound
