'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { PartnerProgramPortalScaffold } from '@/app/partner-program-portal-app/_components/PartnerProgramPortalScaffold'
import { usePartnerSession } from '@/app/partner-program-portal-app/_components/PartnerSessionContext'

export type CommissionTier = 'champion' | 'referral'
export type CommissionDealStatus = 'pending' | 'paid'

export type CommissionTableRow = {
  id: string
  company: string
  tier: CommissionTier
  dealAcv: string
  rate: string
  commission: string
  status: CommissionDealStatus
  paymentDate: string
}

interface CommissionStats {
  totalEarned: number
  pendingCommission: number
  nextPayoutDate: string
}

interface CommissionApiRecord {
  id: number
  userId: string
  companyName: string
  partnershipTier: string
  dealAcv: number
  rate: number
  commission: number
  paymentStatus: string
  paymentDate: string
  invoiceUrl: string
  assignedAe: string
}

function TierBadge({ tier }: { tier: CommissionTier }) {
  const champion = tier === 'champion'
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase leading-4 tracking-[0.275px]',
        champion
          ? 'bg-[rgba(245,166,35,0.2)] text-[#B8860B]'
          : 'bg-[#E5E7EB] text-[#4A5565]'
      )}
    >
      {champion ? 'Champion Partner' : 'Referral Partner'}
    </span>
  )
}

function CommissionStatusPill({
  status
}: {
  status: CommissionTableRow['status']
}) {
  if (status === 'paid') {
    return (
      <span className='inline-flex items-center gap-1 rounded-full bg-[rgba(26,122,74,0.15)] px-2.5 py-0.5 text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#1A7A4A]'>
        <Check
          className='size-3.5 shrink-0 text-[#2BA84A]'
          strokeWidth={2.5}
          aria-hidden
        />
        Paid
      </span>
    )
  }
  return (
    <span className='inline-flex rounded-full bg-[rgba(230,126,34,0.15)] px-2.5 py-0.5 text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#E67E22]'>
      Pending
    </span>
  )
}

