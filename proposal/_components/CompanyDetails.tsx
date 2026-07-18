'use client'

import React from 'react'
import Image from 'next/image'

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
  }
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({
  organizationData
}) => {
  if (!organizationData) {
    return <p>No organization details available. Please check your data.</p>
  }

  return (
    <div className='rounded-xl border py-4'>
      <div className='border-b border-l-0 border-r-0 border-t-0 border-[#E4E7EE]'>
        <div className='mx-4 mb-4 flex items-center gap-4'>
          <div className='h-12 w-12 rounded-lg bg-blue-600'>
            {organizationData.logoUrl && (
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
            )}
          </div>
          <div>
            <h2 className='shark-lg font-bold'>{organizationData.name}</h2>
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
        </div>

        <p className='px-4 pb-4 text-[#2A3241]'>
          {organizationData?.briefDescription}
        </p>
      </div>

      <div className='flex items-center border-b border-l-0 border-r-0 border-t-0 border-[#E4E7EE] py-4'>
        <div className='flex items-center gap-1 px-4 text-xs text-[#4D5C78]'>
          <Image src={'/briefcase-icon.svg'} alt='' width={20} height={20} />
          Open for:
        </div>
        <div className='flex flex-wrap gap-2'>
          {organizationData.preferredPartnershipTypes?.map((tag, index) => (
            <span
              key={index}
              className='rounded bg-[#F0F1F2] px-3 py-1 text-xs text-[#2A3241]'
            >
              {tag.area}
            </span>
          ))}
        </div>
      </div>
      <div className='mx-4 flex items-center justify-between pt-4'>
        <div className='flex flex-row gap-1 text-xs'>
          <Image
            src={'/workflow-circle-icon.svg'}
            alt=''
            width={20}
            height={20}
          />
          <span className='text-[#7688A8]'>Accessible APIs</span>
          <span className='font-bold text-[#2A3241]'>
            {organizationData.accessibleApisVisible
              ? 'APIs are visible.'
              : 'APIs are not visible.'}
          </span>
        </div>
        <button className='text-xs text-[#3E50F7]'>Edit</button>
      </div>
    </div>
  )
}

export default CompanyDetails
