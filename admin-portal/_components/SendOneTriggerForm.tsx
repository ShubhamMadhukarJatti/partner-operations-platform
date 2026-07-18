import React, { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { showCustomToast } from '@/components/custom-toast'

const SendOneTriggerForm: React.FC<{ emailTemplates: any }> = ({
  emailTemplates
}) => {
  const [receiverEmail, setReceiverEmail] = useState<string>('')
  const [receiverEmailArray, setReceiverEmailArray] = useState<string[]>([])
  const [senderEmail, setSenderEmail] = useState('')
  const [templateId, setTemplateId] = useState('')

  const handleRunTrigger = () => {
    const payload = {
      recipients: receiverEmailArray,
      bodyHtml: templateId,
      from: senderEmail
    }
    try {
      const response = fetch('/api/send-one-trigger', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      showCustomToast('Success', 'Email sent', 'success', 5000)
      setReceiverEmail('')
      setReceiverEmailArray([])
      setSenderEmail('')
      setTemplateId('')
    } catch (error) {
      console.log(error)
      showCustomToast('Error', 'Error occured', 'error', 5000)
    }
  }

  useEffect(() => {
    if (receiverEmail.trim().length && receiverEmail != '') {
      setReceiverEmailArray(receiverEmail.split(','))
    }
  }, [receiverEmail])

  return (
    <div className='mx-auto mt-10 max-w-3xl rounded-lg bg-white p-6 shadow-md'>
      <h2 className='mb-6 text-2xl font-bold'>Send One Trigger</h2>

      {emailTemplates.length > 0 && (
        <div className='mb-4 flex flex-col'>
          <Label
            htmlFor='select-expectations'
            className='mb-2 text-left font-semibold'
          >
            Email Template
          </Label>
          <Select
            name='emailTemplate'
            value={templateId}
            onValueChange={(value) => setTemplateId(value)}
          >
            <SelectTrigger className='w-full rounded-lg'>
              <SelectValue placeholder='Select Template' />
            </SelectTrigger>
            <SelectContent>
              {emailTemplates.map((item: any) => {
                return (
                  <SelectItem value={item.id} key={item.id}>
                    {item.id}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      <Label className='mb-2 font-semibold'>Enter Receiver Email</Label>
      <Input
        type='email'
        value={receiverEmail}
        onChange={(e) => setReceiverEmail(e.target.value)}
        className='mb-4 mt-1 w-full rounded border p-2'
        placeholder='example1@gmail.com'
      />
      {receiverEmailArray.length > 0 && (
        <div className='flex gap-3'>
          {receiverEmailArray.map((email, key) => (
            <span
              className='rounded-xl bg-gray-200 px-2 py-1 text-xs'
              key={key}
            >
              {email}
            </span>
          ))}
        </div>
      )}
      <Label className='mb-2 font-semibold'>Enter Sender Email</Label>
      <Input
        type='email'
        defaultValue={'no-reply@sharkdom.com'}
        value={senderEmail}
        onChange={(e) => setSenderEmail(e.target.value)}
        className='mb-4 mt-1 w-full rounded border p-2'
        placeholder='example1@gmail.com'
      />

      <button
        className='mt-6 rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'
        onClick={() => handleRunTrigger()}
      >
        Run Now
      </button>
    </div>
  )
}

export default SendOneTriggerForm
