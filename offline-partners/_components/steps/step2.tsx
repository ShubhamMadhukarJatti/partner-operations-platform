'use client'

import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TwoUserIcon } from '@/components/icons/icons'

type Recipient = {
  email: string
  name: string
  company?: string
}

type Step2Props = {
  partnerName?: string
  partnerEmail?: string
  orgName?: string
  recipients: Recipient[]
  setRecipients: React.Dispatch<React.SetStateAction<Recipient[]>>
}

const Step2 = ({
  partnerName = '',
  partnerEmail = '',
  orgName = 'us',
  recipients,
  setRecipients
}: Step2Props) => {
  const [nameInput, setNameInput] = useState(partnerName)
  const [emailInput, setEmailInput] = useState(partnerEmail)

  useEffect(() => {
    if (partnerName || partnerEmail) {
      setNameInput(partnerName)
      setEmailInput(partnerEmail)
    }
  }, [partnerName, partnerEmail])

  const handleRemove = (email: string) => {
    setRecipients((prev) => prev.filter((r) => r.email !== email))
  }

  const handleAdd = () => {
    const name = nameInput.trim()
    const email = emailInput.trim()
    if (!name || !email) return
    if (recipients.some((r) => r.email === email)) return
    setRecipients((prev) => [...prev, { name, email }])
    setNameInput('')
    setEmailInput('')
  }

  return (
    <div className='mx-auto max-w-xl space-y-6 '>
      {/* Add Recipients */}
      <div>
        <p className='text-base font-bold'>Add Recipients</p>
        <p className='text-base text-[#7688A8]'>
          Add more people if you want to invite multiple people.
        </p>
        <div className='mt-3 flex gap-2'>
          <Input
            placeholder='Full name'
            className='rounded-lg text-black placeholder:text-[#6B7280]'
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <Input
            placeholder='Email Address'
            className='rounded-lg text-black placeholder:text-[#6B7280]'
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          {/* <Button variant='primary' onClick={handleAdd}>
            <Plus size={18} />
          </Button> */}
        </div>
      </div>

      {/* Recipients List */}
      <div className='space-y-2'>
        {recipients.map((r) => (
          <div
            key={r.email}
            className='flex items-center justify-between rounded-xl border p-3'
          >
            <div className='flex gap-2'>
              <TwoUserIcon size={20} color='#323232' />
              <div>
                <p className='pb-[1px] text-sm font-medium'>{r.name}</p>
                <p className='pb-[1px] text-xs text-gray-500'>{r.email}</p>
                <p className='pb-[1px] text-xs text-gray-400'>{r.company}</p>
              </div>
            </div>
            <button
              onClick={() => handleRemove(r.email)}
              className='text-gray-400 hover:text-red-500'
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Email Preview */}
      <div>
        <p className='text-base font-bold'>Email Preview</p>
        <div className='mt-2 space-y-2 rounded-lg border p-3'>
          <div>
            <p className='text-sm font-semibold'>Subject</p>
            <p className='text-sm text-[#4D5C78]'>
              You've been invited to Sharkdom by {orgName}.
            </p>
          </div>

          {/* Scrollable box */}
          <div className='h-24 overflow-y-auto rounded-lg bg-[#F0F2F2] p-3 text-sm text-gray-600'>
            We're inviting you to collaborate with us on Sharkdom, a partner
            finding workspace. Your invite unlocks:{' '}
            <span className='font-bold'>
              1-month Standard and 3 seats at no cost.
            </span>
            <br />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step2
