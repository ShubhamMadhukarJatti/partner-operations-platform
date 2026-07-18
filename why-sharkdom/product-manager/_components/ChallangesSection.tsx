import React from 'react'
import Image from 'next/image'

const ChallengesSection: React.FC = () => {
  return (
    <section className='bg-gray-100 pt-16'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className=' text-center text-3xl font-bold text-gray-900 sm:text-4xl'>
          Challenges in terms of good sustainable Partnerships
        </h2>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Left Side Image with Background Graphics */}
          <div className='relative aspect-[909/825]'>
            <Image
              src='/assets/challenges-banner.png'
              alt='Partnership Team'
              fill
              className='aspect-[909/825] w-full object-cover'
            />
          </div>

          {/* Right Side Textual Content */}
          <div className='z-0 grid h-fit  gap-[80px] pt-12'>
            <div className='relative max-w-[528px] rounded-[20px] border-2 border-[#111950] bg-[#FFB804] p-6 shadow-sm'>
              <h3 className='mb-2 text-2xl font-bold text-gray-900'>
                No Partnership Team
              </h3>
              <p className='mb-5 text-[14px]/[21px] font-normal text-[#231E16]'>
                Quality ultimately narrows down how much your business can be
                benefitted in terms of up to what extent can you offer to expect
                something in return for which partnership roles such as CPO,
                partner manager are best suited for.
              </p>

              <div className='absolute inset-0 -z-10 -translate-x-[6px] translate-y-4 rounded-[20px] bg-[#111950]' />
            </div>

            <div className='relative max-w-[528px] rounded-[20px] border-2 border-[#111950] bg-[#FFB804] p-6 shadow-sm'>
              <h3 className='mb-2 text-2xl font-bold text-gray-900'>
                Fed up with No-Reply-Partners
              </h3>
              <p className='mb-5 text-[14px]/[21px] font-normal text-[#231E16]'>
                Partnerships is not about getting commission in return for
                creating awareness or selling subscription but rather amplifying
                your customer experience and current solutions.
              </p>

              <div className='absolute inset-0 -z-10 -translate-x-[6px] translate-y-4 rounded-[20px] bg-[#111950]' />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChallengesSection
