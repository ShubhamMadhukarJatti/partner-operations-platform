'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

// SVG icon components
const CheckCircle = () => (
  <svg
    width='22'
    height='22'
    viewBox='0 0 22 22'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M11 0.25C5.072 0.25 0.25 5.073 0.25 11C0.25 16.927 5.072 21.75 11 21.75C16.928 21.75 21.75 16.927 21.75 11C21.75 5.073 16.928 0.25 11 0.25ZM11 20.25C5.899 20.25 1.75 16.101 1.75 11C1.75 5.899 5.899 1.75 11 1.75C16.101 1.75 20.25 5.899 20.25 11C20.25 16.101 16.101 20.25 11 20.25ZM15.03 8.13599C15.323 8.42899 15.323 8.90402 15.03 9.19702L10.363 13.864C10.217 14.01 10.025 14.084 9.83301 14.084C9.64101 14.084 9.44901 14.011 9.30301 13.864L6.97 11.531C6.677 11.238 6.677 10.763 6.97 10.47C7.263 10.177 7.73801 10.177 8.03101 10.47L9.83401 12.273L13.97 8.13702C14.263 7.84402 14.737 7.84399 15.03 8.13599Z'
      fill='#22C55E'
    />
  </svg>
)
const WarningIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z'
      stroke='#C47714'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M12 8V13'
      stroke='#C47714'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M11.9941 16H12.0031'
      stroke='#C47714'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
const RocketIcon = () => (
  <svg
    width='22'
    height='22'
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g clipPath='url(#clip0_3137_88370)'>
      <path
        d='M23.8888 14.1112C26.8888 11.1112 27.0763 7.54244 26.9825 5.95119C26.9669 5.70867 26.8635 5.48012 26.6917 5.30827C26.5198 5.13643 26.2913 5.03304 26.0487 5.01744C24.4575 4.92369 20.8913 5.10869 17.8888 8.11119L10 15.9999L16 21.9999L23.8888 14.1112Z'
        fill='#292D32'
        stroke='#292D32'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M17.0003 9H9.29407C9.02921 9.00012 8.77521 9.10532 8.58782 9.2925L4.29407 13.5863C4.16298 13.7176 4.07103 13.8829 4.02853 14.0636C3.98602 14.2442 3.99464 14.4332 4.05341 14.6092C4.11218 14.7853 4.21878 14.9415 4.36129 15.0604C4.5038 15.1793 4.67659 15.2562 4.86032 15.2825L10.0003 16'
        fill='white'
      />
      <path
        d='M17.0003 9H9.29407C9.02921 9.00012 8.77521 9.10532 8.58782 9.2925L4.29407 13.5863C4.16298 13.7176 4.07103 13.8829 4.02853 14.0636C3.98602 14.2442 3.99464 14.4332 4.05341 14.6092C4.11218 14.7853 4.21878 14.9415 4.36129 15.0604C4.5038 15.1793 4.67659 15.2562 4.86032 15.2825L10.0003 16'
        stroke='#292D32'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M23 15V22.7063C22.9999 22.9711 22.8947 23.2251 22.7075 23.4125L18.4137 27.7063C18.2824 27.8373 18.1171 27.9293 17.9364 27.9718C17.7558 28.0143 17.5668 28.0057 17.3908 27.9469C17.2147 27.8881 17.0585 27.7815 16.9396 27.639C16.8207 27.4965 16.7438 27.3237 16.7175 27.14L16 22'
        fill='white'
      />
      <path
        d='M23 15V22.7063C22.9999 22.9711 22.8947 23.2251 22.7075 23.4125L18.4137 27.7063C18.2824 27.8373 18.1171 27.9293 17.9364 27.9718C17.7558 28.0143 17.5668 28.0057 17.3908 27.9469C17.2147 27.8881 17.0585 27.7815 16.9396 27.639C16.8207 27.4965 16.7438 27.3237 16.7175 27.14L16 22'
        stroke='#292D32'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M11.82 23.4772C11.3362 24.5384 9.70625 26.9997 5 26.9997C5 22.2934 7.46125 20.6634 8.5225 20.1797'
        stroke='#292D32'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </g>
    <defs>
      <clipPath id='clip0_3137_88370'>
        <rect width='32' height='32' fill='white' />
      </clipPath>
    </defs>
  </svg>
)

