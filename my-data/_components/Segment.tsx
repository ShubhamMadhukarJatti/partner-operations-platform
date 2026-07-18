'use client'

import React, { useEffect, useState } from 'react'
import { useIntegrationApps } from '@/http-hooks/app-integration'
import {
  useDeletePersona,
  useGetPersona,
  useGetPersonaPreview
} from '@/http-hooks/partner-match'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  BoltIcon,
  LockIcon,
  LockIcon2,
  ThreeDotsIcon,
  UserSearch,
  UserViewFinderIcon
} from '@/components/icons/icons'

import { formatDate } from '../../dashboard/utils'
import PartnerMatchProcessModal from '../../partner-match/_components/partnermatch-process-modal'
import PartnermatchSourceModal from '../../partner-match/_components/partnermatch-source-modal'
import { DataSource, PersonaResponse } from '../../partner-match/page'
import ActionPopover from './ActionPopover'

export type recordType = 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'

const SegmentCard: React.FC<{
  icon: React.ReactElement
  title: string
  description: string
  actionButton: React.ReactElement
  isLocked?: boolean
  data?: any
  recordType: recordType
}> = ({
  icon,
  title,
  description,
  actionButton,
  isLocked = false,
  data,
  recordType
}) => {
  console.log({ recordType, data })
  return (
    <div className='flex items-center justify-between rounded-xl border border-[#C8CFDC] p-4'>
      <div
        className='flex items-center gap-3'
        style={{ opacity: isLocked ? '0.5' : '1' }}
      >
        <div className='flex h-12 w-12 items-center justify-center rounded-[4px] border border-[#C8CFDC]'>
          {icon}
        </div>
        <div>
          <p className='mb-1 text-base font-semibold'>{title}</p>
          <p className='text-sm text-[#535862]'>{description}</p>
        </div>
      </div>
      {!(data && data?.length) ? (
        isLocked ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='flex gap-1 rounded-[100px] bg-[#F1F1F1] px-4 py-3 text-sm text-[#3E50F7]'>
                  <LockIcon2 /> Locked
                </button>
              </TooltipTrigger>
              <TooltipContent className='border-0 bg-[#000000BF]'>
                <p className='max-w-[175px] p-2 text-center text-white'>
                  Add customer data first to unlock it
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          actionButton
        )
      ) : (
        <div className='flex gap-8 text-sm'>
          <div>
            <p className='text-[#535862]'>Last Updated</p>
            <p>{formatDate(data?.creationTimestamp)}</p>
          </div>
          <div>
            <p className='text-[#535862]'>Records</p>
            <p>{data[0]?.fields?.length}</p>
          </div>
          <ActionPopover key={recordType} recordType={recordType} data={data} />
        </div>
      )}
      {/* {isLocked ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className='flex gap-1 rounded-[100px] bg-[#F1F1F1] px-4 py-3 text-sm text-[#3E50F7]'>
                <LockIcon2 /> Locked
              </button>
            </TooltipTrigger>
            <TooltipContent className='border-0 bg-[#000000BF]'>
              <p className='max-w-[175px] p-2 text-center text-white'>
                Add customer data first to unlock it
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        actionButton
      )} */}
    </div>
  )
}

const Segment = () => {
  const { integrations, error: fetchError } = useIntegrationApps()
  const [isLocked, setIsLocked] = useState<boolean>(true)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [activeDataSource, setActiveDataSource] = useState<DataSource | null>(
    null
  )
  const [recordType, setRecordType] = useState<recordType | null>(null)
  const { data, isLoading } = useGetPersonaPreview() as {
    data: any
    isLoading: boolean
  }
  console.log(!data)

  // Function to open modal with specific data source
  const openModalWithSource = (source: DataSource, recordType: recordType) => {
    setActiveDataSource(source)
    setIsOpen(true)
    setRecordType(recordType)
  }

  useEffect(() => {
    if (data?.length > 0) setIsLocked(false)
  }, [data])

  console.log(data)

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h2 className='text-lg font-bold '>Segments</h2>
        <p className='text-sm text-[#4D5C78]'>
          Information about his section in not less than 2 lines. This will act
          as the subtext to the heading.
        </p>
      </div>
      <SegmentCard
        key='CUSTOMER'
        recordType='CUSTOMER'
        title='Add customers'
        description={'This should be a list of your current customers'}
        icon={<BoltIcon />}
        data={data?.filter((data: any) => data?.recordType === 'CUSTOMER')}
        actionButton={
          <PartnermatchSourceModal
            recordType='CUSTOMER'
            isHeader
            openModalWithSource={openModalWithSource}
            data={integrations}
          />
        }
      />
      <SegmentCard
        key='PROSPECT'
        recordType='PROSPECT'
        data={data?.filter((data: any) => data?.recordType === 'PROSPECT')}
        isLocked={isLocked}
        title='Add prospects'
        description={'This should be accounts not in your sales cycle'}
        icon={<UserSearch />}
        actionButton={
          <PartnermatchSourceModal
            recordType='PROSPECT'
            isHeader
            openModalWithSource={openModalWithSource}
            data={integrations}
          />
        }
      />
      <SegmentCard
        recordType='OPPORTUNITY'
        data={data?.filter((data: any) => data?.recordType === 'OPPORTUNITY')}
        key='OPPORTUNITY'
        isLocked={isLocked}
        title='Open opportunities'
        description={'This should be a list of accounts not in your piepline'}
        icon={<UserViewFinderIcon />}
        actionButton={
          <PartnermatchSourceModal
            recordType='OPPORTUNITY'
            isHeader
            openModalWithSource={openModalWithSource}
            data={integrations}
          />
        }
      />
      {activeDataSource && recordType && (
        <PartnerMatchProcessModal
          recordType={recordType}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          dataSource={activeDataSource}
        />
      )}
    </div>
  )
}

export default Segment
