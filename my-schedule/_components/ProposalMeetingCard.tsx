import React, { useState } from 'react'
import { ArrowRight, Clock } from 'lucide-react'

import ScheduleMeetDialog from './ScheduleMeetDialog'

const ProposalMeetingCard: React.FC<{ data: any; org: any }> = ({
  data,
  org
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <ScheduleMeetDialog
        open={open}
        setOpen={setOpen}
        defaultPartner={data?.partnerOrganizationId}
        title='Proposal Discussion'
      />
      <div
        onClick={() => setOpen(true)}
        role='button'
        className='rounded-lg border border-[#C5C5C580] p-5 '
      >
        <div className='flex flex-col gap-4'>
          <div>
            <h1 className='text-base font-medium text-[#2A3241]'>
              {data?.organizationName} x {org?.name}
            </h1>
          </div>

          <p className='flex items-center gap-1.5 text-sm font-medium text-destructive'>
            <Clock size={12} stroke={'#7E7E7E'} strokeWidth={1.5} /> 12:30 PM{' '}
            <ArrowRight size={12} stroke={'#7E7E7E'} /> 04:36 PM IST{' '}
            <span className='text-[#3E50F7]'>(Not Set)</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProposalMeetingCard
