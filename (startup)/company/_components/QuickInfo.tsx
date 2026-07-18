import Link from 'next/link'
import { OrganizationType } from '@/types'
import { EyeOff, SquareArrowOutUpRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import FollowButton from '@/app/(app)/(dashboard-pages)/_components/follow-button'

type Props = {
  currentOrganization: OrganizationType
  organization: OrganizationType
  orgSector: {
    value: string
    label: string
  } | null
}

const QuickInfo = ({ organization, currentOrganization, orgSector }: Props) => {
  return (
    <div>
      <div className=' max-w-80 justify-self-end rounded-sm border border-[#D4D4D4] p-4'>
        <p className='text-base  font-medium leading-5'>Quick info</p>
        <div className='mt-4 flex flex-col gap-2'>
          <div className='flex items-center justify-between text-base leading-5  '>
            <span className='inline-flex items-center'>
              Brand Resouces{' '}
              <Link
                href={'https://doc.sharkdom.com/branding-resources'}
                target='_blank'
              >
                <span className='ml-2 flex size-5  items-center  justify-center rounded-full bg-border font-mono text-xs font-bold leading-3'>
                  i
                </span>
              </Link>
            </span>
            <span className='text-muted-foreground'>
              {organization?.brandResources ? 'Available' : 'False'}
            </span>
          </div>
          <div className='flex items-center justify-between text-base leading-5  '>
            {' '}
            <span className='inline-flex items-center'>
              Referral Program{' '}
              <Link
                href={'https://doc.sharkdom.com/use-cases/referral-program'}
                target='_blank'
              >
                <span className='ml-2 flex size-5  items-center  justify-center rounded-full bg-border font-mono text-xs font-bold leading-3'>
                  i
                </span>
              </Link>{' '}
            </span>
            <span className='text-muted-foreground'>
              {' '}
              {organization?.referralProgram ? 'Available' : 'False'}
            </span>
          </div>
          <div className='flex items-center justify-between text-base leading-5  '>
            <span>Point of Contact</span>
            <span className='text-muted-foreground'> Founder</span>
          </div>
        </div>{' '}
        <div className='mt-6 flex flex-col gap-2'>
          <div className='flex items-center justify-between text-base leading-5  '>
            <span>Legal Name</span>
            <span className='text-muted-foreground'>
              {organization.legalName === 'string' ? (
                <EyeOff className='size-4 font-bold text-muted-foreground' />
              ) : (
                <span className='text-muted-foreground'>
                  {organization?.legalName}
                </span>
              )}
            </span>
          </div>
          <div className='flex items-center justify-between text-base leading-5  '>
            {' '}
            <span>Founded in </span>
            <span className='text-muted-foreground'>
              {' '}
              {organization?.inceptionYear}
            </span>
          </div>
          <div className='flex items-center justify-between text-base leading-5  '>
            <span>Location</span>

            {organization.city === 'string' ? (
              <EyeOff className='size-4 font-bold text-muted-foreground' />
            ) : (
              <span className='text-muted-foreground'>
                {organization?.city}
              </span>
            )}
          </div>
          <div className='flex items-center justify-between text-base leading-5  '>
            <span>Sector</span>
            <span className='text-muted-foreground'> {orgSector?.label}</span>
          </div>
          <div className='flex items-center justify-between text-base leading-5  '>
            <span>Website</span>

            {organization?.website === 'string' ? (
              <EyeOff className='size-4 font-bold text-muted-foreground' />
            ) : organization.website ? (
              <Link href={organization?.website} target='_blank'>
                <Button variant={'link'} className='px-0'>
                  {organization?.website.slice(0, 15)}
                  {organization?.website.length > 15 ? '...' : ''}
                  <SquareArrowOutUpRight className='ml-1 size-4' />
                </Button>{' '}
              </Link>
            ) : (
              <span className='text-red-500'>Not Available</span>
            )}
          </div>
        </div>
        <div className='mt-[3.5rem]  flex w-full flex-col items-center gap-3 rounded-lg  bg-[#F3F4F6] p-4'>
          <p className='text-base'>
            Subscribe to get updates about {organization?.name} partnership
            deals
          </p>

          <FollowButton
            className='h-8 w-full rounded-sm border border-[#0062F1] bg-[#D6EFFF] text-sm text-[#0062F1] hover:text-white'
            organizationId={organization?.id}
            currentOrganizationId={currentOrganization?.id}
          />
        </div>
      </div>
    </div>
  )
}

export default QuickInfo
