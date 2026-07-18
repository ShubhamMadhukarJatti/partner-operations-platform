'use client'

import React, { useState } from 'react'
import { ChevronUp } from 'lucide-react'

import { GradientLabel } from '@/components/ui/gradient-label'

interface FaqAccordionProps {
  title: string
  children: React.ReactNode
}

const FaqAccordion = ({ title, children }: FaqAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false)

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
      name: 'What exactly is a partner ecosystem and why is it important in 2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A partner ecosystem is a network of organizations that collaborate to jointly deliver value and accelerate growth beyond what either could achieve alone. According to Sharkdom reports, in 2025 ecosystems are a strategic growth lever influencing over 30% of B2B revenue and playing a pivotal role in customer acquisition and innovation.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do we begin building a high-performing partner ecosystem?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A proven way is to start with your data: analyze closed-won and closed-lost deals from the past two years to identify patterns, adjacent technologies and segments where partnerships have historically driven impact. Then design your partner strategy around these signals and opportunities.'
      }
    },
    {
      '@type': 'Question',
      name: 'What roles should partnerships play within our GTM motion?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Partnerships should be treated as a full go-to-market motion—effectively a business within your business—not just LinkedIn announcements or integrations. They must be integrated into sales, marketing, product and revenue functions to deliver measurable return.'
      }
    },
    {
      '@type': 'Question',
      name: 'What key metrics should we track to measure ecosystem success?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Track impact-based metrics such as partner-sourced revenue velocity—how quickly partner-sourced opportunities convert to closed revenue—rather than superficial metrics like portal logins or tier counts.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do we identify the right partners to prioritize?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ideal partners should have ICP alignment, meaning they sell into similar customer profiles as you do, and should be able to drive impact without requiring disproportionate oversight. Tools like overlap analysis can help streamline this process.'
      }
    },
    {
      '@type': 'Question',
      name: 'Should we start with large or small partnerships?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Begin with smaller, high-impact partnerships that don’t require heavy oversight. These early wins help build momentum, refine playbooks and demonstrate value to internal stakeholders before scaling broader initiatives.'
      }
    },
    {
      '@type': 'Question',
      name: 'What internal capabilities are essential for a thriving partner ecosystem?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Successful ecosystems rely on clear strategy and governance, a foundation built from data and insights, cross-functional collaboration across sales, product and marketing, and process frameworks and playbooks that help partners integrate, sell and succeed with you.'
      }
    }
  ]
}

const FAQAccordion = () => {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className='bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24'>
        <div className='mx-auto max-w-6xl'>
          <div className='grid grid-cols-1 gap-12 lg:grid-cols-12'>
            {/* Left Column: Heading */}
            <div className='lg:col-span-5'>
              <div className='mb-6'>
                <GradientLabel>FAQ</GradientLabel>
              </div>
              <h2 className='text-[40px] font-medium leading-[1.1] text-[#1B0C27] md:text-[56px]'>
                Frequently
                <br />
                Asked
                <br />
                Questions
              </h2>
            </div>

            {/* Right Column: Accordion Items */}
            <div className='flex flex-col gap-4 lg:col-span-7'>
              <FaqAccordion title='What exactly is a partner ecosystem and why is it important in 2025?'>
                <p>
                  A partner ecosystem is a network of organizations that
                  collaborate to jointly deliver value and accelerate growth
                  beyond what either could achieve alone. According to Sharkdom
                  reports, in 2025 ecosystems are a strategic growth lever
                  influencing over 30% of B2B revenue and playing a pivotal role
                  in customer acquisition and innovation.
                </p>
              </FaqAccordion>

              <FaqAccordion title='How do we begin building a high-performing partner ecosystem?'>
                <p>
                  A proven way is to start with your data: analyze closed-won
                  and closed-lost deals from the past two years to identify
                  patterns, adjacent technologies and segments where
                  partnerships have historically driven impact. Then design your
                  partner strategy around these signals and opportunities.
                </p>
              </FaqAccordion>

              <FaqAccordion title='What roles should partnerships play within our GTM motion?'>
                <p>
                  Partnerships should be treated as a full go-to-market
                  motion—effectively a business within your business—not just
                  LinkedIn announcements or integrations. They must be
                  integrated into sales, marketing, product and revenue
                  functions to deliver measurable return.
                </p>
              </FaqAccordion>

              <FaqAccordion title='What key metrics should we track to measure ecosystem success?'>
                <p>
                  Track impact-based metrics such as partner-sourced revenue
                  velocity—how quickly partner-sourced opportunities convert to
                  closed revenue—rather than superficial metrics like portal
                  logins or tier counts.
                </p>
              </FaqAccordion>

              <FaqAccordion title='How do we identify the right partners to prioritize?'>
                <p>
                  Ideal partners should have ICP alignment, meaning they sell
                  into similar customer profiles as you do, and should be able
                  to drive impact without requiring disproportionate oversight.
                  Tools like overlap analysis can help streamline this process.
                </p>
              </FaqAccordion>

              <FaqAccordion title='Should we start with large or small partnerships?'>
                <p>
                  Begin with smaller, high-impact partnerships that don’t
                  require heavy oversight. These early wins help build momentum,
                  refine playbooks and demonstrate value to internal
                  stakeholders before scaling broader initiatives.
                </p>
              </FaqAccordion>

              <FaqAccordion title='What internal capabilities are essential for a thriving partner ecosystem?'>
                <div className='flex flex-col gap-2'>
                  <p>
                    Successful ecosystems rely on several core capabilities:
                  </p>
                  <ul className='list-disc space-y-1 pl-5'>
                    <li>Clear strategy and governance</li>
                    <li>A foundation built from data and insights</li>
                    <li>
                      Cross-functional collaboration across sales, product and
                      marketing
                    </li>
                    <li>
                      Process frameworks and playbooks that help partners
                      integrate, sell and succeed with you
                    </li>
                  </ul>
                </div>
              </FaqAccordion>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default FAQAccordion
