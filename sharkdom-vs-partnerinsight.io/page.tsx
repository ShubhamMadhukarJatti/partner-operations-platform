import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

import { ScrollReveal } from '../../_components/ScrollReveal'
import PartnerinsightAdvantageSection from './_components/PartnerinsightAdvantageSection'
import PartnerinsightComparisonTable from './_components/PartnerinsightComparisonTable'
import PartnerinsightHero from './_components/PartnerinsightHero'
import PartnerinsightMigrationForm from './_components/PartnerinsightMigrationForm'
import PartnerinsightPricingCards from './_components/PartnerinsightPricingCards'
import PartnerinsightTeamStory from './_components/PartnerinsightTeamStory'
import PartnerinsightTrustStrip from './_components/PartnerinsightTrustStrip'
import PartnerinsightWhyGrid from './_components/PartnerinsightWhyGrid'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Sharkdom vs PartnerInsight.io | Built for SaaS vs Basic GTM Hubs',
  description:
    'Comparing Sharkdom vs PartnerInsight.io? With the advent of goal-oriented partnerships, traditional ways need reforms but PartnerInsight.io is not the perfect fit. Compare Sharkdom and PartnerInsight.io, and learn why Sharkdom is the clear winner.',
  keywords: [
    'Sharkdom vs PartnerInsight',
    'PartnerInsight alternative',
    'PRM comparison',
    'partner relationship management'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/compare/sharkdom-vs-partnerinsight.io'
  }
}

function SharkdomVsPartnerinsightPage() {
  return (
    <div className={plusJakartaSans.className}>
      <ScrollReveal amount={0.15}>
        <PartnerinsightHero />
      </ScrollReveal>
      <ScrollReveal>
        <PartnerinsightAdvantageSection />
      </ScrollReveal>
      <ScrollReveal>
        <PartnerinsightComparisonTable />
      </ScrollReveal>
      <ScrollReveal>
        <PartnerinsightPricingCards />
      </ScrollReveal>
      <ScrollReveal>
        <PartnerinsightWhyGrid />
      </ScrollReveal>
      <ScrollReveal>
        <PartnerinsightTeamStory />
      </ScrollReveal>
      <ScrollReveal>
        <PartnerinsightTrustStrip />
      </ScrollReveal>
      <ScrollReveal>
        <PartnerinsightMigrationForm />
      </ScrollReveal>
    </div>
  )
}

export default SharkdomVsPartnerinsightPage
