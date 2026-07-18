import React from 'react'

import { Badge } from '@/components/ui/badge'
import RoundedTitleCard from '@/components/shared/rounded-title-card'

type Props = {}

const programPartners = [
  {
    id: 'cloud-solutions',
    name: 'Cloud Solutions Ltd',
    status: 'Active',
    performance: '98%',
    leadsGenerated: '150',
    conversionRate: '65%',
    revenue: '-'
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing Pro',
    status: 'Active',
    performance: '92%',
    leadsGenerated: '120',
    conversionRate: '58%',
    revenue: '-'
  }
]

type PartnerProps = {
  id: string
  name: string
  status: string
  performance: string
  leadsGenerated: string
  conversionRate: string
  revenue: string
}

const MetricItem = ({ label, value }: { label: string; value: string }) => (
  <div className='flex flex-col gap-1'>
    <p className='text-shark-sm text-[#92A0B9]'>{label}</p>
    <p className='text-shark-base font-semibold text-[#181D27]'>{value}</p>
  </div>
)

const PartnerCard = ({ partner }: { partner: PartnerProps }) => {
  return (
    <div className='border-t border-[#E9EAEB] p-6'>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <h3 className='text-shark-lg font-semibold text-[#181D27]'>
              {partner.name}
            </h3>
            <Badge className='border-[#ABEFC6] bg-[#ECFDF3] font-medium text-[#067647]'>
              {partner.status}
            </Badge>
          </div>
          <a
            href='#'
            className='text-shark-sm font-semibold text-primary-blue hover:underline'
          >
            View Profile
          </a>
        </div>

        <div className='grid grid-cols-4 gap-8'>
          <MetricItem label='Performance' value={partner.performance} />
          <MetricItem label='Leads Generated' value={partner.leadsGenerated} />
          <MetricItem label='Conversion Rate' value={partner.conversionRate} />
          <MetricItem label='Revenue' value={partner.revenue} />
        </div>
      </div>
    </div>
  )
}

type ProgramPartnersProps = {
  partners?: PartnerProps[]
  className?: string
}

const ProgramPartners = ({
  partners = programPartners,
  className = ''
}: ProgramPartnersProps) => {
  return (
    <RoundedTitleCard className='' title='Program Partners'>
      <div className='flex flex-col  gap-2'>
        {partners.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>
    </RoundedTitleCard>
  )
}

export default ProgramPartners
