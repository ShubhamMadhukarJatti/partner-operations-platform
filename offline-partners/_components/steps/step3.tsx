// components/InviteCard.tsx
import { Checkbox } from '@/components/ui/checkbox'
import { TwoUserIcon } from '@/components/icons/icons'

type Step3Props = {
  orgName?: string
  partnerName?: string
  partnerEmail?: string
  recipients?: { name: string; email: string }[]
  policyChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}
const Step3 = ({
  partnerName = '',
  partnerEmail = '',
  orgName = 'us',
  recipients = [],
  policyChecked = false,
  onCheckedChange
}: Step3Props) => {
  const displayName =
    recipients.length > 0
      ? recipients
          .map((r) => `${r.name || 'Recipient'} (${r.email || '—'})`)
          .join(', ')
      : partnerName || partnerEmail
        ? `${partnerName || 'Recipient'} (${partnerEmail || '—'})`
        : 'Recipient'

  return (
    <div className='mx-auto'>
      {/* Header */}
      <div className='mb-4 rounded-lg border border-[#DEE2E6] bg-[#F8F9FA] p-4'>
        <p className='text-sm font-bold text-black'>Ready to send to:</p>
        <p className='py-1 text-sm text-black'>{displayName}</p>
        <div className='my-2 border'></div>
        <p className='mt-2 text-sm text-gray-600'>
          <span className='text-sm font-bold text-black'>Subject:</span>{' '}
          <span className='text-sm text-black'>
            You&apos;ve been invited to Sharkdom by {orgName}.
          </span>
        </p>
      </div>

      {/* Benefits Box */}
      <div className='mb-4 rounded-lg border border-[#3FA44A] bg-[#F5FAF5] p-3'>
        <div className='flex gap-4'>
          <TwoUserIcon />
          <p className='mb-2 flex items-center text-base font-bold text-green-700'>
            Their Benefits
          </p>
        </div>
        <ul className='list-disc space-y-1 pl-6 text-sm'>
          <li>You&apos;ll earn +1 credit immediately when invites are sent</li>
          <li>When they join, you&apos;ll earn +1 more credit</li>
          <li>Partner Mapping will unlock for this relationship</li>
          <li>They&apos;ll get 1-month Standard + 3 seats at no cost</li>
        </ul>
      </div>

      {/* Checkbox - mandatory to send invite */}
      <div className='flex items-center space-x-2 pb-20'>
        <Checkbox
          id='policy'
          checked={policyChecked}
          onCheckedChange={(value) => onCheckedChange?.(value === true)}
          className='h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500'
        />
        <label htmlFor='policy' className='text-sm font-bold'>
          I agree to Sharkdom&apos;s invite policy
        </label>
      </div>
    </div>
  )
}
export default Step3
