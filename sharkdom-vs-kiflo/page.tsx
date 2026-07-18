import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

import { ScrollReveal } from '../../_components/ScrollReveal'
import KifloAdvantageSection from './_components/KifloAdvantageSection'
import KifloComparisonTable from './_components/KifloComparisonTable'
import KifloHero from './_components/KifloHero'
import KifloMigrationForm from './_components/KifloMigrationForm'
import KifloPricingCards from './_components/KifloPricingCards'
import KifloTeamStory from './_components/KifloTeamStory'
import KifloTrustStrip from './_components/KifloTrustStrip'
import KifloWhyGrid from './_components/KifloWhyGrid'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Sharkdom vs Kiflo PRM | Partner Platform Comparison',
  description:
    'Compare Sharkdom and Kiflo PRM on partner portal, CRM sync, marketplace, attribution, pricing, and time to value. Side-by-side breakdown for teams evaluating modern partner ops.',
  keywords: [
    'Sharkdom vs Kiflo',
    'Kiflo alternative',
    'PRM comparison',
    'partner relationship management'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/compare/sharkdom-vs-kiflo'
  }
}

function SharkdomVsKifloPage() {
  return (
    <div className={plusJakartaSans.className}>
      <ScrollReveal amount={0.15}>
        <KifloHero />
      </ScrollReveal>
      <ScrollReveal>
        <KifloAdvantageSection />
      </ScrollReveal>
      <ScrollReveal>
        <KifloComparisonTable />
      </ScrollReveal>
      <ScrollReveal>
        <KifloPricingCards />
      </ScrollReveal>
      <ScrollReveal>
        <KifloWhyGrid />
      </ScrollReveal>
      <ScrollReveal>
        <KifloTeamStory />
      </ScrollReveal>
      <ScrollReveal>
        <KifloTrustStrip />
      </ScrollReveal>
      <ScrollReveal>
        <KifloMigrationForm />
      </ScrollReveal>
    </div>
  )
}

export default SharkdomVsKifloPage
