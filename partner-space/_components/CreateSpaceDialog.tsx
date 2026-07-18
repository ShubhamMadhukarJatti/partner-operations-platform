'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useCollaborationsData } from '@/http-hooks/collaborations'
import { useCreateSpace } from '@/http-hooks/partner-space'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronDown, ChevronsUpDown, X } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { z } from 'zod'

import { getOrganizationById } from '@/lib/db/organization'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export const createSpaceSchema = z.object({
  spaceName: z.string().min(1, 'Space name are required'),
  partners: z.string().min(1, 'Select one partner'),
  spaceType: z.enum(['B2B', 'D2C', 'OTHER'])
})

export type CreateSpaceData = z.infer<typeof createSpaceSchema>

const CreateSpaceDialog = () => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')
  const { mutate: createSpace, isPending } = useCreateSpace()
  const saved = useSelector((state: RootState) => state.currentOrg)
  const [allPartners, setAllPartners] = useState([])
  const { loading: orgLoading, organization } = saved

  const form = useForm<CreateSpaceData>({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      spaceName: ''
    },
    mode: 'onChange'
  })

  const {
    handleSubmit,
    control,
    formState: { errors, isValid }
  } = form

  const onSubmit = (data: CreateSpaceData) => {
    if (isValid) {
      const payload = {
        spaceName: data.spaceName,
        partnerJoined: [Number(data.partners)],
        spaceType: data.spaceType,
        creatorOrgId: organization.id
      }
      createSpace(payload)
    }

    !isPending && setOpen(false)
    form.reset()
  }

  useEffect(() => {
    const fetchPartners = async () => {
      if (!organization.id) return // Ensure organization is available
      const res = (await getOrganizationById(organization.id)) as any
      const activePartners = res?.organizationCollaborations?.filter(
        (partner: any) => partner.status === 'ACTIVE'
      )

      setAllPartners(activePartners)
    }

    fetchPartners()
  }, [organization])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='w-fit'>Create Partnership Space</Button>
      </DialogTrigger>

      <DialogContent className=''>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <div className='flex flex-col gap-2'>
              <h1 className='fds-heading'>Welcome to Partner Valve Room</h1>
              <p className='fds-text text-[#4D5C78]'>
                Create your first partnership space and start collaborating with
                your business partners.
              </p>
            </div>

            <FormField
              control={control}
              name='spaceName'
              render={({ field }) => (
                <FormItem>
                  <FormControl className='w-full'>
                    <div className='flex flex-col gap-2 text-shark-sm'>
                      <Label htmlFor='name'>Space Name*</Label>
                      <Input
                        className='rounded-lg border border-[#D5D7DA] px-3.5 py-2.5 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]'
                        type='text'
                        placeholder='e.g. TechCorp + CloudTech Alliance'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='partners'
              render={({ field }) => (
                <FormItem>
                  <div className='relative flex flex-col gap-2 text-shark-sm'>
                    <FormLabel htmlFor='name'>Select Partners*</FormLabel>
                    <Select
                      name={`partners`}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger className=' w-full rounded-xl border-text-40'>
                          <SelectValue placeholder='Select a Partner' />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {allPartners.map((partner: any) => (
                          <SelectItem
                            key={partner.organizationId}
                            value={String(partner.organizationId)}
                          >
                            {partner.organizationName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='spaceType'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <Label className='fds-text flex items-center gap-1 text-text-100'>
                    Space Type*
                  </Label>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='grid grid-cols-3 gap-4'
                    >
                      <FormItem className=''>
                        <FormControl>
                          <Label
                            htmlFor='B2B'
                            className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                          >
                            <div className='flex flex-1 gap-3 font-medium'>
                              <span className='[&:has(~[data-state=checked])]:text-primary-light-blue'>
                                B2B
                              </span>
                            </div>
                            <RadioGroupItem
                              value='B2B'
                              id='B2B'
                              className='peer '
                            />
                          </Label>
                        </FormControl>
                      </FormItem>
                      <FormItem className=''>
                        <FormControl>
                          <Label
                            htmlFor='D2C'
                            className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                          >
                            <div className='flex flex-1 gap-3 font-medium'>
                              <span className='[&:has(~[data-state=checked])]:text-primary-light-blue'>
                                D2C
                              </span>
                            </div>
                            <RadioGroupItem
                              value='D2C'
                              id='D2C'
                              className='peer '
                            />
                          </Label>
                        </FormControl>
                      </FormItem>
                      <FormItem className=''>
                        <FormControl>
                          <Label
                            htmlFor='other'
                            className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                          >
                            <div className='flex flex-1 gap-3 font-medium'>
                              <span className='[&:has(~[data-state=checked])]:text-primary-light-blue'>
                                Other
                              </span>
                            </div>
                            <RadioGroupItem
                              value='OTHER'
                              id='other'
                              className='peer '
                            />
                          </Label>
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='mt-2 flex justify-end gap-4 border-t border-text-30 py-4'>
              <Button
                variant={'ghost'}
                className='rounded-lg border border-[#D5D7DA] px-3.5 py-2.5'
                type='button'
                onClick={() => (setOpen(false), form.reset())}
              >
                Cancel
              </Button>
              <Button
                variant={isPending ? 'disable' : 'primary'}
                loading={isPending}
                type='submit'
                className={cn(
                  'rounded-lg px-3.5 py-2.5',
                  isPending &&
                    'disabled:pointer-events-auto disabled:cursor-not-allowed'
                )}
              >
                Create Space
              </Button>
            </div>
          </form>
        </Form>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateSpaceDialog
