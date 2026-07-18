import React from 'react'
import Link from 'next/link'

const learnMoreData = [
  {
    tag: 'Insights',
    heading: 'Understanding Customer Behavior',
    desc: 'Nostrum velit reiciendis et. Placeat neque accusantium laboriosam commodi in. Blanditiis voluptas impedit nisi dicta. Vitae sequi inventore explicabo quae dolorem.',
    link: '/insights/customer-behavior'
  },
  {
    tag: 'Strategy',
    heading: 'Persona-Based Marketing',
    desc: 'Nostrum velit reiciendis et. Placeat neque accusantium laboriosam commodi in. Blanditiis voluptas impedit nisi dicta. Vitae sequi inventore explicabo quae dolorem.',
    link: '/strategy/persona-marketing'
  },
  {
    tag: 'Tools',
    heading: 'Customer Segmentation Techniques',
    desc: 'Nostrum velit reiciendis et. Placeat neque accusantium laboriosam commodi in. Blanditiis voluptas impedit nisi dicta. Vitae sequi inventore explicabo quae dolorem.',
    link: '/tools/customer-segmentation'
  }
]

const LearnMore = () => {
  return (
    <section className=''>
      <h2 className='text-xl font-bold leading-[24px] text-text-100'>
        Learn more about our customer persona
      </h2>

      <div>
        <div className='mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {learnMoreData.map((item, index) => (
            <div
              key={index}
              className='flex flex-col  rounded-2xl border border-text-20 bg-background-ghost-white px-4 py-6'
            >
              <span className='w-fit rounded-full border border-primary-light-blue bg-[#0062F11A] px-1 py-0.5 text-xs font-bold leading-[14px] text-primary-light-blue'>
                {item.tag}
              </span>
              <h3 className='leding[22px] mt-6  text-lg font-bold text-text-100'>
                {item.heading}
              </h3>
              <p className='mt-2 text-sm leading-[14.52px] text-text-80'>
                {item.desc}
              </p>
              <Link
                href={item.link}
                className='mt-6 inline-flex items-center text-xs font-medium leading-[14.52px] text-primary-light-blue hover:underline'
              >
                View on our Resources
                <svg
                  width='15'
                  height='15'
                  viewBox='0 0 15 15'
                  className='ml-2'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M11.7402 2.54036L3.57357 10.707'
                    stroke='#0062F1'
                    strokeWidth='0.875'
                    strokeMiterlimit='10'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M11.7402 8.5332L11.7402 2.54237L5.7494 2.54237'
                    stroke='#0062F1'
                    strokeWidth='0.875'
                    strokeMiterlimit='10'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M2.70703 13.334H12.6237'
                    stroke='#0062F1'
                    strokeWidth='0.875'
                    strokeMiterlimit='10'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LearnMore
