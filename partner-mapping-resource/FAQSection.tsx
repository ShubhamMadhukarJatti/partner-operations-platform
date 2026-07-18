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
      name: 'What is partner ecosystem mapping and why does it matter for revenue?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Partner ecosystem mapping is a strategic process for visualizing and analyzing your partner network, uncovering relationships, overlaps and opportunities that drive predictable partner revenue. It helps you prioritize high-impact collaborations and align resources accordingly.'
      }
    },
    {
      '@type': 'Question',
      name: 'How does partner mapping reduce blind spots in my partner program?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'By aggregating partner data and visualizing connections, partner mapping reveals hidden overlaps, underserved segments and growth gaps enabling more effective prioritization and decision-making for GTM teams.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can partner mapping identify which partners will drive the most pipeline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, partner mapping tools can highlight mutual account overlap, partner strengths and strategic fit so teams can focus on partners with the highest potential for co-selling and cross-selling opportunities.'
      }
    },
    {
      '@type': 'Question',
      name: 'How often should I update my partner ecosystem map?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Partner ecosystems evolve as you add partners, enter new markets, or shift strategy. A best practice is to update the map regularly (quarterly or as key changes occur) to keep insights accurate and actionable.'
      }
    },
    {
      '@type': 'Question',
      name: 'How is partner mapping different from simple account sharing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Account sharing shows what partners know about customers. Partner mapping goes further by analyzing relationships, strategic alignment, customer overlaps and market influence helping teams make data-backed decisions rather than just sharing lists.'
      }
    },
    {
      '@type': 'Question',
      name: 'Does partner mapping require advanced tools or can it be done manually?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A basic ecosystem map can start with internal data and visualization tools, but scaling partner mapping (real-time overlap, multi-partner insights, predictive analytics) is best achieved with automated platforms designed for dynamic ecosystems.'
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
      <section className='mx-auto flex max-w-6xl flex-col gap-10 bg-white px-4 py-16 sm:px-6 lg:flex-row lg:px-8 lg:py-24'>
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
              title='What is partner ecosystem mapping and why does it matter for revenue?'
              defaultOpen={true}
            >
              <p>
                Partner ecosystem mapping is a strategic process for visualizing
                and analyzing your partner network, uncovering relationships,
                overlaps and opportunities that drive predictable partner
                revenue. It helps you prioritize high-impact collaborations and
                align resources accordingly.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={2}
              title='How does partner mapping reduce blind spots in my partner program?'
            >
              <p>
                By aggregating partner data and visualizing connections, partner
                mapping reveals hidden overlaps, underserved segments and growth
                gaps enabling more effective prioritization and decision-making
                for GTM teams.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={3}
              title='Can partner mapping identify which partners will drive the most pipeline?'
            >
              <p>
                Yes, partner mapping tools can highlight mutual account overlap,
                partner strengths and strategic fit so teams can focus on
                partners with the highest potential for co-selling and
                cross-selling opportunities.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={4}
              title='How often should I update my partner ecosystem map?'
            >
              <p>
                Partner ecosystems evolve as you add partners, enter new
                markets, or shift strategy. A best practice is to update the map
                regularly (quarterly or as key changes occur) to keep insights
                accurate and actionable.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={5}
              title='How is partner mapping different from simple account sharing?'
            >
              <p>
                Account sharing shows what partners know about customers.
                Partner mapping goes further by analyzing relationships,
                strategic alignment, customer overlaps and market influence
                helping teams make data-backed decisions rather than just
                sharing lists.
              </p>
            </FaqAccordion>

            <FaqAccordion
              number={6}
              title='Does partner mapping require advanced tools or can it be done manually?'
            >
              <p>
                A basic ecosystem map can start with internal data and
                visualization tools, but scaling partner mapping (real-time
                overlap, multi-partner insights, predictive analytics) is best
                achieved with automated platforms designed for dynamic
                ecosystems.
              </p>
            </FaqAccordion>
          </div>
        </div>
      </section>
    </>
  )
}

export default FAQSection
