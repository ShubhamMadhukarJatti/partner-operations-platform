'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { IconCloudCheck } from '@tabler/icons-react'
import { ArrowRight } from 'iconsax-react'
import {
  ArrowLeft,
  FileText,
  Info,
  Plus,
  Search,
  Settings,
  Trash2,
  X
} from 'lucide-react'
import { useSelector } from 'react-redux'

import { getPersonaDetails } from '@/lib/db/customer-persona'
import { fetchconnectedApps } from '@/lib/db/organization'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { showCustomToast } from '@/components/custom-toast'

const dataTypes = ['Text', 'Number']

interface Country {
  code: string
  name: string
}

interface Partner {
  orgId: number
  name: string
}

interface CustomField {
  id: string
  title: string
  type: string
  value: string
  required: boolean
}

export default function DealRegisterPage() {
  const router = useRouter()
  const [showCustomField, setShowCustomField] = useState(false)
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [newFieldData, setNewFieldData] = useState({
    title: '',
    type: 'Text',
    value: '',
    required: false
  })
  const [websiteError, setWebsiteError] = useState<string | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedPartner, setSelectedPartner] = useState('')
  const [countrySearch, setCountrySearch] = useState('')
  const [partnerSearch, setPartnerSearch] = useState('')
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([])
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([])
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [isPartnerOpen, setIsPartnerOpen] = useState(false)
  const [partnersLoading, setPartnersLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [dealExistsError, setDealExistsError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [checkingConnection, setCheckingConnection] = useState(true)

  const { organization } = useSelector((state: RootState) => state.currentOrg)
  const currentOrgId = organization?.id

  // Check HubSpot connection status
  // useEffect(() => {
  //   const checkHubSpotConnection = async () => {
  //     try {
  //       setCheckingConnection(true)
  //       const connectedApps = await fetchconnectedApps()
  //       const hubspotAppData = connectedApps.find(
  //         (app: any) => app.integrationType === 'HUBSPOT'
  //       )

  //       const isConnected = hubspotAppData && hubspotAppData.refreshToken

  //       setTimeout(() => {
  //         if (!isConnected) {
  //           setShowModal(true)
  //         }
  //         setCheckingConnection(false)
  //       }, 500)
  //     } catch (error) {
  //       setCheckingConnection(false)
  //     }
  //   }

  //   if (currentOrgId) {
  //     checkHubSpotConnection()
  //   }
  // }, [currentOrgId])

  // Form data state
  const [formData, setFormData] = useState({
    customerAccountName: '',
    website: '',
    headQuarterLocation: '',
    estimatedAcv: '',
    expectedClosingTime: '',
    currentSolution: '',
    requirements: '',
    dealProtectionPeriod: 90
  })

  // Fetch countries and partners on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries')
        const data = await response.json()
        setCountries(data)
        setFilteredCountries(data)
      } catch (error) {
        console.error('Error fetching countries:', error)
      }
    }

    const fetchPartners = async () => {
      try {
        setPartnersLoading(true)
        const response = await fetch('/api/active-partners')
        if (!response.ok) {
          throw new Error('Failed to fetch active partners')
        }
        const data = await response.json()
        setPartners(data)
        setFilteredPartners(data)
      } catch (error) {
        console.error('Error fetching partners:', error)
        setPartners([])
        setFilteredPartners([])
      } finally {
        setPartnersLoading(false)
      }
    }

    fetchCountries()
    fetchPartners()
  }, [])

  useEffect(() => {
    if (countrySearch) {
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(countrySearch.toLowerCase())
      )
      setFilteredCountries(filtered)
    } else {
      setFilteredCountries(countries)
    }
  }, [countrySearch, countries])

  // Filter partners based on search
  useEffect(() => {
    if (partnerSearch) {
      const filtered = partners.filter((partner) =>
        partner.name.toLowerCase().includes(partnerSearch.toLowerCase())
      )
      setFilteredPartners(filtered)
    } else {
      setFilteredPartners(partners)
    }
  }, [partnerSearch, partners])

  const handleCountrySelect = (value: string) => {
    setSelectedCountry(value)
    // Update formData's headQuarterLocation when country changes
    setFormData((prev) => ({ ...prev, headQuarterLocation: value }))
    setCountrySearch('')
    setIsCountryOpen(false)
  }

  const handlePartnerSelect = (value: string) => {
    setSelectedPartner(value)
    setPartnerSearch('')
    setIsPartnerOpen(false)
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === 'website') {
      // Ensure website always starts with https://
      if (!value.startsWith('https://')) {
        setWebsiteError('Website must start with https://')
      } else {
        setWebsiteError(null) // Clear error when user starts typing
      }
    }

    const updatedFormData = { ...formData, [field]: value }
    setFormData(updatedFormData)
  }

  const validateWebsite = (website: string) => {
    if (!website.startsWith('https://')) {
      setWebsiteError('Website must start with https://')
      return false
    }

    // Remove trailing slash if present
    const cleanWebsite = website.endsWith('/') ? website.slice(0, -1) : website

    // Check if it's a valid URL format
    try {
      new URL(cleanWebsite)
      setWebsiteError(null)
      return true
    } catch {
      setWebsiteError('Please enter a valid website URL')
      return false
    }
  }

  const handleWebsiteBlur = async () => {
    const website = formData.website.trim()

    // Validate website format first
    if (!validateWebsite(website)) {
      return
    }

    // Clean website URL (remove trailing slash)
    const cleanWebsite = website.endsWith('/') ? website.slice(0, -1) : website

    if (cleanWebsite && selectedPartner) {
      try {
        // Get the selected partner's orgId
        const selectedPartnerData = partners.find(
          (partner) => partner.name === selectedPartner
        )
        const vendorOrgId = selectedPartnerData?.orgId

        if (!vendorOrgId) {
          setDealExistsError(null)
          return
        }

        const response = await fetch(
          `/api/my-deals/dealExist?vendorOrgId=${vendorOrgId}&website=${encodeURIComponent(cleanWebsite)}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        // Check if deal already exists with any vendor
        if (
          result.alreadyExistsWithAnotherVendor ||
          result.alreadyExistsWithSameVendor
        ) {
          setDealExistsError('Deal is already locked with this customer')
        } else {
          setDealExistsError(null)
        }
      } catch (error) {
        setDealExistsError(null)
      }
    } else {
      setDealExistsError(null)
    }
  }

  const handleCustomFieldChange = (fieldId: string, value: string) => {
    const updatedFields = customFields.map((field) =>
      field.id === fieldId ? { ...field, value } : field
    )
    setCustomFields(updatedFields)
  }

  const handleAddField = () => {
    if (newFieldData.title.trim()) {
      const newField = {
        id: Date.now().toString(),
        title: newFieldData.title,
        type: newFieldData.type,
        value: newFieldData.value,
        required: false
      }
      setCustomFields([...customFields, newField])
      setNewFieldData({
        title: '',
        type: 'Text',
        value: '',
        required: false
      })
      setShowCustomField(false)
    }
  }

  const handleRemoveField = (fieldId: string) => {
    setCustomFields(customFields.filter((field) => field.id !== fieldId))
  }

  const handleReset = () => {
    setFormData({
      customerAccountName: '',
      website: 'https://',
      headQuarterLocation: '',
      estimatedAcv: '',
      expectedClosingTime: '',
      currentSolution: '',
      requirements: '',
      dealProtectionPeriod: 90
    })
    setSelectedCountry('')
    setSelectedPartner('')
    setCustomFields([])
    setDealExistsError(null)
    setWebsiteError(null)
    router.push('/deal-pipeline')
  }

  const isFormValid = () => {
    // Check all required fields
    const requiredFields = {
      customerAccountName: formData.customerAccountName.trim(),
      website: formData.website.trim(),
      headQuarterLocation: selectedCountry.trim(),
      estimatedAcv: formData.estimatedAcv.trim(),
      expectedClosingTime: formData.expectedClosingTime.trim(),
      currentSolution: formData.currentSolution.trim(),
      requirements: formData.requirements.trim(),
      selectedPartner: selectedPartner.trim()
    }

    // Check if any required field is empty
    const hasEmptyFields = Object.values(requiredFields).some((value) => !value)

    // Check if there are any errors
    const hasErrors = !!dealExistsError || !!websiteError

    return !hasEmptyFields && !hasErrors
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      // Validate website format
      if (!validateWebsite(formData.website.trim())) {
        return
      }

      // Validate required fields
      const requiredFields = {
        customerAccountName: formData.customerAccountName.trim(),
        website: formData.website.trim(),
        headQuarterLocation: selectedCountry.trim(),
        estimatedAcv: formData.estimatedAcv.trim(),
        expectedClosingTime: formData.expectedClosingTime.trim(),
        currentSolution: formData.currentSolution.trim(),
        requirements: formData.requirements.trim(),
        selectedPartner: selectedPartner.trim()
      }

      // Check if any required field is empty
      const emptyFields = Object.entries(requiredFields)
        .filter(([key, value]) => !value)
        .map(([key]) => key)

      if (emptyFields.length > 0) {
        const fieldNames = {
          customerAccountName: 'Customer Account Name',
          website: 'Website',
          headQuarterLocation: 'Headquartered Location',
          estimatedAcv: 'Estimated ACV',
          expectedClosingTime: 'Expected Closing Time',
          currentSolution: 'Current Solution/Competitor',
          requirements: 'Use Case & Requirements',
          selectedPartner: 'Assign to Partner'
        }

        const missingFields = emptyFields
          .map((field) => fieldNames[field as keyof typeof fieldNames])
          .join(', ')
        alert(`Please fill in all required fields: ${missingFields}`)
        return
      }

      // Validate all custom fields (all are required)
      const emptyCustomFields = customFields.filter(
        (field) => !field.value?.trim()
      )

      if (emptyCustomFields.length > 0) {
        const missingCustomFields = emptyCustomFields
          .map((field) => field.title)
          .join(', ')
        alert(`Please fill in all custom fields: ${missingCustomFields}`)
        return
      }

      // Get the selected partner's orgId
      const selectedPartnerData = partners.find(
        (partner) => partner.name === selectedPartner
      )
      const targetOrgId = selectedPartnerData?.orgId

      // Check for duplicate deal before proceeding
      if (targetOrgId) {
        // Clean website URL (remove trailing slash)
        const cleanWebsite = formData.website.endsWith('/')
          ? formData.website.slice(0, -1)
          : formData.website

        try {
          const dealExistResponse = await fetch(
            `/api/my-deals/dealExist?vendorOrgId=${targetOrgId}&website=${encodeURIComponent(cleanWebsite)}`
          )

          if (dealExistResponse.ok) {
            const dealExistResult = await dealExistResponse.json()

            // Check if deal already exists with same or another vendor
            if (
              dealExistResult.alreadyExistsWithSameVendor ||
              dealExistResult.alreadyExistsWithAnotherVendor
            ) {
              showCustomToast(
                'Error',
                'Please check you have the same deal',
                'error',
                5000
              )
              return
            }
          }
        } catch (error) {
          // If the check fails, log but don't block submission
          console.error('Error checking deal existence:', error)
        }
      }

      // Prepare custom fields data in the required format
      const customFieldsData: Record<string, { value: any; dataType: string }> =
        {}

      customFields.forEach((field) => {
        let value: any = field.value || ''
        let dataType = 'String' // default

        switch (field.type) {
          case 'Number':
            value = field.value ? parseInt(field.value) || 0 : 0
            dataType = 'Integer'
            break
          case 'Dropdown':
            value = field.value || ''
            dataType = 'String'
            break
          case 'Text':
          default:
            value = field.value || ''
            dataType = 'String'
            break
        }

        customFieldsData[field.title] = {
          value,
          dataType
        }
      })

      // Clean website URL (remove trailing slash)
      const cleanWebsite = formData.website.endsWith('/')
        ? formData.website.slice(0, -1)
        : formData.website

      // Prepare the request body
      const requestBody = {
        customerAccountName: formData.customerAccountName,
        website: cleanWebsite,
        headQuarterLocation: selectedCountry,
        estimatedAcv: parseInt(formData.estimatedAcv) || 0,
        expectedClosingTime: parseInt(formData.expectedClosingTime) || 0,
        currentSolution: formData.currentSolution,
        requirements: formData.requirements,
        customFields: customFieldsData,
        dealStage: 'WAITING_FOR_APPROVAL',
        source: 'PORTAL',
        isApproved: false,
        dealerOrgId: currentOrgId || 0,
        vendorOrgId: targetOrgId || 0,
        dealProtectionPeriod: 90,
        dealSize: 0
      }

      const response = await fetch('/api/deal-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Failed to submit deal registration: ${response.status} - ${errorText}`
        )
      }
      router.push('/deal-pipeline')
    } catch (error) {
      // Handle error - show toast notification, etc.
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='relative min-h-screen bg-[#FAFBFC]'>
      <div className='flex w-full flex-col items-center'>
        <div className='flex w-full flex-col gap-0 px-[5%] pb-12 pt-8 md:px-[8%]'>
          <Link
            href='/deal-pipeline/resell'
            className='mb-6 flex items-center gap-2 text-sm font-semibold text-primary-blue hover:underline'
          >
            <ArrowLeft size={18} /> Back to Deal Pipeline
          </Link>
          <div className='mb-2 text-xl font-semibold'>Deal Registration</div>
          <div className='mb-8 text-sm text-text-60'>
            Register a new partner opportunity
          </div>

          <div className='flex w-full flex-col items-start gap-8 md:flex-row'>
            {/* Left: Form */}
            <div className='min-w-[340px] flex-1'>
              <div className='mb-6 rounded-2xl border bg-white py-6'>
                <div className='mb-8 flex items-center gap-2 px-4'>
                  <FileText size={20} className='text-gray-800' />
                  <span className='text-base font-semibold'>
                    Opportunity Details
                  </span>
                </div>
                <div className='grid grid-cols-1 gap-4 px-4 md:grid-cols-2'>
                  <div>
                    <label className='mb-2 block text-xs font-medium text-stone-500'>
                      Customer Account Name
                    </label>
                    <Input
                      placeholder='eg. Acme corp'
                      className='rounded-lg text-black placeholder:text-[#6B7280]'
                      value={formData.customerAccountName}
                      onChange={(e) =>
                        handleInputChange('customerAccountName', e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className='mb-2 block text-xs font-medium text-stone-500'>
                      Assign to Partner
                    </label>
                    <Select
                      value={selectedPartner}
                      onValueChange={handlePartnerSelect}
                      open={isPartnerOpen}
                      onOpenChange={setIsPartnerOpen}
                      disabled={partnersLoading}
                    >
                      <SelectTrigger className='w-full rounded-lg'>
                        <SelectValue
                          placeholder={
                            partnersLoading
                              ? 'Loading partners...'
                              : 'Select Partner'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <div className='p-2'>
                          <div className='relative'>
                            <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
                            <Input
                              placeholder='Search partners...'
                              value={partnerSearch}
                              onChange={(e) => setPartnerSearch(e.target.value)}
                              className='pl-8 text-black placeholder:text-[#6B7280]'
                              onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                  setIsPartnerOpen(false)
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className='max-h-[200px] overflow-y-auto'>
                          {filteredPartners.length > 0 ? (
                            filteredPartners.map((partner) => (
                              <SelectItem
                                key={partner.orgId}
                                value={partner.name}
                                className='text-black'
                              >
                                {partner.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className='p-2 text-sm text-gray-500'>
                              {partnersLoading
                                ? 'Loading partners...'
                                : 'No active partners found'}
                            </div>
                          )}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className='mb-2 block text-xs font-medium text-stone-500'>
                      Headquartered Location
                    </label>
                    <Select
                      value={selectedCountry}
                      onValueChange={handleCountrySelect}
                      open={isCountryOpen}
                      onOpenChange={setIsCountryOpen}
                    >
                      <SelectTrigger className='w-full rounded-lg'>
                        <SelectValue
                          placeholder='Select Country'
                          className='!text-black'
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <div className='p-2'>
                          <div className='relative'>
                            <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
                            <Input
                              placeholder='Search countries...'
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              className='pl-8 text-black placeholder:text-[#6B7280]'
                              onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                  setIsCountryOpen(false)
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className='max-h-[200px] overflow-y-auto'>
                          {filteredCountries.map((country) => (
                            <SelectItem
                              key={country.code}
                              value={country.name}
                              className='text-black'
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className='mb-2 block text-xs font-medium text-stone-500'>
                      Estimated ACV
                    </label>
                    <div className='relative'>
                      <p className='absolute left-3 top-1/2 mt-[1px] -translate-y-1/2 text-sm text-black'>
                        {formData.estimatedAcv ? '$' : ''}
                      </p>
                      <Input
                        placeholder='eg. 150000'
                        type='number'
                        className='rounded-lg text-black placeholder:text-[#6B7280]'
                        value={formData.estimatedAcv}
                        min={0}
                        onChange={(e) =>
                          handleInputChange('estimatedAcv', e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className='mb-2 block text-xs font-medium text-stone-500'>
                      Expected closing time
                    </label>
                    <Input
                      placeholder='eg 34 days'
                      className='rounded-lg text-black placeholder:text-[#6B7280]'
                      value={formData.expectedClosingTime}
                      onChange={(e) =>
                        handleInputChange('expectedClosingTime', e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className='mb-2 block text-xs font-medium text-stone-500'>
                      Website
                    </label>
                    <Input
                      placeholder='eg. https://www.acme.com'
                      className={`rounded-lg text-black placeholder:text-[#6B7280] ${
                        dealExistsError || websiteError
                          ? 'border-red-500 focus:border-red-500'
                          : ''
                      }`}
                      value={formData.website}
                      onChange={(e) =>
                        handleInputChange('website', e.target.value)
                      }
                      onBlur={handleWebsiteBlur}
                      required
                    />
                    {websiteError && (
                      <p className='mt-1 text-xs text-red-500'>
                        {websiteError}
                      </p>
                    )}
                    {dealExistsError && (
                      <p className='mt-1 text-xs text-red-500'>
                        {dealExistsError}
                      </p>
                    )}
                  </div>
                  <div className='md:col-span-2'>
                    <label className='mb-2 block text-xs font-medium text-stone-500'>
                      Current Solution/Competitor
                    </label>
                    <Input
                      placeholder='eg. Salesforce, Hubspot, or manual process'
                      className='rounded-lg text-black placeholder:text-[#6B7280]'
                      value={formData.currentSolution}
                      onChange={(e) =>
                        handleInputChange('currentSolution', e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className='md:col-span-2'>
                    <label className='mb-2 block text-xs font-medium text-stone-500'>
                      Use Case & Requirements
                    </label>
                    <Textarea
                      placeholder="Describe the customer's needs, pain points, and how our solutions address them ..."
                      rows={3}
                      className='rounded-lg text-black placeholder:text-[#6B7280]'
                      value={formData.requirements}
                      onChange={(e) =>
                        handleInputChange('requirements', e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* Custom Fields */}
                  {customFields.map((field) => (
                    <div
                      key={field.id}
                      className='flex items-center gap-2 md:col-span-2'
                    >
                      <div className='flex-1'>
                        <div className='mb-2 flex items-center justify-between'>
                          <label className='block text-xs font-medium text-stone-500'>
                            {field.title}
                          </label>
                          <button
                            onClick={() => handleRemoveField(field.id)}
                            className='text-gray-500 hover:text-gray-700'
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        {field.type === 'Text' && (
                          <Input
                            placeholder={field.value}
                            className='rounded-lg text-black placeholder:text-[#6B7280]'
                            value={field.value}
                            onChange={(e) =>
                              handleCustomFieldChange(field.id, e.target.value)
                            }
                            required
                          />
                        )}
                        {field.type === 'Number' && (
                          <Input
                            type='number'
                            placeholder={field.value}
                            className='rounded-lg text-black placeholder:text-[#6B7280]'
                            value={field.value}
                            onChange={(e) =>
                              handleCustomFieldChange(field.id, e.target.value)
                            }
                            required
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {!showCustomField && (
                  <Button
                    variant='link'
                    className='mx-4 my-6 flex items-center justify-center gap-2 p-0 text-stone-800'
                    onClick={() => setShowCustomField(true)}
                  >
                    <Plus size={18} /> Add Custom Field
                  </Button>
                )}
                {showCustomField && (
                  <div className='border-t px-4 pt-6'>
                    <div className='mb-4 flex items-center justify-between'>
                      <span className='text-base font-semibold text-[#1A202C]'>
                        Add New Field
                      </span>
                      <button
                        className='text-sm font-medium text-gray-500 hover:text-gray-700'
                        onClick={() => setShowCustomField(false)}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <div>
                        <label className='mb-2 block text-xs font-medium text-stone-500'>
                          Add Field Title
                        </label>
                        <Input
                          placeholder='Field Title'
                          className='rounded-lg text-black placeholder:text-[#6B7280]'
                          value={newFieldData.title}
                          onChange={(e) =>
                            setNewFieldData({
                              ...newFieldData,
                              title: e.target.value
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className='mb-2 block text-xs font-medium text-stone-500'>
                          Select data type
                        </label>
                        <Select
                          value={newFieldData.type}
                          onValueChange={(value) =>
                            setNewFieldData({ ...newFieldData, type: value })
                          }
                        >
                          <SelectTrigger className='w-full rounded-lg text-black placeholder:text-[#6B7280]'>
                            <SelectValue placeholder='Text' />
                          </SelectTrigger>
                          <SelectContent>
                            {dataTypes.map((d) => (
                              <SelectItem
                                key={d}
                                value={d}
                                className='text-black'
                              >
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='md:col-span-2'>
                        <label className='mb-2 block text-xs font-medium text-stone-500'>
                          Field Value
                        </label>
                        <Input
                          placeholder='Enter field value'
                          className='rounded-lg text-black placeholder:text-[#6B7280]'
                          value={newFieldData.value}
                          onChange={(e) =>
                            setNewFieldData({
                              ...newFieldData,
                              value: e.target.value
                            })
                          }
                        />
                      </div>
                    </div>
                    <Button
                      className='mb-4 w-full rounded-lg bg-black font-semibold text-white hover:bg-gray-900'
                      onClick={handleAddField}
                    >
                      Add Field
                    </Button>
                  </div>
                )}
                <div className='flex gap-4 border-t px-4 pt-6'>
                  <Button
                    variant='outline'
                    className='flex-1 rounded-lg border-gray-300 text-gray-700'
                    onClick={handleReset}
                  >
                    Discard
                  </Button>
                  <Button
                    variant={
                      submitting || !isFormValid() ? 'disable' : 'primary'
                    }
                    className={cn(
                      'flex-1 rounded-lg font-semibold',
                      (submitting || !isFormValid()) &&
                        'disabled:pointer-events-auto disabled:cursor-not-allowed'
                    )}
                    onClick={handleSubmit}
                    disabled={submitting || !isFormValid()}
                  >
                    {submitting ? 'Submitting...' : 'Submit for Review'}
                  </Button>
                </div>
              </div>
            </div>
            <div className='mt-8 flex w-full flex-col gap-6 md:mt-0 md:max-w-xs'>
              <div className='rounded-2xl border bg-white p-6'>
                <div className='mb-4 text-lg font-semibold text-[#1A202C]'>
                  Process Overview
                </div>
                <ol className='space-y-4 text-sm'>
                  <li className='flex items-center gap-2 text-black'>
                    <span className='flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-black text-white'>
                      1
                    </span>
                    Submit Registration
                  </li>
                  <li className='flex items-center gap-2 text-gray-600'>
                    <span className='flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-200'>
                      2
                    </span>
                    CRM Sync
                  </li>
                  <li className='flex items-center gap-2 text-gray-600'>
                    <span className='flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-200'>
                      3
                    </span>
                    Review ≤48h
                  </li>
                </ol>
              </div>
              <div className='flex items-center gap-2 rounded-2xl border bg-white p-6 text-sm text-gray-500'>
                <IconCloudCheck size={25} className='text-black' /> Changes are
                saved automatically!
              </div>
              <div className='flex flex-col gap-2 rounded-2xl border bg-white p-6 text-sm text-gray-500'>
                <div className='flex items-center gap-2 text-black'>
                  <Settings size={20} />
                  <span className='text-sm'>Deal Settings</span>
                </div>
                <p className='text-sm'>Deal Protection Period</p>
                <div className='flex items-center'>
                  <span className='rounded-lg border border-gray-400 px-3 py-2'>
                    90
                  </span>
                  <span className='ml-2'>days</span>
                </div>
                <p className='text-sm'>
                  The number of days this deal will be protected from other
                  partners registering the same opportunity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && !checkingConnection && (
        <div className='fixed inset-0 z-50 flex w-full items-center justify-center bg-black bg-opacity-80 transition-all'>
          <div className='flex w-5/12 flex-col gap-6 rounded-xl bg-white p-6'>
            <div className='flex items-start gap-3'>
              <div className='mt-1'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F6FF]'>
                  <Info className='h-5 w-5 text-[#2563EB]' strokeWidth={2} />
                </div>
              </div>
              <div className='flex flex-col gap-0.5'>
                <p className='text-xl font-semibold text-[#0F172A]'>
                  You need to connect your CRM
                </p>
                <p className='text-sm text-[#475569]'>
                  Connect your company information to unlock insights
                </p>
              </div>
            </div>
            <p className='text-sm text-[#475569]'>
              To see your audience overlap and partnership potential with{' '}
              <span className='font-semibold'>
                {selectedPartner ? selectedPartner : 'partners'}
              </span>
              , we need some basic information about company and target
              audience.
            </p>
            <div className='flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'>
              <Link href='/integrations' className='w-1/2'>
                <div className='inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#3E50F7] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2c3ed9]'>
                  Connect CRM
                  <ArrowRight size={16} />
                </div>
              </Link>
              <a
                className='transitio inline-flex cursor-pointer items-center justify-center gap-2 bg-white px-5 py-2 text-sm font-semibold text-gray-700'
                href='https://help.sharkdom.com/'
                target='_blank'
              >
                Why do I need to Connect CRM?
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
