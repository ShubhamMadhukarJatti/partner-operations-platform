import React from 'react'
import { CheckedState } from '@radix-ui/react-checkbox'

import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { PreferenceType } from './PreferenceDialog'

const Step3Form: React.FC<{
  formData: PreferenceType
  setFormData: React.Dispatch<React.SetStateAction<PreferenceType>>
}> = ({ formData, setFormData }) => {
  const handleMaturityLevelChange = (checked: CheckedState, value: string) => {
    setFormData((prevData: any) => {
      const updatedLevel = checked
        ? [...prevData.excludeBusinessMaturityLevel, value]
        : prevData.excludeBusinessMaturityLevel.filter(
            (p: string) => p !== value
          )

      return {
        ...prevData,
        excludeBusinessMaturityLevel: updatedLevel
      }
    })
  }
  const handleExcludeTechnology = (checked: CheckedState, value: string) => {
    setFormData((prevData: any) => {
      const updatedLevel = checked
        ? [...prevData.excludeCompaniesTechnology, value]
        : prevData.excludeCompaniesTechnology.filter((p: string) => p !== value)

      return {
        ...prevData,
        excludeCompaniesTechnology: updatedLevel
      }
    })
  }

  return (
    <div className='space-y-6'>
      <div className=''>
        <Label htmlFor='sector' className='mb-1.5 text-sm text-[#414651]'>
          Which business maturity levels should be excluded?
        </Label>

        <div className='grid grid-cols-2 gap-4 lg:grid-cols-3'>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='MVP'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              MVP (Minimum Viable Product)
            </label>
            <Checkbox
              checked={formData?.excludeBusinessMaturityLevel?.includes('MVP')}
              onCheckedChange={(checked) =>
                handleMaturityLevelChange(checked, 'MVP')
              }
              className='rounded-sm'
              id='MVP'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='PRE_REVENUE'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Pre-revenue
            </label>
            <Checkbox
              checked={formData?.excludeBusinessMaturityLevel?.includes(
                'PRE_REVENUE'
              )}
              onCheckedChange={(checked) =>
                handleMaturityLevelChange(checked, 'PRE_REVENUE')
              }
              className='rounded-sm'
              id='PRE_REVENUE'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='REVENUE_GENERATING'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Revenue Generating
            </label>
            <Checkbox
              checked={formData?.excludeBusinessMaturityLevel?.includes(
                'REVENUE_GENERATING'
              )}
              onCheckedChange={(checked) =>
                handleMaturityLevelChange(checked, 'REVENUE_GENERATING')
              }
              className='rounded-sm'
              id='REVENUE_GENERATING'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='SCALING_STAGE'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Scaling Stage
            </label>
            <Checkbox
              checked={formData?.excludeBusinessMaturityLevel?.includes(
                'SCALING_STAGE'
              )}
              onCheckedChange={(checked) =>
                handleMaturityLevelChange(checked, 'SCALING_STAGE')
              }
              className='rounded-sm'
              id='SCALING_STAGE'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='ESTABLISHED'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Established
            </label>
            <Checkbox
              checked={formData?.excludeBusinessMaturityLevel?.includes(
                'ESTABLISHED'
              )}
              onCheckedChange={(checked) =>
                handleMaturityLevelChange(checked, 'ESTABLISHED')
              }
              className='rounded-sm'
              id='ESTABLISHED'
            />
          </div>
        </div>
      </div>
      <div className=''>
        <Label htmlFor='sector' className='mb-1.5 text-sm text-[#414651]'>
          Exclude companies using these technologies?
        </Label>

        <div className='grid grid-cols-2 gap-4 lg:grid-cols-3'>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='WEB3_BLOCKCHAIN'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Web3 / Blockchain
            </label>
            <Checkbox
              checked={formData?.excludeCompaniesTechnology?.includes(
                'WEB3_BLOCKCHAIN'
              )}
              onCheckedChange={(checked) =>
                handleExcludeTechnology(checked, 'WEB3_BLOCKCHAIN')
              }
              className='rounded-sm'
              id='WEB3_BLOCKCHAIN'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='AI_ML'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              AI / ML
            </label>
            <Checkbox
              checked={formData?.excludeCompaniesTechnology?.includes('AI_ML')}
              onCheckedChange={(checked) =>
                handleExcludeTechnology(checked, 'AI_ML')
              }
              className='rounded-sm'
              id='AI_ML'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='AR_VR'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              AR / VR
            </label>
            <Checkbox
              checked={formData?.excludeCompaniesTechnology?.includes('AR_VR')}
              onCheckedChange={(checked) =>
                handleExcludeTechnology(checked, 'AR_VR')
              }
              className='rounded-sm'
              id='AR_VR'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='LEGACY_SYSTEMS'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Legacy Systems
            </label>
            <Checkbox
              checked={formData?.excludeCompaniesTechnology?.includes(
                'LEGACY_SYSTEMS'
              )}
              onCheckedChange={(checked) =>
                handleExcludeTechnology(checked, 'LEGACY_SYSTEMS')
              }
              className='rounded-sm'
              id='LEGACY_SYSTEMS'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='NO_AND_LOW_CODE_PLATFORM'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              No-code / Low-code Platforms
            </label>
            <Checkbox
              checked={formData?.excludeCompaniesTechnology?.includes(
                'NO_AND_LOW_CODE_PLATFORM'
              )}
              onCheckedChange={(checked) =>
                handleExcludeTechnology(checked, 'NO_AND_LOW_CODE_PLATFORM')
              }
              className='rounded-sm'
              id='NO_AND_LOW_CODE_PLATFORM'
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor='sector' className='mb-1.5 text-sm text-[#414651]'>
          Do you want to avoid companies with less than 6 months of operation?
        </Label>
        <RadioGroup
          value={formData.companySixMonthOperation ? 'Yes' : 'No'}
          onValueChange={(value) =>
            setFormData((prevData) => ({
              ...prevData,
              companySixMonthOperation: value === 'Yes' ? true : false
            }))
          }
          className='grid grid-cols-2 gap-3 md:grid-cols-2'
        >
          <div>
            <Label
              htmlFor='Yes'
              className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-[#3E50F7]'
            >
              <div className='flex flex-1 gap-3 font-medium'>
                <span className=''>Yes</span>
              </div>
              <RadioGroupItem value='Yes' id='Yes' className='peer' />
            </Label>
          </div>
          <div>
            <Label
              htmlFor='No'
              className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-[#3E50F7]  '
            >
              <div className='flex flex-1 gap-3 font-medium'>
                <span className=''>No</span>
              </div>
              <RadioGroupItem value='No' id='No' className='peer' />
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label htmlFor='sector' className='mb-1.5 text-sm text-[#414651]'>
          Do you want to avoid companies that are currently fundraising?
        </Label>
        <RadioGroup
          value={formData.companyFundRaising ? 'Yes' : 'No'}
          onValueChange={(value) =>
            setFormData((prevData) => ({
              ...prevData,
              companyFundRaising: value === 'Yes' ? true : false
            }))
          }
          className='grid grid-cols-2 gap-3 md:grid-cols-2'
        >
          <div>
            <Label
              htmlFor='Yes2'
              className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-[#3E50F7]'
            >
              <div className='flex flex-1 gap-3 font-medium'>
                <span className=''>Yes</span>
              </div>
              <RadioGroupItem value='Yes' id='Yes2' className='peer' />
            </Label>
          </div>
          <div>
            <Label
              htmlFor='No2'
              className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-2 [&:has([data-state=checked])]:border-[#3E50F7]  '
            >
              <div className='flex flex-1 gap-3 font-medium'>
                <span className=''>No</span>
              </div>
              <RadioGroupItem value='No' id='No2' className='peer' />
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

export default Step3Form
