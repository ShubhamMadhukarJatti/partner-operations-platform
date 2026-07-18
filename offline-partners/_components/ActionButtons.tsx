import React, { useState } from 'react'
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

import DeletePartnersDialog from './DeletePartnersDialog'
import SendInviteDialog from './SendInviteDialog'

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

  const { selectedRows, getSelectedRowsEmails } =
    useOfflinePartnersTable(tabValue)
  const { mutate: addToGroup, isPending } = useAddPartnersToGroup()
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSendInviteDialogOpen, setIsSendInviteDialogOpen] = useState(false)
  console.log(selectedRows, 'selectedRows')
  const handleAddToGroup = () => {
    if (!selectedGroup) return

    addToGroup({
      organizationId: organization?.id,
      emails: getSelectedRowsEmails(),
      partnerGroup: selectedGroup as PartnerGroup['type']
    })
  }
  //
  const areButtonsDisabled = selectedRows.length === 0

  return (
    <div className='flex items-center gap-3'>
      {/* Delete Button */}
      <Button
        variant={areButtonsDisabled ? 'destructiveLight' : 'destructiveSolid'}
        size='sm'
        className={cn(
          'h-9 rounded-lg px-3',
          areButtonsDisabled
            ? 'cursor-not-allowed bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
            : 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600'
        )}
        disabled={areButtonsDisabled}
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        <Trash2 className='h-4 w-4' />
      </Button>

      {/* Create Group Button */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='primary'
            size='sm'
            className={cn(
              'h-9 rounded-lg px-3 text-sm font-medium',
              areButtonsDisabled && 'cursor-not-allowed'
            )}
            disabled={areButtonsDisabled}
          >
            Create group
            <ChevronDown className='ml-2 h-4 w-4' />
          </Button>
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
              variant='primary'
              className={cn(
                'w-full',
                (!selectedGroup || isPending) && 'cursor-not-allowed'
              )}
              disabled={!selectedGroup || isPending}
              onClick={handleAddToGroup}
            >
              {isPending ? 'Adding...' : 'Add to group'}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Send Invite Button */}
      <Button
        variant={areButtonsDisabled ? 'disable' : 'primary'}
        size='sm'
        className={cn(
          'h-9 rounded-lg px-4',
          areButtonsDisabled && 'cursor-not-allowed'
        )}
        disabled={areButtonsDisabled}
        onClick={() => setIsSendInviteDialogOpen(true)}
      >
        Send invite
      </Button>

      <DeletePartnersDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        tabValue={tabValue}
      />

      <SendInviteDialog
        isOpen={isSendInviteDialogOpen}
        onOpenChange={setIsSendInviteDialogOpen}
        emails={getSelectedRowsEmails()}
        tabValue={tabValue}
      />
    </div>
  )
}

export default ActionButtons
