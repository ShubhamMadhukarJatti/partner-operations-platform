import React from 'react'
import Image from 'next/image'

const DealsPage = () => {
  return (
    <div className='h-full overflow-hidden p-4'>
      <div>
        <h1 className='text-2xl font-semibold text-[0F172A]'>Deals</h1>
        <p className='mt-2 text-sm text-[#475569]'>
          Send more proposals and keep track of any terms update from your
          partners.
        </p>
      </div>
      <div className='flex h-full items-center justify-center '>
        <div className='flex flex-col  items-center '>
          <Image src={'/deals.svg'} alt='no-deals' height={150} width={150} />
          <h2 className='mt-4 text-shark-lg font-bold text-text-100'>
            No deals available
          </h2>
          <p className='mt-4 text-shark-sm font-medium text-text-100 '>
            We’ll notify you when there’s a new deal
          </p>
        </div>{' '}
      </div>
    </div>
  )
}

export default DealsPage
