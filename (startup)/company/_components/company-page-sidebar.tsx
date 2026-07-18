import Link from 'next/link'
import { OrganizationType } from '@/types'
import { ArrowCircleUp2, MedalStar } from 'iconsax-react'
import moment from 'moment'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import FollowButton from '@/app/(app)/(dashboard-pages)/_components/follow-button'
import DashboardItemWrapper from '@/app/(app)/(dashboard-pages)/dashboard/[id]/_components/dashboard-item-wrapper'
import CompabilityCheck from '@/app/(startup)/company/_components/CompabilityCheck'

type Props = {
  currentOrganization: OrganizationType
  organization: OrganizationType
  prompt: string
  collabStatus: string | null
}

const CompanyPageSidebar = ({
  organization,
  currentOrganization,
  prompt,
  collabStatus
}: Props) => {
  return (
    <DashboardItemWrapper className='flex-grow-1 flex h-full flex-col p-4 lg:max-w-[260px]'>
      <div className='flex flex-col gap-4'>
        {collabStatus != null ? (
          <Button
            className={cn(
              'h-[37px] w-full rounded-lg border bg-transparent font-bold  hover:bg-transparent',
              {
                ' border-semantic-caution text-semantic-caution':
                  collabStatus === 'PENDING',
                'border-semantic-success text-semantic-success':
                  collabStatus === 'ACTIVE'
              }
            )}
          >
            {collabStatus}
          </Button>
        ) : (
          <Link
            href={
              organization?.code ? `/proposal/${organization.code}/send` : '#'
            }
          >
            <Button className='h-[37px] w-full rounded-lg bg-primary-light-blue font-bold text-white'>
              Send Proposal
            </Button>
          </Link>
        )}
        {/* <Button
          onClick={handleSaveClick}
          className='h-[37px] w-full gap-1 rounded-lg border-2 border-primary-light-blue bg-transparent text-shark-sm font-bold text-primary-light-blue hover:bg-background-ghost-white hover:text-primary-light-blue '
        >
          <Archive size={16} />
          Bookmark
        </Button> */}
      </div>
      <Separator className='my-4 text-text-20' />

      <div className='flex flex-col items-center gap-2 rounded-lg bg-shark-blue-50 px-2 py-4'>
        <MedalStar size='32' color='#0062F1' />
        <p className='text-shark-sm font-medium text-text-100'>
          {currentOrganization.credits.aiProposalLeft} free proposal remaining
        </p>
        <Button
          className='h-[37px] w-full gap-2 rounded-lg text-shark-sm font-bold text-white   hover:bg-primary-dark-blue'
          style={{
            background:
              'linear-gradient(101.31deg, #0062F1 0.05%, #00398B 100.05%)'
          }}
        >
          <ArrowCircleUp2 size='16' color='#fff' />
          Upgrade
        </Button>
      </div>

      <p className='mt-4 text-shark-sm font-medium text-text-100'>
        Member since:{' '}
        {moment(organization.creationTimestamp).format('MMMM D,YYYY')}
      </p>

      <Separator className='my-4 text-text-20' />

      <CompabilityCheck
        currentOrganization={currentOrganization}
        organization={organization}
        prompt={prompt}
      />

      <div className='mt-8 flex flex-col items-center gap-2 rounded-lg bg-shark-blue-50 px-2 py-4'>
        <p className='text-center text-shark-sm font-medium text-text-100'>
          Subscribe to get updates about {organization?.name} partnership deals
        </p>
        <FollowButton
          className='h-[37px] w-full rounded-lg border border-primary-light-blue bg-white text-shark-sm font-bold text-primary-light-blue  hover:bg-background-ghost-white  '
          organizationId={organization?.id}
          currentOrganizationId={currentOrganization?.id}
        />
      </div>
    </DashboardItemWrapper>
  )
}

export default CompanyPageSidebar
