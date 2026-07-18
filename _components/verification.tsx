'use client'

import Image from 'next/image'
import verification3d from '@/../public/icons/verification-3d.png'
import { OrganizationType } from '@/types'

import { KYB } from '@/app/(app)/(dashboard-pages)/_components/kyb'

interface Props {
  organization: OrganizationType
  disableCancel?: boolean
  redirect?: boolean
}

const Verification = ({ organization }: Props) => {
  return (
    <div className='relative hidden h-[80vh] w-full max-w-xl flex-col items-center justify-center gap-10 rounded-3xl border-8 border-white bg-primary text-primary-foreground shadow md:flex'>
      <h2 className='text-3xl font-bold '>Start-up verification</h2>
      <Image
        src={verification3d}
        height={200}
        width={200}
        alt=''
        className=''
      />
      <span className='text-sm'>
        Verify your startup to gain access to all features
      </span>
      <KYB organizationId={organization.id} />
    </div>
  )
}
export default Verification
