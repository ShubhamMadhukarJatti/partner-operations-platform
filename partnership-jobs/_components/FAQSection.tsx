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
      name: 'What is Sharkdom Partnership Jobs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sharkdom Partnership Jobs is a curated space where companies hire partnership, alliances and ecosystem professionals and candidates discover verified roles in the partnerships domain.'
      }
    },
    {
      '@type': 'Question',
      name: 'Who can use this platform?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Both employers looking to hire partnership talent and professionals seeking roles in partnerships, alliances, GTM, or ecosystem growth can use this page but Sharkdom as solution is meant for Partnership and Growth teams.'
      }
    },
    {
      '@type': 'Question',
      name: 'What types of roles are posted here?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Common roles include Partner Managers, Alliances Leaders, Channel Managers, Ecosystem Leads, Co-sell Managers and Partnership Operations roles.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is this only for tech companies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. While many listings are from SaaS and technology companies, roles may also come from consulting firms, agencies, marketplaces and ecosystem-driven businesses.'
      }
    },
    {
      '@type': 'Question',
      name: 'How is this different from LinkedIn or job boards?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sharkdom focuses specifically on partnership talent and includes verification signals, domain-specific screening and ecosystem credibility indicators that generic job boards don’t provide.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do candidates need to pay to apply?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Applying to partnership roles via Sharkdom is free for candidates.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is your incident response and breach notification process?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sharkdom maintains a formal incident response plan. In the unlikely event of a confirmed data breach, we commit to notifying customers within 72 hours of detection alongside remediation steps and root cause insights. Internal monitoring and alerting systems help us detect and respond quickly.'
      }
    },
    {
      '@type': 'Question',
      name: 'How does Sharkdom verify candidates or companies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We use profile validation signals, LinkedIn verification steps and optional screening workflows to improve trust and authenticity for both sides.'
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
      <section className='mx-auto gap-10 bg-white px-4 py-16 sm:px-6 md:flex md:max-w-6xl lg:px-8 lg:py-24'>
        <div>
          <GradientLabel>FAQ</GradientLabel>
          <h2 className='text-black-dark mb-12 mt-3 text-start text-[60px] font-[500] leading-tight'>
            Frequently Asked Questions
          </h2>
        </div>

        <div className='mx-auto max-w-2xl'>
          <div className='flex flex-col gap-4'>
            <FaqAccordion
              number={1}
              title='What is Sharkdom Partnership Jobs?'
              defaultOpen={true}
            >
              <p>
                Sharkdom Partnership Jobs is a curated space where companies
                hire partnership, alliances and ecosystem professionals and
                candidates discover verified roles in the partnerships domain.
              </p>
            </FaqAccordion>

            <FaqAccordion number={2} title='Who can use this platform?'>
              <p>
                Both employers looking to hire partnership talent and
                professionals seeking roles in partnerships, alliances, GTM, or
                ecosystem growth can use this page but Sharkdom as solution is
                meant for Partnership and Growth teams.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={3}
              title='What types of roles are posted here?'
            >
              <p>
                Common roles include Partner Managers, Alliances Leaders,
                Channel Managers, Ecosystem Leads, Co-sell Managers and
                Partnership Operations roles.
              </p>
            </FaqAccordion>

            <FaqAccordion number={4} title='Is this only for tech companies?'>
              <p>
                No. While many listings are from SaaS and technology companies,
                roles may also come from consulting firms, agencies,
                marketplaces and ecosystem-driven businesses.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={5}
              title='How is this different from LinkedIn or job boards?'
            >
              <p>
                Sharkdom focuses specifically on partnership talent and includes
                verification signals, domain-specific screening and ecosystem
                credibility indicators that generic job boards don&apos;t
                provide.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={6}
              title='Do candidates need to pay to apply?'
            >
              <p>
                No. Applying to partnership roles via Sharkdom is free for
                candidates.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={7}
              title='What is your incident response and breach notification process?'
            >
              <p>
                Sharkdom maintains a formal incident response plan. In the
                unlikely event of a confirmed data breach, we commit to
                notifying customers within 72 hours of detection alongside
                remediation steps and root cause insights. Internal monitoring
                and alerting systems help us detect and respond quickly.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={8}
              title='How does Sharkdom verify candidates or companies?'
            >
              <p>
                We use profile validation signals, LinkedIn verification steps
                and optional screening workflows to improve trust and
                authenticity for both sides.
              </p>
            </FaqAccordion>
          </div>
        </div>
      </section>
    </>
  )
}

export default FAQSection