const steps = [
  {
    id: 'step-1',
    title: 'Link to a Google Sheet',
    icon: (
      <img
        src='/icons/sharkdom-sheets-logo.svg'
        alt='Google Sheets'
        className='h-6 w-6'
      />
    ),
    content: (
      <div className='space-y-2'>
        <ul className='list-disc pl-5 text-sm text-[#222]'>
          <li>Sign in with the Gmail account linked to your Google Form.</li>
          <li>Authorize Sharkdom to access your form and Sheets setup.</li>
        </ul>
        <button className='mt-2 rounded-md bg-[#3e50f7] px-4 py-1.5 text-xs font-medium text-white shadow transition hover:bg-[#2d3bb3]'>
          Connect
        </button>
      </div>
    )
  },
  {
    id: 'step-2',
    title: 'Enable Web App Integration',
    icon: <WarningIcon />,
    content: (
      <div className='space-y-2'>
        <ul className='list-disc pl-5 text-sm text-[#222]'>
          <li>Open the linked Google Sheet.</li>
          <li>Navigate to Extensions → Apps Script.</li>
          <li>Paste the Web App code provided by Sharkdom.</li>
        </ul>
        <div className='flex items-center justify-between rounded-lg bg-[#181C2A] p-4 font-mono text-xs text-white'>
          <span>referralCode.js</span>
          <button className='ml-2 rounded bg-[#23272F] px-2 py-1 text-xs'>
            Copy
          </button>
        </div>
        <div className='mt-2 rounded-lg bg-[#181C2A] p-4 font-mono text-xs text-green-400'>
          {`<script>
// this will give the impression data
function executeImpressionApi() {
  var referralCode = "u78AcBq";
}
</script>`}
        </div>
        <button className='mt-2 rounded-md border border-[#3e50f7] bg-[#E9F6F0] px-4 py-1.5 text-xs font-medium text-[#3e50f7] shadow transition hover:bg-[#eaf1ff]'>
          Completed
        </button>
      </div>
    )
  },
  {
    id: 'step-3',
    title: 'Set the Trigger',
    icon: <CheckCircle />,
    content: (
      <div className='space-y-2'>
        <ul className='list-disc pl-5 text-sm text-[#222]'>
          <li>
            In the Apps Script editor, go to Triggers (
            <span className='inline-block text-[#3e50f7]'>⏰</span>) in the left
            sidebar.
          </li>
          <li>
            Create a new trigger:
            <ul className='list-disc pl-5'>
              <li>
                Function: <span className='font-mono'>onFormSubmit</span>
              </li>
              <li>Event type: From spreadsheet → On form submit</li>
            </ul>
          </li>
          <li>Authorize access when prompted.</li>
        </ul>
        <button className='mt-2 rounded-md border border-[#3e50f7] bg-[#E9F6F0] px-4 py-1.5 text-xs font-medium text-[#3e50f7] shadow transition hover:bg-[#eaf1ff]'>
          Completed
        </button>
      </div>
    )
  },
  {
    id: 'step-4',
    title: 'Test the Webhook',
    icon: <CheckCircle />,
    content: (
      <div className='space-y-2'>
        <ul className='list-disc pl-5 text-sm text-[#222]'>
          <li>Submit a test entry via your Google Form.</li>
          <li>
            Confirm the data appears inside Sharkdom under Partner Program →
            Submissions.
          </li>
        </ul>
        <button className='mt-2 rounded-md border border-[#3e50f7] bg-[#E9F6F0] px-4 py-1.5 text-xs font-medium text-[#3e50f7] shadow transition hover:bg-[#eaf1ff]'>
          Completed
        </button>
      </div>
    )
  },
  {
    id: 'step-5',
    title: 'Go Live!',
    icon: <RocketIcon />,
    content: (
      <div className='space-y-2'>
        <ul className='list-disc pl-5 text-sm text-[#222]'>
          <li>Publish your partner form.</li>
          <li>
            Companies visiting your Sharkdom profile will now see your referral
            or partner program automatically.
          </li>
        </ul>
        <button className='mt-2 rounded-md border border-[#3e50f7] bg-[#E9F6F0] px-4 py-1.5 text-xs font-medium text-[#3e50f7] shadow transition hover:bg-[#eaf1ff]'>
          Completed
        </button>
      </div>
    )
  }
]

export default function PartnerProgram() {
  const router = useRouter()
  const [openStep, setOpenStep] = useState('step-1')

  return (
    <div className='min-h-screen bg-white px-8 py-6 font-sans'>
      <div className='mx-auto max-w-7xl'>
        <h1 className='mb-1 text-[18px] font-semibold text-[#222]'>
          Partner program
        </h1>
        <p className='mb-7 text-[13px] text-[#8b98b8]'>
          Attract & Manage new partners to your program
        </p>
        <div className='grid grid-cols-1 gap-7 lg:grid-cols-3'>
          {/* Left: Main Content */}
          <div className='flex flex-col gap-7 rounded-2xl border border-[#E4E7EE] lg:col-span-2'>
            {/* Illustration and Steps */}
            <div className='relative flex min-h-[320px] flex-col gap-6 overflow-hidden rounded-2xl bg-white p-4'>
              {/* Illustration */}
              <div
                className='mb-2 flex justify-center'
                style={{
                  background:
                    'linear-gradient(70.64deg, #E4F8FF 5.06%, #FFFFFF 52.85%, #E1E1F8 99.14%)'
                }}
              >
                <div className='flex w-full justify-center'>
                  <Image
                    src='/images/partner-program\partner-program-banner.svg'
                    alt='Promote partner program'
                    width={500}
                    height={250}
                  />
                </div>
              </div>
              <h2 className='mb-1 text-[16px] font-semibold text-[#222]'>
                Connect Your Google Form to Sharkdom in 5 Simple Steps
              </h2>
              <p className='mb-4 text-[13px] text-[#8b98b8]'>
                Set up once and start receiving real-time partner signups
                directly into your Sharkdom dashboard.
              </p>
              <Accordion
                type='single'
                collapsible
                value={openStep}
                onValueChange={setOpenStep}
                className='w-full'
              >
                {steps.map((step, idx) => (
                  <AccordionItem
                    key={step.id}
                    value={step.id}
                    className='last:border-0'
                  >
                    <AccordionTrigger className='m-2 flex items-center justify-between gap-3 rounded-md border border-[#E4E7EE] py-4 text-[15px] font-semibold text-[#222]'>
                      <span className='flex items-center gap-2'>
                        {idx < Number(openStep.replace('step-', '')) - 1 ? (
                          <CheckCircle />
                        ) : (
                          step.icon
                        )}
                        {step.title}
                      </span>
                      <svg
                        className={`mr-2 h-4 w-4 transition-transform duration-200 ${
                          openStep === step.id ? 'rotate-180' : ''
                        }`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 9l-7 7-7-7'
                        />
                      </svg>
                    </AccordionTrigger>
                    <AccordionContent className='bg-[#FAFBFC] px-4 pb-6 pt-2'>
                      {step.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
          {/* Right: Create New Form Card */}
          <div className='mx-auto flex max-h-[400px] min-h-[120px] max-w-sm flex-col rounded-2xl border border-[#E4E7EE] bg-white p-4'>
            <div
              className='mb-4 flex flex-col items-center'
              style={{
                background:
                  'linear-gradient(70.64deg, rgba(228, 248, 255, 0.6) 5.06%, rgba(255, 255, 255, 0.5) 57.85%, rgba(225, 225, 248, 0.6) 112.82%)'
              }}
            >
              <Image
                src='/images/partner-program\partner-program-form-builder-banner.svg'
                alt='Promote partner program'
                width={500}
                height={250}
              />
            </div>
            <h3 className='mb-2 text-left text-[15px] font-semibold text-[#222]'>
              Create a New Form in Sharkdom
            </h3>
            <ul className='text-md mb-4 list-inside list-disc space-y-1 text-[#8b98b8]'>
              <li>Use a simple form builder for your CRM</li>
              <li>Automate tracking & form mapping</li>
              <li>Generate a branded, no-code embedded widget</li>
            </ul>
            <button
              className='mt-auto w-full rounded-lg bg-[#3e50f7] px-5 py-2 text-sm font-medium text-white shadow transition hover:bg-[#2d3bb3]'
              onClick={() =>
                router.push('/partner-mapping-resource/form-builder')
              }
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
