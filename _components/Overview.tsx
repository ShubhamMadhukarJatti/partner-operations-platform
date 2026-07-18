import React from 'react'

type Props = {
  para1: string
  para2: string
  para3: string
  para4: string
}
function Overview({ para1, para2, para3, para4 }: Props) {
  return (
    <section className='relative bg-white pb-8 lg:pb-16'>
      <div className='bg-white'>
        <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
          <div className='rounded-lg border border-[#DDDDDD] bg-white p-6 shadow-sm'>
            <h3 className='mb-4 text-xl font-semibold text-gray-900'>
              Overview
            </h3>
            <p className='text-gray-600'>{para1}</p>
            <p className='mt-4 text-gray-600'>{para2}</p>
            <div className='mt-6 rounded-lg bg-[#F5F5F7] p-4'>
              <span className='font-semibold text-[#2160FD]'>
                Sharkdom is more than just their Onboarding Platform.
              </span>{' '}
              <p className='inline text-gray-600'>{para3}</p>
            </div>
            <p className='mt-4 text-gray-600'>{para4}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Overview
