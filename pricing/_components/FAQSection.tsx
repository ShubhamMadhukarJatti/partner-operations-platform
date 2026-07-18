import React, { useState } from 'react'
import { ChevronUp } from 'lucide-react'

interface FaqAccordionProps {
  title: string
  children: React.ReactNode
}

const FaqAccordion = ({ title, children }: FaqAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='rounded-[16px] border border-[#E4E7EE] bg-white transition-all duration-200'>
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
      name: 'How is my price calculated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Base Plan + Add-Ons you choose + Additional Seats (optional). No surprise fees. No forced annual upsell. You see your real-time price using the calculator before you pay.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is my partner data private and secure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — by default. Sharkdom uses: End-to-end encryption, Role-based access, Snapshot links (view-only, secure), Granular permissioning for each partner, "Partner-blind zones" to restrict internal visibility. Your data stays yours — even your partners only see what you approve.'
      }
    },
    {
      '@type': 'Question',
      name: 'What if my partner is not on Sharkdom?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "They don't need to be. Using Deal Snapshot Links, your partner can: Submit deals, Track progress, Share updates, Upload files — without creating a Sharkdom account. Secure. Verified by email. Zero login friction."
      }
    },
    {
      '@type': 'Question',
      name: 'Does Sharkdom sync with CRM platforms?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We support: Salesforce, HubSpot, Pipedrive, Zoho CRM, Monday CRM, Custom APIs (Enterprise). Sync includes deals, contacts, accounts, and "partner influence activities."'
      }
    },
    {
      '@type': 'Question',
      name: 'What happens if we exceed deal or mapping limits?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sharkdom will notify you before limits are hit. You can top-up: Deal credits, Mapping credits, Snapshot link bundles. No disruption to workflow.'
      }
    },
    {
      '@type': 'Question',
      name: 'What onboarding support do we get?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All paid plans get: Guided setup, CRM sync assistance, Partner imports, GTM templates, Best-practice playbooks. Enterprise plans get a dedicated Partner Ops Consultant.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can Sharkdom scale to 100+ partners?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes, that's exactly what it's built for. We power: Multi-region co-sell, 10+ partner teams, Large ecosystem intelligence, Enterprise-level permissions & reporting. If you're scaling, we're built for you."
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
      <section className='px-4 py-16 sm:px-6 lg:bg-[#F9F9FB] lg:px-8 lg:py-24'>
        <div className='mx-auto max-w-4xl rounded-[32px] bg-white p-6 sm:p-12'>
          <h2 className='mb-12 text-center text-[40px] font-[600] leading-tight text-[#1B1D21]'>
            Frequently Asked Questions
          </h2>

          <div className='mx-auto flex max-w-3xl flex-col gap-4'>
            <FaqAccordion title='1. How is my price calculated?'>
              <p>
                Base Plan + Add-Ons you choose + Additional Seats (optional).
                <br />
                No surprise fees. No forced annual upsell.
                <br />
                You see your real-time price using the calculator before you
                pay.
              </p>
            </FaqAccordion>

            <FaqAccordion title='2. Is my partner data private and secure?'>
              <div className='flex flex-col gap-2'>
                <p>Yes — by default. Sharkdom uses:</p>
                <ul className='list-disc space-y-1 pl-5'>
                  <li>End-to-end encryption</li>
                  <li>Role-based access</li>
                  <li>Snapshot links (view-only, secure)</li>
                  <li>Granular permissioning for each partner</li>
                  <li>
                    “Partner-blind zones” to restrict internal visibility.
                  </li>
                </ul>
                <p>
                  Your data stays yours — even your partners only see what you
                  approve.
                </p>
              </div>
            </FaqAccordion>

            <FaqAccordion title='3. What if my partner is not on Sharkdom?'>
              <div className='flex flex-col gap-2'>
                <p>They don’t need to be.</p>
                <p>Using Deal Snapshot Links, your partner can:</p>
                <ul className='list-disc space-y-1 pl-5'>
                  <li>Submit deals</li>
                  <li>Track progress</li>
                  <li>Share updates</li>
                  <li>Upload files</li>
                </ul>
                <p>...without creating a Sharkdom account.</p>
                <p className='font-semibold'>
                  Secure. Verified by email. Zero login friction.
                </p>
              </div>
            </FaqAccordion>

            <FaqAccordion title='4. Does Sharkdom sync with CRM platforms?'>
              <div className='flex flex-col gap-2'>
                <p>Yes. We support:</p>
                <ul className='list-disc space-y-1 pl-5'>
                  <li>Salesforce</li>
                  <li>HubSpot</li>
                  <li>Pipedrive</li>
                  <li>Zoho CRM</li>
                  <li>Monday CRM</li>
                  <li>Custom APIs (Enterprise)</li>
                </ul>
                <p>
                  Sync includes deals, contacts, accounts, and “partner
                  influence activities.”
                </p>
              </div>
            </FaqAccordion>

            <FaqAccordion title='5. What happens if we exceed deal or mapping limits?'>
              <div className='flex flex-col gap-2'>
                <p>Sharkdom will notify you before limits are hit.</p>
                <p>You can top-up:</p>
                <ul className='list-disc space-y-1 pl-5'>
                  <li>Deal credits</li>
                  <li>Mapping credits</li>
                  <li>Snapshot link bundles</li>
                </ul>
                <p>No disruption to workflow.</p>
              </div>
            </FaqAccordion>

            <FaqAccordion title='6. What onboarding support do we get?'>
              <div className='flex flex-col gap-2'>
                <p>All paid plans get:</p>
                <ul className='list-disc space-y-1 pl-5'>
                  <li>Guided setup</li>
                  <li>CRM sync assistance</li>
                  <li>Partner imports</li>
                  <li>GTM templates</li>
                  <li>Best-practice playbooks</li>
                </ul>
                <p>Enterprise plans get a dedicated Partner Ops Consultant.</p>
              </div>
            </FaqAccordion>

            <FaqAccordion title='7. Can Sharkdom scale to 100+ partners?'>
              <div className='flex flex-col gap-2'>
                <p>Yes, that’s exactly what it’s built for.</p>
                <p>We power:</p>
                <ul className='list-disc space-y-1 pl-5'>
                  <li>Multi-region co-sell</li>
                  <li>10+ partner teams</li>
                  <li>Large ecosystem intelligence</li>
                  <li>Enterprise-level permissions & reporting</li>
                </ul>
                <p>If you&apos;re scaling, we&apos;re built for you.</p>
              </div>
            </FaqAccordion>
          </div>
        </div>
      </section>
    </>
  )
}

export default FAQSection
