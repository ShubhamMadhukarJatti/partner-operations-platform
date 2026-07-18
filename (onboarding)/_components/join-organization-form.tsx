'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ConfigType } from '@/types'
import AsyncSelect from 'react-select/async'

import { JoinOrganization } from '@/lib/actions/onboarding'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { showCustomToast } from '@/components/custom-toast'

type Props = {
  designationsConfig: ConfigType[]
  token: string
}
export const JoinOrganizationForm = ({ designationsConfig, token }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [organization, setOrganization] = useState<any>(null)
  const [designation, setDesignation] = useState<any>(null)
  const handleJoinOrganization = async (formData: FormData) => {
    try {
      setIsLoading(true)
      await JoinOrganization(formData)
    } catch (error: any) {
      showCustomToast('Error', error.message, 'error', 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const loadOrganizations = async (inputValue: string) => {
    const response = await fetch(
      `/api/organization/searchByPartialName?partialName=${inputValue}&page=0&size=8`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const data = await response.json()
    if (data && data?.content && data?.content?.length > 0) {
      return data?.content.map((org: any) => ({
        value: org.id,
        label: org.name
      }))
    }
    return []
  }

  return (
    <form action={handleJoinOrganization} className='flex flex-col gap-3'>
      <div className='space-y-2'>
        <Label htmlFor='startup'>organization Name</Label>
        <AsyncSelect
          aria-label='startup'
          name='startup'
          className='max-w-sm'
          isClearable
          isSearchable
          escapeClearsValue
          noOptionsMessage={({ inputValue }) =>
            !inputValue ? null : (
              <Link
                href='/onboarding/create'
                className='flex items-center justify-center text-foreground'
              >
                Create New Organization
              </Link>
            )
          }
          classNames={{
            indicatorSeparator: () => 'hidden',
            control: ({ isFocused }) =>
              cn('!bg-background !rounded-lg !border-border !p-px !ring-0', {
                '': isFocused
              }),
            noOptionsMessage: () => '!p-1 bg-accent',
            menuList: () => '!p-1',
            menu: () => '!rounded-lg',
            option: ({ isFocused }) =>
              cn('!text-sm', {
                '!bg-accent !text-accent-foreground !rounded-md': isFocused
              })
          }}
          loadOptions={loadOrganizations}
          placeholder='Enter startup name'
          value={organization}
          onChange={(value) => setOrganization(value)}
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='designation'>designation</Label>
        <Select name='designation' required>
          <SelectTrigger className='max-w-52'>
            <SelectValue placeholder='Designation' />
          </SelectTrigger>
          <SelectContent>
            {designationsConfig.map((designation) => {
              return (
                <SelectItem key={designation.id} value={designation.key}>
                  {designation.value}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
      <div className='mt-2 flex flex-col-reverse items-center justify-between gap-2 sm:flex-row'>
        <span className='text-muted-foreground'>
          New to sharkdom?{' '}
          <Link href='/onboarding/create' className='text-foreground underline'>
            Create a profile.
          </Link>
        </span>
        <Button
          type='submit'
          loading={isLoading}
          loadingText='please wait...'
          className=''
        >
          Join
        </Button>
      </div>
    </form>
  )
}
