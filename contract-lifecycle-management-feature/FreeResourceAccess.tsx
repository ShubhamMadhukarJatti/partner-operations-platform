import React from 'react'
import Image from 'next/image'

import DownloadPlaybookButton from '@/components/marketing/DownloadPlaybookButton'

const card_data = [
  {
    title: 'Invisibility Costs You Revenue',
    desc: "Having your Partner program invisible is always an option but not a must with Sharkdom's Fetch Marketplace",
    imageUrl: '/assets/partner-mapping/img_1.png'
  },
  {
    title: 'Visible Partnerships Matters',
    desc: '78% of Buyers prefer vendors with visible partnerships',
    imageUrl: '/assets/partner-mapping/img_2.png'
  },
  {
    title: 'Build trust with Visibility',
    desc: 'Let your partner visibility be the most efficient way to build trust',
    imageUrl: '/assets/partner-mapping/img_3.png'
  }
]

const FreeResourceAccess = () => {
  return (
    <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
      {/* Section Header */}
      <div className='mb-12 text-center'>
        <h2
          className='mb-4 font-semibold text-black'
          style={{ fontSize: '48px' }}
        >
          Get <span className='underline'>FREE</span> ResourceAccess
        </h2>
        <p className='text-lg text-[#5F6D7E]'>
          Make Sharkdom your only Go-To-market platform for all your partner
          needs.
        </p>
      </div>

      {/* Hero Block */}
      <div className='mb-12 flex gap-6'>
        {/* Left - Text Content */}
        <div className='flex flex-[3] flex-col justify-center rounded-[24px] border border-[#E4E7EE] bg-white p-8 shadow-[0px_1px_2px_0px_#0000000F] lg:p-12'>
          <h3
            className='mb-8 font-bold leading-[1.1] text-[#1B1D21]'
            style={{ fontSize: 'clamp(36px, 4vw, 60px)' }}
          >
            Your Best Partners might be Silently contributing to you{' '}
            <span className='text-[#3C3CD4]'>Partner-led Growth</span>
          </h3>
          <DownloadPlaybookButton
            pdfUrl='https://storage.googleapis.com/sharkdom_resources/hero_section/choose%20capable%20partner%20over%20loud%20partners.pdf'
            fileName='choose-capable-partner-over-loud-partners.pdf'
            demoType='/contract-lifecycle-management-feature'
          />
        </div>

        {/* Right - Image */}
        <div className='hidden flex-[2] flex-col overflow-hidden rounded-[24px] border border-[#E4E7EE] bg-white shadow-[0px_1px_2px_0px_#0000000F] md:flex'>
          <div className='relative h-[300px] w-full'>
            <Image
              src='/assets/partner-mapping/free_resource_img.png'
              alt='Why your best partner is NOT your loudest one'
              fill
              className='object-cover'
            />
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
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
              className='mb-6 w-full rounded-xl'
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

export default FreeResourceAccess
