import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

import { ScrollReveal } from '../../_components/ScrollReveal'
import ImpartnerAdvantageSection from './_components/ImpartnerAdvantageSection'
import ImpartnerComparisonTable from './_components/ImpartnerComparisonTable'
import ImpartnerHero from './_components/ImpartnerHero'
import ImpartnerMigrationForm from './_components/ImpartnerMigrationForm'
import ImpartnerPricingCards from './_components/ImpartnerPricingCards'
import ImpartnerTeamStory from './_components/ImpartnerTeamStory'
import ImpartnerTrustStrip from './_components/ImpartnerTrustStrip'
import ImpartnerWhyGrid from './_components/ImpartnerWhyGrid'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Sharkdom vs Impartner | Built for SaaS vs Enterprise PRM',
  description:
    'Impartner is enterprise PRM. Sharkdom is built for SaaS teams that want speed. Compare pricing setup time features and partner activation side by side.',
  keywords: [
    'Sharkdom vs Impartner',
    'Impartner alternative',
    'PRM for SaaS startups'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/compare/sharkdom-vs-impartner'
  }
}

function SharkdomVsImpartnerPage() {
  return (
    <div className={plusJakartaSans.className}>
      <ScrollReveal amount={0.15}>
        <ImpartnerHero />
      </ScrollReveal>
      <ScrollReveal>
        <ImpartnerAdvantageSection />
      </ScrollReveal>
      <ScrollReveal>
        <ImpartnerComparisonTable />
      </ScrollReveal>
      <ScrollReveal>
        <ImpartnerPricingCards />
      </ScrollReveal>
      <ScrollReveal>
        <ImpartnerWhyGrid />
      </ScrollReveal>
      <ScrollReveal>
        <ImpartnerTeamStory />
      </ScrollReveal>
      <ScrollReveal>
        <ImpartnerTrustStrip />
      </ScrollReveal>
      <ScrollReveal>
        <ImpartnerMigrationForm />
      </ScrollReveal>
    </div>
  )
}

export default SharkdomVsImpartnerPage
