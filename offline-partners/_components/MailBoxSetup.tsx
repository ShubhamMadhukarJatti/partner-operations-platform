import { useState } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  GoogleIcon,
  OtherMailIcon,
  OutlookIcon
} from '@/components/icons/icons'

import MailConfirmationPage from './MailConfirmationPage'
import SmtpForm from './SmtpForm'

export default function MailboxSetup() {
  const [checked, setChecked] = useState(false)
  const [selectedStep, setSelectedStep] = useState<number | null>(1)

  const steps = [
    { id: 1, label: 'Link mailbox' },
    { id: 2, label: 'Configure mailbox' },
    { id: 3, label: 'Finish setup' }
  ]
  console.log('selectedStep', selectedStep)

  return (
    <div className='flex h-screen w-full bg-gray-50'>
      {/* Sidebar */}
      <div className='flex h-screen w-64 flex-col bg-[#10366F] px-4 py-10 text-white '>
        <h2 className='mb-6 text-lg font-semibold'>
          Welcome to the guided mailbox setup!
        </h2>
        <p className='mb-8 text-sm'>
          Follow these steps to connect your mailbox with the{' '}
          <span className='font-bold'>@sharkdom</span> mail.
        </p>

        <div className='flex flex-col space-y-4'>
          {steps.map((step) => (
            <label
              key={step.id}
              className={`flex cursor-pointer items-center space-x-2 text-sm ${
                selectedStep === step.id ? 'text-green-600' : 'text-gray-300'
              }`}
            >
              <Input
                type='radio'
                name='mailboxStep'
                checked={selectedStep === step.id}
                onChange={() => setSelectedStep(step.id)}
                className='h-4 w-4 cursor-pointer border-2 border-green-500 accent-blue-600'
              />
              <span>{step.label}</span>
            </label>
          ))}
        </div>

        <div className='mb-10 mt-auto text-xs text-gray-300'>
          <p>ⓘ This takes less than 5 minutes to complete</p>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex flex-1 items-center justify-center px-4'>
        {selectedStep === 1 ? (
          <div className='w-full max-w-5xl'>
            <div className='flex flex-col gap-8 md:flex-row'>
              {/* Left Text Section */}
              <div className='flex flex-col items-center  pt-6 md:w-1/2'>
                <div className='w-[350px]'>
                  <h1 className='mb-2 text-2xl font-semibold'>
                    Let’s link your
                    <br />
                    mailbox
                  </h1>
                  <p className='mb-6 text-sm text-gray-600'>
                    Link your email with Sharkdom to gain functionality of core
                    engagement tools, <br />
                    like{' '}
                    <span className='text-blue-600'>
                      emails, sequences, conversations, meetings
                    </span>{' '}
                    and more.
                  </p>
                </div>
              </div>

              {/* Right Cards Section */}
              <div className='flex flex-col gap-4 pt-6 md:w-1/2'>
                <div className='flex gap-6'>
                  <Card className='h-38 w-40 cursor-pointer shadow-none transition'>
                    <CardContent className='flex flex-col items-center justify-center p-2'>
                      <GoogleIcon />
                      <span className='text-sm'>Google</span>
                      <span className='text-xs text-gray-500'>
                        Gmail/GSuite
                      </span>
                    </CardContent>
                  </Card>

                  <Card className='h-38 w-40 cursor-pointer shadow-none transition'>
                    <CardContent className='flex flex-col items-center justify-center p-2'>
                      <OutlookIcon />
                      <span className='text-sm'>Outlook</span>
                      <span className='text-xs text-gray-500'>
                        Hotmail, Live, MSN
                      </span>
                    </CardContent>
                  </Card>
                </div>

                <Card className='h-38 w-[350px] cursor-pointer shadow-none transition'>
                  <CardContent className='flex flex-col items-center justify-center p-2'>
                    <OtherMailIcon />
                    <span className='text-sm'>Other</span>
                    <span className='text-xs text-gray-500'>
                      Any provider, IMAP
                    </span>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Terms of Service */}
            <div className='mt-2 flex flex-col items-center justify-center'>
              <div className='w-full max-w-2xl'>
                <p className='text-lg font-semibold'>
                  Sharkdom Terms of Services
                </p>

                <div className='mt-4 flex items-start gap-4'>
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) => setChecked(!!v)}
                  />
                  <p className='text-xs text-gray-600'>
                    I agree to the{' '}
                    {/* <span className='cursor-pointer text-blue-600'>
                      Terms of Service
                    </span>{' '}
                    and */}
                    <span className='cursor-pointer text-blue-600'>
                      {' '}
                      <Link href='/privacy-policy'>Privacy Policy</Link>
                    </span>{' '}
                    with Sharkdom that says by using the Site web sites you
                    agree to indemnify us and affiliated entities (collectively
                    &quot;Indemnities&quot;) and hold them harmless from any and
                    all claims and expenses, including (without limitation)
                    attorney&apos;s fees, submission of ideas and/or related
                    materials to us or from any person&apos;s use of any ID.
                    <span className='cursor-pointer text-blue-600'>
                      {' '}
                      Learn more
                    </span>{' '}
                    about the data sharing.
                  </p>
                </div>
              </div>
            </div>

            <div className='my-2 border'></div>

            {/* Buttons */}
            <div className='mt-4 flex justify-end space-x-2'>
              <Button variant='primary' className='h-8 w-24'>
                Back
              </Button>
              <Button
                variant='primary'
                disabled={selectedStep === null} // enabled when a step is selected
                className={cn(
                  'h-8 w-44 gap-2',
                  selectedStep === null && 'cursor-not-allowed'
                )}
              >
                Link Mailbox
              </Button>
            </div>
          </div>
        ) : selectedStep === 2 ? (
          <SmtpForm />
        ) : (
          <MailConfirmationPage />
        )}
      </div>
    </div>
  )
}
