import React from 'react'

const StyleGuidBanner = () => {
  return (
    <div className='flex w-full flex-col items-center justify-between rounded-xl bg-[#151552] p-[42px] lg:flex-row'>
      <div className='flex flex-col justify-between gap-3 text-white'>
        <h2 className='text-center text-4xl font-bold lg:text-left lg:text-[48px]/[58px]'>
          Sharkdom style guide
        </h2>
        <p className='text-center text-base/5 font-normal'>
          This simple kit is for using Sharkdom logo in conjuction with our
          trademark guidelines
        </p>
      </div>
      <a
        href='https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/sharkdom_icons.rar'
        download
        className='mt-6 flex h-[55px] items-center justify-center rounded-full bg-white px-9 text-sm font-bold lg:mt-0'
      >
        Download kit
      </a>
    </div>
  )
}

export default StyleGuidBanner
