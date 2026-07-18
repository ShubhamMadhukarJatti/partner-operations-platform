'use client'

import React, { useEffect, useState } from 'react'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { useSelector } from 'react-redux'

import {
  fetchPartnershipDetails,
  savePartnershipDetails
} from '@/lib/api/partnership-details'
import {
  colors,
  goalWithSharkdomOptions,
  gtmTeamOptions,
  lookingPartnersInSectorsOptions,
  marketSegmentOptions,
  numberOfPartnersOptions,
  partnershipTypesOptions,
  preferredRegionsOptions,
  registrationTypeOptions
} from '@/lib/constants/partner-details-constants'
import type {
  PartnershipDetailsData,
  PreferredPartnershipType,
  PreferredSector
} from '@/lib/db/partnership-details'
import GenericEditableCard from '@/components/common/GenericEditableCard'
import GenericEditableField from '@/components/common/GenericEditableField'
import { showCustomToast } from '@/components/custom-toast'

interface ProductMarketCardProps {
  className?: string
}

interface ProductMarketFormData {
  marketSegment: string
  targetAudience: string
  registrationType: string
  numberOfPartners: string
  gtmTeam: string
  lookingPartnersInSectors: string[]
  goalWithSharkdom: string[]
  preferredRegionsForPartnership: string[]
  interestInPartnershipTypes: string[]
}

