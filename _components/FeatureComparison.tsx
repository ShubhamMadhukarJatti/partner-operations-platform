import React from 'react'
import Link from 'next/link'
import { CheckCircle2, ChevronRight, CircleX } from 'lucide-react'

interface FeatureComparisonProps {
  showPartnerstack?: boolean
  showCrossbeam?: boolean
  showSharkdom?: boolean
  showImpartner?: boolean
  showPartnerInsight?: boolean
  heading: string
  description: string
}

const FeatureComparison: React.FC<FeatureComparisonProps> = ({
  showPartnerstack = false,
  showCrossbeam = false,
  showSharkdom = false,
  showImpartner = false,
  showPartnerInsight = false,
  heading,
  description
}) => {
  return (
    <section className='bg-white py-16' id='feature-comparison'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <p className='pb-3 text-center uppercase text-[#474747]'>
          COMPARING THE FEATURES
        </p>
        <h2 className='mb-4 text-center text-3xl font-bold text-[#0B0B0B] sm:text-4xl'>
          {heading}
        </h2>
        <p className='mb-12 text-center text-[#474747]'>{description}</p>

        <div className='overflow-x-auto'>
          <table className='min-w-full table-auto border-collapse overflow-auto text-center'>
            {/* Table Header */}
            <thead className='rounded-t-lg bg-[#F5F5F7]'>
              <tr>
                <th className='w-1/4 border border-[#DDDDDD] px-6 py-4'></th>
                {showPartnerstack && (
                  <th className='w-1/4 border border-[#DDDDDD] px-6 py-4'>
                    PartnerStack
                  </th>
                )}
                {showCrossbeam && (
                  <th className='w-1/4 border border-[#DDDDDD] px-6 py-4'>
                    Crossbeam
                  </th>
                )}
                {showImpartner && (
                  <th className='w-1/4 border border-[#DDDDDD] px-6 py-4'>
                    Impartner
                  </th>
                )}
                {showPartnerInsight && (
                  <th className='w-1/4 border border-[#DDDDDD] px-6 py-4'>
                    PartnerInsight
                  </th>
                )}
                {showSharkdom && (
                  <th className='w-1/4 border border-[#DDDDDD] px-6 py-4'>
                    Sharkdom
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {featureRows.map((row, index) => (
                <tr key={index} className='border border-[#DDDDDD]'>
                  <td className='border-r border-[#DDDDDD] bg-[#F5F5F7] px-6 py-4 font-bold'>
                    {row.feature}
                  </td>
                  {showPartnerstack && (
                    <td className='border-r border-[#DDDDDD] px-6 py-4'>
                      {row.partnerStack}
                    </td>
                  )}
                  {showCrossbeam && (
                    <td className='border-r border-[#DDDDDD] px-6 py-4'>
                      {row.crossbeam}
                    </td>
                  )}
                  {showImpartner && (
                    <td className='border-r border-[#DDDDDD] px-6 py-4'>
                      {row.impartner}
                    </td>
                  )}
                  {showPartnerInsight && (
                    <td className='border-r border-[#DDDDDD] px-6 py-4'>
                      {row.partnerInsight}
                    </td>
                  )}
                  {showSharkdom && (
                    <td className='border-r border-[#DDDDDD] px-6 py-4'>
                      {row.sharkdom}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='mt-8 text-center'>
          <Link
            href={'/book-demo'}
            className='mx-auto flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700'
          >
            Talk to the team
            <ChevronRight />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeatureComparison

// Define the feature rows outside the component for better readability and reusability
const featureRows = [
  {
    feature: 'Account Claim',
    partnerStack: 'Mandatory',
    crossbeam: 'Free to Signup',
    impartner: 'Mandatory',
    partnerInsight: 'Mandatory',
    sharkdom: 'Free to Signup'
  },
  {
    feature: 'Offline Partners',
    partnerStack: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    crossbeam: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    ),
    impartner: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    partnerInsight: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    sharkdom: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        In-built
      </div>
    )
  },
  {
    feature: 'Partner Verification (QOP)',
    partnerStack: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    crossbeam: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    impartner: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    partnerInsight: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    sharkdom: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        In-built
      </div>
    )
  },
  {
    feature: 'Account Mapping',
    partnerStack: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    crossbeam: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    ),
    impartner: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    partnerInsight: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    sharkdom: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    )
  },
  {
    feature: 'Partner Registration',
    partnerStack: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    ),
    crossbeam: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    ),
    impartner: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    ),
    partnerInsight: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Not Available
      </div>
    ),
    sharkdom: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        In-built
      </div>
    )
  },
  {
    feature: 'Integrations',
    partnerStack: '15',
    crossbeam: '20',
    impartner: '24',
    partnerInsight: '7',
    sharkdom: '29'
  },
  {
    feature: 'Customers',
    partnerStack: 'Mid-Stage, Large companies',
    crossbeam: 'Mid-Stage, Large Companies',
    impartner: 'Mid-Stage, Large Companies',
    partnerInsight: 'Mid-Stage, Large Companies',
    sharkdom: 'All Types'
  },
  {
    feature: 'Affiliate Program',
    partnerStack: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    ),
    crossbeam: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    impartner: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    partnerInsight: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    ),
    sharkdom: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    )
  },
  {
    feature: 'Partner Enablement',
    partnerStack: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    ),
    crossbeam: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    impartner: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    ),
    partnerInsight: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    ),
    sharkdom: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    )
  },
  {
    feature: 'Pricing Comparison',
    partnerStack: 'Commission based',
    crossbeam: 'Starting @150$',
    impartner: 'Starting @199$',
    partnerInsight: 'Commision based',
    sharkdom: 'Starting @9$'
  },
  {
    feature: 'Max Seats',
    partnerStack: '2',
    crossbeam: '3',
    impartner: '2',
    partnerInsight: '2',
    sharkdom: '10'
  },
  {
    feature: 'API',
    partnerStack: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    crossbeam: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    ),
    impartner: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    partnerInsight: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    sharkdom: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        In-built
      </div>
    )
  },
  {
    feature: 'Target Audience',
    partnerStack: 'Bloggers, Growth Teams',
    crossbeam: 'Sales and Partnership Teams',
    impartner: 'Bloggers, Growth Teams',
    partnerInsight: 'Bloggers, Growth Teams',
    sharkdom:
      'Founding Members (co-founders, CxOs), Partnership Team, Sales Team, Growth Team'
  },
  {
    feature: 'Customer Support',
    partnerStack: 'Email',
    crossbeam: 'Email',
    impartner: 'Email',
    partnerInsight: 'Email',
    sharkdom: '24x7'
  },
  {
    feature: 'Partner Recognition Kit',
    partnerStack: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    crossbeam: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    impartner: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    partnerInsight: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    sharkdom: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    )
  },
  {
    feature: 'Partner Recruitment',
    partnerStack: 'Up to some extent',
    crossbeam: 'Up to some extent',
    impartner: 'Up to some extent',
    partnerInsight: 'Up to some extent',
    sharkdom: '100% Customizable based on the requirement'
  }
]
