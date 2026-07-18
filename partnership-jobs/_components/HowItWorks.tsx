'use client'

import React from 'react'

const complianceItems = [
  {
    title: 'Employer posts role',
    sections: [
      {
        heading: '3-min form',
        bullets: [
          'Input job details to help us shortlist candidate from our pool including \n→ Years of Experience \n→ Past Industry Vertical experience'
        ]
      }
    ]
  },
  {
    title: 'Candidates apply via Sharkdom',
    sections: [
      {
        heading: 'We screen & surface top matches',
        bullets: [
          'Within 48 hours you would receive list of candidates via email with details after someone from our team confirm the candidate interests.'
        ]
      }
    ]
  },
  {
    title: 'Employer connects, interviews, hires',
    sections: [
      {
        heading: 'No Commissions Charge',
        bullets: [
          'Sharkdom does not charge anything, neither to the employer who posted job or the candidate.'
        ]
      }
    ]
  }
]

export const HowItWorks = () => {
  return (
    <section className='mx-auto max-w-6xl px-4 py-12 sm:py-16'>
      <h2 className='mb-2 text-center text-[40px] font-bold leading-[46px] text-gray-900'>
        <span className='block'>How it works?</span>
      </h2>
      <p className='mb-10 text-center text-3xl'>3 step microflow</p>

      <div className='mx-auto grid max-w-full grid-cols-1 gap-12 md:grid-cols-3 md:gap-8'>
        {complianceItems.map((item, idx) => (
          <div
            key={idx}
            className='cursor-pointer rounded-xl p-[1px] transition-transform duration-300 hover:scale-95 hover:shadow-lg'
            style={{
              background: 'linear-gradient(180deg, #85E6C4 0%, #6D44E5 100%)'
            }}
          >
            <div className='h-full rounded-xl bg-white p-6'>
              <h3 className='mb-6 text-xl font-bold text-[#2B7AF3]'>
                {item.title}
              </h3>

              <div className='space-y-6'>
                {item.sections.map((sec, sidx) => (
                  <div key={sidx}>
                    <div className='mb-2 flex items-center gap-4'>
                      <span className='text-2xl'>✓</span>
                      <span className='font-bold text-gray-900'>
                        {sec.heading}
                      </span>
                    </div>

                    <ul className='ml-12 list-disc space-y-2 text-gray-700'>
                      {sec.bullets.map((b, bi) => (
                        <li key={bi} className='whitespace-pre-line'>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
