import React from 'react'
import Image from 'next/image'
import { OrganizationType } from '@/types'
import { BadgeCheck } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

type Props = {
  receiverOrg: OrganizationType
}

const SendProposalOrgInfo = ({ receiverOrg }: Props) => {
  return (
    <div className='w-full rounded-lg border border-[#D4D4D4]   lg:max-w-[15rem]'>
      <div className='space-y-3 rounded-t-lg bg-[#F0F6FC] p-5'>
        <div className='flex items-center gap-2'>
          <Image
            src={receiverOrg?.logoUrl}
            alt=''
            width={50}
            height={50}
            className='h-10 w-10 rounded-full border bg-white object-cover p-0'
          />
          <span className='inline-flex items-center gap-1 text-lg capitalize'>
            {receiverOrg?.name}
            {receiverOrg?.verified && (
              <BadgeCheck
                className='fill-primary text-primary-foreground'
                size={20}
              />
            )}
          </span>
        </div>
        <p className='text-muted-foreground'>{receiverOrg?.briefDescription}</p>
        <Separator />
        <div>
          <p className='capitalize text-muted-foreground'>
            Open to partner for
          </p>
          <p className='capitalize text-muted-foreground'>
            {receiverOrg?.preferredPartnershipTypes
              ?.map((type) => type.area)
              .join(', ') || 'N/A'}
          </p>
        </div>
      </div>

      <div className='space-y-3 p-5'>
        <div>
          <h3 className='font-medium'>About Startup</h3>
          <p className='break-words text-muted-foreground'>
            {receiverOrg?.about || 'N/A'}
          </p>
        </div>
        <div>
          <h3 className='font-medium'>Target Segment</h3>
          <p className='text-muted-foreground'>
            {receiverOrg?.targetMarket || 'N/A'}
          </p>
        </div>
        <div>
          <h3 className='font-medium'>Addressing Problem</h3>
          <p className='text-muted-foreground'>
            {receiverOrg?.services
              ?.map((service) => service.service)
              .join(', ') || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SendProposalOrgInfo
