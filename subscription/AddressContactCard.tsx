'use client'

import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import {
  fetchAddressContact,
  saveAddressContact
} from '@/lib/api/address-contact'
import GenericCardSkeleton from '@/components/common/GenericCardSkeleton'
import GenericEditableCard from '@/components/common/GenericEditableCard'
import GenericEditableField from '@/components/common/GenericEditableField'
import { showCustomToast } from '@/components/custom-toast'

interface AddressContactCardProps {
  className?: string
  addressContact?: any
  onSaveSuccess?: () => void
}

const AddressContactCard: React.FC<AddressContactCardProps> = ({
  className = '',
  addressContact: propAddressContact,
  onSaveSuccess
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const emptyData = {
    address: '',
    city: '',
    zipCode: '',
    country: '',
    state: '',
    phone: ''
  }

  const [formData, setFormData] = useState(emptyData)
  const [initialData, setInitialData] = useState(emptyData)

  const queryClient = useQueryClient()

  // Load data from prop
  React.useEffect(() => {
    if (propAddressContact) {
      const newData = {
        address: propAddressContact.address || '',
        city: propAddressContact.city || '',
        zipCode: propAddressContact.zipCode || '',
        country: propAddressContact.country || '',
        state: propAddressContact.state || '',
        phone: propAddressContact.phone || ''
      }
      setFormData(newData)
      setInitialData(newData)
    }
  }, [propAddressContact])

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
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        state: formData.state,
        country: formData.country,
        phone: formData.phone
      }

      const result = await saveAddressContact(payload)

      if (result.success) {
        // Update initial data to new saved data
        setInitialData(formData)

        // Refetch parent data
        if (onSaveSuccess) {
          onSaveSuccess()
        }
        queryClient.invalidateQueries({ queryKey: ['get-billing-overview'] })

        showCustomToast(
          'Success',
          'Address & contact details saved successfully',
          'success',
          5000
        )
        setIsEditing(false)
      }
    } catch (error: any) {
      showCustomToast(
        'Error',
        error.message || 'Failed to save address & contact details',
        'error',
        5000
      )
      console.error('Error saving address & contact details:', error)
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

  return (
    <GenericEditableCard
      title='Address & Contact'
      icon='/icons/notifications.svg'
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
      className={`w-[48%] ${className}`}
      primaryColor='#6863FB'
    >
      {/* Contact Information */}
      <div className='grid grid-cols-2 gap-x-8 gap-y-3'>
        <div className='col-span-2'>
          <GenericEditableField
            label='Address'
            value={formData.address}
            isEditing={isEditing}
            onChange={(val) => handleInputChange('address', val as string)}
            labelColor='#6B7280'
            valueColor='#2A3241'
          />
        </div>

        <GenericEditableField
          label='City'
          value={formData.city}
          isEditing={isEditing}
          onChange={(val) => handleInputChange('city', val as string)}
          labelColor='#6B7280'
          valueColor='#2A3241'
        />

        <GenericEditableField
          label='Zip Code'
          value={formData.zipCode}
          isEditing={isEditing}
          onChange={(val) => handleInputChange('zipCode', val as string)}
          labelColor='#6B7280'
          valueColor='#2A3241'
        />

        <GenericEditableField
          label='Country'
          value={formData.country}
          isEditing={isEditing}
          onChange={(val) => handleInputChange('country', val as string)}
          labelColor='#6B7280'
          valueColor='#2A3241'
        />

        <GenericEditableField
          label='State'
          value={formData.state}
          isEditing={isEditing}
          onChange={(val) => handleInputChange('state', val as string)}
          labelColor='#6B7280'
          valueColor='#2A3241'
        />

        <GenericEditableField
          label='Phone'
          value={formData.phone}
          isEditing={isEditing}
          onChange={(val) => handleInputChange('phone', val as string)}
          labelColor='#6B7280'
          valueColor='#2A3241'
        />
      </div>
    </GenericEditableCard>
  )
}

export default AddressContactCard
