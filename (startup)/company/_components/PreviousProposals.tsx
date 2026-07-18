import React from 'react'
import moment from 'moment'

import {
  getCollaborationsByReceiver,
  getCollaborationsBySender
} from '@/lib/db/collaboration'

type Props = {}

type ProposalStatus = 'Awaiting' | 'Accepted' | 'REJECTED' | 'Draft'

interface Proposal {
  company: string
  date: string
  status: string
  logo?: string // URL or local path to logo
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-blue-100 text-blue-600'
    case 'ACTIVE':
      return 'bg-green-100 text-green-600'
    case 'REJECTED':
      return 'bg-red-100 text-red-600'
    case 'Draft':
      return 'bg-gray-100 text-gray-600'
    default:
      return ''
  }
}

const PreviousProposals = async (props: Props) => {
  const [sentProposals, receivedProposals] = await Promise.all([
    getCollaborationsBySender(),
    getCollaborationsByReceiver()
  ])

  return (
    <div className='h-full  w-full max-w-[16rem] border-r  border-[#cccccc] bg-white p-5'>
      <h2 className='mb-4 text-sm  font-semibold'>Previous Proposals</h2>
      <ul className='space-y-5'>
        {sentProposals.map((proposal, index) => (
          <li key={index} className='flex items-center space-x-4'>
            <div className='size-8 shrink-0 rounded-sm bg-gray-300'></div>

            <div className='flex-1'>
              <p className='line-clamp-1 text-sm'>
                {proposal.receiverOrganizationName?.slice(0, 12)}
                {proposal.receiverOrganizationName?.length > 12 && '...'}
              </p>
              <p className='text-xs text-[rgb(0,0,0,0.4)]'>
                {moment(proposal.creationTimestamp).format('MMDDYYYY')}
              </p>
            </div>
            <span
              className={`justify-self-end rounded px-1 py-1 text-xs font-medium capitalize leading-3 ${getStatusStyles(proposal.status)}`}
            >
              {proposal.status.toLowerCase()}
            </span>
          </li>
        ))}

        {receivedProposals.map((proposal, index) => (
          <li key={index} className='flex w-full items-center space-x-4'>
            <div className='size-8 shrink-0 rounded-sm bg-gray-300'></div>

            <div className='flex-1'>
              <p className='line-clamp-1 text-sm'>
                {proposal.senderOrganizationName?.slice(0, 12)}
                {proposal.senderOrganizationName?.length > 12 && '...'}
              </p>
              <p className='text-xs text-[rgb(0,0,0,0.4)]'>
                {moment(proposal.creationTimestamp).format('MMDDYYYY')}
              </p>
            </div>
            <span
              className={`flex justify-self-end rounded px-1 py-1 text-xs font-medium capitalize leading-3 ${getStatusStyles(proposal.status)}`}
            >
              {proposal.status.toLowerCase()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PreviousProposals
