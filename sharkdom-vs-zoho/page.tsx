import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

import { ScrollReveal } from '../../_components/ScrollReveal'
import ZohoAdvantageSection from './_components/ZohoAdvantageSection'
import ZohoComparisonTable from './_components/ZohoComparisonTable'
import ZohoHero from './_components/ZohoHero'
import ZohoMigrationForm from './_components/ZohoMigrationForm'
import ZohoPricingCards from './_components/ZohoPricingCards'
import ZohoTeamStory from './_components/ZohoTeamStory'
import ZohoTrustStrip from './_components/ZohoTrustStrip'
import ZohoWhyGrid from './_components/ZohoWhyGrid'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Sharkdom vs Zoho CRM | Partner Platform Comparison',
  description:
    'Compare Sharkdom and Zoho CRM on partner portal, CRM sync, marketplace, attribution, pricing, and time to value. Side-by-side breakdown for teams evaluating modern partner ops.',
  keywords: [
    'Sharkdom vs Zoho',
    'Zoho alternative',
    'CRM comparison',
    'partner relationship management'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/compare/sharkdom-vs-zoho'
  }
}

function SharkdomVsZohoPage() {
  return (
    <div className={plusJakartaSans.className}>
      <ScrollReveal amount={0.15}>
        <ZohoHero />
      </ScrollReveal>
      <ScrollReveal>
        <ZohoAdvantageSection />
      </ScrollReveal>
      <ScrollReveal>
        <ZohoComparisonTable />
      </ScrollReveal>
      <ScrollReveal>
        <ZohoPricingCards />
      </ScrollReveal>
      <ScrollReveal>
        <ZohoWhyGrid />
      </ScrollReveal>
      <ScrollReveal>
        <ZohoTeamStory />
      </ScrollReveal>
      <ScrollReveal>
        <ZohoTrustStrip />
      </ScrollReveal>
      <ScrollReveal>
        <ZohoMigrationForm />
      </ScrollReveal>
    </div>
  )
}

export default SharkdomVsZohoPage
