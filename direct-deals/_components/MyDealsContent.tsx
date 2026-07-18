'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useGetMyDeals } from '@/http-hooks/deals'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MyDealsIcon } from '@/components/icons/icons'

import DealsCard from './DealsCard'
import EmptyStates from './EmptyStates'
import ApplicationsDrawer from './myDeals/ApplicationsDrawer'
import SecurityDepositDrawer from './myDeals/SecurityDepositDrawer'
import ViewSentApplicationDrawer from './myDeals/ViewSentApplicationDrawer'

type badgeType = {
  id: 'created' | 'joined'
  label: string
}

const badges: badgeType[] = [
  {
    id: 'created',
    label: 'Created Deals'
  },
  {
    id: 'joined',
    label: 'Applied Deals'
  }
]

interface MyDealsContentProps {
  handleCreateDeal: () => void
}

const MyDealsContent: React.FC<MyDealsContentProps> = ({
  handleCreateDeal
}) => {
  const [activeBadge, setActiveBadge] = React.useState<string>('created')
  const {
    data,
    isLoading: isMyDealLoading,
    refetch
  } = useGetMyDeals(activeBadge)
  const [open, setOpen] = useState<boolean>(false)
  const [dealId, setDealId] = useState<string>('') // dealId for drawer to fetch application data
  // const [securityDrawerOpen, setSecurityDrawerOpen] = useState(false);

  const handleViewApplication = useCallback(
    (dealId: string) => {
      setOpen(true)
      setDealId(dealId)
    },
    [dealId]
  )

  const handleTabChange = async (badgeId: 'created' | 'joined') => {
    setActiveBadge(badgeId)
    await refetch()
  }

  return (
    <div>
      {activeBadge === 'created' && (
        <ApplicationsDrawer open={open} setOpen={setOpen} dealId={dealId} />
      )}
      {activeBadge === 'joined' && (
        <ViewSentApplicationDrawer
          open={open}
          setOpen={setOpen}
          dealId={dealId}
        />
      )}
      {/* <SecurityDepositDrawer open={securityDrawerOpen} setOpen={setSecurityDrawerOpen}  /> */}

      <div className='flex gap-5'>
        {badges.map((badge) => (
          <Badge
            onClick={() => handleTabChange(badge.id)}
            key={badge.id}
            className={cn(
              'cursor-pointer bg-white p-3  text-sm',
              badge.id === activeBadge
                ? 'bg-[#E5EFFE] text-[#3E50F7]'
                : 'border  border-[#C8CFDC] text-text-100'
            )}
            variant={'secondary'}
          >
            {badge.label}
          </Badge>
        ))}
      </div>

      <div className='mt-4 flex  flex-col items-center gap-4'>
        {!isMyDealLoading && Array.isArray(data) && data.length !== 0 ? (
          activeBadge === 'created' ? (
            data.map((deal) => (
              <DealsCard
                key={deal.dealId}
                dealId={deal.dealId}
                dealType='created'
                imageUrl={deal.logoUrl}
                title={deal.organizationName}
                tag={deal.organizationType}
                description={deal.organizationBrief}
                subdescription={deal.dealBrief}
                viewApplicationButtonClicked={handleViewApplication}
                status={deal.status}
              />
            ))
          ) : (
            data.map((deal) => (
              <DealsCard
                key={deal.dealId}
                dealId={deal.dealId}
                dealType='joined'
                imageUrl={deal.logoUrl}
                title={deal.organizationName}
                tag={deal.organizationType}
                description={deal.organizationBrief}
                subdescription={deal.dealBrief}
                viewApplicationButtonClicked={handleViewApplication}
              />
            ))
          )
        ) : activeBadge === 'created' ? (
          <EmptyStates
            icon={<MyDealsIcon />}
            title='No deals created yet'
            description={'Create a deal to get started'}
            buttonFunction={handleCreateDeal}
            buttonText={'Create Deal'}
          />
        ) : (
          <EmptyStates
            icon={<MyDealsIcon />}
            title='No deals applied to'
            description={'Join a deal or create your own'}
            buttonFunction={handleCreateDeal}
            buttonText={'Create Deal'}
          />
        )}

        {/* {
          activeBadge === 'created' ? <EmptyStates icon={<MyDealsIcon />} title='No deals created yet' description={'Create a deal to get started'} buttonFunction={handleCreateDeal} buttonText={'Create Deal'} /> : <EmptyStates icon={<MyDealsIcon />} title='No deals applied to' description={'Join a deal or create your own'} buttonFunction={handleCreateDeal} buttonText={'Create Deal'} />
            
        } */}
      </div>
    </div>
  )
}

export default MyDealsContent
