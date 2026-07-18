import React from 'react'
import Image from 'next/image'

const card_data = [
  {
    title: 'Purchase a base pack',
    desc: 'Your secure partner workspace with unlimited partner profiles.',
    imageUrl: '/pricing/bundle_buy.png'
  },
  {
    title: 'Choose Your Add-Ons',
    desc: 'Select only the modules you need today. No bundles. No penalty for scaling later.',
    imageUrl: '/pricing/bundle_addon.png'
  },
  {
    title: 'Get Transparent Monthly Total',
    desc: 'Your pricing auto-updates instantly. Downloadable as PDF for your CFO.',
    imageUrl: '/pricing/bundle_total.png'
  }
]

const CustomizeBundle = () => {
  return (
    <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
      <div className='mb-12 text-center'>
        <h2 className='mb-4 text-[48px] font-[500] leading-tight text-black'>
          Customize your{' '}
          <span className='relative inline-block'>
            Bundle
            <Image
              src='/pricing/bundle_underline.svg'
              alt='underline'
              width={150}
              height={9}
              className='block md:block'
            />
          </span>
        </h2>
        <p className='text-[20px] text-[#1B1D2199]'>
          Turn partner enablement into a predictable revenue engine with
          Sharkdom.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 xs:grid-cols-2 lg:grid-cols-3'>
        {/* Top Row - Left Card (Spans 2 columns) */}
        <div className='flex flex-col justify-start rounded-[16px] border border-[#E4E7EE] bg-white px-8 pb-14 pt-10 shadow-[0px_1px_2px_0px_#0000000F] lg:col-span-2'>
          <h3 className='mb-4 text-4xl font-medium text-[#1B1D21]'>
            A Simple <span className='text-[#6863FB]'>3-Step Process</span>
          </h3>
          <p className='max-w-lg text-lg text-[#1B1D21]'>
            Sample text the heart of the bustling city, a hidden café serves the
            finest brews. Every sip transports you to a world of rich flavors
            and cozy vibes.
          </p>
        </div>

        {/* Top Row - Right Card (Image placeholder) */}
        <div className='overflow-hidden rounded-[16px] border border-[#E4E7EE] bg-gray-50 shadow-[0px_1px_2px_0px_#0000000F] lg:col-span-1 lg:max-h-[400px]'>
          {/* Placeholder for image */}
          <Image
            src='/pricing/bundle_people.png'
            alt='Bundle People'
            width={364}
            height={414}
            className='w-full rounded-xl'
          />
        </div>

        {/* Bottom Row - 3 Cards */}
        {card_data.map((card, index) => (
          <div
            key={index}
            className='flex flex-col rounded-[16px] border border-[#E4E7EE] bg-white p-4 shadow-[0px_1px_2px_0px_#0000000F]'
          >
            <Image
              src={card.imageUrl}
              alt={card.title}
              width={368}
              height={254}
              className={'mb-6 w-full rounded-xl'}
            />
            <div className='mt-auto px-2 pb-2'>
              <h4 className='mb-2 text-xl font-medium text-[#1B1D21]'>
                {card.title}
              </h4>
              <p className='text-sm text-[#5F6D7E]'>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CustomizeBundle
