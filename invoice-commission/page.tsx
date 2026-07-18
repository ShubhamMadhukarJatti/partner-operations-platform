import React from 'react'
import Image from 'next/image'

type Props = {}

const InvoicePage = (props: Props) => {
  return (
    <div className='h-full overflow-hidden p-4'>
      <div>
        <h1 className='text-2xl font-semibold text-[0F172A]'>
          Invoice & Commissions
        </h1>
        <p className='mt-2 text-sm text-[#475569]'>
          Send more proposals and keep track of any terms update from your
          partners.
        </p>
      </div>
      <div className='flex h-full items-center justify-center '>
        <div className='flex flex-col  items-center '>
          <Image
            src={'/invoices.svg'}
            alt='no-deals'
            height={150}
            width={150}
          />
          <h2 className='mt-4 text-shark-lg font-bold text-text-100'>
            No invoice created
          </h2>
          <p className='mt-4 text-shark-sm font-medium text-text-100 '>
            Join referral program to generate invoices
          </p>
        </div>{' '}
      </div>
    </div>
  )
}

export default InvoicePage
