'use client'

import React, { useEffect, useState } from 'react'
import { Award, Globe, Grid3x3 } from 'lucide-react'

import { preferredRegionsOptions } from '@/lib/constants/partner-details-constants'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

import { CourseData } from './CourseDetailsStep'

interface AssignmentRulesData {
  tiers: string[]
  geographies: string[]
  programTypes: string[]
}

interface Tier {
  id: string | number
  name: string
  active?: boolean
}

interface AssignmentRulesStepProps {
  data: CourseData
  updateData: (updates: Partial<CourseData>) => void
  courseId: number | null
}

const PROGRAM_TYPE_OPTIONS = [
  { value: 'reseller', label: 'Reseller' },
  { value: 'coseller', label: 'Coseller' }
]

const AssignmentRulesStep = ({
  data,
  updateData,
  courseId
}: AssignmentRulesStepProps) => {
  const [tiers, setTiers] = useState<Tier[]>([])
  const [isLoadingTiers, setIsLoadingTiers] = useState(true)
  const [assignmentRules, setAssignmentRules] = useState<AssignmentRulesData>({
    tiers: (data as any).assignmentRules?.tiers || [],
    geographies: (data as any).assignmentRules?.geographies || [],
    programTypes: (data as any).assignmentRules?.programTypes || []
  })

  // Fetch tiers on mount
  useEffect(() => {
    const fetchTiers = async () => {
      try {
        setIsLoadingTiers(true)
        const response = await fetch(
          '/api/catalogues/partner/tiers?page=0&size=100',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          }
        )

        if (response.ok) {
          const result = await response.json()
          if (
            result.success &&
            result.data &&
            result.data.tiers &&
            result.data.tiers.content
          ) {
            // Map tiers from API response - structure: data.tiers.content
            const mappedTiers: Tier[] = result.data.tiers.content.map(
              (tier: any) => ({
                id: tier.id || tier.tierId,
                name: tier.tierName || tier.name,
                active: tier.active !== undefined ? tier.active : true
              })
            )
            setTiers(mappedTiers)
          } else if (
            result.success &&
            result.data &&
            Array.isArray(result.data)
          ) {
            // Fallback: Handle case where API returns array directly in data
            const mappedTiers: Tier[] = result.data.map((tier: any) => ({
              id: tier.id || tier.tierId,
              name: tier.tierName || tier.name,
              active: tier.active !== undefined ? tier.active : true
            }))
            setTiers(mappedTiers)
          } else if (Array.isArray(result)) {
            // Fallback: Handle case where API returns array directly
            const mappedTiers: Tier[] = result.map((tier: any) => ({
              id: tier.id || tier.tierId,
              name: tier.tierName || tier.name,
              active: tier.active !== undefined ? tier.active : true
            }))
            setTiers(mappedTiers)
          } else {
            console.warn('Unexpected API response structure:', result)
          }
        } else {
          const errorText = await response
            .text()
            .catch(() => response.statusText)
          console.error('Failed to fetch tiers:', response.status, errorText)
        }
      } catch (error) {
        console.error('Error fetching tiers:', error)
      } finally {
        setIsLoadingTiers(false)
      }
    }

    fetchTiers()
  }, [])

  const handleTierChange = (tier: string, checked: boolean) => {
    const newTiers = checked
      ? [...assignmentRules.tiers, tier]
      : assignmentRules.tiers.filter((t) => t !== tier)
    const newRules = { ...assignmentRules, tiers: newTiers }
    setAssignmentRules(newRules)
    updateData({ assignmentRules: newRules } as any)
  }

  const handleGeographyChange = (geography: string, checked: boolean) => {
    const newGeographies = checked
      ? [...assignmentRules.geographies, geography]
      : assignmentRules.geographies.filter((g) => g !== geography)
    const newRules = { ...assignmentRules, geographies: newGeographies }
    setAssignmentRules(newRules)
    updateData({ assignmentRules: newRules } as any)
  }

  const handleProgrammeTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...assignmentRules.programTypes, type]
      : assignmentRules.programTypes.filter((t) => t !== type)
    const newRules = { ...assignmentRules, programTypes: newTypes }
    setAssignmentRules(newRules)
    updateData({ assignmentRules: newRules } as any)
  }

  return (
    <div className='mx-auto w-full max-w-[800px]'>
      <div className='mb-8'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
          Assignment Rules
        </h2>
        <p className='mt-2 text-gray-500 dark:text-white'>
          Here you can manage the course stages, add new modules, and organize
          content for optimal learning.
        </p>
      </div>

      <div className='rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-border dark:bg-card'>
        {/* Tier Section */}
        <div className='mb-8'>
          <div className='mb-4 flex items-center gap-2'>
            <Award size={18} className='text-gray-600 dark:text-white' />
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Tier
            </h3>
          </div>
          {isLoadingTiers ? (
            <div className='text-sm text-gray-500 dark:text-white'>
              Loading tiers...
            </div>
          ) : tiers.length === 0 ? (
            <div className='text-sm text-gray-500 dark:text-white'>
              No tiers available
            </div>
          ) : (
            <div className='space-y-3'>
              {tiers
                .filter((tier) => tier.active !== false)
                .map((tier) => (
                  <div key={tier.id} className='flex items-center gap-3'>
                    <Checkbox
                      id={`tier-${tier.id}`}
                      checked={assignmentRules.tiers.includes(tier.name)}
                      onCheckedChange={(checked) =>
                        handleTierChange(tier.name, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`tier-${tier.id}`}
                      className='cursor-pointer text-sm font-medium text-gray-700 dark:text-white'
                    >
                      {tier.name}
                    </Label>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Geography Section */}
        <div className='mb-8'>
          <div className='mb-4 flex items-center gap-2'>
            <Globe size={18} className='text-gray-600 dark:text-white' />
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Geography
            </h3>
          </div>
          <div className='space-y-3'>
            {preferredRegionsOptions.map((geography) => (
              <div key={geography.value} className='flex items-center gap-3'>
                <Checkbox
                  id={`geography-${geography.value}`}
                  checked={assignmentRules.geographies.includes(
                    geography.value
                  )}
                  onCheckedChange={(checked) =>
                    handleGeographyChange(geography.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`geography-${geography.value}`}
                  className='cursor-pointer text-sm font-medium text-gray-700 dark:text-white'
                >
                  {geography.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Programme Types Section */}
        <div>
          <div className='mb-4 flex items-center gap-2'>
            <Grid3x3 size={18} className='text-gray-600 dark:text-white' />
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Programme Types
            </h3>
          </div>
          <div className='space-y-3'>
            {PROGRAM_TYPE_OPTIONS.map((type) => (
              <div key={type.value} className='flex items-center gap-3'>
                <Checkbox
                  id={`programme-${type.value}`}
                  checked={assignmentRules.programTypes.includes(type.value)}
                  onCheckedChange={(checked) =>
                    handleProgrammeTypeChange(type.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`programme-${type.value}`}
                  className='cursor-pointer text-sm font-medium text-gray-700 dark:text-white'
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignmentRulesStep
