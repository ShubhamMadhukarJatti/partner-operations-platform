import React from 'react'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'
import { Award, CheckCircle2 } from 'lucide-react'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'

const CertifiedBadge = () => {
  const certificates = [
    { name: 'ISO 9001 - 2000', year: '2025' },
    { name: 'ISO 9001 - 2000', year: '2025' },
    { name: 'ISO 9001 - 2000', year: '2025' }
  ]

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <div className='flex cursor-pointer items-center gap-1 rounded-full bg-[#2BA84A] p-[1.5px] text-xs font-medium text-white'>
          <CheckCircle2 size={16} className='text-white' />
          <span>Certified</span>
          <span className='flex h-4 w-4 items-center justify-center rounded-full bg-[#15803D] text-[10px]'>
            3
          </span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        className='w-[200px] border-[#C8CFDC] p-4 shadow-[0px_4.9px_19.6px_0px_#6A73811F]'
        side='bottom'
        align='center'
      >
        <HoverCardPrimitive.Arrow
          className='fill-white'
          width={11}
          height={5}
        />
        <div className='flex flex-col gap-3'>
          <h4 className='text-base font-bold text-black'>3 Certificates</h4>
          <div className='flex flex-col gap-3'>
            {certificates.map((cert, index) => (
              <div key={index} className='flex items-start gap-3'>
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded bg-blue-50 text-blue-600'>
                  {/* Placeholder for ISO Logo - using Award icon for now */}
                  <Award size={16} />
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium text-gray-900'>
                    {cert.name}
                  </span>
                  <span className='text-xs text-gray-500'>{cert.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default CertifiedBadge
