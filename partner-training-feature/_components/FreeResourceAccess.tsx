import React from 'react'
import Image from 'next/image'

import DownloadPlaybookButton from '@/components/marketing/DownloadPlaybookButton'

const card_data = [
  {
    title: 'Invisibility Costs You Revenue',
    desc: "Having your Partner program invisible is always an option but not a must with Sharkdom's Fetch Marketplace",
    imageUrl: '/assets/partner-training/img_1.png'
  },
  {
    title: 'Enablement is broader than Content and Badges',
    desc: '78% of Buyers prefer vendors',
    imageUrl: '/assets/partner-training/img_4.png'
  },
  {
    title: 'Build trust with Visibility',
    desc: 'Let your partner visibility be the most efficient way to build trust',
    imageUrl: '/assets/partner-training/img_3.png'
  }
]

const FreeResourceAccess = () => {
  return (
    <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
      {/* Section Header */}
      <div className='mb-12 text-center'>
        <h2 className='mb-4 text-5xl font-medium text-black'>
          Get FREE Resource Access
        </h2>
        <p className='text-lg text-[var(--text-muted)]'>
          Make Sharkdom your only Go-To-market platform for all your partner ops
        </p>
      </div>

      {/* Hero Block */}
      <div className='mb-12 flex gap-6'>
        {/* Left - Text Content */}
        <div className='flex flex-[3] flex-col justify-center rounded-[24px] border border-[var(--text-20)] bg-white p-8 shadow-[0px_1px_2px_0px_#0000000F] lg:p-12'>
          <h3
            className='text-black-dark mb-8 font-medium leading-[1.1]'
            style={{ fontSize: 'clamp(36px, 4vw, 60px)' }}
          >
            Bet practices for successful Partner Training
          </h3>
          <DownloadPlaybookButton
            pdfUrl='https://storage.googleapis.com/sharkdom_resources/hero_section/howdesign_partner_training.pdf'
            fileName='why-partner-marketplace.pdf'
            demoType='/partner-training-feature'
          />
        </div>

        {/* Right - Image */}
        <div className='hidden flex-[2] overflow-hidden rounded-[24px] border border-[var(--text-20)] bg-gray-50 shadow-[0px_1px_2px_0px_#0000000F] md:block'>
          <Image
            src='/assets/partner-training/free_resource_img.png'
            alt='Why Most Partner Programs Go Unnoticed'
            width={600}
            height={400}
            className='h-full w-full object-cover'
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {card_data.map((card, index) => (
          <div
            key={index}
            className='flex flex-col rounded-[16px] border border-[var(--text-20)] bg-white p-4 shadow-[0px_1px_2px_0px_#0000000F]'
          >
            <Image
              src={card.imageUrl}
              alt={card.title}
              width={368}
              height={254}
              className='mb-6 w-full rounded-xl'
            />
            <div className='mt-auto px-2 pb-2'>
              <h4 className='text-black-dark mb-2 text-xl font-medium'>
                {card.title}
              </h4>
              <p className='text-brand-strong text-sm'>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FreeResourceAccess
