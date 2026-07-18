import React from 'react'

interface AddAccountCardProps {
  icon: React.ReactElement
  title: string
  description: string
  onClick: () => void
}
const AddAccountCard: React.FC<AddAccountCardProps> = ({
  icon,
  title,
  description,
  onClick
}) => {
  return (
    <div
      className='flex cursor-pointer gap-4 rounded-xl border border-text-20 p-4'
      onClick={onClick}
    >
      <div className='flex min-w-[58px] items-center justify-center rounded-md bg-[#8350DB1A]'>
        {icon}
      </div>
      <div className='flex grow flex-col gap-1'>
        <p className='text-base/5 font-bold text-text-100'>{title}</p>
        <p className='text-sm/4 font-normal text-text-80 '>{description}</p>
      </div>
    </div>
  )
}

export default AddAccountCard
