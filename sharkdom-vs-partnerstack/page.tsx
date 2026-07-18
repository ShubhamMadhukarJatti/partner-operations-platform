import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

import { ScrollReveal } from '../../_components/ScrollReveal'
import PartnerstackComparisonTable from './_components/PartnerstackComparisonTable'
import PartnerstackHero from './_components/PartnerstackHero'
import PartnerstackMigrationForm from './_components/PartnerstackMigrationForm'
import PartnerstackPricingCards from './_components/PartnerstackPricingCards'
import PartnerstackProblemSection from './_components/PartnerstackProblemSection'
import PartnerstackTeamStory from './_components/PartnerstackTeamStory'
import PartnerstackTrustStrip from './_components/PartnerstackTrustStrip'
import PartnerstackWhyGrid from './_components/PartnerstackWhyGrid'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Sharkdom vs PartnerStack | Partner Platform Comparison',
  description:
    'Compare Sharkdom and PartnerStack on AI matching, deal registration, pricing, marketplace access, and setup speed. Side-by-side breakdown for SaaS teams evaluating PRM platforms.',
  keywords: [
    'Sharkdom vs PartnerStack',
    'PartnerStack alternative',
    'partner management comparison'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/compare/sharkdom-vs-partnerstack'
  }
}

export default function SharkdomVsPartnerstackPage() {
  return (
    <div className={plusJakartaSans.className}>
      <ScrollReveal amount={0.15}>
        <PartnerstackHero />
      </ScrollReveal>
      <ScrollReveal>
        <PartnerstackProblemSection />
      </ScrollReveal>
      <ScrollReveal>
        <PartnerstackComparisonTable />
      </ScrollReveal>
      <ScrollReveal>
        <PartnerstackPricingCards />
      </ScrollReveal>
      <ScrollReveal>
        <PartnerstackWhyGrid />
      </ScrollReveal>
      <ScrollReveal>
        <PartnerstackTeamStory />
      </ScrollReveal>
      <ScrollReveal>
        <PartnerstackTrustStrip />
      </ScrollReveal>
      <ScrollReveal>
        <PartnerstackMigrationForm />
      </ScrollReveal>
    </div>
  )
}
