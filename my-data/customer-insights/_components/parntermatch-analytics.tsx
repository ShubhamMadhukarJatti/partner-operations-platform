import React from 'react'

import CompanySizeChart from '../../../customer-persona/_components/company-size-chart'
import MarketSegmentDistribution from './marketsegment-chart'
import SectorDistribution from './sectors-chart'

type Props = {
  personaResultData: any
}

const PartnermatchAnalytics = ({ personaResultData }: Props) => {
  const { companySector, marketSegment, companySize, isPartnershipProgram } =
    personaResultData?.category || {}

  console.log(personaResultData)

  return (
    <div className='space-y-6'>
      <div>
        {companySize ? (
          <CompanySizeChart currentPersona={companySize} />
        ) : (
          <p className='text-sm text-text-80'>
            No data available for company size.
          </p>
        )}
      </div>

      <div className='grid  grid-cols-1 gap-6 lg:grid-cols-2'>
        <MarketSegmentDistribution data={marketSegment} />
        <SectorDistribution data={companySector} />
      </div>
    </div>
  )
}

export default PartnermatchAnalytics
