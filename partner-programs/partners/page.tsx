'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useGetAllPartners } from '@/http-hooks/partner-programs'

import { Button } from '@/components/ui/button'
import PageHeader from '@/components/shared/page-header'

import MetricCard from '../_components/metric-card'
import PartnerProgramsSidebar from '../_components/partner-programs-sidebar'
import { ReferralProgramsList } from '../_components/partnerprogram-list'
import ProgramActivePartners from '../_components/program-active-partners'
import ReferralAddPartner from '../_components/referral-add-parnter'

type Props = {}

const PartnerProgramPartnersPage = (props: Props) => {
  const { data } = useGetAllPartners() as any
  const router = useRouter()

  console.log({ data })
  return (
    <div className='flex'>
      <PartnerProgramsSidebar />
      <div className='w-full'>
        <PageHeader
          title='Partners'
          // description='Add subtext about partner programs'
          // actionButtons={<ReferralAddPartner />}
        />
        <div className='p-6'>
          <div className='mb-6 flex w-full items-center gap-5'>
            <MetricCard
              title={'Total Partners'}
              value={data?.summary?.totalPartners?.value}
              change={data?.summary?.totalPartners?.growth}
            />
            <MetricCard
              title={'Average Performance'}
              value={data?.summary?.averagePerformance?.value}
              change={data?.summary?.averagePerformance?.growth}
            />
            <MetricCard
              title={'Total Leads'}
              value={data?.summary?.totalLeads?.value}
              change={data?.summary?.totalLeads?.growth}
            />
          </div>
          <ProgramActivePartners partners={data?.activePartners} />
        </div>
      </div>
    </div>
  )
}

export default PartnerProgramPartnersPage
