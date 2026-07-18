import { Mail } from 'lucide-react'

import { PlaceHolderIcon } from '@/components/icons/icons'

import {
  convertToParticipants,
  extractParticipants
} from './utils/extractParticipants'

interface ParticipantProps {
  name: string
  email: string
  status: 'Signed' | 'Pending' | 'Active'
}

const statusStyles = {
  Signed: 'bg-green-50 text-green-700 border border-green-300',
  Pending: 'bg-yellow-50 text-yellow-700 border border-yellow-300',
  Active: 'bg-blue-50 text-blue-700 border border-blue-300'
}

export const ParticipantCard: React.FC<ParticipantProps> = ({
  name,
  email,
  status
}) => {
  return (
    <div className='mt-4 flex w-full items-center justify-between rounded-xl border border-[#DFE3E8] bg-[#FCFCFD] bg-white px-4 py-2'>
      <div className='flex items-center gap-3'>
        <PlaceHolderIcon />
        <div>
          <p className='font-medium text-gray-900'>{name}</p>
          <div className='flex items-center gap-1 text-sm text-gray-600'>
            <Mail size={14} className='text-blue-500' />
            <span className='text-primary-light-blue'>{email}</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
      >
        {status}
      </span>
    </div>
  )
}

// Example usage
export default function ParticipantsList({
  extractionData
}: {
  extractionData?: any
}) {
  console.log('ParticipantsList received extractionData:', extractionData)

  // Extract participants using the utility function
  const allSigners = extractParticipants(extractionData)
  console.log('All signers extracted:', allSigners)

  // Convert to participant format with default pending status
  const participants =
    allSigners.length > 0
      ? convertToParticipants(allSigners)
      : [
          // Fallback data if no extraction data
          // {
          //   name: 'Nikhil Saini',
          //   email: 'nikhil.saini@alphabet.com',
          //   status: 'Signed' as const
          // },
          // {
          //   name: 'Rohit Sharma',
          //   email: 'rohit.sharma@alphabet.com',
          //   status: 'Pending' as const
          // }
        ]

  return (
    <div className='flex flex-col gap-4'>
      <div className='mb-4'>
        <h3 className='mb-2 text-lg font-semibold text-gray-900'>
          Document Participants ({participants.length})
        </h3>
        <p className='text-sm text-gray-600'>
          {extractionData
            ? 'Participants extracted from the uploaded document:'
            : 'Default participants (no document data available):'}
        </p>
        {extractionData && (
          <div className='mt-2 flex gap-2'>
            {extractionData.signer1_count && (
              <span className='inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800'>
                Signer 1: {extractionData.signer1_count}
              </span>
            )}
            {extractionData.signer2_count && (
              <span className='inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs text-green-800'>
                Signer 2: {extractionData.signer2_count}
              </span>
            )}
            {extractionData.signer3_count && (
              <span className='inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800'>
                Signer 3: {extractionData.signer3_count}
              </span>
            )}
            {extractionData.signer4_count && (
              <span className='inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800'>
                Signer 4: {extractionData.signer4_count}
              </span>
            )}
          </div>
        )}
      </div>

      {participants.length > 0 ? (
        participants.map((p, i) => <ParticipantCard key={i} {...p} />)
      ) : (
        <div className='py-8 text-center text-gray-500'>
          <p>No participants found in the document</p>
          {extractionData && (
            <div className='mt-4 rounded-lg bg-gray-100 p-4 text-left'>
              <p className='text-sm font-medium text-gray-700'>Debug Info:</p>
              <pre className='mt-2 max-h-40 overflow-auto text-xs text-gray-600'>
                {JSON.stringify(extractionData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Additional Info Section */}
      {extractionData && (
        <div className='mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4'>
          <h4 className='mb-2 font-semibold text-blue-900'>
            Document Information
          </h4>
          <div className='space-y-2 text-sm'>
            {extractionData.agreement_type && (
              <p className='text-blue-800'>
                <span className='font-medium'>Agreement Type:</span>{' '}
                {extractionData.agreement_type}
              </p>
            )}
            {extractionData.effective_date && (
              <p className='text-blue-800'>
                <span className='font-medium'>Effective Date:</span>{' '}
                {new Date(extractionData.effective_date).toLocaleDateString()}
              </p>
            )}
            {extractionData.governing_law && (
              <p className='text-blue-800'>
                <span className='font-medium'>Governing Law:</span>{' '}
                {extractionData.governing_law}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
