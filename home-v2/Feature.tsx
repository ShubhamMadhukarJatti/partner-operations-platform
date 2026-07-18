import React from 'react'
import Image from 'next/image'

const features = [
  {
    image: '/assets/ai-partner-assistant.png', // Replace with your actual image path
    title: 'Find the Right Partners with AI',
    description:
      'Stop guessing. Dweep AI uses data to match you with partners who align with your product-market fit—no more random outreach, just smart, strategic collaboration.'
  },
  {
    image: '/assets/partner-collab-chat.png', // Replace with your actual image path
    title: 'Collaborate with Partners Like Teammates',
    description:
      'Make collaboration feel seamless. Bring the right people together across both companies—so conversations stay relevant, and execution stays fast.'
  }
]

const Feature = () => {
  return (
    <div className='mx-auto mt-16 max-w-5xl px-2 md:px-6'>
      <div className='mx-auto mb-8 flex flex-col items-center justify-center gap-2 pt-8'>
        <h2 className='text-center text-[40px] font-semibold leading-[52px] tracking-[0px] md:text-[40px] xl:text-[40px]'>
          <span className='text-gradient'>Way More</span> than just a PRM
        </h2>
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Feature 1 */}
        <div className='flex h-full flex-col rounded-2xl bg-white p-4'>
          <div
            className='mb-3 flex flex-1 items-center justify-center p-8'
            style={{
              background:
                'linear-gradient(70.64deg, rgba(228, 248, 255, 0.6) 5.06%, rgba(255, 255, 255, 0.5) 57.85%, rgba(225, 225, 248, 0.6) 112.82%)',
              borderRadius: '16px'
            }}
          >
            <Image
              src='/assets/ai-partner-assistant.svg'
              alt='AI Partnership Assistant'
              width={280}
              height={160}
              className='h-auto w-full object-contain'
            />
          </div>
          <div>
            <h3 className='mb-1.5 text-base font-bold text-[#1E1E1E] md:text-lg'>
              Find the Right Partners with AI
            </h3>
            <p className='text-base/[24px] text-[#9CA3AF]'>
              Stop guessing. Dweep AI uses data to match you with partners who
              align with your product-market fit—no more random outreach, just
              smart, strategic collaboration.
            </p>
          </div>
        </div>
        {/* Feature 2 */}
        <div className='flex h-full flex-col rounded-2xl bg-white p-4'>
          <div
            className='mb-3 flex flex-1 items-center justify-center p-8'
            style={{
              background:
                'linear-gradient(70.64deg, rgba(228, 248, 255, 0.6) 5.06%, rgba(255, 255, 255, 0.5) 57.85%, rgba(225, 225, 248, 0.6) 112.82%)',
              borderRadius: '16px'
            }}
          >
            <Image
              src='/assets/partner-collab-chat.svg'
              alt='Partner Collaboration Chat'
              width={280}
              height={160}
              className='h-auto w-full object-contain'
            />
          </div>
          <div>
            <h3 className='mb-1.5 text-base font-bold text-[#1E1E1E] md:text-lg'>
              Collaborate with Partners Like Teammates
            </h3>
            <p className='text-base/[24px] text-[#9CA3AF]'>
              Make collaboration feel seamless. Bring the right people together
              across both companies—so conversations stay relevant, and
              execution stays fast.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feature
