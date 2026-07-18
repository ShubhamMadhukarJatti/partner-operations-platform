import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Star } from 'lucide-react'

import { PREFERRED_SECTORS } from '../../../_components/organization-card'
import CertifiedBadge from './CertifiedBadge'

interface CompanyHeaderProps {
  org: any
  match: number
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ org, match }) => {
  return (
    <div className='flex flex-col gap-4 lg:flex-row lg:items-start'>
      {/* Image */}
      <div className='relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white'>
        <Image
          src={
            org?.logoUrl ||
            'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
          }
          fill
          className='object-contain p-2'
          alt={org?.name || 'Company Logo'}
        />
      </div>

      {/* Content */}
      <div className='flex flex-col gap-2'>
        {/* Title Row */}
        <div className='flex flex-wrap items-center gap-3'>
          <h2 className='text-[18px] font-bold text-[#2A3241]'>{org?.name}</h2>
          <CertifiedBadge />
          <button className='text-gray-400 hover:text-yellow-400'>
            <Star size={18} />
          </button>
          {org?.website && (
            <Link
              href={org.website}
              target='_blank'
              className='text-blue-600 hover:text-blue-700'
            >
              <ExternalLink size={18} />
            </Link>
          )}
        </div>

        {/* Description */}
        <p className='text-[14px] text-[#616161]'>
          {org?.briefDescription || org?.about}
        </p>

        {/* Tags */}
        <div className='mt-1 flex flex-wrap gap-2'>
          {org?.sector && (
            <span className='rounded-md border border-[#B2DDFF] bg-[#EFF8FF] px-2 py-0.5 text-xs font-medium lowercase text-[#175CD3] first-letter:uppercase'>
              {PREFERRED_SECTORS?.find((x) => x?.value === org?.sector)?.key ||
                org?.sector ||
                '-'}
            </span>
          )}

          {org?.companyType && (
            <span className='rounded-md border border-[#B2DDFF] bg-[#EFF8FF] px-2 py-0.5 text-xs font-medium text-[#175CD3]'>
              {org?.companyType}
            </span>
          )}

          <span className='rounded-md border border-[#ABEFC6] bg-[#ECFDF3] px-2 py-0.5 text-xs font-medium text-[#067647]'>
            {match}% match
          </span>
        </div>
      </div>
    </div>
  )
}

export default CompanyHeader
