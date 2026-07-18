import ActivePartnershipChart from './active-partnership-chart'
import CompanySizeChart from './company-size-chart'
import MarketSegmentChart from './market-segment-chart'
import PersonaPieChart from './persona-pie-chart'

type Props = {
  personaResultData: any
}

const PersonaAnalytics = (props: Props) => {
  const { personaResultData } = props

  // Destructure the category data for easier access
  const { companySector, marketSegment, companySize, isPartnershipProgram } =
    personaResultData?.category || {}

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-2xl font-bold leading-[29px] text-text-100'>
          Customer Persona Analytics
        </h1>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='grid gap-4 lg:grid-cols-2'>
          {/* Check if companySector data exists */}
          {companySector ? (
            <PersonaPieChart data={companySector} />
          ) : (
            <p className='text-sm text-text-80'>
              No data available for company sector.
            </p>
          )}

          {/* Check if marketSegment data exists */}
          {marketSegment ? (
            <MarketSegmentChart data={marketSegment} />
          ) : (
            <p className='text-sm text-text-80'>
              No data available for market segment.
            </p>
          )}
        </div>

        <div className='grid gap-4 lg:grid-cols-2'>
          {/* Check if companySize data exists */}
          {companySize ? (
            <CompanySizeChart currentPersona={companySize} />
          ) : (
            <p className='text-sm text-text-80'>
              No data available for company size.
            </p>
          )}

          {/* Check if isPartnershipProgram data exists */}
          {isPartnershipProgram ? (
            <ActivePartnershipChart
              active={
                // Calculate True percentage as 100 - False percentage
                100 -
                (isPartnershipProgram.find((item: any) => item.key === 'False')
                  ?.percentage || 0)
              }
              inactive={
                // Get the False percentage directly
                isPartnershipProgram.find((item: any) => item.key === 'False')
                  ?.percentage || 0
              }
            />
          ) : (
            <p className='text-sm text-text-80'>
              No data available for partnership program.
            </p>
          )}
        </div>
      </div>

      {/* Uncomment this section if LearnMore is needed */}
      {/* <LearnMore /> */}
    </div>
  )
}

export default PersonaAnalytics
