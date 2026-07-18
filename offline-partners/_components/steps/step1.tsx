import React from 'react'

import {
  CalenderIcon,
  GiftsIcon,
  GreenStarIcon,
  PopoverPlaceholder,
  StarIcon,
  TwoUserIcon
} from '@/components/icons/icons'

type BenefitCardProps = {
  title: string
  titleColor: string
  borderColor: string
  bgColor: string
  icon: React.ReactNode
  items: { icon: React.ReactNode; text: string }[]
}

const Step1 = () => {
  const BenefitCard = ({
    title,
    titleColor,
    borderColor,
    bgColor,
    icon,
    items
  }: BenefitCardProps) => (
    <div
      className={`rounded-xl border p-4`}
      style={{ borderColor, backgroundColor: bgColor }}
    >
      <div className='flex gap-3'>
        {icon}
        <p className={`text-base font-bold`} style={{ color: titleColor }}>
          {title}
        </p>
      </div>
      {items.map((item: any, idx: any) => (
        <div key={idx} className={`flex gap-4 ${idx === 0 ? 'pt-4' : 'pt-1'}`}>
          {item.icon}
          <p className='text-sm'>{item.text}</p>
        </div>
      ))}
    </div>
  )
  return (
    <div className='w-full'>
      <div className='flex items-center justify-center'>
        <div>
          <p className='text-center text-base font-bold'>
            Bring offline partners into your shared workspace
          </p>
          <p className='text-center text-base text-[#7688A8]'>
            Invite-only access with premium perks for both you and your
            partners.
          </p>
        </div>
      </div>
      <div className='flex justify-center py-4'>
        <PopoverPlaceholder />
      </div>
      <div className='flex items-center justify-center gap-2'>
        {/* Your Benefits */}
        <BenefitCard
          title='Your Benefits'
          titleColor='#3E50F7'
          borderColor='#3E50F7'
          bgColor='#F6F7FF'
          icon={<GiftsIcon />}
          items={[
            { icon: <StarIcon />, text: '+1 Active Partner' },
            { icon: <StarIcon />, text: 'Partner Mapping unlocked.' },
            {
              icon: <StarIcon />,
              text: 'Earn 2 Credits: 1 now, 1 when they join.'
            }
          ]}
        />

        {/* Their Benefits */}
        <BenefitCard
          title='Their Benefits'
          titleColor='#3FA44A'
          borderColor='#3FA44A'
          bgColor='#F5FAF5'
          icon={<TwoUserIcon size={24} />}
          items={[
            { icon: <CalenderIcon />, text: '+1 Active Partner' },
            {
              icon: <TwoUserIcon size={18} />,
              text: 'Partner Mapping unlocked.'
            },
            {
              icon: <GreenStarIcon />,
              text: 'Earn 2 Credits: 1 now, 1 when they join.'
            }
          ]}
        />
      </div>
    </div>
  )
}

export default Step1
