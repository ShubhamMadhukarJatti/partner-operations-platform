'use client'

import { useState } from 'react'
import Image from 'next/image'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { useSelector } from 'react-redux'

import UpgradePopup from '@/app/(app)/(dashboard-pages)/_components/UpgradePopup'

import StarTagGolden from '../../../../../public/icons/star-tag-golden.svg'
import StarTag from '../../../../../public/icons/star-tag.svg'

export default function ProposalAlert({}: any) {
  const [openUpgrade, setOpenUpgrade] = useState<boolean>(false)

  const handleCloseUpgrade = (value: boolean) => {
    setOpenUpgrade(value)
  }

  const currentOrganization = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType

  const aiProposalCredits = currentOrganization?.credits?.aiProposalLeft || 0

  return (
    <>
      <UpgradePopup
        closeUpgradePopup={handleCloseUpgrade}
        openUpgradePopup={openUpgrade}
        currentOrganization={currentOrganization}
      />

      {aiProposalCredits === 1 && (
        <div className='mt-4 flex flex-row justify-between rounded-md bg-[#B5E5FF] p-4'>
          <div className='flex flex-col'>
            <div className='flex flex-row gap-3'>
              <Image src={StarTag} width={16} height={21} alt='star-tag' />
              <p className='font-semibold'>1 free proposal remaining</p>
            </div>
          </div>
          <div className='flex flex-row gap-3'>
            <button className='rounded-md bg-white px-4 py-2 text-sm font-medium'>
              Remind me later
            </button>
            <button
              className='rounded-md bg-[#000520] px-4 py-2 text-sm font-medium text-white'
              onClick={() => setOpenUpgrade(true)}
            >
              Upgrade
            </button>
          </div>
        </div>
      )}

      {aiProposalCredits === 0 && (
        <div className='mt-4 flex flex-row justify-between rounded-md bg-[#FFF7D9] p-4'>
          <div className='flex flex-col'>
            <div className='flex flex-row gap-3'>
              <Image
                src={StarTagGolden}
                width={16}
                height={21}
                alt='star-tag-golder'
              />
              <p className='font-semibold'>Credit exhausted</p>
            </div>
            <p className=' text-sm text-muted-foreground'>
              Refill now to send more partnership request to increase your
              chances of getting an Ideal Match
            </p>
          </div>
          <div className='flex flex-row gap-3'>
            <button
              className='rounded-md bg-[#000520] px-4 py-2 text-sm font-medium text-white'
              onClick={() => setOpenUpgrade(true)}
            >
              Upgrade
            </button>
          </div>
        </div>
      )}
    </>
  )
}
