import React from 'react'
import { CheckedState } from '@radix-ui/react-checkbox'

import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { PreferenceType } from './PreferenceDialog'

const Step2Form: React.FC<{
  formData: PreferenceType
  setFormData: React.Dispatch<React.SetStateAction<PreferenceType>>
}> = ({ formData, setFormData }) => {
  const handleExcludeCompanySizeChange = (
    checked: CheckedState,
    value: string
  ) => {
    setFormData((prevData: any) => {
      const updatedSize = checked
        ? [...prevData.excludeCompanySize, value]
        : prevData.excludeCompanySize.filter((p: string) => p !== value)

      return {
        ...prevData,
        excludeCompanySize: updatedSize
      }
    })
  }
  const handleExcludePartnershipGoals = (
    checked: CheckedState,
    value: string
  ) => {
    setFormData((prevData: any) => {
      const updatedGoals = checked
        ? [...prevData.excludePartnershipGoals, value]
        : prevData.excludePartnershipGoals.filter((p: string) => p !== value)

      return {
        ...prevData,
        excludePartnershipGoals: updatedGoals
      }
    })
  }

  const handleExcludeRegion = (checked: CheckedState, value: string) => {
    setFormData((prevData: any) => {
      const updatedRegion = checked
        ? [...prevData.avoidGeographicRegion, value]
        : prevData.avoidGeographicRegion.filter((p: string) => p !== value)

      return {
        ...prevData,
        avoidGeographicRegion: updatedRegion
      }
    })
  }

  return (
    <div className='space-y-6'>
      <div className=''>
        <Label htmlFor='sector' className='mb-1.5 text-sm text-[#414651]'>
          What company sizes should be excluded from your view?
        </Label>

        <div className='grid grid-cols-2 gap-4 lg:grid-cols-3'>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='SOLO_ENTREPRENEURS'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Solo Entrepreneurs
            </label>
            <Checkbox
              checked={formData.excludeCompanySize?.includes(
                'SOLO_ENTREPRENEURS'
              )}
              onCheckedChange={(checked) =>
                handleExcludeCompanySizeChange(checked, 'SOLO_ENTREPRENEURS')
              }
              className='rounded-sm'
              id='SOLO_ENTREPRENEURS'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='SMALL_BUSINESSES'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Small Businesses (11–50 employees)
            </label>
            <Checkbox
              checked={formData.excludeCompanySize?.includes(
                'SMALL_BUSINESSES'
              )}
              onCheckedChange={(checked) =>
                handleExcludeCompanySizeChange(checked, 'SMALL_BUSINESSES')
              }
              className='rounded-sm'
              id='SMALL_BUSINESSES'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='STARTUPS'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Startups (1–10 employees)
            </label>
            <Checkbox
              checked={formData.excludeCompanySize?.includes('STARTUPS')}
              onCheckedChange={(checked) =>
                handleExcludeCompanySizeChange(checked, 'STARTUPS')
              }
              className='rounded-sm'
              id='STARTUPS'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='MEDIUM_COMPANIES'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Medium Companies (51–200 employees)
            </label>
            <Checkbox
              checked={formData.excludeCompanySize?.includes(
                'MEDIUM_COMPANIES'
              )}
              onCheckedChange={(checked) =>
                handleExcludeCompanySizeChange(checked, 'MEDIUM_COMPANIES')
              }
              className='rounded-sm'
              id='MEDIUM_COMPANIES'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='ENTERPRISES'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Enterprises (200+ employees)
            </label>
            <Checkbox
              checked={formData.excludeCompanySize?.includes('ENTERPRISES')}
              onCheckedChange={(checked) =>
                handleExcludeCompanySizeChange(checked, 'ENTERPRISES')
              }
              className='rounded-sm'
              id='ENTERPRISES'
            />
          </div>
        </div>
      </div>
      <div className=''>
        <Label htmlFor='sector' className='mb-1.5 text-sm text-[#414651]'>
          Which partnership goals are you not looking for?
        </Label>

        <div className='grid grid-cols-2 gap-4 lg:grid-cols-3'>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='INVESTMENT'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Investment
            </label>
            <Checkbox
              checked={formData.excludePartnershipGoals?.includes('INVESTMENT')}
              onCheckedChange={(checked) =>
                handleExcludePartnershipGoals(checked, 'INVESTMENT')
              }
              className='rounded-sm'
              id='INVESTMENT'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='JOINT_VENTURE'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Joint Venture
            </label>
            <Checkbox
              checked={formData.excludePartnershipGoals?.includes(
                'JOINT_VENTURE'
              )}
              onCheckedChange={(checked) =>
                handleExcludePartnershipGoals(checked, 'JOINT_VENTURE')
              }
              className='rounded-sm'
              id='JOINT_VENTURE'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='MARKETING_COLLABORATION'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Marketing Collaboration
            </label>
            <Checkbox
              checked={formData.excludePartnershipGoals?.includes(
                'MARKETING_COLLABORATION'
              )}
              onCheckedChange={(checked) =>
                handleExcludePartnershipGoals(
                  checked,
                  'MARKETING_COLLABORATION'
                )
              }
              className='rounded-sm'
              id='MARKETING_COLLABORATION'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='TECHNOLOGY_SHARING'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Technology Sharing
            </label>
            <Checkbox
              checked={formData.excludePartnershipGoals?.includes(
                'TECHNOLOGY_SHARING'
              )}
              onCheckedChange={(checked) =>
                handleExcludePartnershipGoals(checked, 'TECHNOLOGY_SHARING')
              }
              className='rounded-sm'
              id='TECHNOLOGY_SHARING'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='RESOURCE_POOLING'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Resource Pooling
            </label>
            <Checkbox
              checked={formData.excludePartnershipGoals?.includes(
                'RESOURCE_POOLING'
              )}
              onCheckedChange={(checked) =>
                handleExcludePartnershipGoals(checked, 'RESOURCE_POOLING')
              }
              className='rounded-sm'
              id='RESOURCE_POOLING'
            />
          </div>
        </div>
      </div>
      <div className=''>
        <Label htmlFor='sector' className='mb-1.5 text-sm text-[#414651]'>
          Are there any geographic regions you&apos;d like to avoid?
        </Label>

        <div className='grid grid-cols-2 gap-4 lg:grid-cols-3'>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='NORTH_AMERICA'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              North America
            </label>
            <Checkbox
              checked={formData.avoidGeographicRegion?.includes(
                'NORTH_AMERICA'
              )}
              onCheckedChange={(checked) =>
                handleExcludeRegion(checked, 'NORTH_AMERICA')
              }
              className='rounded-sm'
              id='NORTH_AMERICA'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='EUROPE'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Europe
            </label>
            <Checkbox
              checked={formData.avoidGeographicRegion?.includes('EUROPE')}
              onCheckedChange={(checked) =>
                handleExcludeRegion(checked, 'EUROPE')
              }
              className='rounded-sm'
              id='EUROPE'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='APAC'
              className='text-sm font-medium uppercase leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              APAC (Asia Pacific)
            </label>
            <Checkbox
              checked={formData.avoidGeographicRegion?.includes('APAC')}
              onCheckedChange={(checked) =>
                handleExcludeRegion(checked, 'APAC')
              }
              className='rounded-sm'
              id='APAC'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='SOUTH_AMERICA'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              South America
            </label>
            <Checkbox
              checked={formData.avoidGeographicRegion?.includes(
                'SOUTH_AMERICA'
              )}
              onCheckedChange={(checked) =>
                handleExcludeRegion(checked, 'SOUTH_AMERICA')
              }
              className='rounded-sm'
              id='SOUTH_AMERICA'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='AUSTRALIA'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Australia/Oceania
            </label>
            <Checkbox
              checked={formData.avoidGeographicRegion?.includes('AUSTRALIA')}
              onCheckedChange={(checked) =>
                handleExcludeRegion(checked, 'AUSTRALIA')
              }
              className='rounded-sm'
              id='AUSTRALIA'
            />
          </div>
          <div className='flex items-center justify-between gap-1 rounded-xl border border-[#E9EAEB] p-4'>
            <label
              htmlFor='MENA'
              className='text-sm font-medium lowercase leading-none first-letter:uppercase peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              MENA (Middle East North Africa)
            </label>
            <Checkbox
              checked={formData.avoidGeographicRegion?.includes('MENA')}
              onCheckedChange={(checked) =>
                handleExcludeRegion(checked, 'MENA')
              }
              className='rounded-sm'
              id='MENA'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step2Form
