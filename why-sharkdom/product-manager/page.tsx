import React from 'react'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { CheckCircle2, CircleX } from 'lucide-react'

import PartnerCompanies from '../../compare/_components/PartnerCompanies'
import ChallengesSection from './_components/ChallangesSection'
import FounderBanner from './_components/FounderBanner'
import Header from './_components/Header'
import MigrationForm from './_components/MigrationForm'
import Overview from './_components/Overview'
import Table from './_components/Table'
import WhySharkdom from './_components/WhySharkdom'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'], // Specify subsets you need
  weight: ['400', '500', '600', '700'], // Add the required font weights
  variable: '--font-plus-jakarta' // Optional: Custom CSS variable
})

function Founder() {
  return (
    <div className={plusJakartaSans.className}>
      <Header />
      <Overview />
      <ChallengesSection />
      <Table />
      <WhySharkdom />
      <FounderBanner />
      <PartnerCompanies />
      <MigrationForm />
    </div>
  )
}

export default Founder
