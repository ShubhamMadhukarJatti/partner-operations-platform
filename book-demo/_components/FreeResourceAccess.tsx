import React from 'react'
import Image from 'next/image'

import FigmaDownloadButton from '@/components/marketing/FigmaDownloadButton'

const card_data = [
  {
    title: 'CRM is for Sales team only',
    desc: 'Your secure partner workspace with unlimited partner profiles.',
    imageUrl: '/assets/book-demo/img_1.png'
  },
  {
    title: 'No partner deal Ownership in CRM',
    desc: 'Partnership team needs to know which partner influenced deal and who brought',
    imageUrl: '/assets/book-demo/img_4.png'
  },
  {
    title: 'No Conflict handling Mechanism in CRM',
    desc: 'Be Consice and Clear with your expectation and offerings before enabling partnership',
    imageUrl: '/assets/book-demo/img_3.png'
  }
]

const FreeResourceAccess = () => {
  return (
    <section
      id='comparison-section'
      className='mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8'
    >
      {/* Section Header */}
      <div className='mb-16 flex flex-col items-center text-center'>
        <div className='mb-8 flex items-center gap-3 rounded-full border border-gray-200 px-4 py-1.5 shadow-sm'>
          <div className='h-2 w-2 rounded-full bg-[#6366F1]' />
          <span className='text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500'>
            PRICING, LIKE-FOR-LIKE
          </span>
        </div>

        <h2 className='mb-4 text-4xl font-bold text-[#1A1A2E] md:text-6xl'>
          CRM vs <span className='text-[#6366F1]'>Modern day PRM</span>
        </h2>

        <p className='max-w-2xl text-lg font-medium text-gray-400'>
          Make Sharkdom your only Go-To-market platform for all your partner ops
        </p>
      </div>

      {/* Hero Block */}
      <div className='mb-12 flex flex-col gap-6 md:flex-row'>
        {/* Left - Text Content */}
        <div className='relative flex flex-[5] flex-row items-center justify-between overflow-hidden rounded-[24px] border border-[var(--text-20)] bg-[#F3F3FF] p-8 shadow-[0px_1px_2px_0px_#0000000F] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0px_20px_40px_rgba(0,0,0,0.08)] lg:px-12 lg:py-10'>
          <div className='z-10 flex w-full flex-col justify-center lg:w-[65%]'>
            <h3
              className='text-black-dark mb-6 font-bold leading-[1.1]'
              style={{ fontSize: 'clamp(28px, 5vw, 56px)' }}
            >
              Why Partnership/GTM team should avoid CRM’s over{' '}
              <span className='font-bold text-[#6366F1]'>PRM at all cost?</span>
            </h3>

            <FigmaDownloadButton
              pdfUrl='https://storage.googleapis.com/sharkdom_resources/thumbnails/whypartnershipteamsshouldavoidsalestools.pdf'
              fileName='why-partner-marketplace.pdf'
              demoType='/book-demo'
            />
          </div>

          <div className='absolute bottom-0 right-0 h-[90%] w-full lg:static lg:h-full lg:w-[35%]'>
            <div className='relative h-full w-full'>
              {/* Floating demo images */}
              <div className='absolute left-[60px] top-[50%] hidden -translate-y-1/2 lg:block'>
                <Image
                  src='/assets/book-demo/demo1img.svg'
                  alt='AI matches'
                  width={0}
                  height={0}
                  className='h-auto w-[480px] drop-shadow-2xl'
                />
              </div>

              <div className='absolute bottom-20 right-40 hidden w-[250px] lg:block'>
                <Image
                  src='/assets/book-demo/demo3img.svg'
                  alt='PRM stats'
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='h-auto w-full'
                />
              </div>

              <div className='absolute right-[60px] top-[80px] hidden w-[180px] lg:block'>
                <Image
                  src='/assets/book-demo/demo2img.svg'
                  alt='Icon'
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='h-auto w-full'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right - Image */}
        <div className='relative hidden flex-[2] overflow-hidden rounded-[24px] border border-[var(--text-20)] bg-white shadow-[0px_1px_2px_0px_#0000000F] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0px_20px_40px_rgba(0,0,0,0.08)] md:block'>
          <Image
            src='/assets/book-demo/free_resource_img.svg'
            alt='Why Most Partner Programs Go Unnoticed'
            fill
            className='object-contain object-bottom'
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {card_data.map((card, index) => (
          <div
            key={index}
            className='group flex flex-col rounded-[16px] border border-[var(--text-20)] bg-white p-4 shadow-[0px_1px_2px_0px_#0000000F] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0px_20px_40px_rgba(0,0,0,0.08)]'
          >
            <Image
              src={card.imageUrl}
              alt={card.title}
              width={368}
              height={254}
              className='mb-6 w-full rounded-xl'
            />
            <div className='px-2 pb-2'>
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
