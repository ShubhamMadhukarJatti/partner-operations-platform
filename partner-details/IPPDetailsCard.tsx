'use client'

import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { fetchIppDetails, saveIppDetails } from '@/lib/api/ipp-details'
import { colors } from '@/lib/constants/partner-details-constants'
import GenericCardSkeleton from '@/components/common/GenericCardSkeleton'
import GenericEditableCard from '@/components/common/GenericEditableCard'
import GenericEditableField from '@/components/common/GenericEditableField'
import { showCustomToast } from '@/components/custom-toast'

interface IPPDetailsCardProps {
  className?: string
}

const IPPDetailsCard: React.FC<IPPDetailsCardProps> = ({ className = '' }) => {
  const [isEditing, setIsEditing] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const emptyData = {
    companyBrandingPageLink: '',
    activePartnerPrograms: ''
  }

  const [formData, setFormData] = useState(emptyData)
  const [initialData, setInitialData] = useState(emptyData)

  // Fetch IPP details using React Query
  const {
    data: ippDetails,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['ipp-details'],
    queryFn: fetchIppDetails,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false
  })

  // Load data from API response
  useEffect(() => {
    if (ippDetails?.data) {
      const apiData = ippDetails.data

      const orgData = {
        companyBrandingPageLink: apiData.brandingPage || '',
        activePartnerPrograms: apiData.activePartnerProgram || ''
      }
      setFormData(orgData)
      setInitialData(orgData)
    }
  }, [ippDetails])

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
      const payload = {
        brandingPage: formData.companyBrandingPageLink,
        activePartnerProgram: formData.activePartnerPrograms
      }

      const result = await saveIppDetails(payload)

      if (result.success) {
        // Update initial data to new saved data
        setInitialData(formData)

        // Refetch to get latest data
        refetch()

        showCustomToast(
          'Success',
          'IPP details saved successfully',
          'success',
          5000
        )
        setIsEditing(false)
      }
    } catch (error: any) {
      showCustomToast(
        'Error',
        error.message || 'Failed to save IPP details',
        'error',
        5000
      )
      console.error('Error saving IPP details:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return <GenericCardSkeleton className={className} />
  }

  return (
    <GenericEditableCard
      title='IPP Details'
      icon='/icons/ipp_details.svg'
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
      className={`w-[48%] ${className}`}
      primaryColor={colors.primary}
    >
      {/* Form Fields */}
      <div className='space-y-4'>
        <GenericEditableField
          label='Company Branding Page Link'
          value={formData.companyBrandingPageLink}
          isEditing={isEditing}
          onChange={(val) =>
            handleInputChange('companyBrandingPageLink', val as string)
          }
          labelColor={colors.textLight}
          valueColor={colors.text}
        />
        <GenericEditableField
          label="Company's Active Partner Program"
          value={formData.activePartnerPrograms}
          isEditing={isEditing}
          onChange={(val) =>
            handleInputChange('activePartnerPrograms', val as string)
          }
          labelColor={colors.textLight}
          valueColor={colors.text}
        />
      </div>
    </GenericEditableCard>
  )
}

export default IPPDetailsCard
