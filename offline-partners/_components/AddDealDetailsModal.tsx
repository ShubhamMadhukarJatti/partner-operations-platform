'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { RootState } from '@/redux/store'
import { FileText, Plus, Search, Trash2, X } from 'lucide-react'
import { useSelector } from 'react-redux'

import { getPersonaDetails } from '@/lib/db/customer-persona'
import { isDummyFlow } from '@/lib/dummy-flow'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
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

interface AddDealDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  isPartnerPortal?: boolean
  /** When in partner portal, use this as vendorOrgId in the deal payload (from URL). */
  partnerPortalVendorOrgId?: number
  /** When in partner portal, use this email to fetch externalPartnerCode from /v2/offline-partner/code. */
  partnerEmail?: string | null
  /** When provided (e.g. from PartnerHeader context), auto-fills Partner Name and disables the field. */
  initialPartnerName?: string | null
  /** When provided (e.g. from PartnerHeader data.email), used to fetch externalPartnerCode for create deal (dashboard flow). */
  initialPartnerEmail?: string | null
  onSuccess?: () => void
  inDummyFlow?: boolean
}

const AddDealDetailsModal: React.FC<AddDealDetailsModalProps> = ({
  isOpen,
  onClose,
  isPartnerPortal = false,
  partnerPortalVendorOrgId,
  partnerEmail,
  initialPartnerName,
  initialPartnerEmail,
  onSuccess,
  inDummyFlow = false
}) => {
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
  const [userId, setUserId] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [userIdLoading, setUserIdLoading] = useState(false)
  const [currentOrgIdForPortal, setCurrentOrgIdForPortal] = useState<
    number | null
  >(null)
  const [currentOrgIdFromApi, setCurrentOrgIdFromApi] = useState<number | null>(
    null
  )

  const { organization } = useSelector((state: RootState) => state.currentOrg)
  const currentOrgId = organization?.id

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

  // Auto-fill Partner Name from context (e.g. PartnerHeader) when modal opens
  useEffect(() => {
    if (isOpen && initialPartnerName?.trim()) {
      setSelectedPartner(initialPartnerName.trim())
    }
  }, [isOpen, initialPartnerName])

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries')
        if (!response.ok) throw new Error('Failed to fetch countries')
        const data = await response.json()
        setCountries(data)
        setFilteredCountries(data)
      } catch (error) {
        console.error('Error fetching countries:', error)
      }
    }
    if (isOpen) {
      fetchCountries()
    }
  }, [isOpen])

  // When not in partner portal, fetch current org from API if Redux org is missing (for targetOrgId)
  useEffect(() => {
    if (!isOpen || isPartnerPortal) return
    if (currentOrgId) {
      setCurrentOrgIdFromApi(null)
      return
    }
    let cancelled = false
    fetch('/api/organization/current', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((org: { id?: number } | null) => {
        if (!cancelled && org?.id != null) setCurrentOrgIdFromApi(org.id)
        else if (!cancelled) setCurrentOrgIdFromApi(null)
      })
      .catch(() => {
        if (!cancelled) setCurrentOrgIdFromApi(null)
      })
    return () => {
      cancelled = true
    }
  }, [isOpen, isPartnerPortal, currentOrgId])

  // Fetch partners when modal opens (dashboard only; uses Redux org or API fallback)
  useEffect(() => {
    const fetchPartners = async () => {
      const orgId = currentOrgId ?? currentOrgIdFromApi ?? null
      if (!orgId) return
      try {
        setPartnersLoading(true)
        const personas = await getPersonaDetails(orgId)
        const activePartners = personas
          .filter((persona: any) => persona.status === 'ACTIVE')
          .map((persona: any) => ({
            orgId: persona.id,
            name: persona.name
          }))
        setPartners(activePartners)
        setFilteredPartners(activePartners)
      } catch (error) {
        console.error('Error fetching partners:', error)
      } finally {
        setPartnersLoading(false)
      }
    }
    if (isOpen && !isPartnerPortal) {
      fetchPartners()
    }
  }, [isOpen, currentOrgId, currentOrgIdFromApi, isPartnerPortal])

  // Fetch user email (and for partner portal: userId + org) when modal opens
  useEffect(() => {
    const fetchUserAndOrgData = async () => {
      if (!isOpen) return
      try {
        setUserIdLoading(true)
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          const uid = data.user?.uid || ''
          setUserId(uid)
          if (data.user?.email) {
            setUserEmail(data.user.email)
          } else if (uid) {
            try {
              const userRes = await fetch(`/api/user/${uid}`)
              if (userRes.ok) {
                const userProfile = await userRes.json()
                setUserEmail(userProfile?.email || '')
              }
            } catch {
              // ignore
            }
          }

          if (isPartnerPortal) {
            // Try to get organization ID from API (partner portal only)
            try {
              const orgResponse = await fetch('/api/organization/current')
              if (orgResponse.ok) {
                const orgData = await orgResponse.json()
                setCurrentOrgIdForPortal(orgData?.id || null)
              }
            } catch (orgError) {
              console.error('Error fetching organization:', orgError)
              if (currentOrgId) {
                setCurrentOrgIdForPortal(currentOrgId)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setUserIdLoading(false)
      }
    }
    fetchUserAndOrgData()
  }, [isOpen, isPartnerPortal, currentOrgId])

  // Filter countries based on search
  useEffect(() => {
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase())
    )
    setFilteredCountries(filtered)
  }, [countrySearch, countries])

  // Filter partners based on search
  useEffect(() => {
    const filtered = partners.filter((partner) =>
      partner.name.toLowerCase().includes(partnerSearch.toLowerCase())
    )
    setFilteredPartners(filtered)
  }, [partnerSearch, partners])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === 'website') {
      setWebsiteError(null)
      setDealExistsError(null)
    }
  }

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName)
    handleInputChange('headQuarterLocation', countryName)
    setIsCountryOpen(false)
  }

  const handlePartnerSelect = (partnerName: string) => {
    setSelectedPartner(partnerName)
    setIsPartnerOpen(false)
  }

  const handleWebsiteBlur = () => {
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/
    if (formData.website && !urlPattern.test(formData.website)) {
      setWebsiteError('Please enter a valid website URL')
    }
  }

  const handleAddField = () => {
    if (newFieldData.title.trim()) {
      const newField: CustomField = {
        id: `custom-${Date.now()}`,
        ...newFieldData
      }
      setCustomFields([...customFields, newField])
      setNewFieldData({ title: '', type: 'Text', value: '', required: false })
      setShowCustomField(false)
    }
  }

  const handleRemoveField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id))
  }

  const handleCustomFieldChange = (id: string, value: string) => {
    setCustomFields(
      customFields.map((field) =>
        field.id === id ? { ...field, value } : field
      )
    )
  }

  const isFormValid = () => {
    const baseValidation =
      formData.customerAccountName &&
      formData.website &&
      !websiteError &&
      !dealExistsError &&
      formData.headQuarterLocation &&
      formData.estimatedAcv &&
      formData.expectedClosingTime &&
      formData.currentSolution &&
      formData.requirements

    if (isPartnerPortal) {
      return baseValidation && userId
    }

    return baseValidation
  }

  const handleReset = () => {
    setFormData({
      customerAccountName: '',
      website: '',
      headQuarterLocation: '',
      estimatedAcv: '',
      expectedClosingTime: '',
      currentSolution: '',
      requirements: '',
      dealProtectionPeriod: 90
    })
    setCustomFields([])
    setSelectedCountry('')
    setSelectedPartner('')
    setWebsiteError(null)
    setDealExistsError(null)
    if (isPartnerPortal) {
      setUserId('')
      setCurrentOrgIdForPortal(null)
    }
    onClose()
  }

  const handleSubmit = async () => {
    if (!isFormValid()) return

    // If in dummy flow, show info toast instead of creating deal
    if (inDummyFlow) {
      showCustomToast(
        'Info',
        'No edit access for this dummy account',
        'info',
        5000
      )
      return
    }

    try {
      setSubmitting(true)
      setDealExistsError(null)

      // Prepare custom fields data
      const customFieldsData = customFields.map((field) => ({
        title: field.title,
        type: field.type,
        value: field.value,
        required: field.required
      }))

      // Clean website URL (remove trailing slash if present)
      const cleanWebsite =
        formData.website && formData.website.endsWith('/')
          ? formData.website.slice(0, -1)
          : formData.website

      // Determine target organization ID (vendor) and dealer
      const effectiveCurrentOrgId = currentOrgId ?? currentOrgIdFromApi ?? null
      const targetOrgId = isPartnerPortal
        ? (partnerPortalVendorOrgId ?? currentOrgIdForPortal ?? currentOrgId)
        : selectedPartner
          ? parseInt(selectedPartner, 10)
          : effectiveCurrentOrgId

      // if (!targetOrgId) {
      //   showCustomToast(
      //     'Error',
      //     isPartnerPortal
      //       ? 'Organization context is missing. Use your partner link with org ID.'
      //       : 'Organization context is missing. Please try again.',
      //     'error',
      //     5000
      //   )
      //   setSubmitting(false)
      //   return
      // }

      // Prepare the request body (external partner portal API expects shape matching backend)
      // Partner portal API expects customFields as object: { "fieldName": { "value": "...", "dataType": "string" } }
      const partnerPortalCustomFields =
        customFieldsData.length === 0
          ? {}
          : customFieldsData.reduce(
              (acc, f) => {
                const key =
                  f.title?.trim() || `field_${Object.keys(acc).length}`
                acc[key] = {
                  value: f.value ?? '',
                  dataType: f.type || 'string'
                }
                return acc
              },
              {} as Record<string, { value: string; dataType: string }>
            )
      const dashboardCustomFields =
        customFieldsData.length === 0
          ? {}
          : customFieldsData.reduce(
              (acc, f) => {
                const key =
                  f.title?.trim() || `field_${Object.keys(acc).length}`
                acc[key] = {
                  value: f.value ?? '',
                  dataType: f.type || 'string'
                }
                return acc
              },
              {} as Record<string, { value: string; dataType: string }>
            )

      // Resolve externalPartnerCode and run deal/exist where needed
      let externalPartnerCode: string | undefined
      if (isPartnerPortal) {
        // Partner portal: call dealExist first, then fetch externalPartnerCode
        const dealExistWebsite = cleanWebsite
        const dealExistRes = await fetch(
          `/api/my-deals/dealExist?vendorOrgId=${encodeURIComponent(targetOrgId)}&website=${encodeURIComponent(dealExistWebsite)}`
        )
        const dealExistData = await dealExistRes.json().catch(() => ({}))
        if (
          !dealExistRes.ok ||
          dealExistData?.statusCode === 500 ||
          dealExistData?.errorMessage
        ) {
          const errorMsg =
            dealExistData?.errorMessage ??
            dealExistData?.message ??
            'Deal existence check failed'
          showCustomToast('Error', String(errorMsg), 'error', 5000)
          setDealExistsError(String(errorMsg))
          setSubmitting(false)
          return
        }
        const emailForCode = (partnerEmail ?? userEmail)?.trim()
        if (!emailForCode) {
          showCustomToast(
            'Error',
            'Partner email is required to create a deal.',
            'error',
            5000
          )
          setSubmitting(false)
          return
        }
        const codeRes = await fetch(
          `/api/offline-partner/code?email=${encodeURIComponent(emailForCode)}`
        )
        const codeData = await codeRes.json().catch(() => ({}))
        if (!codeRes.ok || !codeData?.data) {
          showCustomToast(
            'Error',
            codeData?.message ?? 'Failed to get partner code',
            'error',
            5000
          )
          setSubmitting(false)
          return
        }
        externalPartnerCode = String(codeData.data)
      } else {
        // Dashboard: get externalPartnerCode from partner email (e.g. PartnerHeader data.email) or current user email, then deal/exist with customer website
        const emailForCode = (initialPartnerEmail ?? userEmail)?.trim()
        if (!emailForCode) {
          showCustomToast(
            'Error',
            'Partner or user email is required to create a deal. Use partner context or sign in again.',
            'error',
            5000
          )
          setSubmitting(false)
          return
        }
        const codeRes = await fetch(
          `/api/offline-partner/code?email=${encodeURIComponent(emailForCode)}`
        )
        const codeData = await codeRes.json().catch(() => ({}))
        if (!codeRes.ok || !codeData?.data) {
          showCustomToast(
            'Error',
            codeData?.message ?? 'Failed to get partner code',
            'error',
            5000
          )
          setSubmitting(false)
          return
        }
        externalPartnerCode = String(codeData.data)
        const dealExistRes = await fetch(
          `/api/my-deals/external/partner/portal/deal/exist?externalPartnerCode=${encodeURIComponent(externalPartnerCode)}&website=${encodeURIComponent(cleanWebsite)}`
        )
        const dealExistData = await dealExistRes.json().catch(() => ({}))
        if (
          !dealExistRes.ok ||
          dealExistData?.statusCode === 500 ||
          dealExistData?.errorMessage
        ) {
          const errorMsg =
            dealExistData?.errorMessage ??
            dealExistData?.message ??
            'Deal existence check failed'
          showCustomToast('Error', String(errorMsg), 'error', 5000)
          setDealExistsError(String(errorMsg))
          setSubmitting(false)
          return
        }
        if (dealExistData?.alreadyExistsWithSameVendor === true) {
          const message =
            dealExistData?.message ??
            'Deal already exists with same vendor. You cannot create a duplicate deal.'
          showCustomToast('Error', String(message), 'error', 5000)
          setDealExistsError(String(message))
          setSubmitting(false)
          return
        }
      }

      const requestBody = isPartnerPortal
        ? {
            customerAccountName: formData.customerAccountName,
            website: cleanWebsite,
            headQuarterLocation: selectedCountry,
            estimatedAcv: parseInt(formData.estimatedAcv) || 0,
            expectedClosingTime: parseInt(formData.expectedClosingTime) || 0,
            currentSolution: formData.currentSolution,
            requirements: formData.requirements,
            customFields: partnerPortalCustomFields,
            dealStage: 'APPROVED',
            source: 'PORTAL',
            isApproved: true,
            dealerOrgId: 0,
            vendorOrgId: Number(targetOrgId),
            dealProtectionPeriod: formData.dealProtectionPeriod || 90,
            dealSize: 0,
            userId,
            externalPartnerPortalDeal: true,
            dealStatus: 'ACTIVE',
            ...(externalPartnerCode != null && { externalPartnerCode })
          }
        : {
            customerAccountName: formData.customerAccountName,
            website: cleanWebsite,
            headQuarterLocation: selectedCountry,
            estimatedAcv: parseInt(formData.estimatedAcv) || 0,
            expectedClosingTime: parseInt(formData.expectedClosingTime) || 0,
            currentSolution: formData.currentSolution,
            requirements: formData.requirements,
            customFields: dashboardCustomFields,
            dealStage: 'WAITING_FOR_APPROVAL',
            source: 'PORTAL',
            isApproved: false,
            dealerOrgId: 0,
            vendorOrgId: 0,
            dealProtectionPeriod: formData.dealProtectionPeriod || 90,
            dealStatus: 'ACTIVE',
            dealSize: '0',
            userId: '0',
            externalPartnerCode,
            externalPartnerPortalDeal: true,
            internalToExternalPartnerPortalDeal: true
          }

      const apiUrl = isPartnerPortal
        ? '/api/deal-registration/external/partner/portal'
        : '/api/my-deals/internal/external/partner'
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage =
          errorData.message ||
          errorData.error ||
          `Failed to create deal: ${response.statusText}`
        throw new Error(errorMessage)
      }

      const result = await response.json()
      showCustomToast(
        'Success',
        result.message || 'Deal created successfully!',
        'success',
        5000
      )

      handleReset()
      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error('Error creating deal:', error)
      const errorMessage =
        error.message || 'Failed to create deal. Please try again.'
      showCustomToast('Error', errorMessage, 'error', 5000)
      setDealExistsError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className='max-h-[95vh] max-w-[680px] overflow-hidden p-0'
        hideCloseBtn
      >
        {/* Header */}
        <div className='flex items-start justify-between border-b p-6 pb-4'>
          <div>
            <div className='mb-1 flex items-center gap-2'>
              <FileText size={20} className='text-gray-800' />
              <h2 className='text-lg font-semibold text-[#1A202C]'>
                Add Deal Details
              </h2>
            </div>
            <p className='text-sm text-[#6B7280]'>
              Enter deal information to register with your partner
            </p>
          </div>
          <button
            onClick={onClose}
            className='rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className='max-h-[calc(90vh-180px)] overflow-y-auto px-6'>
          <div className='grid grid-cols-1 gap-4 py-4 md:grid-cols-2'>
            {/* Customer Account Name */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
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

            {/* Assign to Partner - Only show if not partner portal */}
            {!isPartnerPortal && (
              <div>
                <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                  Assign to Partner
                </label>
                <Input
                  placeholder='Enter Partner Name'
                  className='rounded-lg pl-6 text-black placeholder:text-[#6B7280]'
                  type='string'
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  required
                  disabled={!!initialPartnerName?.trim()}
                  title={
                    initialPartnerName?.trim()
                      ? 'Partner name is set from the current partner context'
                      : undefined
                  }
                />
              </div>
            )}

            {/* Headquartered Location */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Headquartered Location
              </label>
              <Select
                value={selectedCountry}
                onValueChange={handleCountrySelect}
                open={isCountryOpen}
                onOpenChange={setIsCountryOpen}
              >
                <SelectTrigger
                  className={`w-full rounded-lg ${selectedCountry ? 'text-black' : 'text-[#6B7280]'}`}
                >
                  <SelectValue placeholder='Select Country' />
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
                      <SelectItem key={country.code} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>

            {/* Estimated ACV */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Estimated ACV
              </label>
              <div className='relative'>
                <p className='absolute left-3 top-1/2 mt-[1px] -translate-y-1/2 text-sm text-black'>
                  {formData.estimatedAcv ? '$' : ''}
                </p>
                <Input
                  placeholder='eg. 150000'
                  className='rounded-lg pl-6 text-black placeholder:text-[#6B7280]'
                  type='number'
                  value={formData.estimatedAcv}
                  min={0}
                  onChange={(e) =>
                    handleInputChange('estimatedAcv', e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* Expected closing time */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
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

            {/* Website */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Website
              </label>
              <Input
                placeholder='eg. https://www.acme.com'
                className={`rounded-lg text-black placeholder:text-[#6B7280] ${dealExistsError || websiteError ? 'border-red-500 focus:border-red-500' : ''}`}
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                onBlur={handleWebsiteBlur}
                required
              />
              {websiteError && (
                <p className='mt-1 text-xs text-red-500'>{websiteError}</p>
              )}
              {dealExistsError && (
                <p className='mt-1 text-xs text-red-500'>{dealExistsError}</p>
              )}
            </div>

            {/* Current Solution/Competitor */}
            <div className='md:col-span-2'>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
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

            {/* Use Case & Requirements */}
            <div className='md:col-span-2'>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
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
                  <div className='mb-1 flex items-center justify-between'>
                    <label className='block text-xs font-medium text-[#6B7280]'>
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

          {/* Added Custom Field Button */}
          {!showCustomField && (
            <Button
              variant='ghost'
              className='mb-4 flex w-full items-center justify-center gap-2 rounded-lg border text-black'
              onClick={() => setShowCustomField(true)}
            >
              <Plus size={18} /> Add Custom Field
            </Button>
          )}

          {/* Custom Field Form */}
          {showCustomField && (
            <div className='mb-4 border-t pt-4'>
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
                  <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
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
                  <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                    Select data type
                  </label>
                  <Select
                    value={newFieldData.type}
                    onValueChange={(value) =>
                      setNewFieldData({ ...newFieldData, type: value })
                    }
                  >
                    <SelectTrigger className='w-full rounded-lg'>
                      <SelectValue placeholder='Text' />
                    </SelectTrigger>
                    <SelectContent>
                      {dataTypes.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='md:col-span-2'>
                  <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
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
        </div>

        {/* Footer */}
        <Separator />
        <div className='flex gap-4 px-6 pb-8 pt-4'>
          <Button
            variant='outline'
            className='flex-1 rounded-lg border-2 border-gray-300 bg-white font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            onClick={handleReset}
          >
            Cancel
          </Button>
          <Button
            className='flex-1 rounded-lg bg-primary-blue font-semibold text-white hover:bg-blue-700'
            onClick={handleSubmit}
            disabled={submitting || !isFormValid() || inDummyFlow}
          >
            {submitting ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddDealDetailsModal
