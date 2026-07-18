/* eslint-disable react/no-unescaped-entities */
'use client'

import { FormEvent, useRef, useState } from 'react'
// import { Metadata } from 'next'
import emailjs from '@emailjs/browser'
import { Mail, MapPin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// export const metadata: Metadata = {
//   title: `Sharkdom helpdesk | Modern day partner ops platform`,
//   description: 'Contact our Support team to help you get started with Sharkdom'
// }

const HelpDesk = () => {
  const form = useRef<any>()

  const [submitted, setSubmitted] = useState(false)

  const sendEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    emailjs
      .sendForm('service_ukdqm9w', 'template_ze9d1qu', form.current, {
        publicKey: 'VU3sUJyVUNoEupb3L'
      })
      .then(
        () => {
          console.log('SUCCESS!')
          setSubmitted(true)
        },
        (error) => {
          console.log('FAILED...', error.text)
        }
      )
  }

  return (
    <>
      <div className='flex flex-col sm:flex-row sm:pb-24'>
        <div className='mx-auto mt-8 flex flex-col justify-center gap-y-2 px-4 sm:w-1/3'>
          <h1 className='flex text-3xl font-bold text-blue-600'>
            Sharkdom Helpdesk
          </h1>
          <h2 className='flex text-xl font-semibold'>
            Feeling Stuck? We're Here To Help!
          </h2>
          <div className='space-y-4'>
            <p>Or you can contact us directly at:</p>
            <ul className='space-y-4'>
              <li>
                <Mail />
                support@sharkdom.com
              </li>

              <li>
                <MapPin />
                Cyberhub, 77-A, DLF Cyber City, Gurugram, Haryana, 122015.
              </li>
            </ul>
          </div>
        </div>
        <div className='mx-4 my-8 flex justify-center rounded-lg border p-8 shadow-lg sm:mx-auto sm:mt-32 sm:w-1/3'>
          {submitted ? (
            <p className='text-green-500'>Submitted successfully!</p>
          ) : (
            <form
              ref={form}
              onSubmit={sendEmail}
              className='flex w-full flex-col'
            >
              <label className='text-zinc-700'>Email Address</label>
              <Input
                className='rounded-lg border border-[#3662E3] p-2 text-[#84858A] shadow'
                type='email'
                name='user_email'
                placeholder='name@startup.com'
                required
              />
              <label className='mt-6 text-zinc-700'>Message</label>
              <Input
                className='h-32 rounded-lg border border-[#3662E3] p-2 text-[#84858A] shadow'
                type='message'
                name='message'
                placeholder='Type your message here.'
                required
              />
              <Button
                className='mt-6 rounded-md py-6 text-lg'
                type='submit'
                value='Send'
              >
                Send
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default HelpDesk
