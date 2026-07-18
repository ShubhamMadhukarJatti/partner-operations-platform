import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

interface EventCardProps {
  imageSrc?: string
  title: string
  organizer?: string
  description: string
  time: string
  backgroundColor?: string
  className?: string
  href?: string
}

const EventCard = ({
  imageSrc = '/auth-slide-1.jpeg',
  title,
  organizer = 'Sharkdom',
  description,
  time,
  backgroundColor = '#FEF9C3', // Default to yellow-ish if not provided
  className,
  href
}: EventCardProps) => {
  const CardContent = (
    <div
      className={cn(
        'flex flex-col gap-6 rounded-[24px] p-6 md:flex-row md:items-center md:gap-8 md:p-8',
        href && 'cursor-pointer transition-opacity hover:opacity-95',
        className
      )}
      style={{ backgroundColor }}
    >
      {/* Image */}
      <div className='relative h-[260px] w-full shrink-0 overflow-hidden rounded-[16px] md:h-[160px] md:h-[180px] md:w-[210px]'>
        <Image src={imageSrc} alt={title} fill className='object-cover' />
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col gap-3'>
        <div className='flex flex-col justify-between gap-2 md:flex-row md:items-start'>
          <div className='space-y-1'>
            <h3 className='text-xl font-bold leading-tight text-[#101828] md:text-2xl'>
              {title}
            </h3>
            <p className='text-sm font-medium text-[#1B0C27]'>By {organizer}</p>
          </div>
          <span className='shrink-0 whitespace-nowrap text-lg font-semibold text-[#101828]'>
            {time}
          </span>
        </div>

        <p className='text-base leading-relaxed text-[#1B0C27]'>
          {description}
        </p>
      </div>
    </div>
  )

  return href ? <Link href={href}>{CardContent}</Link> : CardContent
}

export default EventCard
