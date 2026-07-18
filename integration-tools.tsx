import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function IntegrationTools() {
  return (
    <section className='bg-gradient-to-b from-[#0F172A] via-[#121A2F] to-[#000000] px-2 py-4 lg:px-16 lg:py-0'>
      <div className='relative m-auto h-[500px] max-w-screen-xl lg:h-[680px]'>
        <Image
          src={'/assets/box-illustration.png'}
          alt='box-allustration'
          fill
        />
        <div className='relative flex h-full items-center justify-center'>
          <Image
            src={'/assets/our-integration-tools.png'}
            alt='our-integration-tools'
            width={600}
            height={700}
            className='absolute top-1/2 aspect-[39/43] -translate-y-1/2 transform'
          />
          <div className='relative flex w-4/5 flex-col items-center lg:w-1/3'>
            <h5 className='mb-2 text-center text-xl font-bold lg:text-3xl'>
              We Integrate with the Tools you Trust
            </h5>
            <p className='text-center text-sm lg:text-base'>
              Look at the best Partner Onboarding Platform that helps you grow
              your Channel Partners
            </p>
            <Link
              href={'/integration'}
              className='mt-4 rounded-lg bg-[#040514] px-3 py-2 text-xs text-white lg:mt-12 lg:px-5 lg:py-3 lg:text-sm'
            >
              Explore All Integrations
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IntegrationTools
