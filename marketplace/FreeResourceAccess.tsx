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
    <>
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='mb-12 text-center'>
          <h2
            className='mb-4 font-semibold text-black'
            style={{ fontSize: '48px' }}
          >
            Get FREE Resource Access
          </h2>
          <p className='text-lg text-[#5F6D7E]'>
            Make Sharkdom your only Go-To-market platform for all your partner
            ops
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
              Check why you need a{' '}
              <span className='text-[#3C3CD4]'>Partner Marketplace</span> for a
              strong Partner Ecosystem
            </h3>
            <DownloadPlaybookButton
              pdfUrl='https://storage.googleapis.com/sharkdom_resources/hero_section/why%20partner%20marketplace.pdf'
              fileName='why-partner-marketplace.pdf'
              demoType='/marketplace'
            />
          </div>

          {/* Right - Image */}
          <div className='hidden flex-[2] overflow-hidden rounded-[24px] border border-[#E4E7EE] bg-gray-50 shadow-[0px_1px_2px_0px_#0000000F] md:block'>
            <Image
              src='/assets/partner-mapping/free_resource_img.png'
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

        {/* Marketplace FAQ */}
        <div className='mx-auto mt-16 max-w-3xl space-y-6'>
          <h3 className='text-2xl font-semibold text-[#1B1D21]'>
            Marketplace FAQ
          </h3>
          <div className='space-y-4'>
            <div>
              <h4 className='text-lg font-medium text-[#1B1D21]'>
                How do partners get discovered in Sharkdom's Marketplace?
              </h4>
              <p className='mt-1 text-sm text-[#5F6D7E]'>
                Discovery is driven by profile completeness, declared
                capabilities, and our Dweep AI match score (which weights ICP
                overlap, historical signals and integration fit). Partners with
                higher match scores appear earlier in relevant searches and
                curated recommendations.
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-[#1B1D21]'>
                What is Dweep AI and how does it influence partner selection?
              </h4>
              <p className='mt-1 text-sm text-[#5F6D7E]'>
                Dweep AI forecasts partner-fit by analyzing overlapping KPIs,
                product signals, and historical outcomes. It&apos;s used to rank
                potential partners, suggest prioritisation for outbound
                outreach, and reduce onboarding risk by highlighting
                high-probability matches.
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-[#1B1D21]'>
                Can I control what information about my program is public vs
                private?
              </h4>
              <p className='mt-1 text-sm text-[#5F6D7E]'>
                Yes. Marketplace listings support visibility tiers public,
                invite-only, and private. You control which assets, partner
                contacts and sandbox credentials are exposed and to which
                audience segment.
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-[#1B1D21]'>
                How are inbound partner enquiries routed and qualified?
              </h4>
              <p className='mt-1 text-sm text-[#5F6D7E]'>
                Enquiries are captured in a central queue and pass through
                configurable qualification workflows (auto-scoring rules plus
                manual review). You can define required fields, auto-reject
                criteria and SLA routing to Partner Success or Sales contacts.
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-[#1B1D21]'>
                Does Marketplace support private "partner catalogs" for vertical
                programs?
              </h4>
              <p className='mt-1 text-sm text-[#5F6D7E]'>
                Yes. You can create segmented catalogs (industry, region, or
                solution play) so prospects see only the partners relevant to
                their use case or geography.
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-[#1B1D21]'>
                How do you protect sensitive data (eg. sandbox credentials,
                contracts) shared with partners?
              </h4>
              <p className='mt-1 text-sm text-[#5F6D7E]'>
                Marketplace enforces role-based access, encrypted storage, and
                time-limited credential sharing. You can require NDAs, vet
                partners before full access, and revoke credentials centrally at
                any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default FreeResourceAccess
