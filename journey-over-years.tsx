import React from 'react'
import { People } from 'iconsax-react'

import { Button } from '@/components/ui/button'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

type Props = {}

const JourneyOverYears = (props: Props) => {
  return (
    <section className='min-h-screen bg-white py-16'>
      <MaxWidthWrapper className='flex flex-col px-6 xl:px-0'>
        <h2 className='text-3xl font-bold text-text-100 lg:text-5xl'>
          <span className='text-semantic-danger'>Our Journey</span> over the
          Years!
        </h2>

        <div className='relative mt-20 flex flex-col items-center justify-center gap-14 lg:flex-row'>
          <div className='relative flex flex-col gap-14 lg:flex-row'>
            <div className='flex w-full max-w-lg flex-col justify-between rounded-3xl bg-[#F0F0F0] p-8 md:w-[600px]'>
              <People size={32} />

              <h4 className='mt-6 text-shark-3xl font-bold text-black'>
                Inception
              </h4>

              <p className='mt-5 text-shark-base text-text-80'>
                2 people originally from gaming sector understanding the need of
                partnering after experiencing significant growth via indie
                gaming studios tie ups saw opportunity in making the whole
                process automated resulting in what today is know as ‘sharkdom’
              </p>

              <div className='mt-10 flex justify-start'>
                <Button className='h-[37px] bg-black'>START OF 2023</Button>
              </div>
            </div>

            {/* card-2  */}
            <div className='flex w-full max-w-lg flex-col justify-between rounded-3xl bg-[#F0F0F0] p-8 md:w-[600px]'>
              <People size={32} />

              <h4 className='mt-6 text-shark-3xl font-bold text-black'>
                Beta Version
              </h4>

              <p className='mt-5 text-shark-base text-text-80'>
                After 4 months of finding right team of smart & curious people,
                we roll out our first beta version around August 2023
              </p>

              <div className='mt-10 flex justify-end'>
                <Button className='h-[37px] bg-black'>Q2-Q3, 2024</Button>
              </div>
            </div>

            {/* card-3 relative */}

            <div className='left-[50%] top-[80%] flex w-full max-w-lg flex-col justify-between rounded-3xl bg-[#001430] p-8 md:w-[600px] lg:absolute lg:-translate-x-1/2'>
              <People size={32} color='white' />

              <h4 className='mt-6 text-shark-3xl font-bold text-white'>
                Recognition
              </h4>

              <p className='mt-5 text-shark-base text-white'>
                We crossed 500 Indian Tech Startups with over 700 co-founders
                around which 5% of them, Our team successfully took feedback on
                our earlier rollouts.
              </p>

              <div className='mt-auto flex '>
                <Button className='mt-10 h-[37px] border border-white bg-transparent font-bold text-white hover:bg-transparent '>
                  FALL OF 2023
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  )
}

export default JourneyOverYears