export function PartnerCommissionView() {
  const { user, token } = usePartnerSession()
  const [stats, setStats] = useState<CommissionStats | null>(null)
  const [commissions, setCommissions] = useState<CommissionApiRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!user?.uid || !token) {
        setLoading(false)
        return
      }

      try {
        const [statsRes, listRes] = await Promise.all([
          fetch(`/api/api/v1/partner/commission/stats/${user.uid}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`/api/api/v1/partner/commissions/${user.uid}?page=0&size=10`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        if (statsRes.ok) {
          const statsJson = await statsRes.json()
          if (statsJson.success) setStats(statsJson.data)
        }

        if (listRes.ok) {
          const listJson = await listRes.json()
          if (listJson.success) setCommissions(listJson.data.content || [])
        }
      } catch (err) {
        console.error('Failed to fetch commissions data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.uid, token])

  const chartData = useMemo(() => {
    const dataByMonth: Record<string, { champion: number; referral: number }> =
      {}

    // Seed the last 6 months for a complete chart
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const formattedMonth = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: '2-digit'
      })
        .format(d)
        .replace(' ', " '") // e.g. "May '26"
      dataByMonth[formattedMonth] = { champion: 0, referral: 0 }
    }

    commissions.forEach((c) => {
      if (!c.paymentDate) return
      const d = new Date(c.paymentDate)
      const formattedMonth = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: '2-digit'
      })
        .format(d)
        .replace(' ', " '")

      if (!dataByMonth[formattedMonth]) {
        dataByMonth[formattedMonth] = { champion: 0, referral: 0 }
      }

      if (c.partnershipTier === 'CHAMPION_PARTNER') {
        dataByMonth[formattedMonth].champion += c.commission
      } else {
        dataByMonth[formattedMonth].referral += c.commission
      }
    })

    const result = Object.entries(dataByMonth).map(([month, vals]) => ({
      month,
      champion: vals.champion,
      referral: vals.referral
    }))

    // Sort chronologically
    result.sort((a, b) => {
      const dateA = new Date('01 ' + a.month.replace("'", '20'))
      const dateB = new Date('01 ' + b.month.replace("'", '20'))
      return dateA.getTime() - dateB.getTime()
    })

    return result
  }, [commissions])

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0)

  return (
    <PartnerProgramPortalScaffold mainClassName='flex-1 overflow-y-auto p-6 pb-28'>
      <div className='mx-auto w-full max-w-[1268px] space-y-6'>
        <h1 className='text-2xl font-bold leading-9 text-[#1A1A2E]'>
          Commission Tracker
        </h1>

        <div className='flex flex-col gap-4 rounded-[10px] border border-[#D9D2EF] bg-white p-4 dark:bg-card sm:flex-row sm:items-center sm:justify-between'>
          <div className='max-w-[544px] space-y-0.5'>
            <p className='text-sm font-bold leading-[21px] text-[#6863FB]'>
              Add a payment method to receive your commissions
            </p>
            <p className='text-[13px] leading-5 text-[#4A5565]'>
              You have {stats ? formatCurrency(stats.pendingCommission) : '$0'}{' '}
              pending. Add your bank details or PayPal to receive your next
              payout.
            </p>
          </div>
          <button
            type='button'
            onClick={() =>
              toast.message('Add payment method (demo — no API yet).')
            }
            className='h-[41px] shrink-0 rounded-[10px] bg-[#6863FB] px-5 text-sm font-bold text-white hover:bg-[#6863FB]/90'
          >
            Add Payment Method →
          </button>
        </div>

        <div
          className={`grid grid-cols-1 gap-4 md:grid-cols-3 ${loading ? 'opacity-70 transition-opacity' : ''}`}
        >
          <div className='flex flex-col gap-1 rounded-[14px] border border-[#F3F4F6] bg-white p-[21px] pb-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] dark:bg-card'>
            <p className='text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-[#6A7282]'>
              Total Earned (all time)
            </p>
            <p className='text-[32px] font-extrabold leading-[48px] text-[#6863FB]'>
              {stats ? formatCurrency(stats.totalEarned) : '$0'}
            </p>
            <p className='text-xs font-normal leading-[18px] text-[#99A1AF]'>
              All-time total
            </p>
          </div>
          <div className='flex flex-col gap-1 rounded-[14px] border border-[#F3F4F6] bg-white p-[21px] pb-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] dark:bg-card'>
            <p className='text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-[#6A7282]'>
              Pending Commission
            </p>
            <p className='text-[32px] font-extrabold leading-[48px] text-[#6863FB]'>
              {stats ? formatCurrency(stats.pendingCommission) : '$0'}
            </p>
            <p className='text-xs font-normal leading-[18px] text-[#99A1AF]'>
              Expected within 30 days
            </p>
          </div>
          <div className='flex flex-col gap-1 rounded-[14px] border border-[#F3F4F6] bg-white p-[21px] pb-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] dark:bg-card'>
            <p className='text-xs font-bold uppercase leading-[18px] tracking-[0.3px] text-[#6A7282]'>
              Next Payout Date
            </p>
            <p className='text-[32px] font-extrabold leading-[48px] text-[#1A1A2E]'>
              {stats?.nextPayoutDate || '-'}
            </p>
            <p className='text-xs font-normal leading-[18px] text-[#99A1AF]'>
              Payment processed on 1st of each month
            </p>
          </div>
        </div>

        <div className='rounded-[14px] border border-[#F3F4F6] bg-white p-6 pb-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] dark:bg-card'>
          <h2 className='text-base font-bold leading-6 text-[#1A1A2E]'>
            Monthly Earnings
          </h2>
          <div className='mt-4 h-[250px] w-full min-w-0'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
                barCategoryGap='18%'
                barGap={4}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='#E5E7EB'
                />
                <XAxis
                  dataKey='month'
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#666666' }}
                />
                <YAxis
                  domain={[0, 6000]}
                  ticks={[0, 2000, 3000, 5000, 6000]}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#666666' }}
                  tickFormatter={(v) => (v === 0 ? '$0k' : `$${v / 1000}k`)}
                />
                <Tooltip
                  formatter={(value: number) =>
                    `$${value.toLocaleString('en-US')}`
                  }
                  labelStyle={{ color: '#1A1A2E', fontWeight: 600 }}
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    fontSize: 12
                  }}
                />
                <Bar
                  dataKey='champion'
                  name='Champion Tier'
                  fill='#6863FB'
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey='referral'
                  name='Referral Tier'
                  fill='#D1D5DB'
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className='mt-6 flex flex-wrap items-center justify-center gap-8'>
            <div className='flex items-center gap-2'>
              <span
                className='size-3.5 shrink-0 rounded-sm bg-[#6863FB]'
                aria-hidden
              />
              <span className='text-base leading-6 text-[#6863FB]'>
                Champion Tier
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <span
                className='size-3.5 shrink-0 rounded-sm bg-[#D1D5DB]'
                aria-hidden
              />
              <span className='text-base leading-6 text-[#D1D5DB]'>
                Referral Tier
              </span>
            </div>
          </div>
        </div>

        <div className='overflow-hidden rounded-[14px] border border-[#F3F4F6] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] dark:bg-card'>
          <div className='w-full overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='h-[41px] border-[#F3F4F6] hover:!bg-transparent focus:!bg-transparent'>
                  <TableHead className='whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                    Company
                  </TableHead>
                  <TableHead className='whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                    Tier
                  </TableHead>
                  <TableHead className='whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                    Deal ACV
                  </TableHead>
                  <TableHead className='whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                    Rate
                  </TableHead>
                  <TableHead className='whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                    Commission
                  </TableHead>
                  <TableHead className='whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                    Status
                  </TableHead>
                  <TableHead className='whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                    Payment Date
                  </TableHead>
                  <TableHead className='w-[110px]'>
                    <span className='sr-only'>Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.length === 0 && !loading && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className='py-8 text-center text-sm text-[#6A7282]'
                    >
                      No commissions found.
                    </TableCell>
                  </TableRow>
                )}
                {commissions.map((row) => (
                  <TableRow
                    key={row.id}
                    className='h-[53px] border-[#F9FAFB] hover:bg-[#F9FAFB] dark:bg-muted/50'
                  >
                    <TableCell className='py-4 text-sm font-medium text-[#0A0A0A]'>
                      {row.companyName}
                    </TableCell>
                    <TableCell className='py-4'>
                      <TierBadge
                        tier={
                          row.partnershipTier === 'CHAMPION_PARTNER'
                            ? 'champion'
                            : 'referral'
                        }
                      />
                    </TableCell>
                    <TableCell className='py-4 text-sm text-[#4A5565]'>
                      {formatCurrency(row.dealAcv)}
                    </TableCell>
                    <TableCell className='py-4 text-sm text-[#4A5565]'>
                      {row.rate}%
                    </TableCell>
                    <TableCell className='py-4 text-sm font-bold text-[#1A7A4A]'>
                      {formatCurrency(row.commission)}
                    </TableCell>
                    <TableCell className='py-4'>
                      <CommissionStatusPill
                        status={
                          row.paymentStatus === 'PAID' ? 'paid' : 'pending'
                        }
                      />
                    </TableCell>
                    <TableCell className='py-4 text-[13px] text-[#99A1AF]'>
                      {row.paymentDate
                        ? new Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }).format(new Date(row.paymentDate))
                        : '-'}
                    </TableCell>
                    <TableCell className='py-4 text-right'>
                      <button
                        type='button'
                        className='inline-flex h-7 min-w-[99px] items-center justify-center rounded-[10px] border border-[#D1D5DC] px-2 text-xs font-bold leading-[18px] text-[#4A5565] hover:bg-[#F9FAFB] dark:bg-muted'
                        onClick={() => {
                          if (row.invoiceUrl) {
                            window.open(row.invoiceUrl, '_blank')
                          } else {
                            toast.message('No invoice available.')
                          }
                        }}
                      >
                        View Invoice
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </PartnerProgramPortalScaffold>
  )
}