const ProductMarketCard: React.FC<ProductMarketCardProps> = ({
  className = ''
}) => {
  const organization = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // Initialize with empty values - will be populated from API
  const initialFormData: ProductMarketFormData = {
    marketSegment: '',
    targetAudience: '',
    registrationType: '',
    numberOfPartners: '',
    gtmTeam: '',
    lookingPartnersInSectors: [],
    goalWithSharkdom: [],
    preferredRegionsForPartnership: [],
    interestInPartnershipTypes: []
  }
  const [formData, setFormData] =
    useState<ProductMarketFormData>(initialFormData)
  const [initialData, setInitialData] =
    useState<ProductMarketFormData>(initialFormData)
  const [existingPartnershipTypes, setExistingPartnershipTypes] = useState<
    PreferredPartnershipType[]
  >([])
  const [existingSectors, setExistingSectors] = useState<PreferredSector[]>([])

  // Map API partnershipTeamSize to form value
  const mapPartnershipTeamSizeToForm = (teamSize: string | null): string => {
    if (!teamSize) return ''
    const mapping: Record<string, string> = {
      ZERO: 'No',
      LESS_THAN_5: 'Yes',
      BETWEEN_5_AND_20: 'Yes',
      MORE_THAN_20: 'Yes'
    }
    return mapping[teamSize] || ''
  }

  // Map form value to API partnershipTeamSize
  const mapFormToPartnershipTeamSize = (formValue: string): string | null => {
    if (formValue === 'Yes') {
      // Default to LESS_THAN_5 if Yes is selected
      // You might want to add a separate field for team size
      return 'LESS_THAN_5'
    }
    return 'ZERO'
  }

  // Fetch partnership details on mount
  useEffect(() => {
    const loadPartnershipDetails = async () => {
      setIsLoading(true)
      try {
        const response = await fetchPartnershipDetails()
        // Handle both response structures: {success, data} or direct data
        const apiData: PartnershipDetailsData =
          response && 'data' in response
            ? (response.data as PartnershipDetailsData)
            : (response as any)

        if (apiData) {
          // Map API data to form state - use only API data, no hardcoded fallbacks
          const mappedData: ProductMarketFormData = {
            marketSegment: apiData.companyType || '',
            targetAudience: apiData.targetMarket || '',
            registrationType: apiData.registrationType || '',
            numberOfPartners: apiData.onboardedPartners || '',
            gtmTeam: apiData.partnershipTeamSize || '',
            lookingPartnersInSectors: Array.isArray(apiData.preferredSectors)
              ? apiData.preferredSectors
                  .map((sector) => sector.area)
                  .filter(Boolean)
              : [],
            goalWithSharkdom: Array.isArray(apiData.goalsToUseSharkdom)
              ? apiData.goalsToUseSharkdom
                  .filter(Boolean)
                  .map((goal: string) => {
                    // Transform API values to match option values
                    const mapping: Record<string, string> = {
                      'Partner channel marketing': 'Partner Channel Marketing',
                      'Manage current partnerships':
                        'Manage Current Partnerships',
                      'Discover New Partners': 'Discover New Partners',
                      'Just exploring': 'Just exploring'
                    }
                    return mapping[goal] || goal
                  })
              : [],
            preferredRegionsForPartnership: Array.isArray(
              apiData.regionToPartnerWith
            )
              ? apiData.regionToPartnerWith.filter(Boolean)
              : [],
            interestInPartnershipTypes: Array.isArray(
              apiData.preferredPartnershipTypes
            )
              ? apiData.preferredPartnershipTypes
                  .map((type) => type.area)
                  .filter(Boolean)
              : []
          }

          setFormData(mappedData)
          setInitialData(mappedData)
          // Store existing data to preserve IDs when saving
          setExistingPartnershipTypes(apiData.preferredPartnershipTypes || [])
          setExistingSectors(apiData.preferredSectors || [])
        }
      } catch (error: any) {
        console.error('Error fetching partnership details:', error)
        showCustomToast(
          'Error',
          error.message || 'Failed to load partnership details',
          'error',
          5000
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadPartnershipDetails()
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData(initialData)
    setIsEditing(false)
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Convert form data to API payload structure
      // Build preferredPartnershipTypes - preserve all fields from existing entries
      const preferredPartnershipTypes: PreferredPartnershipType[] =
        Array.isArray(formData.interestInPartnershipTypes)
          ? formData.interestInPartnershipTypes.map((area) => {
              // Try to find existing entry with same area to preserve ID and timestamps
              const existing = existingPartnershipTypes.find(
                (pt) => pt.area === area
              )
              if (existing) {
                // Preserve all existing fields
                return {
                  ...(existing.id !== undefined && { id: existing.id }),
                  ...(existing.creationTimestamp && {
                    creationTimestamp: existing.creationTimestamp
                  }),
                  ...(existing.lastUpdatedTimestamp && {
                    lastUpdatedTimestamp: existing.lastUpdatedTimestamp
                  }),
                  area
                } as PreferredPartnershipType
              }
              // New entry - send only area (API will generate id and timestamps)
              return {
                area
              } as PreferredPartnershipType
            })
          : []

      // Build preferredSectors - preserve all fields from existing entries
      const preferredSectors: PreferredSector[] = Array.isArray(
        formData.lookingPartnersInSectors
      )
        ? formData.lookingPartnersInSectors.map((area: string) => {
            // Try to find existing entry with same area to preserve ID and timestamps
            const existing = existingSectors.find((s) => s.area === area)
            if (existing) {
              // Preserve all existing fields
              return {
                ...(existing.id !== undefined && { id: existing.id }),
                ...(existing.creationTimestamp && {
                  creationTimestamp: existing.creationTimestamp
                }),
                ...(existing.lastUpdatedTimestamp && {
                  lastUpdatedTimestamp: existing.lastUpdatedTimestamp
                }),
                area
              } as PreferredSector
            }
            // New entry - send only area (API will generate id and timestamps)
            return {
              area
            } as PreferredSector
          })
        : []

      // Build payload, ensuring no undefined values
      const payload: PartnershipDetailsData = {
        registrationType:
          formData.registrationType && formData.registrationType.trim()
            ? formData.registrationType.trim()
            : null,
        partnershipTeamSize: formData.gtmTeam || null,
        goalsToUseSharkdom: Array.isArray(formData.goalWithSharkdom)
          ? formData.goalWithSharkdom
              .filter((goal) => goal && goal.trim())
              .map((goal: string) => {
                // Transform form values back to API format
                const reverseMapping: Record<string, string> = {
                  'Partner Channel Marketing': 'Partner channel marketing',
                  'Manage Current Partnerships': 'Manage current partnerships',
                  'Discover New Partners': 'Discover New Partners',
                  'Just exploring': 'Just exploring'
                }
                return reverseMapping[goal] || goal
              })
          : [],
        preferredPartnershipTypes: preferredPartnershipTypes.filter(
          (pt) => pt.area && pt.area.trim()
        ),
        regionToPartnerWith: Array.isArray(
          formData.preferredRegionsForPartnership
        )
          ? formData.preferredRegionsForPartnership.filter(
              (region) => region && region.trim()
            )
          : [],
        targetMarket:
          formData.targetAudience && formData.targetAudience.trim()
            ? formData.targetAudience.trim()
            : null,
        onboardedPartners:
          formData.numberOfPartners && formData.numberOfPartners.trim()
            ? formData.numberOfPartners.trim()
            : null,
        companyType:
          formData.marketSegment && formData.marketSegment.trim()
            ? formData.marketSegment.trim()
            : null,
        preferredSectors: preferredSectors.filter(
          (sector) => sector.area && sector.area.trim()
        )
      }

      // Remove any undefined values from nested objects
      const cleanPayload = JSON.parse(
        JSON.stringify(payload, (key, value) => {
          if (value === undefined) return null
          return value
        })
      )

      const result = await savePartnershipDetails(cleanPayload)

      // Handle both response structures: {success, message, data} or direct response
      const isSuccess =
        (result && 'success' in result && result.success) ||
        (!('success' in result) && result)

      if (isSuccess) {
        // Update initial data to new saved data
        setInitialData(formData)

        showCustomToast(
          'Success',
          'Product market details saved successfully',
          'success',
          5000
        )
        setIsEditing(false)
      } else {
        const errorMessage =
          (result && 'message' in result && result.message) ||
          'Failed to save partnership details'
        throw new Error(errorMessage)
      }
    } catch (error: any) {
      showCustomToast(
        'Error',
        error.message || 'Failed to save product market details',
        'error',
        5000
      )
      console.error('Error saving product market details:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div
        className={`w-[48%] rounded-lg border border-gray-200 bg-white p-6 dark:border-border dark:bg-white/5 ${className}`}
      >
        <div className='flex items-center justify-center py-8'>
          <div className='text-gray-500 dark:text-white'>
            Loading partnership details...
          </div>
        </div>
      </div>
    )
  }

  return (
    <GenericEditableCard
      title='Product Market'
      icon='/icons/product_market.svg'
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
      className={`w-[48%] ${className}`}
      primaryColor={colors.primary}
    >
      {/* Form Fields */}
      <div className='grid grid-cols-2 gap-x-8 gap-y-3'>
        <GenericEditableField
          label='Market Segment'
          value={formData.marketSegment}
          isEditing={isEditing}
          onChange={(val) => handleInputChange('marketSegment', val)}
          type='select'
          options={marketSegmentOptions}
          placeholder={`Please select Market Segment`}
          labelColor={colors.textLight}
          valueColor={colors.text}
        />
        <GenericEditableField
          label='Registration Type'
          value={formData.registrationType}
          isEditing={isEditing}
          onChange={(val) => handleInputChange('registrationType', val)}
          type='select'
          options={registrationTypeOptions}
          placeholder={`Please select Registration Type`}
          labelColor={colors.textLight}
          valueColor={colors.text}
        />
        <GenericEditableField
          label='Number of Partners'
          value={formData.numberOfPartners}
          isEditing={isEditing}
          onChange={(val) => handleInputChange('numberOfPartners', val)}
          type='select'
          options={numberOfPartnersOptions}
          placeholder={`Please select Number of Partners`}
          labelColor={colors.textLight}
          valueColor={colors.text}
        />
        <GenericEditableField
          label='GTM Team'
          value={formData.gtmTeam}
          isEditing={isEditing}
          onChange={(val) => handleInputChange('gtmTeam', val)}
          type='select'
          options={gtmTeamOptions}
          placeholder={`Please select GTM Team`}
          labelColor={colors.textLight}
          valueColor={colors.text}
        />
        <div className='col-span-2'>
          <GenericEditableField
            label='Looking Partners in Sectors'
            value={formData.lookingPartnersInSectors}
            isEditing={isEditing}
            onChange={(val) =>
              handleInputChange('lookingPartnersInSectors', val)
            }
            type='multiselect'
            options={lookingPartnersInSectorsOptions}
            labelColor={colors.textLight}
            valueColor={colors.text}
          />
        </div>
        <div className='col-span-2'>
          <GenericEditableField
            label='Goal with Sharkdom'
            value={formData.goalWithSharkdom}
            isEditing={isEditing}
            onChange={(val) => handleInputChange('goalWithSharkdom', val)}
            type='multiselect'
            options={goalWithSharkdomOptions}
            labelColor={colors.textLight}
            valueColor={colors.text}
          />
        </div>
        <div className='col-span-2'>
          <GenericEditableField
            label='Preferred Regions for Partnership'
            value={formData.preferredRegionsForPartnership}
            isEditing={isEditing}
            onChange={(val) =>
              handleInputChange('preferredRegionsForPartnership', val)
            }
            type='multiselect'
            options={preferredRegionsOptions}
            labelColor={colors.textLight}
            valueColor={colors.text}
          />
        </div>
        <div className='col-span-2'>
          <GenericEditableField
            label='Interest in Partnership types'
            value={formData.interestInPartnershipTypes}
            isEditing={isEditing}
            onChange={(val) =>
              handleInputChange('interestInPartnershipTypes', val)
            }
            type='multiselect'
            options={partnershipTypesOptions}
            labelColor={colors.textLight}
            valueColor={colors.text}
          />
        </div>
      </div>
    </GenericEditableCard>
  )
}

export default ProductMarketCard
