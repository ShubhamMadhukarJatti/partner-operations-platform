'use client'

import React from 'react'
import Image from 'next/image'

import UserIcon from '../../../../../public/users.svg'
// import BriefcaseIcon from '../../../../../public/briefcase-icon.svg'
import { PREFERRED_SECTORS } from '../../(dashboard-pages)/_components/organization-card'

interface CompanyDetailsProps {
  organizationData: {
    id: number
    name: string
    briefDescription?: string
    logoUrl?: string
    sector?: string
    preferredPartnershipTypes?: { area: string }[]
    accessibleApisVisible?: boolean
    activePartnerships?: number
  }
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({
  organizationData
}) => {
  console.log('🚀 ~ organizationData:', organizationData)
  if (!organizationData) {
    return <p>No organization details available. Please check your data.</p>
  }

  return (
    <div className='rounded-xl border py-1'>
      <div className='border-[#E4E7EE]'>
        <div className='mx-4 mb-4 flex items-center gap-2'>
          <div className='mt-2'>
            <Image
              src={
                organizationData?.logoUrl ||
                'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
              }
              width={58}
              height={58}
              alt='org-logo'
              className='rounded-lg'
            />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h2 className='shark-lg text-lg font-bold'>
                {organizationData?.name || '-'}
              </h2>
              <div className='flex items-center gap-2 text-xs'>
                {organizationData?.sector && (
                  <span className='rounded bg-[#E5EFFE] px-2 py-1 text-[#2A3241]'>
                    {PREFERRED_SECTORS?.find(
                      (x) => x?.value === organizationData.sector
                    )?.key || '-'}
                  </span>
                )}
              </div>
            </div>
            <div className='mt-1 flex flex-col gap-1'>
              <div className='flex items-center gap-1 text-xs'>
                <Image src={UserIcon} alt='' />
                <span className='font-bold text-[#8A8F9B]'>
                  {organizationData?.activePartnerships}
                </span>
                <span className='text-[#8A8F9B]'>Active Partnerships</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDetails
