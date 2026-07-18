'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { OrganizationType } from '@/types'
import UpgradePopup from '@app/(dashboard-pages)/_components/UpgradePopup'

export default function GetInsights({
  currentOrganization,
  orgName
}: {
  currentOrganization: OrganizationType
  orgName: string
}) {
  const router = useRouter()

  const [openUpgrade, setOpenUpgrade] = useState(false)

  const handleCloseUpgrade = (value: boolean) => {
    setOpenUpgrade(value)
  }

  return (
    <div className='max-w-80'>
      <UpgradePopup
        openUpgradePopup={openUpgrade}
        closeUpgradePopup={handleCloseUpgrade}
        currentOrganization={currentOrganization}
      />
      <div className='rounded-t-md bg-[#B5E5FF] p-4'>
        <div className='flex flex-col  gap-4'>
          <p className=' text-xl font-bold'>Want to get more insights?</p>
          <div className=' flex flex-col gap-3'>
            <div className='flex flex-row items-start gap-3'>
              <Image
                className=''
                src='/icons/star.svg'
                width={24}
                height={24}
                alt=''
              />
              <p>Check Compatibility via AI</p>
            </div>
            <div className='flex flex-row items-start gap-3'>
              <Image
                className=''
                src='/icons/star.svg'
                width={24}
                height={24}
                alt=''
              />
              <p>Check if {orgName} is a Potencial lead?</p>
            </div>
            <div className='flex flex-row items-start gap-3'>
              <Image
                className=''
                src='/icons/star.svg'
                width={24}
                height={24}
                alt=''
              />
              <p>Check if {orgName} can be Marketing ally?</p>
            </div>
            <div className='flex flex-row items-start gap-3'>
              <Image
                className=''
                src='/icons/star.svg'
                width={24}
                height={24}
                alt=''
              />
              <p>
                Check if {orgName} can improve {currentOrganization?.name}
                Brand image?
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col items-center gap-4 rounded-b-md bg-[#000520] p-4'>
        <p className='text-center text-xl font-bold text-white'>
          Unlock even more fractures with paid plans
        </p>
        <button
          className='w-full rounded-md bg-[#D6EFFF] px-4 py-2 transition duration-300 ease-in-out hover:bg-[#BFE5FC]'
          onClick={() => setOpenUpgrade(true)}
        >
          View Plans
        </button>
      </div>
    </div>
  )
}
