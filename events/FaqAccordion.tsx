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
      name: 'What are the available pricing plans for Sharkdom?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sharkdom offers three main subscription tiers: Standard (ideal for small companies, up to 2 AI proposal generators, personalized recommendations, 24×7 email support), Premium (for mid-stage companies, up to 5 AI proposal generators, meeting scheduling tools, integration portals, Partner Space), and Elite (for enterprises, unlimited AI proposal generators, quarterly check-ins, all Premium features). Each plan includes built-in meeting and communication functionality.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is my data secure with Sharkdom?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Sharkdom ensures data security with encrypted environments for secure account mapping and data sharing.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is there a free trial available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Sharkdom offers a 14-day free trial with credit card required. This trial includes free data migration and customer support.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do all plans include integrations with other tools?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Sharkdom integrates with various tools like HubSpot, Zoho CRM, Mailchimp, Google Meet, and more. The number of available integrations increases with higher-tier plans.'
      }
    },
    {
      '@type': 'Question',
      name: 'What support options are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All plans come with 24×7 email support. Higher-tier plans may offer additional support features, including quarterly check-ins for Enterprise subscribers.'
      }
    },
    {
      '@type': 'Question',
      name: 'Who can I contact for more information?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "For further inquiries, you can reach out to Sharkdom's support team at support@sharkdom.com or book a call through their website."
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
              title='What are the available pricing plans for Sharkdom?'
              defaultOpen={true}
            >
              <div className='flex flex-col gap-4'>
                <p>Sharkdom offers three main subscription tiers:</p>
                <ul className='list-disc space-y-2 pl-5'>
                  <li>
                    <strong>Standard:</strong> Ideal for small companies,
                    includes up to 2 AI proposal generators, personalized
                    recommendations and 24×7 email support.
                  </li>
                  <li>
                    <strong>Premium:</strong> Designed for mid-stage companies,
                    offering up to 5 AI proposal generators, full access to
                    meeting scheduling tools, integration portals and Partner
                    Space.
                  </li>
                  <li>
                    <strong>Elite:</strong> Tailored for enterprises, providing
                    unlimited AI proposal generators, quarterly check-ins and
                    all Premium features.
                  </li>
                </ul>
                <p>
                  Each plan includes built-in meeting and communication
                  functionality.
                </p>
              </div>
            </FaqAccordion>

            <FaqAccordion number={2} title='Is my data secure with Sharkdom?'>
              <p>
                Yes, Sharkdom ensures data security with encrypted environments
                for secure account mapping and data sharing.
              </p>
            </FaqAccordion>

            <FaqAccordion number={3} title='Is there a free trial available?'>
              <p>
                Yes, Sharkdom offers a 14-day free trial with credit card
                required. This trial includes free data migration and customer
                support.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={4}
              title='Do all plans include integrations with other tools?'
            >
              <p>
                Yes, Sharkdom integrates with various tools like HubSpot, Zoho
                CRM, Mailchimp, Google Meet, and more. The number of available
                integrations increases with higher-tier plans
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={5}
              title='What support options are available?'
            >
              <p>
                All plans come with 24×7 email support. Higher-tier plans may
                offer additional support features, including quarterly check-ins
                for Enterprise subscribers.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={6}
              title='Who can I contact for more information?'
            >
              <p>
                For further inquiries, you can reach out to Sharkdom&#39;s
                support team at support@sharkdom.com or book a call through
                their website.
              </p>
            </FaqAccordion>
          </div>
        </div>
      </section>
    </>
  )
}

export default FAQSection
