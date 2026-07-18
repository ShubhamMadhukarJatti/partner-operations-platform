import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sharkdom Contact | Modern day partner ops platform',
  description: `Contact Sharkdom&apos;s support team to get started with #1 destination for Finding Ideal Partners for your business`
}

const ContactUsPage = () => {
  return (
    <div className='py-12'>
      <h1 className='text-2xl text-primary md:text-3xl'>Contact us</h1>
      <div className='-mt-2 h-[2px] w-20 bg-primary' />

      <div>
        <p className='text-lg font-semibold text-muted-foreground '>
          Last updated on Jul 13th 2024
        </p>

        <p className='text-base '>
          <strong className='text-muted-foreground'>
            Merchant Legal entity name:
          </strong>{' '}
          Kalasa Agile Pvt Ltd
          <br />
          <strong className='text-muted-foreground'>
            Registered Address:
          </strong>{' '}
          Muqbool Road, Amritsar, Amritsar, Punjab 143001
          <br />
          <strong className='text-muted-foreground'>
            Operational Address:
          </strong>{' '}
          Muqbool Road, Amritsar, Amritsar, Punjab 143001
          <br />
          <strong className='text-muted-foreground'>Telephone No:</strong>
          <br />
          <strong className='text-muted-foreground'>E-Mail ID:</strong>{' '}
          <a
            href='mailto:office@sharkdom.com'
            className='text-muted-foreground'
          >
            office@sharkdom.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default ContactUsPage
