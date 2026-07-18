import React, { useEffect, useState } from 'react'
import { useChangePermission } from '@/http-hooks/partner-match'
import { RootState } from '@/redux/store'
import { ChevronDown, ChevronRight, Shield } from 'lucide-react'
import { useSelector } from 'react-redux'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Users2, UserSlashIcon } from '@/components/icons/icons'

type accessType = 'FULL_ACCESS' | 'ONLY_COUNT' | 'HIDDEN' | 'PARTIAL'

type CheckedItemKey = 'customers' | 'prospects' | 'opportunity'

type CheckedItem = {
  parent: boolean
  children: { label: string; value: boolean }[]
}

const DataPrivacyDialog: React.FC<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  group: any
  data: any
}> = ({ open, setOpen, group, data }) => {
  const [access, setAccess] = useState<accessType>('FULL_ACCESS')
  const [checked, setChecked] = useState({})
  const saved = useSelector((state: RootState) => state.currentOrg)

  const permissionKeyMap: Record<string, keyof typeof checkedItems> = {
    CUSTOMER: 'customers',
    OPPORTUNITY: 'opportunity',
    PROSPECT: 'prospects'
  }

  console.log({ access })

  const { loading: orgLoading, organization } = saved

  const [expanded, setExpanded] = useState({
    customers: true,
    opportunity: false,
    prospects: false
  })
  const mutate = useChangePermission()

  const [checkedItems, setCheckedItems] = useState<
    Record<CheckedItemKey, CheckedItem>
  >({
    customers: {
      parent: true,
      children: [
        {
          label: 'name',
          value: false
        },
        {
          label: 'companyName',
          value: false
        },
        {
          label: 'contactEmail',
          value: false
        },
        {
          label: 'domain',
          value: false
        },
        {
          label: 'dealStage',
          value: false
        },
        {
          label: 'creationDate',
          value: false
        },
        {
          label: 'closeDate',
          value: false
        },
        {
          label: 'subscribed',
          value: false
        },
        {
          label: 'ticketSize',
          value: false
        }
      ]
    },
    prospects: {
      parent: true,
      children: [
        {
          label: 'name',
          value: false
        },
        {
          label: 'companyName',
          value: false
        },
        {
          label: 'contactEmail',
          value: false
        },
        {
          label: 'domain',
          value: false
        },
        {
          label: 'dealStage',
          value: false
        },
        {
          label: 'creationDate',
          value: false
        },
        {
          label: 'closeDate',
          value: false
        },
        {
          label: 'subscribed',
          value: false
        },
        {
          label: 'ticketSize',
          value: false
        }
      ]
    },
    opportunity: {
      parent: true,
      children: [
        {
          label: 'name',
          value: false
        },
        {
          label: 'companyName',
          value: false
        },
        {
          label: 'contactEmail',
          value: false
        },
        {
          label: 'domain',
          value: false
        },
        {
          label: 'dealStage',
          value: false
        },
        {
          label: 'creationDate',
          value: false
        },
        {
          label: 'closeDate',
          value: false
        },
        {
          label: 'subscribed',
          value: false
        },
        {
          label: 'ticketSize',
          value: false
        }
      ]
    }
  })

  const toggleExpanded = (key: CheckedItemKey) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleParentCheck = (key: CheckedItemKey) => {
    setCheckedItems((prev) => {
      const isChecked = !prev[key].parent
      const updatedChildren = prev[key].children.map((child) => ({
        ...child,
        value: isChecked
      }))
      return {
        ...prev,
        [key]: {
          parent: isChecked,
          children: updatedChildren
        }
      }
    })
  }

  const handleChildCheck = (key: CheckedItemKey, index: number) => {
    setCheckedItems((prev) => {
      const updatedChildren = prev[key].children.map((child, i) =>
        i === index ? { ...child, value: !child.value } : child
      )
      const allChecked = updatedChildren.every((child: any) => child.value)
      return {
        ...prev,
        [key]: {
          parent: allChecked,
          children: updatedChildren
        }
      }
    })
  }

  const handleChangePermission = () => {
    const getSharedFields = (key: CheckedItemKey) => {
      const item = checkedItems[key]
      if (item.parent) return [] // nothing shared if parent is unchecked
      return item.children
        .filter((child: any) => child.value)
        .map((child: any) => child.label)
    }

    const getIsParentChecked = (key: CheckedItemKey) => {
      const item = checkedItems[key]
      return item.parent
    }

    mutate.mutate(
      {
        collaborationCategory: group,
        organizationId: organization?.id,
        permissions: {
          CUSTOMER: {
            accessType:
              access === 'FULL_ACCESS'
                ? getIsParentChecked('customers')
                  ? access
                  : 'PARTIAL'
                : access,
            sharedFields: getSharedFields('customers')
          },
          PROSPECT: {
            accessType:
              access === 'FULL_ACCESS'
                ? getIsParentChecked('prospects')
                  ? access
                  : 'PARTIAL'
                : access,
            sharedFields: getSharedFields('prospects')
          },
          OPPORTUNITY: {
            accessType:
              access === 'FULL_ACCESS'
                ? getIsParentChecked('opportunity')
                  ? access
                  : 'PARTIAL'
                : access,
            sharedFields: getSharedFields('opportunity')
          }
        }
      },
      {
        onSuccess: () => {
          setOpen(false)
        }
      }
    )
  }

  function evaluatePermission(permissions: any) {
    // Rule 1: Return ONLY_COUNT or HIDDEN if any exist
    const perms = Object.values(permissions) as any

    for (const perm of perms) {
      if (perm.accessType === 'ONLY_COUNT' || perm.accessType === 'HIDDEN') {
        return perm.accessType
      }
    }

    return 'FULL_ACCESS'
  }

  useEffect(() => {
    if (data) {
      setAccess(evaluatePermission(data?.recordPermissions))

      console.log(Object.entries(data?.recordPermissions))

      setCheckedItems((prev) => {
        const updated = { ...prev }

        Object.entries(data?.recordPermissions).forEach(
          ([recordKey, permission]: [any, any]) => {
            const stateKey = permissionKeyMap[recordKey]
            if (
              permission.accessType === 'PARTIAL' &&
              permission.sharedFields
            ) {
              updated[stateKey] = {
                ...updated[stateKey],
                children: updated[stateKey].children.map((field) => ({
                  ...field,
                  value: permission.sharedFields?.includes(field.label) ?? false
                }))
              }
            }
          }
        )

        return updated
      })
    }
  }, [data])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='w-full max-w-[620px] bg-transparent p-0'>
        <ScrollArea
          className={cn(
            'rounded-xl bg-white p-6',
            access === 'FULL_ACCESS' ? 'h-[calc(100dvh-24px)]' : 'h-auto'
          )}
        >
          <DialogHeader>
            <DialogTitle className='text-xl font-bold text-[#3B475D]'>
              Sharing - Strategic partner
            </DialogTitle>
          </DialogHeader>

          <div className='mt-0 space-y-4 py-3'>
            <div className='text-sm font-medium'>General Access</div>
            <Tabs
              value={access}
              onValueChange={(val: any) => setAccess(val)}
              className='w-full'
            >
              <TabsList className='grid h-auto grid-cols-3 rounded-lg'>
                <TabsTrigger
                  className='flex h-[40px] gap-2 rounded-lg font-normal data-[state=active]:bg-[#BAF5C8] data-[state=active]:text-[#153022]'
                  value='FULL_ACCESS'
                >
                  <Users2 /> Full access
                </TabsTrigger>
                <TabsTrigger
                  className='flex h-[40px] gap-2 rounded-lg data-[state=active]:bg-[#FCE8AD] data-[state=active]:text-[#1E1E1E]'
                  value='ONLY_COUNT'
                >
                  <Shield size={16} /> Only Count
                </TabsTrigger>
                <TabsTrigger
                  className='flex h-[40px] gap-2 rounded-lg data-[state=active]:bg-[#FCE1E1] data-[state=active]:text-[#1E1E1E]'
                  value='HIDDEN'
                >
                  <UserSlashIcon /> Hidden
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {access === 'ONLY_COUNT' && (
              <p className='text-sm text-[#2A3241]'>
                Your partners can see a summary count of overlaps for this
                Segments. No specifics about the overlaps, including name or any
                other data, is shared
              </p>
            )}

            {access === 'FULL_ACCESS' && (
              <div className='space-y-2'>
                <div className='text-sm font-medium'>
                  Select fields to share
                </div>

                <Collapsible
                  open={expanded.customers}
                  onOpenChange={() => toggleExpanded('customers')}
                >
                  <CollapsibleTrigger className='flex items-center gap-2'>
                    {expanded.customers ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                    <Checkbox
                      checked={checkedItems.customers.parent}
                      onCheckedChange={() => handleParentCheck('customers')}
                    />
                    Customers
                  </CollapsibleTrigger>
                  <CollapsibleContent className='ml-6 mt-2 max-h-[500px] space-y-1'>
                    {checkedItems.customers.children.map((child, key) => (
                      <div className='flex items-center gap-2' key={key}>
                        <Checkbox
                          checked={child.value}
                          onCheckedChange={() =>
                            handleChildCheck('customers', key)
                          }
                        />
                        {child.label}
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible
                  open={expanded.prospects}
                  onOpenChange={() => toggleExpanded('prospects')}
                >
                  <CollapsibleTrigger className='flex items-center gap-2'>
                    {expanded.prospects ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                    <Checkbox
                      checked={checkedItems.prospects.parent}
                      onCheckedChange={() => handleParentCheck('prospects')}
                    />
                    Prospects
                  </CollapsibleTrigger>
                  <CollapsibleContent className='ml-6 mt-2 max-h-[500px] space-y-1'>
                    {checkedItems.prospects.children.map((child, key) => (
                      <div className='flex items-center gap-2' key={key}>
                        <Checkbox
                          checked={child.value}
                          onCheckedChange={() =>
                            handleChildCheck('prospects', key)
                          }
                        />
                        {child.label}
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible
                  open={expanded.opportunity}
                  onOpenChange={() => toggleExpanded('opportunity')}
                >
                  <CollapsibleTrigger className='flex items-center gap-2'>
                    {expanded.opportunity ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                    <Checkbox
                      checked={checkedItems.opportunity.parent}
                      onCheckedChange={() => handleParentCheck('opportunity')}
                    />
                    Opportunity
                  </CollapsibleTrigger>
                  <CollapsibleContent className='ml-6 mt-2 max-h-[500px] space-y-1'>
                    {checkedItems.opportunity.children.map((child, key) => (
                      <div className='flex items-center gap-2' key={key}>
                        <Checkbox
                          checked={child.value}
                          onCheckedChange={() =>
                            handleChildCheck('opportunity', key)
                          }
                        />
                        {child.label}
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
            {access === 'HIDDEN' && (
              <p className='text-sm text-[#2A3241]'>
                Your partners cannot access this data
              </p>
            )}
            <div className='flex justify-end gap-2 pt-4'>
              <DialogClose>
                <Button variant='ghost'>Cancel</Button>
              </DialogClose>
              <Button onClick={handleChangePermission}>Save</Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default DataPrivacyDialog
