import React, { useState } from 'react'
import { useCollaborationsData } from '@/http-hooks/collaborations'
import { useCollaborationsTable } from '@/http-hooks/collaborations-table'
import {
  useAddPartnersToGroup,
  useOfflinePartnersTable
} from '@/http-hooks/offline-partners'
import { RootState } from '@/redux/store'
import { PartnerGroup } from '@/types'
import { ChevronDown, Trash2 } from 'lucide-react'
import { useSelector } from 'react-redux'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

import DeletePartnersDialog from '../offline-partners/_components/DeletePartnersDialog'

type Props = {
  tabValue: string
}

const partnerGroups = [
  {
    type: 'RELIABLE_PARTNER',
    label: 'Reliable Partner',
    subtext: 'High performing partners'
  },
  {
    type: 'STEADY_PARTNER',
    label: 'Steady Partner',
    subtext: 'Consistent performers'
  },
  {
    type: 'LOW_IMPACT_PARTNER',
    label: 'Low Impact Partner',
    subtext: 'Limited engagement'
  },
  {
    type: 'INACTIVE_PARTNER',
    label: 'Inactive Partner',
    subtext: 'No recent activity'
  }
]

const ActionButtons = ({ tabValue }: Props) => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { loading: orgLoading, organization } = saved

  const { selectedRows, getSelectedRowsEmails } = useCollaborationsTable(
    tabValue,
    'collab'
  )
  //   const { selectedRows, getSelectedRowsEmails } =
  //     useCollaborationsData(tabValue)
  const { mutate: addToGroup, isPending } = useAddPartnersToGroup()
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSendInviteDialogOpen, setIsSendInviteDialogOpen] = useState(false)

  const handleAddToGroup = () => {
    if (!selectedGroup) return

    addToGroup({
      organizationId: organization?.id,
      emails: getSelectedRowsEmails(),
      partnerGroup: selectedGroup as PartnerGroup['type']
    })
  }

  const areButtonsDisabled = selectedRows.length === 0

  return (
    // <-- changed w-full -> inline-flex so this component doesn't stretch
    <div className='inline-flex items-center gap-2'>
      {/* Delete Button (commented) */}
      {/* <Button
        variant='outline'
        size='sm'
        className={cn(
          'h-9 rounded-lg border-gray-300 bg-white px-3 hover:bg-gray-50',
          areButtonsDisabled && 'cursor-not-allowed opacity-50'
        )}
        disabled={areButtonsDisabled}
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        <Trash2 className='h-4 w-4 text-red-500' />
      </Button> */}

      {/* Create Group Button */}
      <Popover>
        <PopoverTrigger asChild>
          {/* <Button
            variant='outline'
            size='sm'
            className={cn(
              'h-9 rounded-lg border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50',
              areButtonsDisabled && 'cursor-not-allowed opacity-50'
            )}
            disabled={areButtonsDisabled}
          >
            Create group
            <ChevronDown className='ml-2 h-4 w-4' />
          </Button> */}
        </PopoverTrigger>

        <PopoverContent className='w-64 rounded-lg p-4' align='end'>
          <div className='space-y-4'>
            <div className='text-sm font-medium text-gray-900'>
              Select partner group
            </div>

            <div className='space-y-3'>
              {partnerGroups.map((group) => (
                <div key={group.type} className='flex items-center space-x-3'>
                  <Checkbox
                    className='rounded border-gray-300'
                    id={group.type}
                    checked={selectedGroup === group.type}
                    onCheckedChange={() => setSelectedGroup(group.type)}
                  />
                  <div className='flex-1'>
                    <label
                      htmlFor={group.type}
                      className='cursor-pointer text-sm font-medium text-gray-900'
                    >
                      {group.label}
                    </label>
                    <p className='text-xs text-gray-500'>{group.subtext}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              className='w-full bg-blue-600 text-white hover:bg-blue-700'
              disabled={!selectedGroup || isPending}
              onClick={handleAddToGroup}
            >
              {isPending ? 'Adding...' : 'Add to group'}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Send Invite Button (commented) */}
      {/* <Button
        size='sm'
        className={cn(
          'h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700',
          areButtonsDisabled && 'cursor-not-allowed opacity-50'
        )}
        disabled={areButtonsDisabled}
        onClick={() => setIsSendInviteDialogOpen(true)}
      >
        Send invite
      </Button> */}

      {/* Optional dialogs (commented out in original) */}
      {/* <DeletePartnersDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        tabValue={tabValue}
      />

      <SendInviteDialog
        isOpen={isSendInviteDialogOpen}
        onOpenChange={setIsSendInviteDialogOpen}
        email={'office@sharkdom.com'}
        tabValue={tabValue}
      /> */}
    </div>
  )
}

export default ActionButtons
