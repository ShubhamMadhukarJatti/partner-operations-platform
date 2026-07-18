'use client'

import React, { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js'
import { ChevronDown, Mail } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import {
  EmailEventSummary,
  fetchMailboxClaimStatus,
  getEmailEventSummary
} from '@/lib/db/email-outreach'
import { getServerUser } from '@/lib/server'
import { Button } from '@/components/ui/button'

import EmailSentIcon from '../../../../../../public/sentemailCard-icon.svg'
import DraftsPage from './DraftBox'
import EmailComposer, { EmailData } from './EmailComposer'
import EmptyEmailsPage from './EmptyPlaceholder'
import MultiSelectDropdown from './MultiOptionDropdown'
import TimeframeDropdown from './TimeFrameDropdown'

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false
})

interface Partner {
  orgId: number
  name: string
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

type StatCardProps = {
  title: string
  valueText: string
  deltaText?: string
  smallLabel?: string
  deltaPositive?: boolean
  miniData?: number[]
  color?: string
  value?: string
  showChart?: boolean
  imageSrc?: any
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  valueText,
  deltaText,
  smallLabel,
  deltaPositive = true,
  miniData = [],
  color = '#16A34A',
  value,
  showChart = true,
  imageSrc
}) => {
  // If showChart is false (Email Sent), we won't render the sparkline
  const data = {
    labels: miniData.map((_, i) => i),
    datasets: [
      {
        data: miniData,
        fill: true,
        // translucent fill
        backgroundColor: `${color}33`,
        borderColor: color,
        tension: 0.35,
        pointRadius: 0
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { display: false }, y: { display: false } },
    plugins: { legend: { display: false }, tooltip: { enabled: false } }
  }

  return (
    <div className='rounded-2xl bg-white p-4'>
      <div className='text-base font-medium'>{title}</div>

      <div className='my-2 flex items-baseline gap-3 '>
        <div
          className={`text-2xl font-extrabold ${
            !showChart
              ? 'text-black'
              : title === 'Bounce Rate'
                ? 'text-red-600'
                : valueText === '0'
                  ? 'text-gray-500'
                  : 'text-green-600'
          }`}
        >
          {valueText}%
        </div>

        {deltaText && (
          <div
            className={`text-sm font-semibold ${
              !showChart
                ? 'text-black'
                : deltaPositive
                  ? 'text-green-600'
                  : 'text-red-600'
            }`}
          >
            {deltaText}
          </div>
        )}
      </div>

      {smallLabel && (
        <div className='flex text-xs text-gray-400'>
          <strong className='pr-1'>{value}</strong>
          {smallLabel}
        </div>
      )}

      <div className='mt-2 flex h-28 items-center justify-center'>
        {showChart ? (
          <div className='h-full w-full'>
            <Line data={data} options={options} />
          </div>
        ) : imageSrc ? (
          // For "Email Sent" we show the image/icon centered instead of a chart
          <div className='flex h-full w-full items-center '>
            <Image
              src={imageSrc}
              alt='email'
              height={120}
              width={120}
              className='max-h-32 object-contain'
            />
          </div>
        ) : (
          <div className='text-xs text-gray-400'>—</div>
        )}
      </div>
    </div>
  )
}

const Select: React.FC<{
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}> = ({ label, options, value, onChange }) => (
  <div className='flex items-center gap-2'>
    <div className='text-xs text-gray-500'>{label}:</div>
    <div className='relative'>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='appearance-none rounded-full border border-gray-200 bg-white px-4 py-2 pr-8 text-sm  focus:outline-none'
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <div className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400'>
        <ChevronDown size={16} />
      </div>
    </div>
  </div>
)

const StatsDashboard: React.FC<{
  isClaimed: boolean
  isLoading: boolean
  org: any | null
}> = ({ isClaimed, isLoading, org }) => {
  const [partners, setPartners] = useState<{ id: number; label: string }[]>([])
  const [segments, setSegments] = useState<{ id: number; label: string }[]>([
    { id: 1, label: 'Total partners' },
    { id: 2, label: 'Reliable partner' },
    { id: 3, label: 'Steady partner' },
    { id: 4, label: 'Low impact partner' },
    { id: 5, label: 'Inactive partner' }
  ])
  const [partnersLoading, setPartnersLoading] = useState(false)
  const [selected, setSelected] = useState<Array<string | number>>([])
  const [selectedSegment, setSelectedSegment] = useState<
    Array<string | number>
  >([])
  const [range, setRange] = useState<DateRange | undefined>()
  const [showEmailComposer, setShowEmailComposer] = useState(false)
  const [emailStats, setEmailStats] = useState<EmailEventSummary | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  // Fetch partners from API
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setPartnersLoading(true)

        const response = await fetch('/api/active-partners', {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Ensure cookies are sent with the request
        })
        if (!response.ok) {
          throw new Error('Failed to fetch active partners')
        }
        const data: Partner[] = await response.json()

        // Transform the data to match the format needed for MultiSelectDropdown
        const transformedPartners = data.map((partner) => ({
          id: partner.orgId,
          label: partner.name
        }))

        setPartners(transformedPartners)
        setSelected(transformedPartners.map((partner) => partner.id))
      } catch (error) {
        console.error('Error fetching partners:', error)
        setPartners([])
      } finally {
        setPartnersLoading(false)
      }
    }

    fetchPartners()
  }, [])

  // Fetch email statistics when a partner is selected
  useEffect(() => {
    const fetchEmailStats = async () => {
      if (selected.length === 0) {
        setEmailStats(null)
        return
      }

      try {
        setStatsLoading(true)

        if (isClaimed) {
          // Use the new API endpoint when mailbox is claimed
          const { token } = await getServerUser()
          // console.log("t1")
          const response = await fetch(
            '/api/email/outreach/message/event/summary',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
              },
              credentials: 'include',
              body: JSON.stringify(selected.map((id) => Number(id)))
            }
          )
          // console.log("response : ", response)
          // console.log("t1 pass")
          if (!response.ok) {
            throw new Error('Failed to fetch email statistics')
          }

          const stats = await response.json()
          setEmailStats(stats)
        } else {
          // Use the existing method when mailbox is not claimed
          const collaborationId = Number(selected[0])
          const stats = await getEmailEventSummary(collaborationId)
          setEmailStats(stats)
        }
      } catch (error) {
        console.error('Error fetching email statistics:', error)
        setEmailStats(null)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchEmailStats()
  }, [selected, isClaimed])

  const handleSendEmail = async (emailData: EmailData) => {
    try {
      // Use different endpoint based on whether it's an external partner
      const endpoint = emailData.externalPartnerCode
        ? '/api/email/outreach/message/send/external/partner'
        : '/api/email/outreach/message/send'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent with the request
        body: JSON.stringify(emailData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send email')
      }

      const result = await response.json()
      console.log('Email sent successfully:', result)
      // You can add a success notification here
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  }

  const bigData = useMemo(
    () => ({
      labels: ['AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN'],
      datasets: [
        {
          label: 'Engagement',
          data: emailStats
            ? [
                emailStats.opened || 0,
                emailStats.clicked || 0,
                emailStats.delivered || 0,
                emailStats.bounced || 0,
                emailStats.complained || 0,
                emailStats.unsubscribed || 0
              ]
            : [0, 0, 0, 0, 0, 0],
          fill: true,
          backgroundColor: 'rgba(34,197,94,0.15)',
          borderColor: '#22c55e',
          tension: 0.35
        }
      ]
    }),
    [emailStats]
  )

  const bigOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#eee' } }
    }
  }

  // If EmailComposer is open, show it as a full-page view
  if (showEmailComposer) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <EmailComposer
          isModal={false}
          onClose={() => setShowEmailComposer(false)}
          onSend={handleSendEmail}
        />
      </div>
    )
  }

  return (
    <>
      <div className='flex justify-between bg-white'>
        <div className='flex items-center gap-2 p-2 text-sm'>
          <Mail className='h-5 w-5 text-blue-700' strokeWidth={1.8} />
          <span className='text-blue-700'>{org?.name}@sharkdom.com</span>
        </div>

        <div className='m-2 flex gap-4'>
          {/* <Button
            variant='outline'
            className='flex w-full items-center justify-center gap-2 rounded-lg border border-[#3E50F7] px-4 py-2 text-sm font-semibold text-[#3E50F7] transition-colors '
          >
            Use Template
          </Button> */}
          {isClaimed && (
            <Button
              variant='primary'
              onClick={() => setShowEmailComposer(true)}
              className='flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-base font-semibold'
            >
              Compose Email
              <Mail className='h-5 w-5' />
            </Button>
          )}
        </div>
      </div>
      <div className='min-h-screen p-2 md:p-4'>
        <div className='mb-4 flex flex-wrap gap-4 p-4 md:p-1'>
          <MultiSelectDropdown
            options={partners}
            value={selected}
            onChange={(v) => setSelected(v)}
            placeholder={
              partnersLoading ? 'Loading partners...' : 'Partners: All Partners'
            }
            maxChipsToShow={4}
          />
          {/* <MultiSelectDropdown
            options={segments}
            value={selectedSegment}
            onChange={(v) => setSelectedSegment(v)}
            placeholder='Segment: All Segment'
            maxChipsToShow={4}
          /> */}
          {/* <TimeframeDropdown value={range} onChange={(r) => setRange(r)} /> */}
        </div>

        {statsLoading && (
          <div className='mb-4 text-center text-sm text-gray-500'>
            Loading email statistics...
          </div>
        )}

        <div className='grid grid-cols-1 gap-4 lg:grid-cols-12'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7'>
            <StatCard
              title='Open Rate'
              valueText={`${emailStats?.openRate ?? 0}`}
              deltaText='+0% Since last week'
              value={`${emailStats?.opened ?? 0}/${emailStats?.totalEmails ?? 0}`}
              smallLabel='emails opened'
              miniData={
                emailStats
                  ? [
                      emailStats.opened || 0,
                      emailStats.delivered || 0,
                      emailStats.clicked || 0,
                      emailStats.bounced || 0,
                      emailStats.complained || 0
                    ]
                  : [0, 0, 0, 0, 0]
              }
            />
            <StatCard
              title='Click Rate'
              valueText={`${emailStats?.clickRate ?? 0}`}
              deltaText='+0% Since last week'
              value={`${emailStats?.clicked ?? 0}/${emailStats?.totalEmails ?? 0}`}
              smallLabel='emails clicked'
              miniData={
                emailStats
                  ? [
                      emailStats.clicked || 0,
                      emailStats.opened || 0,
                      emailStats.delivered || 0,
                      emailStats.bounced || 0,
                      emailStats.unsubscribed || 0
                    ]
                  : [0, 0, 0, 0, 0]
              }
            />
            <StatCard
              title='Bounce Rate'
              valueText={`${emailStats && emailStats.totalEmails > 0 ? ((emailStats.bounced / emailStats.totalEmails) * 100).toFixed(1) : 0}`}
              deltaPositive={false}
              value={`${emailStats?.bounced ?? 0}/${emailStats?.totalEmails ?? 0}`}
              smallLabel='emails bounced'
              miniData={
                emailStats
                  ? [
                      emailStats.bounced || 0,
                      emailStats.dropped || 0,
                      emailStats.complained || 0,
                      emailStats.unsubscribed || 0,
                      emailStats.accepted || 0
                    ]
                  : [0, 0, 0, 0, 0]
              }
              color='#EF4444'
            />
            <StatCard
              title='Email Sent'
              valueText={`${emailStats?.totalEmails ?? 0}`}
              smallLabel={`Delivered: ${emailStats?.delivered ?? 0}`}
              deltaText='total emails'
              showChart={false}
              imageSrc={EmailSentIcon}
              color='#6B7280'
            />
          </div>

          <div className='lg:col-span-5'>
            <div className='flex h-full flex-col rounded-lg bg-white p-4 '>
              <div className='text-base font-medium'>Engagement Rate</div>
              <div className='my-2 flex items-baseline gap-3 '>
                <div
                  className={`text-2xl font-extrabold ${
                    emailStats?.engagementRate
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}
                >
                  {emailStats?.engagementRate ?? 0}%
                </div>

                <div className={`text-sm font-semibold text-green-600`}>
                  0% Since last week
                </div>
              </div>
              <div className='text-xs text-gray-400'>
                Partners interacted with{' '}
                <strong className='font-semibold text-blue-500'>
                  {(emailStats?.opened ?? 0) + (emailStats?.clicked ?? 0)}
                </strong>{' '}
                of your emails out of {emailStats?.totalEmails ?? 0} sent.{' '}
              </div>
              <div className='mt-4 min-h-[200px] flex-1'>
                <Line data={bigData} options={bigOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <DraftsPage /> */}
    </>
  )
}

export default StatsDashboard
