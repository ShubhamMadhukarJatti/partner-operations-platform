import React from 'react'
import Image from 'next/image'

export const card_data = [
  {
    title: 'Apply',
    desc: 'Fill out a short application. Tell us who you are and who you work with. Approval within 2 business days.',
    imageUrl: '/assets/new-partner-program/partner-apply.png'
  },
  {
    title: 'Submit a Lead',
    desc: 'Found a company that needs Sharkdom? Submit via your dashboard company, contact and short pain point description.',
    imageUrl: '/assets/new-partner-program/partner-lead.png'
  },
  {
    title: 'We Close the Deal',
    desc: 'Our partnerships team qualifies the lead and assigns an AE. You track progress in real time. We do the selling.',
    imageUrl: '/assets/new-partner-program/partner-deal.png'
  },
  {
    title: 'You Get Paid',
    desc: "Deal converts to paid client. Commission confirmed in your dashboard. Payout processed per your tier's SLA.",
    imageUrl: '/assets/new-partner-program/partner-dollar.png'
  }
]

interface WhatHappensProps {
  title: string
  cards: {
    title: string
    desc: string
    imageUrl: string
  }[]
  gridCols?: number
}

const WhatHappens = ({ title, cards, gridCols = 3 }: WhatHappensProps) => {
  return (
    <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
      <div className='mb-14 text-center'>
        <h2 className='text-3xl font-bold text-gray-800 md:text-4xl'>
          {title}
        </h2>
      </div>
      <div className={`grid grid-cols-1 gap-6 sm:grid-cols-${gridCols}`}>
        {cards.map((card, index) => (
          <div
            key={index}
            className='flex flex-col rounded-[16px] border border-[var(--text-20)] bg-white p-4 shadow-[0px_1px_2px_0px_#0000000F] transition-all duration-300 hover:z-10 hover:-translate-y-3 hover:scale-105 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]'
          >
            <Image
              src={card.imageUrl}
              alt={card.title}
              width={368}
              height={254}
              className='mb-6 w-full rounded-xl'
            />
            <div className='mt-auto px-2 pb-2'>
              <h4 className='text-black-dark mb-2 text-center text-xl font-medium'>
                {card.title}
              </h4>
              <p className='text-brand-strong text-center text-sm'>
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default WhatHappens
