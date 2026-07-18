import React, { useState } from 'react'
import { X } from 'lucide-react'

import { useSpecificConfigData } from '@/lib/useConfig'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { PreferenceType } from './PreferenceDialog'

const Step1Form: React.FC<{
  formData: PreferenceType
  setFormData: React.Dispatch<React.SetStateAction<PreferenceType>>
}> = ({ formData, setFormData }) => {
  const { preferredPartnerships, preferredSectors } = useSpecificConfigData([
    'PREFERRED_PARTNERSHIPS',
    'PREFERRED_SECTORS'
  ])

  console.log({ formData })

  return (
    <div className='space-y-6'>
      <div className=''>
        <Label htmlFor='sector' className='mb-1.5 text-sm text-[#414651]'>
          I am looking to partner in sectors
        </Label>
        <DropdownMenu>
          <div className='relative flex h-12 w-full items-center rounded-lg border p-2'>
            {Number(formData?.preferredSectors?.length) > 0 ? (
              <div className='flex w-full flex-wrap gap-1.5 text-left text-sm capitalize'>
                {Number(formData?.preferredSectors?.length) > 7
                  ? `${formData.preferredSectors
                      ?.slice(0, 7)
                      ?.map((item: string) => item)
                      ?.join(', ')}...`
                  : formData?.preferredSectors?.map((item: string) => (
                      <button
                        key={item}
                        type='button'
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setFormData((prevData: any) => ({
                            ...prevData,
                            sectors: prevData.preferredSectors?.filter(
                              (sec: any) => sec !== item
                            )
                          }))
                        }}
                        className='flex items-center gap-[3px] rounded-[6px] border py-[2px] pl-[9px] pr-[4px]'
                      >
                        {item}
                        <X size={12} strokeWidth={1.5} stroke='#A4A7AE' />
                      </button>
                    ))}
              </div>
            ) : (
              <p className='w-full text-left text-sm text-gray-500'>
                Select your preferred sectors...
              </p>
            )}

            {/* Invisible button just to open the Dropdown */}
            <DropdownMenuTrigger id='sector' asChild>
              <button
                type='button'
                className='absolute inset-0 h-full w-full border-none bg-transparent focus:outline-none'
              />
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent>
            <ScrollArea className='h-72 w-60 rounded-md border'>
              {preferredSectors?.map((sector: any, idx: number) => (
                <DropdownMenuCheckboxItem
                  key={idx}
                  checked={formData.preferredSectors?.includes(sector.key)}
                  id={sector.value}
                  onClick={(e: any) => {
                    e.preventDefault()
                    setFormData((prevData: any) => {
                      const updatedSectors =
                        prevData.preferredSectors?.includes(sector.key)
                          ? prevData.preferredSectors?.filter(
                              (value: any) => value !== sector.key
                            )
                          : [...prevData.preferredSectors, sector.key]

                      return {
                        ...prevData,
                        preferredSectors: updatedSectors
                      }
                    })
                  }}
                >
                  {sector.key}
                </DropdownMenuCheckboxItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className=''>
        <Label htmlFor='sector' className='mb-1.5 text-sm text-[#414651]'>
          Preferred Partnership Types
        </Label>

        <div className='grid grid-cols-2 gap-4 lg:grid-cols-3'>
          {preferredPartnerships?.map((partnership: any, idx: number) => {
            return (
              <div
                key={idx}
                className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4 transition-colors hover:bg-gray-50 sm:text-base [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-[#3E50F7]'
              >
                <label
                  htmlFor={partnership.value}
                  className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70 '
                >
                  {partnership.value}
                </label>
                <Checkbox
                  value={partnership.value}
                  checked={formData?.preferredPartnershipTypes?.includes(
                    partnership.value
                  )}
                  onCheckedChange={(checked) => {
                    setFormData((prevData: any) => {
                      const updatedPartnerships = checked
                        ? [
                            ...prevData?.preferredPartnershipTypes,
                            partnership.value
                          ]
                        : prevData.preferredPartnershipTypes?.filter(
                            (p: any) => p !== partnership.value
                          )

                      return {
                        ...prevData,
                        preferredPartnershipTypes: updatedPartnerships
                      }
                    })
                  }}
                  className='rounded-sm'
                  id={partnership.value}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <Label htmlFor='sector' className='mb-1.5 text-sm text-[#414651]'>
          Market Segment
        </Label>
        <RadioGroup
          value={formData.companyType ?? ''}
          onValueChange={(value) => {
            setFormData((prevData: any) => ({
              ...prevData,
              companyType: value
            }))
          }}
          defaultValue={'B2B'}
          className='grid grid-cols-1 gap-3 md:grid-cols-3'
        >
          <div>
            <Label
              htmlFor='B2B'
              className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-[#3E50F7]'
            >
              <div className='flex flex-1 gap-3 font-medium'>
                <span className=''>B2B</span>
              </div>
              <RadioGroupItem value='B2B' id='B2B' className='peer' />
            </Label>
          </div>
          <div>
            <Label
              htmlFor='B2C'
              className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-[#3E50F7]  '
            >
              <div className='flex flex-1 gap-3 font-medium'>
                <span className=''>B2C</span>
              </div>
              <RadioGroupItem value='B2C' id='B2C' className='peer' />
            </Label>
          </div>
          <div>
            <Label
              htmlFor='B2B2C'
              className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-[#3E50F7] '
            >
              <div className='flex flex-1 gap-3 font-medium'>
                <span className=''>B2B2C</span>
              </div>
              <RadioGroupItem value='B2B2C' id='B2B2C' className='peer' />
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label htmlFor='sector' className='mb-1.5 text-sm text-[#414651]'>
          How many current partners do you have?
        </Label>
        <RadioGroup
          value={formData.onboardedPartners ?? ''}
          onValueChange={(value) => {
            setFormData((prevData: any) => ({
              ...prevData,
              onboardedPartners: value
            }))
          }}
          className='grid grid-cols-2 gap-3 md:grid-cols-4'
        >
          <div>
            <Label
              htmlFor='ZERO'
              className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-[#3E50F7]'
            >
              <div className='flex flex-1 gap-3 font-medium'>
                <span className=''>0</span>
              </div>
              <RadioGroupItem value='ZERO' id='ZERO' className='peer' />
            </Label>
          </div>
          <div>
            <Label
              htmlFor='LESS_THAN_FIVE'
              className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-[#3E50F7]  '
            >
              <div className='flex flex-1 gap-3 font-medium'>
                <span className=''>{'<5'}</span>
              </div>
              <RadioGroupItem
                value='LESS_THAN_FIVE'
                id='LESS_THAN_FIVE'
                className='peer'
              />
            </Label>
          </div>
          <div>
            <Label
              htmlFor='BETWEEN_5_AND_20'
              className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-[#3E50F7] '
            >
              <div className='flex flex-1 gap-3 font-medium'>
                <span className=''>5-20</span>
              </div>
              <RadioGroupItem
                value='BETWEEN_5_AND_20'
                id='BETWEEN_5_AND_20'
                className='peer'
              />
            </Label>
          </div>
          <div>
            <Label
              htmlFor='MORE_THAN_20'
              className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-[#3E50F7] '
            >
              <div className='flex flex-1 gap-3 font-medium'>
                <span className=''>{'>20'}</span>
              </div>
              <RadioGroupItem
                value='MORE_THAN_20'
                id='MORE_THAN_20'
                className='peer'
              />
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

export default Step1Form
