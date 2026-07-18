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
      name: 'What does “30-day, behavior-first training” mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It’s a short, action-oriented onboarding sequence that prioritizes one measurable partner action per module (e.g., register a deal, run a sandbox call) so partners produce real outcomes within 30 days.'
      }
    },
    {
      '@type': 'Question',
      name: 'How is the Readiness Score calculated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Readiness is a weighted score based on actions (course completion, sandbox/API verification, deal registration) and recency, configurable to match your GTM priorities.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I map training completion to certification levels?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, you can map training completion to certification levels so that specific course paths and milestones unlock different partner certifications aligned to your program tiers.'
      }
    },
    {
      '@type': 'Question',
      name: 'Will partners see the same metadata we see?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You control visibility: thumbnails, duration, tags and certificate badges can be public, invite-only or hidden based on listing settings.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is there a way to require a sandbox/API verification as part of the course?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — you can add a “first API call” or sandbox verification action to any module and mark completion only after the system verifies the call.'
      }
    },
    {
      '@type': 'Question',
      name: 'Who should own the training program internally?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Best practice: Partnerships own curriculum design, Partner Ops/RevOps own integration with CRM and attribution, Sales/AE teams support co-sell exercises, and a cross-functional RACI ensures adoption.'
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
              title='What does “30-day, behavior-first training” mean?'
              defaultOpen={true}
            >
              <p>
                It&apos;s a short, action-oriented onboarding sequence that
                prioritizes one measurable partner action per module (e.g.,
                register a deal, run a sandbox call) so partners produce real
                outcomes within 30 days.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={2}
              title='How is the Readiness Score calculated?'
            >
              <p>
                Readiness is a weighted score based on actions (course
                completion, sandbox/API verification, deal registration) and
                recency, configurable to match your GTM priorities.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={3}
              title='Can I map training completion to certification levels?'
            >
              <p>
                Yes, you can map training completion to certification levels so
                that specific course paths and milestones unlock different
                partner certifications aligned to your program tiers.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={4}
              title='Will partners see the same metadata we see?'
            >
              <p>
                You control visibility: thumbnails, duration, tags and
                certificate badges can be public, invite only or hidden based on
                listing settings.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={5}
              title='Is there a way to require a sandbox/API verification as part of the course?'
            >
              <p>
                Yes — add a &quot;first API call&quot; or sandbox verification
                action to any module and mark completion only after the system
                verifies the call.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={6}
              title='Who should own the training program internally?'
            >
              <p>
                Best practice: Partnerships own curriculum design, Partner
                Ops/RevOps own integration with CRM and attribution, Sales/AE
                teams support co-sell exercises, and a cross-functional RACI
                ensures adoption.
              </p>
            </FaqAccordion>
          </div>
        </div>
      </section>
    </>
  )
}

export default FAQSection
