'use client'

import React, { useState } from 'react'
import { ChevronUp } from 'lucide-react'

import { GradientLabel } from '@/components/ui/gradient-label'

interface FaqAccordionProps {
  number: number
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

const FaqAccordion = ({
  number,
  title,
  children,
  defaultOpen = false
}: FaqAccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className='rounded-[12px] border border-[var(--text-20)] transition-all duration-200'>
      <button
        className='flex w-full items-start justify-between p-4 text-left focus:outline-none'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className='text-[18px] font-medium leading-[24px] text-[var(--text-100)]'>
          {title}
        </span>
        <ChevronUp
          className={`ml-4 h-5 w-5 shrink-0 text-[var(--text-100)] transition-transform duration-300 ${
            isOpen ? 'rotate-0' : 'rotate-180'
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className='px-10 pb-4 text-[16px] font-normal leading-[24px] text-[var(--text-110)]'>
          {children}
        </div>
      </div>
    </div>
  )
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do partners get discovered in Sharkdom’s Marketplace?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Discovery is driven by profile completeness, declared capabilities, and our Dweep AI match score (which weights ICP overlap, historical signals and integration fit). Partners with higher match scores appear earlier in relevant searches and curated recommendations.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is Dweep AI and how does it influence partner selection?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dweep AI forecasts partner-fit by analyzing overlapping KPIs, product signals, and historical outcomes. It’s used to rank potential partners, suggest prioritisation for outbound outreach, and reduce onboarding risk by highlighting high-probability matches.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I control what information about my program is public vs private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Marketplace listings support visibility tiers public, invite-only, and private. You control which assets, partner contacts and sandbox credentials are exposed and to which audience segment.'
      }
    },
    {
      '@type': 'Question',
      name: 'How are inbound partner enquiries routed and qualified?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enquiries are captured in a central queue and pass through configurable qualification workflows (auto-scoring rules plus manual review). You can define required fields, auto-reject criteria and SLA routing to Partner Success or Sales contacts.'
      }
    },
    {
      '@type': 'Question',
      name: 'Does Marketplace support private “partner catalogs” for vertical programs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can create segmented catalogs (industry, region, or solution play) so prospects see only the partners relevant to their use case or geography.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do you protect sensitive data (eg. sandbox credentials, contracts) shared with partners?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Marketplace enforces role-based access, encrypted storage, and time-limited credential sharing. You can require NDAs, vet partners before full access, and revoke credentials centrally at any time.'
      }
    }
  ]
}

const FAQSection = () => {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className='mx-auto flex max-w-6xl gap-10 bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24'>
        <div>
          <GradientLabel>FAQ</GradientLabel>
          <h2 className='mb-12 mt-3 text-start text-[60px] font-[500] leading-tight text-[#1B1D21]'>
            Frequently Asked Questions
          </h2>
        </div>

        <div className='mx-auto max-w-3xl'>
          <div className='flex flex-col gap-4'>
            <FaqAccordion
              number={1}
              title='How do partners get discovered in Sharkdom’s Marketplace?'
              defaultOpen={true}
            >
              <p>
                Discovery is driven by profile completeness, declared
                capabilities, and our Dweep AI match score (which weights ICP
                overlap, historical signals and integration fit). Partners with
                higher match scores appear earlier in relevant searches and
                curated recommendations.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={2}
              title='What is Dweep AI and how does it influence partner selection?'
            >
              <p>
                Dweep AI forecasts partner-fit by analyzing overlapping KPIs,
                product signals, and historical outcomes. It&apos;s used to rank
                potential partners, suggest prioritisation for outbound
                outreach, and reduce onboarding risk by highlighting
                high-probability matches.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={3}
              title='Can I control what information about my program is public vs private?'
            >
              <p>
                Yes. Marketplace listings support visibility tiers public,
                invite-only, and private. You control which assets, partner
                contacts and sandbox credentials are exposed and to which
                audience segment.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={4}
              title='How are inbound partner enquiries routed and qualified?'
            >
              <p>
                Enquiries are captured in a central queue and pass through
                configurable qualification workflows (auto-scoring rules plus
                manual review). You can define required fields, auto-reject
                criteria and SLA routing to Partner Success or Sales contacts.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={5}
              title='Does Marketplace support private “partner catalogs” for vertical programs?'
            >
              <p>
                Yes. You can create segmented catalogs (industry, region, or
                solution play) so prospects see only the partners relevant to
                their use case or geography.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={6}
              title='How do you protect sensitive data (eg. sandbox credentials, contracts) shared with partners?'
            >
              <p>
                Marketplace enforces role-based access, encrypted storage, and
                time-limited credential sharing. You can require NDAs, vet
                partners before full access, and revoke credentials centrally at
                any time.
              </p>
            </FaqAccordion>
          </div>
        </div>
      </section>
    </>
  )
}

export default FAQSection
