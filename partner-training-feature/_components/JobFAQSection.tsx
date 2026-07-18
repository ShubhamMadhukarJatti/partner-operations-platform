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
      name: 'Who can post jobs on Sharkdom?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Any company hiring for partnership or alliances roles can submit a job posting. Our team reviews submissions before publishing or sharing candidates.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is there a cost to post a job?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Depending on your plan or engagement level with Sharkdom, job posting may be free or included within your partnership program subscription. Contact us for details.'
      }
    },
    {
      '@type': 'Question',
      name: 'What information do I need to provide?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You’ll typically share role title, location, experience level, responsibilities, hiring timeline and contact details for candidate coordination.'
      }
    },
    {
      '@type': 'Question',
      name: 'How are candidates screened before sharing with us?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can choose to use Sharkdom AI screening or receive raw applications. Our system can pre-qualify candidates based on experience, domain fit and signals you define.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I edit or close the job later?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can update job details or close the hiring request anytime by contacting the Sharkdom team or through your dashboard (if enabled).'
      }
    },
    {
      '@type': 'Question',
      name: 'Will my job be visible publicly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can choose whether the job is publicly visible, shared privately with curated candidates or both.'
      }
    },
    {
      '@type': 'Question',
      name: 'How quickly will I start receiving candidates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most employers begin receiving candidate matches within a few days, depending on role complexity and market availability.'
      }
    }
  ]
}

const JobFAQSection = () => {
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
              title='Who can post jobs on Sharkdom?'
              defaultOpen={true}
            >
              <p>
                Any company hiring for partnership or alliances roles can submit
                a job posting. Our team reviews submissions before publishing or
                sharing candidates.
              </p>
            </FaqAccordion>

            <FaqAccordion number={2} title='Is there a cost to post a job?'>
              <p>
                Depending on your plan or engagement level with Sharkdom, job
                posting may be free or included within your partnership program
                subscription. Contact us for details.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={3}
              title='What information do I need to provide?'
            >
              <p>
                You&apos;ll typically share role title, location, experience
                level, responsibilities, hiring timeline and contact details for
                candidate coordination.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={4}
              title='How are candidates screened before sharing with us?'
            >
              <p>
                You can choose to use Sharkdom AI screening or receive raw
                applications. Our system can pre-qualify candidates based on
                experience, domain fit and signals you define.
              </p>
            </FaqAccordion>

            <FaqAccordion number={5} title='Can I edit or close the job later?'>
              <p>
                Yes. You can update job details or close the hiring request
                anytime by contacting the Sharkdom team or through your
                dashboard (if enabled).
              </p>
            </FaqAccordion>

            <FaqAccordion number={6} title='Will my job be visible publicly?'>
              <p>
                You can choose whether the job is publicly visible, shared
                privately with curated candidates or both.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={7}
              title='How quickly will I start receiving candidates?'
            >
              <p>
                Most employers begin receiving candidate matches within a few
                days, depending on role complexity and market availability.
              </p>
            </FaqAccordion>
          </div>
        </div>
      </section>
    </>
  )
}

export default JobFAQSection
