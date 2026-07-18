import React, { useState } from 'react'
import { useGetPersonPermissionData } from '@/http-hooks/partner-match'
import { ChevronDown, Clock, Shield, TrendingDown, Users } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  AffiliateIcon,
  CommunityGroupIcon,
  RankingIcon,
  TootipIcon,
  TVRetroIcon,
  Users2,
  UserSlashIcon,
  WhiteBoltIcon
} from '@/components/icons/icons'

import DataPrivacyDialog from './DataPrivacyDialog'

type permissionType = 'FULL_ACCESS' | 'HIDDEN' | 'ONLY_COUNT' | 'PARTIAL'

const PermissionBadge = (permission: permissionType) => {
  switch (permission) {
    case 'FULL_ACCESS':
      return (
        <span className='flex w-fit items-center gap-1 rounded-xl bg-black p-1 px-4 text-center text-xs text-white'>
          {/* <Users2 /> */} Full Access
          <ChevronDown className='size-4' />
        </span>
      )

    case 'ONLY_COUNT':
      return (
        <span className='flex w-fit items-center gap-1  rounded-xl border border-black p-1 px-4 text-xs'>
          Only count
          <ChevronDown className='size-4' />
        </span>
      )

    case 'HIDDEN':
      return (
        <span className='flex w-fit items-center gap-1  rounded-xl border border-black p-1 p-1 px-2 px-4 text-xs'>
          Hidden
          <ChevronDown className='size-4' />
        </span>
      )
    default:
      return (
        <span className='flex w-fit items-center gap-1 rounded-xl bg-black p-1 px-4 text-center text-xs text-white'>
          {/* <Users2 /> */} Full Access
          <ChevronDown className='size-4' />
        </span>
      )
  }
}

function evaluatePermission(permissions: any) {
  // Rule 1: Return ONLY_COUNT or HIDDEN if any exist
  const perms = Object.values(permissions) as any
  for (const perm of perms) {
    if (perm.accessType === 'ONLY_COUNT' || perm.accessType === 'HIDDEN') {
      return perm.accessType
    }
  }

  // Rule 2: If any is PARTIAL
  for (const perm of perms) {
    if (perm.accessType === 'PARTIAL') {
      return `Sharing ${perm.sharedFields.length} fields`
    }
  }

  // Rule 3: All FULL_ACCESS
  return 'FULL_ACCESS'
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const PermissionCard: React.FC<{
  group: string
  icon: React.ReactElement
  title: string
  data: any
}> = ({ icon, title, group, data }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <DataPrivacyDialog
        open={open}
        setOpen={setOpen}
        group={group}
        data={data}
      />
      <div className='grid grid-cols-12 rounded-xl border border-[#C8CFDC] p-4'>
        <div className='col-span-8 flex items-center gap-3 text-xs text-[#1E1E1E]'>
          {icon}
          <p className='text-base font-semibold text-[#181D27]'>{title}</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className='col-span-2 flex items-center text-xs text-[#1E1E1E]'
        >
          {PermissionBadge(
            data ? evaluatePermission(data?.recordPermissions) : 'Not Available'
          )}
        </button>
        <div className='col-span-2 flex flex-col justify-center text-xs text-[#1E1E1E]'>
          <p className='text-[#717182]'>
            {formatDate(data?.lastModified)} By You
          </p>
        </div>
      </div>
    </>
  )
}

const PermissionContainer = () => {
  const { data } = useGetPersonPermissionData() as { data: any }
  return (
    <div className='flex flex-col gap-4 overflow-x-auto rounded-xl border p-4'>
      <div className='w-full min-w-[700px]'>
        <div>
          <h2 className='text-base font-semibold '>Manage Permissions</h2>
          <p className='pb-4 text-sm text-[#717182]'>
            Assign Group based permissions to your partners with our fully
            encrypted escrow environment
          </p>
        </div>

        <div className='flex flex-col gap-4'>
          {/* <div className='grid grid-cols-12'>
            <p className='col-span-7 text-xs text-[#1E1E1E]'>Name</p>
            <p className='col-span-3 flex gap-1 text-xs text-[#1E1E1E]'>
              Sharing settings{' '}
              <div className='flex'>
                <Tooltip>
                  <TooltipTrigger>
                    <TootipIcon />
                  </TooltipTrigger>
                  <TooltipContent
                    side='top'
                    className='max-w-[220px] whitespace-normal break-words text-center text-sm font-normal leading-snug'
                  >
                    Shared partner data access based on segment
                  </TooltipContent>
                </Tooltip>
              </div>
            </p>
            <p className='col-span-2 text-xs text-[#1E1E1E]'>Last modified</p>
          </div> */}
          <PermissionCard
            key={'STEADY_PARTNER'}
            data={data?.permissions.find(
              (perm: any) => perm.collaborationCategory === 'STEADY_PARTNER'
            )}
            group='STEADY_PARTNER'
            icon={<Users className='h-5 w-5 text-blue-600' />}
            title='Steady Partners'
          />
          <PermissionCard
            key={'INACTIVE_PARTNER'}
            data={data?.permissions.find(
              (perm: any) => perm.collaborationCategory === 'INACTIVE_PARTNER'
            )}
            group='INACTIVE_PARTNER'
            icon={<Clock className='h-5 w-5 text-red-500' />}
            title='Inactive Partners'
          />
          <PermissionCard
            key={'RELIABLE_PARTNER'}
            data={data?.permissions.find(
              (perm: any) => perm.collaborationCategory === 'RELIABLE_PARTNER'
            )}
            group='RELIABLE_PARTNER'
            icon={<Shield className='h-5 w-5 text-green-600' />}
            title='Reliable partners'
          />
          <PermissionCard
            key={'LOW_IMPACT_PARTNER'}
            data={data?.permissions.find(
              (perm: any) => perm.collaborationCategory === 'LOW_IMPACT_PARTNER'
            )}
            group='LOW_IMPACT_PARTNER'
            icon={<TrendingDown className='h-5 w-5 text-orange-500' />}
            title='Low Impact Partner'
          />
          {/* <PermissionCard
          icon={
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#3E50F7]'>
              <AffiliateIcon />
            </div>
          }
          title='Low Impact Partners'
          permission='hidden'
          date='14/03/25'
          modifiedby='you'
        /> */}
        </div>
      </div>
    </div>
  )
}

export default PermissionContainer
