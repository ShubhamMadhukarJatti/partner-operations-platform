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
      name: 'What are integration partners and how do they differ from traditional channel partners?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Integration partners build technical connections between products that create additional value for customers and open new distribution or co-sell channels. While traditional channel partners focus on reselling and support, integration partners extend product capabilities, improve customer experience and unlock indirect revenue streams.'
      }
    },
    {
      '@type': 'Question',
      name: 'When should a company treat integration partnerships as a channel rather than just a feature?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A company should treat integration partners as a channel when integrations begin to influence pipeline, enable co-sell motions and connect with ecosystems where customers make buying decisions. This typically means the integration delivers measurable customer value beyond a simple API connection.'
      }
    },
    {
      '@type': 'Question',
      name: 'What are the first things to validate before inviting an integration partner into a channel motion?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Before recruiting integration partners into channel strategies, validate product/market fit for the integration, whether there is two-way demand from each partner’s customer base, and alignment in GTM motions such as co-marketing or referral programs.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do integration partnerships intersect with traditional channel strategies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Integration partnerships intersect with channel strategies when they unlock access to partner marketplaces, reseller communities or joint GTM ecosystems. Strategic integrations often expand reach by embedding your product in a partner’s tech stack, enabling co-sell and marketplace motions.'
      }
    },
    {
      '@type': 'Question',
      name: 'What incentive models work best for early channel engagement with integration partners?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Early channel incentives should be simple and aligned to mutual success. Common models include referral rewards, shared pipeline credits or lightweight reseller arrangements that protect partner deal flow without adding complexity.'
      }
    },
    {
      '@type': 'Question',
      name: 'How should deal registration be structured for integration partners?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Deal registration for integration partners should protect the partner’s contribution while ensuring direct sales cadence is not slowed. Clear rules and low-friction registration help partners feel secure and encourage more consistent participation in joint selling.'
      }
    },
    {
      '@type': 'Question',
      name: 'What metrics should companies track to measure the success of integration partner channel strategies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Key metrics include partner-sourced pipeline, partner-influenced pipeline, percentage of customers using key integrations, time to first registered deal, and active partner ratio (engaged vs onboarded partners).'
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
              <FaqAccordion title='What are integration partners and how do they differ from traditional channel partners?'>
                <p>
                  Integration partners build technical connections between
                  products that create additional value for customers and open
                  new distribution or co-sell channels. While traditional
                  channel partners focus on reselling and support, integration
                  partners extend product capabilities, improve customer
                  experience and unlock indirect revenue streams.
                </p>
              </FaqAccordion>

              <FaqAccordion title='When should a company treat integration partnerships as a channel rather than just a feature?'>
                <p>
                  A company should treat integration partners as a channel when
                  integrations begin to influence pipeline, enable co-sell
                  motions and connect with ecosystems where customers make
                  buying decisions. This typically means the integration
                  delivers measurable customer value beyond a simple API
                  connection.
                </p>
              </FaqAccordion>

              <FaqAccordion title='What are the first things to validate before inviting an integration partner into a channel motion?'>
                <div className='flex flex-col gap-2'>
                  <p>
                    Before recruiting integration partners into channel
                    strategies, validate:
                  </p>
                  <ul className='list-disc space-y-1 pl-5'>
                    <li>Product/market fit for the integration</li>
                    <li>
                      Whether there is two-way demand from each partner&apos;s
                      customer base
                    </li>
                    <li>
                      Alignment in GTM motions such as co-marketing or referral
                      programs
                    </li>
                  </ul>
                </div>
              </FaqAccordion>

              <FaqAccordion title='How do integration partnerships intersect with traditional channel strategies?'>
                <p>
                  Integration partnerships intersect with channel strategies
                  when they unlock access to partner marketplaces, reseller
                  communities or joint GTM ecosystems. Strategic integrations
                  often expand reach by embedding your product in a
                  partner&apos;s tech stack, enabling co-sell and marketplace
                  motions.
                </p>
              </FaqAccordion>

              <FaqAccordion title='What incentive models work best for early channel engagement with integration partners?'>
                <p>
                  Early channel incentives should be simple and aligned to
                  mutual success. Common models include referral rewards, shared
                  pipeline credits or lightweight reseller arrangements that
                  protect partner deal flow without adding complexity.
                </p>
              </FaqAccordion>

              <FaqAccordion title='How should deal registration be structured for integration partners?'>
                <p>
                  Deal registration for integration partners should protect the
                  partner&apos;s contribution while ensuring direct sales
                  cadence is not slowed. Clear rules and low-friction
                  registration help partners feel secure and encourage more
                  consistent participation in joint selling.
                </p>
              </FaqAccordion>

              <FaqAccordion title='What metrics should companies track to measure the success of integration partner channel strategies?'>
                <div className='flex flex-col gap-2'>
                  <p>Key metrics include:</p>
                  <ul className='list-disc space-y-1 pl-5'>
                    <li>Partner-sourced pipeline</li>
                    <li>Partner-influenced pipeline</li>
                    <li>Percentage of customers using key integrations</li>
                    <li>Time to first registered deal</li>
                    <li>
                      Active partner ratio (engaged vs onboarded partners)
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
