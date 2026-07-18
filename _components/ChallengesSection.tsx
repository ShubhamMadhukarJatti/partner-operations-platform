import React from 'react'
import Image from 'next/image'

const ChallengesSection: React.FC = () => {
  return (
    <section className='bg-gray-100 py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h2 className='mb-12 text-center text-3xl font-bold text-gray-900 sm:text-4xl'>
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
          <div className='grid gap-8'>
            <div className='rounded-xl bg-white p-8 shadow-sm'>
              <h3 className='mb-4 text-2xl font-semibold text-gray-900'>
                No Partnership Team
              </h3>
              <p className='text-gray-600'>
                Quality ultimately narrows down how much your business can be
                benefitted in terms of up to what extent can you offer to expect
                something in return for which partnership roles such as CPO,
                partner manager are best suited for.
              </p>
            </div>

            <div className='rounded-xl bg-white p-8 shadow-sm'>
              <h3 className='mb-4 text-2xl font-semibold text-gray-900'>
                Fed up with No-Reply Partners
              </h3>
              <p className='text-gray-600'>
                Partnerships are not about getting commission in return for
                creating awareness or selling subscriptions but rather
                amplifying your customer experience and current solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChallengesSection
