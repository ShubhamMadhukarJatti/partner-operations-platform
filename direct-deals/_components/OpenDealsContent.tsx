import React, { useRef, useState } from 'react'
import { useGetDeals, useJoinDeal } from '@/http-hooks/deals'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

import { getServerUser } from '@/lib/server'
import { useConfigData } from '@/lib/useConfig'
import { Search } from '@/components/ui/search'
import { OpenDealIcon } from '@/components/icons/icons'

import { FilterPopover } from '../../explore-2/_components/FilterPopover'
import DealsCard from './DealsCard'
import EmptyStates from './EmptyStates'
import JoinDealDrawer from './joinDeals/JoinDealDrawer'

interface Props {
  sectorsCommaSeparated: string
  setSectorsCommaSeparated: (sectors: string) => void
  handleCreateDeal: () => void
}

const OpenDealsContent = ({
  sectorsCommaSeparated,
  setSectorsCommaSeparated,
  handleCreateDeal
}: Props) => {
  const { preferredSectors, preferredPartnerships, preferredSubSectors } =
    useConfigData()

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const { data, isLoading: isDealLoading } = useGetDeals()
  const [openJoinDealDrawer, setOpenJoinDealDrawer] = useState<boolean>(false)
  const [selectedDealId, setSelectedDealId] = useState<string>('')

  const handleJoinDealButtonClicked = (dealId: string) => {
    setOpenJoinDealDrawer(true)
    setSelectedDealId(dealId)
  }

  console.log({ data })

  return (
    <>
      <JoinDealDrawer
        open={openJoinDealDrawer}
        setOpen={setOpenJoinDealDrawer}
        dealId={selectedDealId}
      />
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-4'>
          <div className='flex w-full  max-w-md items-center justify-between pb-0'>
            <Search
              placeholder='Search'
              className='min-w-96 px-2 py-1'
              // value={searchQuery}
              // onChange={(e) => {
              //   handleSearchInput(e)
              // }}
            />
          </div>
          {preferredPartnerships && (
            <FilterPopover
              title={'Deals Type'}
              options={preferredPartnerships.map((item: any) => ({
                id: item.id,
                label: item.value,
                value: item.value
              }))}
              onSelectionChange={() => console.log('')}
              label={''}
              setActiveTab={function (x: string): void {
                throw new Error('Function not implemented.')
              }} // onSelectionChange={async (selectedIds: string[]) => {
              //   setActiveTab('input')

              //   setPartnershipType(selectedIds.join(','))
              //   await queryClient.invalidateQueries({
              //     queryKey: [
              //       'input-based-marketplace',
              //       sectorsCommaSeparated,
              //       partnershipType,
              //       subSectorsCommaSeparated,
              //       searchQuery
              //     ]
              //   })
              // }}
            />
          )}
          {preferredSectors && (
            <FilterPopover
              title={'Sector Type'}
              options={preferredSectors.map((item: any) => ({
                id: item.id,
                label: item.key,
                value: item.value
              }))}
              onSelectionChange={async (selectedIds: string[]) => {
                setSectorsCommaSeparated(selectedIds.join(','))
                // await queryClient.invalidateQueries({
                //   queryKey: [
                //     'input-based-marketplace',
                //     sectorsCommaSeparated,
                //     subSectorsCommaSeparated,
                //     searchQuery
                //   ]
                // })
              }}
            />
          )}
          {preferredSubSectors && (
            <FilterPopover
              title={'Tags'}
              options={preferredSubSectors.map((item: any) => ({
                id: item.id,
                label: item.key,
                value: item.value
              }))}
              onSelectionChange={async (selectedIds: string[]) => {
                // setSubSectorsCommaSeparated(selectedIds.join(','))
              }}
            />
          )}
        </div>
        {!isDealLoading && Array.isArray(data) ? (
          data?.map((deal) => (
            <DealsCard
              dealId={deal?.dealId}
              key={deal?.dealId}
              dealType='all'
              imageUrl={deal?.logoUrl}
              title={deal?.organizationName}
              tag={deal?.organizationType}
              description={deal?.organizationBrief}
              subdescription={deal?.dealBrief}
              joinDealButton={handleJoinDealButtonClicked}
            />
          ))
        ) : (
          <div className='flex min-h-[500px] items-center justify-center'>
            <EmptyStates
              icon={<OpenDealIcon />}
              title='No open deals available'
              description='You can check back later or create your own deal.'
              buttonText='Create Deal'
              buttonFunction={handleCreateDeal}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default OpenDealsContent
