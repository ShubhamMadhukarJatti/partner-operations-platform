import { Button } from '@/components/ui/button'
import { GiftsIcon, RightEnvelopIcon } from '@/components/icons/icons'

const FinalStep = ({
  partnerName = '',
  partnerEmail = '',
  isExternalPartner = false
}: {
  partnerName?: string
  partnerEmail?: string
  isExternalPartner?: boolean
}) => {
  return (
    <div className='mx-auto pb-10 '>
      <div className='mb-8 flex items-center justify-between rounded-xl border border-[#3FA44A] bg-[#F5FAF5] p-4'>
        <div>
          <p className='pb-2 text-base font-semibold text-[#3FA44A]'>
            Invite sent to 1 recipient
          </p>
          <p className='text-sm text-[#4D5C78]'>
            {partnerName || partnerEmail
              ? `${partnerName || 'Recipient'} (${partnerEmail || '—'})`
              : 'Recipient'}
          </p>
        </div>
        {!isExternalPartner && (
          <span className='flex items-center gap-1 rounded-2xl bg-[#ED9E00] px-3 py-2 text-xs font-medium text-white'>
            <GiftsIcon size={20} color='#FFF' /> +1 Credit
          </span>
        )}
      </div>

      <Button
        variant='primary'
        className='mb-3 flex h-12 w-full items-center justify-start gap-2 rounded-xl border border-[#DEE2E6] bg-white px-3 py-1 py-2 text-base text-[#323232] hover:bg-gray-50'
      >
        <RightEnvelopIcon color={'#323232'} /> Send Another Invite
      </Button>

      <Button
        variant='primary'
        className='mb-3 flex h-12 w-full items-center justify-start gap-2 rounded-xl border border-[#DEE2E6] bg-white px-3 py-1 py-2 text-base text-[#323232] hover:bg-gray-50'
      >
        🔗 Copy Invite Link
      </Button>

      {!isExternalPartner && (
        <div className='my-4 w-full rounded-xl bg-[#F8F9FA] p-3 text-base text-[#7688A8]'>
          When they join, you'll receive +1 credit.
        </div>
      )}
    </div>
  )
}
export default FinalStep
