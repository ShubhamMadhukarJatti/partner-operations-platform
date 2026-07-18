import React from 'react'

import { type PricingRegion } from '@/lib/pricing-region'

import PurchaseCard from './PurchaseCard'

const dummyCards = [
  {
    thumbnail: '/pricing/feature_onboarding.png',
    name: 'Partner Onboarding',
    indiaPricePerMonth: '₹1,499',
    features: [
      'Bring offline & online partners into single workspace',
      'Verification flows',
      'Partner profile builder',
      'Custom forms',
      'Access Control'
    ],
    learnMoreLink: 'https://help.sharkdom.com/feature-suite/partner-onboarding'
  },
  {
    thumbnail: '/pricing/feature_management.png',
    name: 'Partner Management',
    indiaPricePerMonth: '₹2,299',
    features: [
      'Roles, dashboards & performance governance. Partner scorecard',
      'Incentive rules',
      'Access logs',
      'Steering committee view'
    ],
    learnMoreLink: 'https://help.sharkdom.com/feature-suite/external-partners'
  },
  {
    thumbnail: '/pricing/feature_registration.png',
    name: 'Deal Registration',
    indiaPricePerMonth: '₹799',
    features: [
      'Let partners submit deals → auto-sync to CRM.',
      'Deal workflows',
      'CRM sync',
      'Review panel',
      'Fraud prevention'
    ],
    learnMoreLink: 'https://help.sharkdom.com/feature-suite/deal-registration'
  },
  {
    thumbnail: '/pricing/feature_mapping.png',
    name: 'Partner Mapping',
    indiaPricePerMonth: '₹799',
    features: [
      'Reveal co-sell opportunities across partners.',
      'Account comparison',
      'Lookalike matching',
      'Opportunity scoring'
    ],
    learnMoreLink: 'https://help.sharkdom.com/feature-suite/partner-mapping'
  },
  {
    thumbnail: '/pricing/feature_gtm_board.png',
    name: 'Joint GTM Board',
    indiaPricePerMonth: '₹799',
    features: [
      'Shared Trello/Notion-style space for GTM launches.',
      'Shared GTM tasks',
      'Partner profile builder',
      'Visibility rules',
      'Recurring milestones'
    ],
    learnMoreLink: 'https://help.sharkdom.com/feature-suite/partner-mapping'
  },
  {
    thumbnail: '/pricing/feature_incentives.png',
    name: 'Loyalty & Incentives',
    indiaPricePerMonth: '₹999',
    features: [
      'Motivate partners via structured rewards tracking',
      'Loyalty based programs for partners',
      'Gamification of partner experience'
    ],
    learnMoreLink:
      'https://help.sharkdom.com/feature-suite/deal-registration/partner-loyalty-program'
  }
]

type PurchaseCardsSectionProps = {
  region: PricingRegion
}

const PurchaseCardsSection = ({ region }: PurchaseCardsSectionProps) => {
  return (
    <section className='mx-auto flex max-w-7xl flex-col items-center gap-[56px] px-4 py-16 sm:px-6 lg:px-8'>
      <h2 className='text-center text-[40px] font-semibold text-[#1B0C27]'>
        Elevate Your Team’s Performance
      </h2>
      <div className='grid max-w-[1000px] grid-cols-1 justify-items-center gap-8 md:grid-cols-2'>
        {dummyCards.map(({ indiaPricePerMonth, ...card }) => (
          <PurchaseCard
            key={card.name}
            {...card}
            pricePerMonth={
              region === 'India'
                ? indiaPricePerMonth
                : 'Calculated automatically'
            }
            priceSuffix={region === 'India' ? '/ mo' : undefined}
          />
        ))}
      </div>
    </section>
  )
}

export default PurchaseCardsSection
