import React from 'react'

import DashboardItemWrapper from '../../dashboard/[id]/_components/dashboard-item-wrapper'
import { dashedline } from '../../dashboard/[id]/_components/proposal-progress'
import { CheckIcon } from '../../dashboard/[id]/_components/proposal-status'

type Props = {
  data: any
}

const OfflineProposalProgress = ({ data }: Props) => {
  return (
    <DashboardItemWrapper className='p-4'>
      <h2 className='text-shark-lg font-bold text-text-100'>
        Get Started with 100% Partner Invitation
      </h2>

      {/* step -1 */}

      <div className='mt-4 flex flex-col gap-0'>
        <div className='flex items-center gap-2  '>
          <>{CheckIcon}</>

          <div className='flex flex-col'>
            <span className='text-shark-base font-medium text-text-100'>
              Invitation Sent by you
            </span>
            <span className='text-shark-xs font-medium text-text-60'>
              You have sent the Proposal.
            </span>
          </div>
        </div>

        {dashedline}

        <div className='flex items-center gap-2  '>
          {data?.verified ? (
            CheckIcon
          ) : (
            <span className='size-5 shrink-0 rounded-full border-[1.43px] border-text-60'></span>
          )}

          <div className='flex flex-col'>
            <span className='text-shark-base font-medium text-text-100'>
              Upload the Documents
            </span>
            <span className='text-shark-xs font-medium text-text-60'>
              You need to upload your contract documents.
            </span>
          </div>
        </div>

        {/* {dashedline} */}
        {/* 
        <div className='flex items-center gap-2  '>
          {false ? (
            CheckIcon
          ) : (
            <span className='size-5 shrink-0 rounded-full border-[1.43px] border-text-60'></span>
          )}

          <div className='flex flex-col'>
            <span className='text-shark-base font-medium text-text-100'>
              Connect your video conferencing (Default. Sharkdom Meet)
            </span>
            <span className='text-shark-xs font-medium text-text-60'>
              You&apos;ve connected Google Meet.
              <button className='font-bold text-primary-light-blue'>
                Set Communication
              </button>
            </span>
          </div>
        </div> */}
      </div>
    </DashboardItemWrapper>
  )
}

export default OfflineProposalProgress
