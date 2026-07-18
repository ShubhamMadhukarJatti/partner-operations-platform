'use client'

import { useEffect, useState } from 'react'

import { usePartnerSession } from '@/app/partner-program-portal-app/_components/PartnerSessionContext'

export type KpiItem = {
  label: string
  value: string
  sublabel?: string
  valueColorClass?: string
}

const cardShadow =
  'shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]'

interface DashboardStatsResponse {
  success: boolean
  message: string
  data: {
    totalLeadsSubmitted: number
    leadsInProgress: number
    commissionEarned: number
    commissionPending: number
  }
}

export function PartnerPortalKpiCards() {
  const { user, token } = usePartnerSession()
  const [items, setItems] = useState<KpiItem[]>([
    {
      label: 'Total Leads Submitted',
      value: '0',
      sublabel: ''
    },
    {
      label: 'Leads In Progress',
      value: '0',
      valueColorClass: 'text-[#1A6AB5]'
    },
    {
      label: 'Commission Earned',
      value: '$0',
      sublabel: 'All-time total',
      valueColorClass: 'text-[#2563EB]'
    },
    {
      label: 'Commission Pending',
      value: '$0',
      sublabel: 'Awaiting payment',
      valueColorClass: 'text-[#2563EB]'
    }
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (!user?.uid || !token) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(
          `/api/api/v1/partner/dashboard/stats/${user.uid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (!res.ok) {
          throw new Error('Failed to fetch stats')
        }

        const json = (await res.json()) as DashboardStatsResponse

        if (json.success && json.data) {
          const {
            totalLeadsSubmitted,
            leadsInProgress,
            commissionEarned,
            commissionPending
          } = json.data

          setItems([
            {
              label: 'Total Leads Submitted',
              value: String(totalLeadsSubmitted || 0),
              sublabel: ''
            },
            {
              label: 'Leads In Progress',
              value: String(leadsInProgress || 0),
              valueColorClass: 'text-[#1A6AB5]'
            },
            {
              label: 'Commission Earned',
              value: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              }).format(commissionEarned || 0),
              sublabel: 'All-time total',
              valueColorClass: 'text-[#2563EB]'
            },
            {
              label: 'Commission Pending',
              value: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              }).format(commissionPending || 0),
              sublabel: 'Awaiting payment',
              valueColorClass: 'text-[#2563EB]'
            }
          ])
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user?.uid, token])

  return (
    <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {items.map((k) => (
        <div
          key={k.label}
          className={`flex flex-col gap-1 rounded-[14px] border border-[#F3F4F6] bg-white py-[21px] pb-px pl-[21px] pr-[21px] dark:bg-card ${cardShadow} ${loading ? 'opacity-70 transition-opacity' : ''}`}
        >
          <p className='text-[12px] font-bold uppercase leading-[18px] tracking-[0.3px] text-[#6A7282]'>
            {k.label}
          </p>
          <p
            className={`text-[32px] font-extrabold leading-[48px] ${k.valueColorClass ?? 'text-[#1A1A2E]'}`}
          >
            {k.value}
          </p>
          {k.sublabel ? (
            <p className='text-[12px] font-normal leading-[18px] text-[#53637F]'>
              {k.sublabel}
            </p>
          ) : (
            <div className='h-[18px]' />
          )}
        </div>
      ))}
    </div>
  )
}
