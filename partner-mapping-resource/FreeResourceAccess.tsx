import React from 'react'
import Image from 'next/image'

import DownloadPlaybookButton from '@/components/marketing/DownloadPlaybookButton'

const card_data = [
  {
    title: 'Purchase a base pack',
    // highlightText: 'Partnership Outcome',
    imageUrl: '/assets/partner-mapping/01.png',
    desc: 'Your secure partner workspace with unlimited partner profiles',
    hasButton: false
  },
  {
    title: 'Account Mapping',
    // highlightText: 'Partnership',
    imageUrl: '/assets/partner-mapping/img_2.png',
    desc: 'Find opportunities among your partners by simply connecting your Data Source',
    hasButton: false
  },
  {
    title: 'Deliverability Capabilities',
    highlightText: '',
    imageUrl: '/assets/partner-mapping/img_3.png',
    desc: 'Be Consice and Clear with your expectation and offerings before enabling  partnership',
    hasButton: false
  }
]

const FreeResourceAccess = () => {
  return (
    <>
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
        <div className='mb-12 flex flex-col gap-6 lg:flex-row'>
          {/* Left - Text Content */}
          <div className='group flex flex-[3] flex-col justify-center rounded-[24px] border border-[#E4E7EE] bg-white p-8 shadow-[0px_1px_2px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:rotate-[0.5deg] hover:border-[#3C3CD4]/30 hover:shadow-[0_30px_60px_-20px_rgba(60,60,212,0.15)] lg:p-12'>
            <h3
              className='mb-8 font-semibold leading-[1.1] text-[#1B1D21]'
              style={{ fontSize: 'clamp(36px, 4vw, 60px)' }}
            >
              KPI’s to measure{' '}
              <span className='text-[#3C3CD4] transition-colors duration-300 group-hover:text-[#2828a1]'>
                Partnership Outcome
              </span>{' '}
              ahead of partnering
            </h3>
            <div className='transition-transform duration-300 group-hover:translate-x-1'>
              <DownloadPlaybookButton
                pdfUrl="https://storage.googleapis.com/sharkdom_resources/hero_section/hidden%20KPI's.pdf"
                fileName='hidden-kpis.pdf'
                demoType='/partner-mapping-resource'
              />
            </div>
          </div>

          {/* Right - Image */}
          <div className='hidden flex-[2] overflow-hidden rounded-[24px] border border-[#E4E7EE] bg-gray-50 shadow-[0px_1px_2px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:-rotate-[0.5deg] hover:border-[#3C3CD4]/30 hover:shadow-[0_30px_60px_-20px_rgba(60,60,212,0.15)] md:block'>
            <Image
              src='/assets/partner-mapping/free_resource_new.svg'
              alt='Why Most Partner Programs Go Unnoticed'
              width={600}
              height={400}
              className='h-full w-full object-cover transition-transform duration-700 hover:scale-110'
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {card_data.map((card, index) => (
            <div
              key={index}
              className='group flex flex-col rounded-[16px] border border-[#E4E7EE] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-3 hover:rotate-1 hover:border-[#3C3CD4]/40 hover:shadow-[0_25px_50px_-12px_rgba(60,60,212,0.2)]'
            >
              <div className='overflow-hidden rounded-xl bg-gray-50'>
                <Image
                  src={card.imageUrl}
                  alt={card.title}
                  width={368}
                  height={254}
                  className='mb-6 w-full rounded-xl transition-transform duration-700 group-hover:rotate-[-1deg] group-hover:scale-110'
                />
              </div>
              <div className='px-2 pb-2'>
                <h4 className='mb-2 text-xl font-medium text-[#1B1D21] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#3C3CD4]'>
                  {card.highlightText ? (
                    <>
                      {card.title.split(card.highlightText)[0]}
                      <span className='text-[#3C3CD4]'>
                        {card.highlightText}
                      </span>
                      {card.title.split(card.highlightText)[1]}
                    </>
                  ) : (
                    card.title
                  )}
                </h4>
                <p className='text-sm text-[#5F6D7E] transition-colors duration-300 group-hover:text-[#1B1D21]'>
                  {card.desc}
                </p>
                {card.hasButton && (
                  <div className='mt-4'>
                    <DownloadPlaybookButton
                      pdfUrl="https://storage.googleapis.com/sharkdom_resources/hero_section/hidden%20KPI's.pdf"
                      fileName='hidden-kpis.pdf'
                      demoType='/partner-mapping-resource'
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Partner Mapping FAQ */}
        <div className='mx-auto mt-16 max-w-3xl space-y-6'>
          <h3 className='text-2xl font-semibold text-[#1B1D21]'>
            Partner Mapping FAQ
          </h3>
          <div className='space-y-4'>
            <div>
              <h4 className='text-lg font-medium text-[#1B1D21]'>
                What is partner ecosystem mapping and why does it matter for
                revenue?
              </h4>
              <p className='mt-1 text-sm text-[#5F6D7E]'>
                Partner ecosystem mapping is a strategic process for visualizing
                and analyzing your partner network, uncovering relationships,
                overlaps and opportunities that drive predictable partner
                revenue. It helps you prioritize high-impact collaborations and
                align resources accordingly.
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-[#1B1D21]'>
                How does partner mapping reduce blind spots in my partner
                program?
              </h4>
              <p className='mt-1 text-sm text-[#5F6D7E]'>
                By aggregating partner data and visualizing connections, partner
                mapping reveals hidden overlaps, underserved segments and growth
                gaps enabling more effective prioritization and decision-making
                for GTM teams.
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-[#1B1D21]'>
                Can partner mapping identify which partners will drive the most
                pipeline?
              </h4>
              <p className='mt-1 text-sm text-[#5F6D7E]'>
                Yes, partner mapping tools can highlight mutual account overlap,
                partner strengths and strategic fit so teams can focus on
                partners with the highest potential for co-selling and
                cross-selling opportunities.
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-[#1B1D21]'>
                How often should I update my partner ecosystem map?
              </h4>
              <p className='mt-1 text-sm text-[#5F6D7E]'>
                Partner ecosystems evolve as you add partners, enter new
                markets, or shift strategy. A best practice is to update the map
                regularly (quarterly or as key changes occur) to keep insights
                accurate and actionable.
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-[#1B1D21]'>
                How is partner mapping different from simple account sharing?
              </h4>
              <p className='mt-1 text-sm text-[#5F6D7E]'>
                Account sharing shows what partners know about customers.
                Partner mapping goes further by analyzing relationships,
                strategic alignment, customer overlaps and market influence
                helping teams make data-backed decisions rather than just
                sharing lists.
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-[#1B1D21]'>
                Does partner mapping require advanced tools or can it be done
                manually?
              </h4>
              <p className='mt-1 text-sm text-[#5F6D7E]'>
                A basic ecosystem map can start with internal data and
                visualization tools, but scaling partner mapping (real-time
                overlap, multi-partner insights, predictive analytics) is best
                achieved with automated platforms designed for dynamic
                ecosystems.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default FreeResourceAccess
