import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

import { ScrollReveal } from '../../_components/ScrollReveal'
import CrossbeamComparisonTable from './_components/CrossbeamComparisonTable'
import CrossbeamHero from './_components/CrossbeamHero'
import CrossbeamMigrationForm from './_components/CrossbeamMigrationForm'
import CrossbeamPricingCards from './_components/CrossbeamPricingCards'
import CrossbeamProblemSection from './_components/CrossbeamProblemSection'
import CrossbeamTeamStory from './_components/CrossbeamTeamStory'
import CrossbeamTrustStrip from './_components/CrossbeamTrustStrip'
import CrossbeamWhyGrid from './_components/CrossbeamWhyGrid'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Sharkdom vs Crossbeam | Partner Ops vs Account Mapping',
  description:
    'Crossbeam maps accounts. Sharkdom manages the full partner ops stack — onboarding, deal registration, co-sell pipeline and AI matching. See how they compare side by side.',
  keywords: [
    'Sharkdom vs Crossbeam',
    'Crossbeam alternative',
    'account mapping plus partner ops'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/compare/sharkdom-vs-crossbeam'
  }
}

export default function SharkdomVsCrossbeamPage() {
  return (
    <div className={plusJakartaSans.className}>
      <ScrollReveal amount={0.15}>
        <CrossbeamHero />
      </ScrollReveal>
      <ScrollReveal>
        <CrossbeamProblemSection />
      </ScrollReveal>
      <ScrollReveal>
        <CrossbeamComparisonTable />
      </ScrollReveal>
      <ScrollReveal>
        <CrossbeamPricingCards />
      </ScrollReveal>
      <ScrollReveal>
        <CrossbeamWhyGrid />
      </ScrollReveal>
      <ScrollReveal>
        <CrossbeamTeamStory />
      </ScrollReveal>
      <ScrollReveal>
        <CrossbeamTrustStrip />
      </ScrollReveal>
      <ScrollReveal>
        <CrossbeamMigrationForm />
      </ScrollReveal>
    </div>
  )
}
