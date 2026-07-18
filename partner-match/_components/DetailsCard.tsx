import React from 'react'

const DetailsCard: React.FC<{
  title: string
  description: string
  badge?: React.ReactNode
}> = ({ title, description, badge }) => {
  return (
    <div className='flex flex-col gap-2 rounded-xl border px-4 py-3'>
      <p className='text-sm font-medium text-[#535862]'>{title}</p>
      <div className='flex items-center gap-3'>
        <p className='text-3xl font-semibold text-[#181D27]'>{description}</p>
        {badge}
      </div>
    </div>
  )
}

export default DetailsCard
