'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { storeOrganizationData } from '@/redux/reducers/organization'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Plus } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchCompanyDetails } from '@/lib/api/company-details'
import {
  colors,
  companyDetailsData,
  icons
} from '@/lib/constants/company-details-constants'
import { updateCompanyDetails } from '@/lib/db/company-details'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import GenericCardSkeleton from '@/components/common/GenericCardSkeleton'
import GenericEditableCard from '@/components/common/GenericEditableCard'
import GenericEditableField from '@/components/common/GenericEditableField'
import { showCustomToast } from '@/components/custom-toast'

export interface CompanyDetailsCardRef {
  handleSave: () => Promise<void>
}

interface CompanyDetailsCardProps {
  className?: string
}

const inHousePartnershipTeamOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' }
]

const CompanyDetailsCard = React.forwardRef<
  CompanyDetailsCardRef,
  CompanyDetailsCardProps
>(({ className = '' }, ref) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const organization = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType

  const [isSaving, setIsSaving] = useState(false)

  const emptyData = {
    banner: '',
    logo: '/logo.svg',
    companyName: '',
    foundedOn: '',
    websiteUrl: '',
    headquarters: '',
    companySize: [] as string[],
    industries: [] as string[],
    country: '',
    state: '',
    city: '',
    zipcode: '',
    contactNumber: '',
    tagline: '',
    aboutCompany: '',
    inHousePartnershipTeam: '',
    sharkdomPersonalisedUrl: '',
    aboutProductService: ''
  }

  const [formData, setFormData] = useState(emptyData)
  const [initialData, setInitialData] = useState(emptyData)

  // Fetch company details using React Query
  const {
    data: companyDetails,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['company-details'],
    queryFn: fetchCompanyDetails,
    staleTime: 0, // Data is immediately stale
    gcTime: 0, // Don't cache (formerly cacheTime in v4)
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: false // Don't refetch on window focus
  })

  // Load data from API response
  useEffect(() => {
    if (companyDetails?.data) {
      const apiData = companyDetails.data

      // Convert ISO date to YYYY-MM-DD format for date input
      let formattedDate = ''
      if (apiData.incorporationDate) {
        try {
          const date = new Date(apiData.incorporationDate)
          formattedDate = date.toISOString().split('T')[0] // Get YYYY-MM-DD
        } catch {
          formattedDate = ''
        }
      }

      const orgData = {
        banner: '',
        logo: organization?.logoUrl || '/logo.svg',
        companyName: apiData.name || '',
        foundedOn: formattedDate,
        websiteUrl: apiData.website || '',
        headquarters: '',
        companySize: [],
        industries: [],
        country: '',
        state: '',
        city: '',
        zipcode: '',
        contactNumber: '',
        tagline: '',
        inHousePartnershipTeam:
          apiData.isInHousePartnership === null
            ? ''
            : apiData.isInHousePartnership
              ? 'Yes'
              : 'No',
        sharkdomPersonalisedUrl: `https://sharkdom.com/company/${organization?.code || ''}`,
        aboutCompany: apiData.about || '',
        aboutProductService: apiData.aboutProductService || ''
      }
      setFormData(orgData)
      setInitialData(orgData)
    }
  }, [companyDetails, organization])

  React.useImperativeHandle(ref, () => ({
    handleSave
  }))

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Prepare payload for API
      const payload = {
        name: formData.companyName,
        about: formData.aboutCompany,
        incorporationDate: formData.foundedOn
          ? new Date(formData.foundedOn).toISOString()
          : null,
        isInHousePartnership:
          formData.inHousePartnershipTeam === ''
            ? false
            : formData.inHousePartnershipTeam === 'Yes',
        website: formData.websiteUrl,
        productUrl: formData.websiteUrl, // Using website URL as product URL
        aboutProductService: formData.aboutProductService
      }

      const result = await updateCompanyDetails(payload)

      if (result.success) {
        // Update initial data to new saved data
        setInitialData(formData)

        // Refetch to get latest data
        refetch()

        showCustomToast(
          'Success',
          'Company details saved successfully',
          'success',
          5000
        )
      }
    } catch (error: any) {
      showCustomToast(
        'Error',
        error.message || 'Failed to save company details',
        'error',
        5000
      )
      console.error('Error saving company details:', error)
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

  const handleUploadLogo = async (file: File) => {
    if (!organization?.id) {
      showCustomToast('Error', 'Organization ID not found', 'error', 5000)
      return
    }

    const formDataUpload = new FormData()
    formDataUpload.append('logo', file)
    try {
      const response = await axios.post(
        `/api/upload-logo?organizationId=${organization.id}`,
        formDataUpload,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      const currentOrganization = await response.data

      // Update Redux state
      dispatch(storeOrganizationData({ currentOrganization }))

      // Update local state
      if (currentOrganization?.logoUrl) {
        setFormData((prev) => ({
          ...prev,
          logo: currentOrganization.logoUrl
        }))
        showCustomToast(
          'Success',
          'Logo uploaded successfully',
          'success',
          5000
        )
      }
    } catch (error) {
      console.error('Upload error:', error)
      showCustomToast('Error', 'Failed to upload logo', 'error', 5000)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleUploadLogo(file)
    }
  }

  const handleRedirect = () => {
    if (organization?.id) {
      router.push(`/explore/${organization.id}`)
    } else {
      window.open(formData.websiteUrl, '_blank')
    }
  }

  if (isLoading) {
    return <GenericCardSkeleton className={className} />
  }

  return (
    <div
      className={`rounded-[20px] border border-[#F3F4F6] bg-white/50 p-8 ${className}`}
    >
      <h2 className='mb-8 text-xl font-bold text-[#1F2937]'>
        Basic information
      </h2>

      {/* Banner Section */}
      <div className='mb-8'>
        <label className='mb-1 block text-sm font-medium text-[#1F2937]'>
          Banner image
        </label>
        <div className='mb-3 flex items-center justify-between'>
          <p className='text-sm text-[#9CA3AF]'>Maximum file size: 5MB</p>
          <p className='text-sm text-[#9CA3AF]'>Recommended: 1128 x 191 px</p>
        </div>
        <div className='mt-2'>
          <div className='relative flex h-[140px] w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-[#F9FAFB] transition-colors hover:bg-gray-100'>
            <Input
              type='file'
              accept='image/*'
              className='absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0'
            />
            {formData.banner ? (
              <Image
                src={formData.banner}
                alt='Banner'
                fill
                className='rounded-xl object-cover'
              />
            ) : (
              <Plus size={24} color='#D1D5DB' />
            )}
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className='mb-8'>
        <label className='mb-1 block text-sm font-medium text-[#1F2937]'>
          Company Logo
        </label>
        <p className='mb-3 text-sm text-[#9CA3AF]'>Maximum file size: 5MB</p>
        <div className='mt-2'>
          <div className='flex flex-col items-start gap-4'>
            <div className='relative'>
              <Input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                className='absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0'
              />
              <div className='flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-[#F9FAFB] transition-colors hover:bg-gray-100'>
                {formData.logo && formData.logo !== '/logo.svg' ? (
                  <Image
                    src={formData.logo}
                    alt='Company Logo'
                    width={100}
                    height={100}
                    className='h-full w-full rounded-xl object-cover'
                  />
                ) : (
                  <Plus size={24} color='#D1D5DB' />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className='grid grid-cols-2 gap-x-8 gap-y-8'>
        <GenericEditableField
          label='Company name'
          value={formData.companyName}
          isEditing={true}
          onChange={(val) => handleInputChange('companyName', val as string)}
          labelColor='#1F2937'
          required={true}
          placeholder='Acme corp'
        />
        <GenericEditableField
          label='Company website'
          value={formData.websiteUrl}
          isEditing={true}
          onChange={(val) => handleInputChange('websiteUrl', val as string)}
          labelColor='#1F2937'
          prefix='https://'
          required={true}
          placeholder='www.acmecorp.com'
        />
        <GenericEditableField
          label='Founded on (year)'
          value={formData.foundedOn}
          isEditing={true}
          onChange={(val) => handleInputChange('foundedOn', val as string)}
          type='text'
          labelColor='#1F2937'
          required={true}
          placeholder='2018'
        />
        <GenericEditableField
          label='Headquarters'
          value={formData.headquarters}
          isEditing={true}
          onChange={(val) => handleInputChange('headquarters', val as string)}
          type='text'
          labelColor='#1F2937'
          required={true}
          placeholder='San Francisco'
        />
        <div className='col-span-2'>
          <GenericEditableField
            label='Company size served'
            value={formData.companySize}
            isEditing={true}
            onChange={(val) =>
              handleInputChange('companySize', val as string[])
            }
            type='pills'
            options={[
              { value: 'SMB', label: 'SMB' },
              { value: 'Mid-market', label: 'Mid-market' },
              { value: 'Enterprise', label: 'Enterprise' },
              { value: 'Startup', label: 'Startup' }
            ]}
            labelColor='#1F2937'
            required={true}
          />
          <p className='mt-1 text-[11px] text-[#9CA3AF]'>
            Select all customer segments that apply
          </p>
        </div>
        <div className='col-span-2'>
          <GenericEditableField
            label='Industries'
            value={formData.industries}
            isEditing={true}
            onChange={(val) => handleInputChange('industries', val as string[])}
            type='pills'
            options={[
              { value: 'Telecom', label: 'Telecom' },
              { value: 'Healthcare', label: 'Healthcare' },
              { value: 'Fintech', label: 'Fintech' },
              { value: 'E-Commerce', label: 'E-Commerce' },
              { value: 'SaaS', label: 'SaaS' },
              { value: 'Edtech', label: 'Edtech' },
              { value: 'Manufacturing', label: 'Manufacturing' }
            ]}
            labelColor='#1F2937'
            required={true}
          />
        </div>
        <GenericEditableField
          label='Country'
          value={formData.country}
          isEditing={true}
          onChange={(val) => handleInputChange('country', val as string)}
          type='select'
          options={[
            { value: 'US', label: 'United States' },
            { value: 'UK', label: 'United Kingdom' },
            { value: 'IN', label: 'India' }
          ]}
          placeholder='Select'
          labelColor='#1F2937'
          required={true}
        />
        <GenericEditableField
          label='State'
          value={formData.state}
          isEditing={true}
          onChange={(val) => handleInputChange('state', val as string)}
          type='select'
          options={[
            { value: 'CA', label: 'California' },
            { value: 'NY', label: 'New York' },
            { value: 'TX', label: 'Texas' }
          ]}
          placeholder='Select'
          labelColor='#1F2937'
          required={true}
        />
        <GenericEditableField
          label='City'
          value={formData.city}
          isEditing={true}
          onChange={(val) => handleInputChange('city', val as string)}
          type='select'
          options={[
            { value: 'SF', label: 'San Francisco' },
            { value: 'NYC', label: 'New York City' },
            { value: 'LA', label: 'Los Angeles' }
          ]}
          placeholder='Select'
          labelColor='#1F2937'
          required={true}
        />
        <GenericEditableField
          label='Zipcode'
          value={formData.zipcode}
          isEditing={true}
          onChange={(val) => handleInputChange('zipcode', val as string)}
          type='text'
          placeholder='Enter zipcode'
          labelColor='#1F2937'
          required={true}
        />
        <GenericEditableField
          label='Contact number'
          value={formData.contactNumber}
          isEditing={true}
          onChange={(val) => handleInputChange('contactNumber', val as string)}
          type='text'
          placeholder='+91 9876543210'
          prefix='🇮🇳 ⌄'
          labelColor='#1F2937'
          required={true}
        />
        <div className='hidden'></div> {/* Empty space for grid alignment */}
        <div className='col-span-2'>
          <GenericEditableField
            label='Tagline (short description)'
            value={formData.tagline}
            isEditing={true}
            onChange={(val) => handleInputChange('tagline', val as string)}
            type='text'
            placeholder='Enter tagline'
            labelColor='#1F2937'
            required={true}
          />
          <p className='mt-1 text-[11px] text-[#9CA3AF]'>100 characters</p>
        </div>
        <div className='col-span-2'>
          <GenericEditableField
            label='About company'
            value={formData.aboutCompany}
            isEditing={true}
            onChange={(val) => handleInputChange('aboutCompany', val as string)}
            type='textarea'
            labelColor='#1F2937'
            placeholder='Enter details about your company'
          />
        </div>
      </div>
    </div>
  )
})

CompanyDetailsCard.displayName = 'CompanyDetailsCard'

export default CompanyDetailsCard
