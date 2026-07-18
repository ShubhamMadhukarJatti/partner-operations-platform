'use client'

import React from 'react'

interface BannerProps {
  icon: React.ReactNode
  title: string
  description: string
}
const Banner: React.FC<BannerProps> = ({ icon, title, description }) => {
  return (
    <div className='flex items-center gap-1 bg-[#FFF6DB] p-4'>
      <div className='rounded-lg p-3'>{icon}</div>
      <div>
        <p className='text-base/5 font-medium text-text-100'>{title}</p>
        <p className='text-sm/4 text-text-80'>{description}</p>
      </div>
    </div>
  )
}

export default Banner
