'use client'

import { Minus, Plus } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

import { SectionEyebrow } from './SectionEyebrow'

const faqs: { id: string; q: string; a: string }[] = [
  {
    id: '1',
    q: 'What is Sharkdom?',
    a: 'Sharkdom is an AI-native partner operations platform for B2B SaaS teams: onboarding, deal registration, co-sell, and partner matching in one place.'
  },
  {
    id: '2',
    q: 'What exactly is Sharkdom used for?',
    a: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,'
  },
  {
    id: '3',
    q: 'How does Sharkdom automate tasks?',
    a: 'Workflows, CRM sync, and AI-assisted routing reduce manual work so partner teams can focus on relationships and revenue.'
  },
  {
    id: '4',
    q: 'Is my data secure with Sharkdom?',
    a: 'We follow industry-standard security practices. Contact us for details on compliance and data processing.'
  },
  {
    id: '5',
    q: 'What kind of support do you offer?',
    a: 'We provide onboarding, success check-ins, and resources for your team. Partners also get a dedicated channel to our partnerships team.'
  }
]

/** Figma frame: FAQ column ~1058px wide */
const FAQ_CONTENT_MAX = 'max-w-[min(1058px,100%)]'

export function PartnerProgramFaq() {
  return (
    <section className='bg-white py-14 sm:py-20'>
      <MaxWidthWrapper className='px-4 sm:px-6'>
        <div
          className={`mx-auto mb-6 flex flex-col items-center gap-4 text-center sm:mb-8 ${FAQ_CONTENT_MAX}`}
        >
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className='text-3xl font-bold leading-tight tracking-[-0.04em] text-[#0e111b] sm:text-5xl sm:leading-[50px]'>
            Frequently Asked Questions
          </h2>
        </div>
        <div className={`mx-auto w-full ${FAQ_CONTENT_MAX}`}>
          <Accordion
            type='single'
            collapsible
            defaultValue='2'
            className='space-y-5'
          >
            {faqs.map((f) => (
              <AccordionItem
                key={f.id}
                value={f.id}
                className='group overflow-hidden rounded-2xl border-0 bg-[#f4f4ff] shadow-[0_1px_2px_0_rgba(0,0,0,0.06)] data-[state=open]:border-t-2 data-[state=open]:border-[#5b76ff]'
              >
                <AccordionTrigger className='w-full items-center justify-between !gap-4 px-5 py-5 hover:no-underline sm:px-6'>
                  <span className='min-w-0 flex-1 pr-4 text-left text-xl font-medium leading-8 text-[#1b0c27] sm:text-2xl'>
                    {f.q}
                  </span>
                  <span
                    className='relative inline-flex h-6 w-6 shrink-0 items-center justify-center'
                    aria-hidden
                  >
                    <Plus className='size-6 group-data-[state=open]:hidden' />
                    <Minus className='absolute hidden size-6 group-data-[state=open]:block' />
                  </span>
                </AccordionTrigger>
                <AccordionContent className='px-5 pb-5 pt-0 sm:px-6 sm:pb-6'>
                  <p className='text-left text-base leading-[26px] text-[#1b0c27]'>
                    {f.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </MaxWidthWrapper>
    </section>
  )
}
