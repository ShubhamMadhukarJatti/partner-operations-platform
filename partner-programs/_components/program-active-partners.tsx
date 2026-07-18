'use client'

import { useRouter } from 'next/navigation'
import { Globe, Mail } from 'lucide-react'
import { routeros } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Sample data based on the screenshot
const activePartners = [
  {
    id: 'cloud-solutions',
    name: 'Cloud Solutions Ltd',
    status: 'Active',
    website: 'www.cloudsolutions.com',
    email: 'partnerships@cloudsolutions.com',
    performance: '98%',
    referrals: '250',
    impressions: 'Impressions'
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing Pro',
    status: 'Active',
    website: 'https://www.digitalmarketing.pro/',
    email: 'hello@digitalmarketing.pro',
    performance: '92%',
    referrals: '180',
    impressions: 'Impressions'
  }
]

type PartnerProps = {
  id: string
  name: string
  status: string
  website: string
  email: string
  performance: string
  referrals: string
  impressions: string
}

const PartnerCard = ({ partner }: { partner: PartnerProps }) => {
  const router = useRouter()
  return (
    <div className='border-b border-[#E9EAEB] p-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <h3 className='text--shark-lg font-semibold text-[#181D27]'>
              {partner.name}
            </h3>
            <Badge className='border-[#ABEFC6] bg-[#ECFDF3] font-medium text-[#067647]'>
              {partner.status}
            </Badge>
          </div>

          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-2 text-[#535862]'>
              <Globe className='h-4 w-4 text-[#92A0B9]' />
              <a
                href={`https://${partner.website}`}
                className='text--shark-sm hover:underline'
              >
                {partner.website}
              </a>
            </div>
            <div className='flex items-center gap-2 text-[#535862]'>
              <Mail className='h-4 w-4 text-[#92A0B9]' />
              <a
                href={`mailto:${partner.email}`}
                className='text-shark-sm hover:underline'
              >
                {partner.email}
              </a>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-6 md:gap-12'>
          <div className='flex flex-col items-center'>
            <p className='text-shark-sm text-[#92A0B9]'>Performance</p>
            <p className='text--shark-lg font-semibold text-[#181D27]'>
              {partner.performance}%
            </p>
          </div>
          <div className='flex flex-col items-center'>
            <p className='text-shark-sm text-[#92A0B9]'>Referrals</p>
            <p className='fds-text-lead-semibold text-[#181D27]'>
              {partner.referrals}
            </p>
          </div>
          <div className='flex flex-col items-center'>
            <p className='text-shark-sm text-[#92A0B9]'>Impressions</p>
            <p className='fds-text-lead-semibold text-[#181D27]'>
              {partner.impressions}
            </p>
          </div>
          <Button
            variant='link'
            className='text--shark-sm font-semibold text-primary-blue'
            onClick={() =>
              router.push(`/partner-programs/partners/${partner.id}`)
            }
          >
            View Profile
          </Button>
        </div>
      </div>
    </div>
  )
}

type ProgramActivePartnersProps = {
  partners?: PartnerProps[]
}

export default function ProgramActivePartners({
  partners
}: ProgramActivePartnersProps) {
  return (
    <div className='rounded-lg border border-[#E9EAEB]'>
      <div className='border-b border-[#E9EAEB] p-4'>
        <h2 className='fds-text-semibold text-[#181D27]'>Active Partners</h2>
      </div>
      {partners?.map((partner) => (
        <PartnerCard key={partner.id} partner={partner} />
      ))}
    </div>
  )
}
