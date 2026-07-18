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
      name: 'What happens after I apply for a job?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your application is reviewed and shared with the hiring company. You may also receive follow-up questions or screening requests if the employer requires more information.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do I need to verify my profile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Some employers prefer verified candidates. You may optionally complete a LinkedIn or profile verification step to improve your visibility and trust.'
      }
    },
    {
      '@type': 'Question',
      name: 'Will my data be shared with other companies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Your application is only shared with the employer for the role you applied to unless you explicitly opt-in for broader opportunities.'
      }
    },
    {
      '@type': 'Question',
      name: 'How will I know if I’m shortlisted?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You’ll receive updates via email or through Sharkdom if the employer expresses interest or requests next steps.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I apply for multiple roles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can apply to multiple partnership roles through Sharkdom.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is there any fee for candidates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Applying and being reviewed for partnership roles is completely free.'
      }
    },
    {
      '@type': 'Question',
      name: 'What if I want to withdraw my application?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can request withdrawal anytime by contacting Sharkdom support or replying to your confirmation email.'
      }
    }
  ]
}

const JobPreviewFAQSection = () => {
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
              title='What happens after I apply for a job?'
              defaultOpen={true}
            >
              <p>
                Your application is reviewed and shared with the hiring company.
                You may also receive follow-up questions or screening requests
                if the employer requires more information.
              </p>
            </FaqAccordion>

            <FaqAccordion number={2} title='Do I need to verify my profile?'>
              <p>
                Some employers prefer verified candidates. You may optionally
                complete a LinkedIn or profile verification step to improve your
                visibility and trust.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={3}
              title='Will my data be shared with other companies?'
            >
              <p>
                No. Your application is only shared with the employer for the
                role you applied to unless you explicitly opt-in for broader
                opportunities.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={4}
              title='How will I know if I’m shortlisted?'
            >
              <p>
                You&apos;ll receive updates via email or through Sharkdom if the
                employer expresses interest or requests next steps.
              </p>
            </FaqAccordion>

            <FaqAccordion number={5} title='Can I apply for multiple roles?'>
              <p>
                Yes. You can apply to multiple partnership roles through
                Sharkdom.
              </p>
            </FaqAccordion>

            <FaqAccordion number={6} title='Is there any fee for candidates?'>
              <p>
                No. Applying and being reviewed for partnership roles is
                completely free.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={7}
              title='What if I want to withdraw my application?'
            >
              <p>
                You can request withdrawal anytime by contacting Sharkdom
                support or replying to your confirmation email.
              </p>
            </FaqAccordion>
          </div>
        </div>
      </section>
    </>
  )
}

export default JobPreviewFAQSection
