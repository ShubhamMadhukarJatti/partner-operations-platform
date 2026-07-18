'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storeOrganizationData } from '@/redux/reducers/organization'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowRightIcon, Lightbulb, Plus } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import GenericCardSkeleton from '@/components/common/GenericCardSkeleton'
import { showCustomToast } from '@/components/custom-toast'

interface CompanyDetailsCardProps {
  className?: string
}

const inHousePartnershipTeamOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' }
]

const CompanyDetailsCard: React.FC<CompanyDetailsCardProps> = ({
  className = ''
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const organization = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const emptyData = {
    logo: '/logo.svg',
    companyName: '',
    foundedOn: '',
    websiteUrl: '',
    inHousePartnershipTeam: '',
    sharkdomPersonalisedUrl: '',
    aboutCompany: '',
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
        logo: organization?.logoUrl || '/logo.svg',
        companyName: apiData.name || '',
        foundedOn: formattedDate,
        websiteUrl: apiData.website || '',
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

  const handleEdit = () => {
    router.push('/settings/company-details?mode=edit&tab=basic')
  }

  const handleCancel = () => {
    setFormData(initialData)
  }

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
      className={`mx-auto flex w-full max-w-4xl flex-col gap-6 ${className}`}
    >
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-[#1F2937]'>Company details</h1>
        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            onClick={handleCancel}
            disabled={isSaving}
            className='rounded-lg px-6 font-semibold'
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className='rounded-lg bg-[#6863FB] px-6 font-semibold text-white hover:bg-[#5853E8]'
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </div>

      {/* Banner */}
      <div className='flex items-center justify-between rounded-lg border border-[#F3E8FF] bg-[#F3E8FF]/60 px-4 py-3'>
        <div className='flex items-center gap-3'>
          <Lightbulb className='h-5 w-5 text-[#6863FB]' />
          <span className='text-sm font-medium text-[#6B7280]'>
            You can preview your company profile and make edits there if
            required
          </span>
        </div>
        <Link
          href={organization?.id ? `/explore-beta/${organization.id}` : '#'}
          className='flex items-center gap-1 text-sm font-semibold text-[#6863FB] hover:underline'
        >
          View profile <ArrowRightIcon className='h-4 w-4' />
        </Link>
      </div>

      {/* Main Form Card */}
      <div className='flex flex-col gap-8 rounded-[24px] border border-gray-100 bg-white/50 p-8 shadow-sm'>
        {/* Logo Section */}
        <div>
          <label className='mb-1 block text-sm font-medium text-[#1F2937]'>
            Company Logo
          </label>
          <p className='mb-4 text-sm text-[#9CA3AF]'>Maximum file size: 5MB</p>
          <div className='relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-[#F9FAFB] transition-colors hover:bg-gray-50'>
            <Input
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0'
            />
            {formData.logo && formData.logo !== '/logo.svg' ? (
              <Image
                src={formData.logo}
                alt='Company Logo'
                fill
                className='object-cover'
              />
            ) : (
              <Plus className='h-6 w-6 text-gray-300' />
            )}
          </div>
        </div>

        {/* Name & Founded On */}
        <div className='grid grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-[#6B7280]'>
              Company name <span className='text-[#E11D48]'>*</span>
            </label>
            <Input
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder='Acme corp'
              className='h-11 rounded-xl border-gray-200 text-black'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-[#6B7280]'>
              Founded on
            </label>
            <Input
              type={formData.foundedOn ? 'date' : 'text'}
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = 'text'
              }}
              placeholder='Select date'
              value={formData.foundedOn}
              onChange={(e) => handleInputChange('foundedOn', e.target.value)}
              className='h-11 rounded-xl border-gray-200 text-black'
            />
          </div>
        </div>

        {/* In-house partnership team */}
        <div className='flex flex-col gap-3'>
          <label className='text-sm font-medium text-[#6B7280]'>
            Do you have an in-house partnership team?
          </label>
          <div className='flex items-center gap-6'>
            <label className='flex cursor-pointer items-center gap-2'>
              <input
                type='radio'
                name='inHouseTeam'
                checked={formData.inHousePartnershipTeam === 'Yes'}
                onChange={() =>
                  handleInputChange('inHousePartnershipTeam', 'Yes')
                }
                className='h-4 w-4 border-gray-300 text-[#6863FB] focus:ring-[#6863FB]'
              />
              <span className='text-sm text-[#1F2937]'>Yes</span>
            </label>
            <label className='flex cursor-pointer items-center gap-2'>
              <input
                type='radio'
                name='inHouseTeam'
                checked={formData.inHousePartnershipTeam === 'No'}
                onChange={() =>
                  handleInputChange('inHousePartnershipTeam', 'No')
                }
                className='h-4 w-4 border-gray-300 text-[#6863FB] focus:ring-[#6863FB]'
              />
              <span className='text-sm text-[#1F2937]'>No</span>
            </label>
          </div>
        </div>

        {/* Company Website */}
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium text-[#6B7280]'>
            Company website <span className='text-[#E11D48]'>*</span>
          </label>
          <div className='flex h-11 items-center overflow-hidden rounded-xl border border-gray-200 bg-white transition-all focus-within:border-[#6863FB] focus-within:ring-2 focus-within:ring-[#6863FB]/20'>
            <div className='flex h-full items-center border-r border-gray-200 bg-gray-50 px-4 text-sm text-[#6B7280]'>
              https://
            </div>
            <input
              type='text'
              value={formData.websiteUrl.replace(/^https?:\/\//, '')}
              onChange={(e) =>
                handleInputChange('websiteUrl', 'https://' + e.target.value)
              }
              placeholder='www.acmecorp.com'
              className='h-full flex-1 bg-transparent px-4 text-sm text-black outline-none'
            />
          </div>
        </div>

        {/* Sharkdom URL */}
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium text-[#6B7280]'>
            Sharkdom personalised URL <span className='text-[#E11D48]'>*</span>
          </label>
          <div className='flex h-11 items-center overflow-hidden rounded-xl border border-gray-200 bg-white transition-all focus-within:border-[#6863FB] focus-within:ring-2 focus-within:ring-[#6863FB]/20'>
            <div className='flex h-full items-center border-r border-gray-200 bg-gray-50 px-4 text-sm text-[#6B7280]'>
              https://
            </div>
            <input
              type='text'
              value={formData.sharkdomPersonalisedUrl.replace(
                /^https?:\/\//,
                ''
              )}
              onChange={(e) =>
                handleInputChange(
                  'sharkdomPersonalisedUrl',
                  'https://' + e.target.value
                )
              }
              placeholder='sharkdom.com/company/acmecorp-5dbf'
              className='h-full flex-1 bg-transparent px-4 text-sm text-black outline-none'
            />
          </div>
        </div>

        {/* About Company */}
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium text-[#6B7280]'>
            About company
          </label>
          <Textarea
            value={formData.aboutCompany}
            onChange={(e) => handleInputChange('aboutCompany', e.target.value)}
            placeholder='Enter details about your company'
            className='min-h-[120px] resize-y rounded-xl border-gray-200 p-4 text-sm text-black'
          />
        </div>

        {/* About Products */}
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium text-[#6B7280]'>
            About products / services
          </label>
          <Textarea
            value={formData.aboutProductService}
            onChange={(e) =>
              handleInputChange('aboutProductService', e.target.value)
            }
            placeholder='What do you offer?'
            className='min-h-[120px] resize-y rounded-xl border-gray-200 p-4 text-sm text-black'
          />
        </div>
      </div>
    </div>
  )
}

export default CompanyDetailsCard
