import { Clock, HeartHandshake } from 'lucide-react'

import { cn } from '@/lib/utils'

const timeline: TimelineCardProps[] = [
  {
    legend: 'Day 1',
    title: "Find Decision Maker's Email",
    days: '1 Day'
  },
  {
    legend: 'Day 2',
    title: 'Send a Partnership proposal',
    days: '1 Day'
  },
  {
    legend: 'Day 3-6',
    title: 'Waiting for Acknowledgment',
    days: '4 Days',
    type: 'destructive',
    size: 4,
    highlight: '91% fail to ackowledge'
  },
  {
    legend: 'Day 7-9',
    title: 'Meet to discuss terms + Negotiation',
    days: '3 Days',
    size: 3,
    type: 'default'
  },
  {
    legend: 'Day 10-11',
    title: 'MOU Signing',
    days: '2 Days',
    size: 2,
    type: 'default'
  },
  {
    legend: 'Day 12',
    title: 'Partnership initiates',
    days: '1 Day',
    type: 'success'
  }
]

export const TypicalPartnership = () => {
  return (
    <div className='container flex flex-col gap-6'>
      <div className='flex flex-col items-center justify-center justify-between lg:flex-row'>
        <h2 className='flex flex-col items-center gap-2 text-center text-3xl font-semibold lg:flex-row'>
          <HeartHandshake size={28} />
          Traditional Way of Partnering
        </h2>

        <div className='mt-2 flex w-full flex-row items-center justify-center gap-2 rounded-xl bg-red-600 p-2 text-destructive-foreground sm:flex-row lg:w-auto lg:flex-col'>
          <div>
            <Clock className='' />
          </div>
          <p className='text-center'>
            New partner in <br />
            <span className='font-semibold'>10+ Days</span>
          </p>
        </div>
      </div>
      <div className='grid-cols grid max-w-full shrink gap-1 lg:grid-cols-12'>
        {timeline.map((item, index) => (
          <TimelineCard key={index} {...item} />
        ))}
      </div>
    </div>
  )
}

type TimelineCardProps = {
  legend: string
  title: string
  days: string
  size?: number
  type?: 'default' | 'destructive' | 'success'
  highlight?: string
}
const TimelineCard = ({
  legend,
  title,
  size = 1,
  days,
  type = 'default',
  highlight
}: TimelineCardProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        {
          'col-span-1 lg:col-span-2': size === 2
        },
        { 'col-span-2 lg:col-span-3': size === 3 },
        { 'col-span-2 lg:col-span-4': size === 4 }
      )}
    >
      <div
        className={cn(
          'flex flex-1 flex-col items-center justify-between gap-4 rounded-lg border-2 border-sky-300 bg-sky-200 p-4',
          { 'border-red-300 bg-red-200': type === 'destructive' },
          { 'border-green-300 bg-green-200': type === 'success' }
        )}
      >
        <span className='text-center font-semibold'>{legend}</span>
        <p className='break-words text-center text-base font-medium xs:text-base xl:font-semibold'>
          {title}
        </p>
        {highlight && (
          <div className='rounded-xl bg-red-600 p-2 text-center text-sm text-destructive-foreground xs:text-base'>
            {highlight}
          </div>
        )}
        <div
          className={cn(
            'flex flex-wrap items-center justify-center gap-1 rounded-full bg-sky-500 p-1 text-center text-xs text-white',
            { 'bg-red-500': type === 'destructive' },
            { 'bg-green-600': type === 'success' }
          )}
        >
          <Clock size={16} /> <span>{days}</span>
        </div>
      </div>
    </div>
  )
}
