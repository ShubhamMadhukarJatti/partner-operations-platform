'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateCollaborationGroup } from '@/http-hooks/collaborations'
import { TableRow } from '@/redux/features/tableSlice'
import { RootState } from '@/redux/store'
import { ChevronDown } from 'lucide-react'
import { useSelector } from 'react-redux'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

interface Props {
  selectedRows: TableRow[]
}

const partnerGroups = [
  {
    type: 'RELIABLE_PARTNER',
    label: 'Reliable partner',
    subtext: 'Subtext'
  },
  {
    type: 'STEADY_PARTNER',
    label: 'Steady partner',
    subtext: 'Subtext'
  },
  {
    type: 'LOW_IMPACT_PARTNER',
    label: 'Low impact partner',
    subtext: 'Subtext'
  },
  {
    type: 'INACTIVE_PARTNER',
    label: 'Inactive partner',
    subtext: 'Subtext'
  }
]

const GroupActions = ({ selectedRows }: Props) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const router = useRouter()
  const currentOrganization = useSelector(
    (state: RootState) => state.organization?.organizationData
  )
  const { mutate: createGroup, isPending } = useCreateCollaborationGroup()

  const handleCreateGroup = () => {
    console.log({
      payload: {
        organizationId: currentOrganization?.id,
        organizationCollaborationId: selectedRows.map((row) => row.orgId),
        category: selectedGroup,
        selectedRows: selectedRows
      }
    })
    createGroup({
      organizationId: currentOrganization?.id,
      organizationCollaborationId: selectedRows.map((row) => row.orgId),
      category: selectedGroup
    })
  }

  const areButtonsDisabled = selectedRows.length === 0

  return (
    <div className='flex items-center justify-start gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              'flex items-center gap-2 rounded-lg p-3 text-sm font-bold text-white',
              areButtonsDisabled && 'bg-text-20 text-text-60'
            )}
            disabled={areButtonsDisabled}
          >
            Create Group
            <ChevronDown className='h-4 w-4' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[300px] rounded-lg p-4' align='end'>
          <div className='flex flex-col gap-4'>
            {partnerGroups.map((group) => (
              <div key={group.type} className='flex items-center space-x-3'>
                <Checkbox
                  className=' rounded-lg'
                  id={group.type}
                  checked={selectedGroup === group.type}
                  onCheckedChange={() => setSelectedGroup(group.type)}
                />
                <div>
                  <label
                    htmlFor={group.type}
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    {group.label}
                  </label>
                  <p className='text-xs text-muted-foreground'>
                    {group.subtext}
                  </p>
                </div>
              </div>
            ))}
            <Button
              className='w-min disabled:bg-text-20 disabled:text-text-60'
              disabled={!selectedGroup || isPending}
              onClick={handleCreateGroup}
            >
              Add to group
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default GroupActions
