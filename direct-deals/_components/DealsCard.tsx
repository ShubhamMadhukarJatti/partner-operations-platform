'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { AlertTriangleIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import ReportDeal from '@/components/dashboard-loader/ReportDeal'
import { ThreeDotsIcon } from '@/components/icons/icons'

import EndDealDialog from './myDeals/EndDealDialog'

interface DealsCardProps {
  dealId: string
  title: string
  imageUrl: string
  description: string
  tag: string | null
  status?: string
  subdescription: string
  joinDealButton?: (e: string) => void

  dealType: 'all' | 'joined' | 'created'
  viewApplicationButtonClicked?: (e: string) => void
}

const DealsCard: React.FC<DealsCardProps> = ({
  dealId,
  title,
  imageUrl,
  tag,
  description,
  subdescription,
  dealType,
  status,
  joinDealButton,
  viewApplicationButtonClicked
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [orgName, setOrgName] = useState<string>('')

  const placeholderImage =
    'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'

  console.log({ imageUrl })

  return (
    <>
      <ReportDeal isOpen={isOpen} setIsOpen={setIsOpen} orgName={orgName} />
      <div className='flex w-full items-center justify-between rounded-xl border border-text-20 p-4'>
        <div>
          <div className='flex gap-4'>
            <div className='relative h-[45px] w-[45px] rounded-lg'>
              <Image src={placeholderImage} alt='company logo' fill />
            </div>
            <div className='flex flex-col gap-1 '>
              <p className='text-lg/5 font-bold text-text-100'>{title}</p>
              <div className='flex gap-1'>
                <Badge
                  className='rounded-[4px] bg-shark-blue-50 text-[12px]/[14px] text-text-100'
                  variant={'secondary'}
                >
                  {tag}
                </Badge>
              </div>
            </div>
          </div>
          <p className='mt-2 text-sm/4 font-normal text-text-100'>
            {description}
          </p>
          <Badge
            className='mt-4 rounded-[4px] bg-[#F0F1F2] px-2 py-1 text-[12px]/[14px] text-text-100'
            variant={'secondary'}
          >
            {subdescription}
          </Badge>
        </div>
        {dealType === 'all' && (
          <div className='flex items-center gap-4'>
            <Button
              onClick={() => joinDealButton && joinDealButton(dealId)}
              className='border border-text-40 bg-white text-primary-blue hover:text-white'
            >
              Join Deal
            </Button>
            <HoverCard>
              <HoverCardTrigger>
                <ThreeDotsIcon />
              </HoverCardTrigger>
              <HoverCardContent className='max-w-[177px] px-6 py-4'>
                <button
                  onClick={() => {
                    setIsOpen(true), setOrgName(title)
                  }}
                  className='flex gap-2 '
                >
                  <AlertTriangleIcon size={24} /> Report Deal
                </button>
              </HoverCardContent>
            </HoverCard>
          </div>
        )}
        {dealType === 'created' && (
          <div className='flex gap-4'>
            {status === 'Hidden' ? (
              <>
                <Badge className='h-auto rounded-lg bg-[#FFEBEB] px-2 py-1 text-xs text-destructive hover:bg-[#FFEBEB]'>
                  You have ended the deal
                </Badge>
              </>
            ) : (
              <EndDealDialog dealId={dealId} />
            )}

            <Button
              onClick={() =>
                viewApplicationButtonClicked &&
                viewApplicationButtonClicked(dealId)
              }
              variant={'default'}
            >
              View applications
            </Button>
          </div>
        )}
        {dealType === 'joined' && (
          <div className='flex gap-4'>
            <Badge className='rounded-lg bg-[#FFF2CE] px-2 py-1 text-shark-xs text-[#B67F27] hover:bg-[#FFF2CE]'>
              ✓ Application sent
            </Badge>

            <Button
              onClick={() =>
                viewApplicationButtonClicked &&
                viewApplicationButtonClicked(dealId)
              }
              className='py-0'
              variant={'link'}
            >
              View
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default DealsCard
