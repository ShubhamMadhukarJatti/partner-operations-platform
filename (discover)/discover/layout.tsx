import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'iconsax-react'

import { Button } from '@/components/ui/button'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { FullLogo } from '@/components/icons/logo'
import { Providers } from '@/components/providers'

export default function StartupInfoLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main className=''>
      <header className='bg-[#F7F9FC]'>
        <MaxWidthWrapper className='max-w-6xl'>
          <div className='flex flex-col items-center justify-between gap-10 px-4 pt-20 lg:flex-row lg:px-8'>
            <div className='max-w-lg space-y-6'>
              <h1 className='fds-heading text-primary-dark-blue lg:text-shark-hero'>
                Rejuvenate your Partnership Experience(PE)
              </h1>
              <p className='fds-text text-text-100 lg:text-shark-xl'>
                Convert more partnership pipeline by syncing Sharkdom insights
                with your team&apos;s tech stack.
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
              src={'/discover-img.png'}
              width={500}
              height={570}
              alt='discover-page'
            />
          </div>
          {/* <div className='flex items-center justify-between'>
            <Link href='/' className='flex items-center fds-text-lead-semibold'>
              <FullLogo className='h-6 w-full sm:h-8' />
            </Link>

            <div className='flex items-center gap-12'>
              <Link href='/partner-programs' className=''>
                <span className='text-sm font-normal '>Partner Programs</span>
              </Link>
              <Link href='/integrations' className=''>
                <span className='text-sm font-normal '>Integrations</span>
              </Link>
              <Link href='/resources' className=''>
                <span className='text-sm font-normal '>Resources</span>
              </Link>
            </div>
          </div> */}
        </MaxWidthWrapper>
      </header>
      {children}
    </main>
  )
}
