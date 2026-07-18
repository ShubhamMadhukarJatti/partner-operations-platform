import { Metadata } from 'next'

import { PartnerProgramBenefitsAndMetrics } from './_components/PartnerProgramBenefitsAndMetrics'
import { PartnerProgramCalculator } from './_components/PartnerProgramCalculator'
import { PartnerProgramDashboard } from './_components/PartnerProgramDashboard'
import { PartnerProgramFaq } from './_components/PartnerProgramFaq'
import { PartnerProgramHero } from './_components/PartnerProgramHero'
import { PartnerProgramHowItWorks } from './_components/PartnerProgramHowItWorks'
import { PartnerProgramLogoRow } from './_components/PartnerProgramLogoRow'
import { PartnerProgramPersonas } from './_components/PartnerProgramPersonas'
import { PartnerProgramTestimonials } from './_components/PartnerProgramTestimonials'
import { PartnerProgramTiers } from './_components/PartnerProgramTiers'

export const metadata: Metadata = {
  title: 'Partner Program | Sharkdom',
  description:
    'Turn your GTM expertise into recurring income. Refer companies to Sharkdom and earn commission on every deal you influence.',
  openGraph: {
    title: 'Partner Program | Sharkdom',
    description:
      'Turn your GTM expertise into recurring income. Refer companies to Sharkdom and earn commission on every deal you influence.',
    type: 'website'
  }
}

export default function PartnerProgramPage() {
  return (
    <div className='min-h-screen w-full overflow-x-clip bg-white'>
      {/*
        Do not use overflow-x-hidden: per CSS, when one axis is not visible the other
        becomes 'auto', which clips the hero jumbotron that extends with negative top
        behind the fixed header. overflow-x-clip only clips x while keeping y visible.
      */}
      <PartnerProgramHero />
      <PartnerProgramBenefitsAndMetrics />
      <PartnerProgramPersonas />
      <PartnerProgramTiers />
      <PartnerProgramCalculator />
      <PartnerProgramHowItWorks />
      <PartnerProgramDashboard />
      <PartnerProgramTestimonials />
      <PartnerProgramLogoRow />
      <PartnerProgramFaq />
    </div>
  )
}
