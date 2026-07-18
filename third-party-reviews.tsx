import React from 'react'
import Image from 'next/image'
import { QuoteDown } from 'iconsax-react'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

type Props = {}

const ThirdPartyReviews = (props: Props) => {
  return (
    <section className=' bg-white py-16'>
      <MaxWidthWrapper className=' flex   flex-col  px-6 xl:px-0 '>
        <h2 className='text-center text-3xl font-bold text-text-100 lg:text-5xl'>
          See how <br className='block lg:hidden' />
          <span className='text-semantic-danger'>Sharkdom stacks up </span>
          <span className=' lg:inline'>to other</span>
          <br className='hidden lg:block' />
          <span className='text-semantic-danger'> PRMs</span>
          <span> in third-party reviews</span>
        </h2>

        <div className='flex items-center justify-center  pt-20'>
          <div className='flex flex-col items-start'>
            <div className='flex max-w-6xl items-start justify-between'>
              <h6 className='max-w-3xl text-shark-xl font-bold text-text-100'>
                Since we&apos;ve started using Sharkdom, we&apos;ve Tripled our
                our revenue via our Partner Network.
              </h6>

              <QuoteDown size={56} color='#1463FF' />
            </div>

            <div className='mt-6 flex items-center '>
              <Image
                src={'/profile-circle.svg'}
                alt='Profile Image'
                width={50}
                height={50}
                className=' rounded-full'
              />

              <div className='ml-4'>
                <div className='text-shark-base font-bold text-text-100'>
                  John Doe
                </div>
                <div className='text-shark-sm text-text-80'>Designation</div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  )
}

export default ThirdPartyReviews
