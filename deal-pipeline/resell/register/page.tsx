'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { format } from 'date-fns'
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
  FileCheck,
  FileText,
  Search,
  Shield
} from 'lucide-react'
import { useSelector } from 'react-redux'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { showCustomToast } from '@/components/custom-toast'

import ConflictCheckLoading from '../_components/ConflictCheckLoading'
import ConflictCheckScreen from '../_components/ConflictCheckScreen'
import SubmissionLoading from '../_components/SubmissionLoading'

type Step =
  | 'form'
  | 'review'
  | 'loading-conflicts'
  | 'conflict-check'
  | 'loading-submission'

interface Partner {
  orgId: number
  name: string
}

export default function ResellPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('form')
  const [partners, setPartners] = useState<Partner[]>([])
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([])
  const [partnerSearch, setPartnerSearch] = useState('')
  const [isPartnerOpen, setIsPartnerOpen] = useState(false)
  const [partnersLoading, setPartnersLoading] = useState(false)
  const [isCalculatingTier, setIsCalculatingTier] = useState(false)
  const [tierCalculated, setTierCalculated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdDealId, setCreatedDealId] = useState<number | null>(null)

  const { organization } = useSelector((state: RootState) => state.currentOrg)
  const currentOrgId = organization?.id

  const [formData, setFormData] = useState({
    customerName: '',
    releaseTime: '',
    resellerPartner: 'Sharkdom',
    expectedClosingDate: new Date(), // Current date
    productsRequired: '',
    numberOfLicenses: '',
    tier: '',
    billingModel: 'prepaid-bulk',
    suggestedRetailPrice: '',
    suggestedBulkPrice: '',
    requestSpecialPricing: true,
    competitorInfo: ''
  })
  const [selectedPartnerOrgId, setSelectedPartnerOrgId] = useState<
    number | null
  >(null)

  // Mock conflicts data
  const [conflicts, setConflicts] = useState([
    {
      id: 'account-exists',
      title: 'Account already exist in CRMs',
      count: 1,
      details: {
        accountName: 'Global Solution',
        owner: 'Jhon Doe',
        stage: 'In Pipeline',
        lastActivity: '29 Nov',
        region: 'Chennai'
      },
      resolutionText:
        'You can link the CRM and the system automatically checks if this is the same customer.'
    },
    {
      id: 'opportunity-exists',
      title: 'An opportunity already exists for this account',
      count: 3
    },
    {
      id: 'partner-registered',
      title: 'Another partner has already registered this deal',
      count: 3
    },
    {
      id: 'territory',
      title: "Not assigned to this partner's territory",
      count: 3
    },
    {
      id: 'already-submitted',
      title: 'This deal was already submitted',
      count: 3
    }
  ])

  // Fetch partners on component mount
  useEffect(() => {
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

    fetchPartners()
  }, [])

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

  // Calculate tier and pricing when numberOfLicenses or selectedPartnerOrgId changes
  useEffect(() => {
    // Don't calculate if partner orgId is not available or if already calculating
    if (!selectedPartnerOrgId || isCalculatingTier) {
      return
    }

    // Don't calculate if numberOfLicenses is empty or invalid
    if (!formData.numberOfLicenses || formData.numberOfLicenses.trim() === '') {
      return
    }

    const numberOfLicenses = parseInt(formData.numberOfLicenses)
    if (isNaN(numberOfLicenses) || numberOfLicenses <= 0) {
      return
    }

    // Debounce the API call - wait 500ms after user stops typing
    const timeoutId = setTimeout(async () => {
      try {
        setIsCalculatingTier(true)
        const response = await fetch(
          `/api/reseller/deals/calculate/partner/tier?orgId=${selectedPartnerOrgId}&numberOfLicences=${numberOfLicenses}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (result.success && result.data) {
          const { tierName, actualPrice, buyPrice } = result.data

          // Format prices with currency symbol and commas
          const formatPrice = (price: number) => {
            return `₹ ${price.toLocaleString('en-IN')}`
          }

          setFormData((prev) => ({
            ...prev,
            tier: tierName || prev.tier,
            suggestedRetailPrice: formatPrice(actualPrice),
            suggestedBulkPrice: formatPrice(buyPrice)
          }))
          setTierCalculated(true)
        }
      } catch (error) {
        console.error('Error calculating tier:', error)
        // Don't show error to user, just log it
      } finally {
        setIsCalculatingTier(false)
      }
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId)
  }, [formData.numberOfLicenses, selectedPartnerOrgId])

  const handlePartnerSelect = (value: string) => {
    handleInputChange('customerName', value)
    // Find the partner's orgId from the partners list
    const selectedPartner = partners.find((partner) => partner.name === value)
    if (selectedPartner) {
      setSelectedPartnerOrgId(selectedPartner.orgId)
    } else {
      setSelectedPartnerOrgId(null)
    }
    setPartnerSearch('')
    setIsPartnerOpen(false)
    // Reset tier calculation when partner changes
    setTierCalculated(false)
  }

  const handleInputChange = (field: string, value: string | boolean | Date) => {
    // If numberOfLicenses is being changed, reset tier calculated flag
    if (field === 'numberOfLicenses') {
      setTierCalculated(false)
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Helper function to extract number from formatted price string
  const extractPriceNumber = (priceString: string): number => {
    if (!priceString) return 0
    // Remove ₹ symbol, commas, and spaces, then parse
    const cleaned = priceString.replace(/[₹,\s]/g, '')
    return parseFloat(cleaned) || 0
  }

  // Calculate days until expected closing date
  const calculateDaysUntilClosing = (date: Date): number => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const closingDate = new Date(date)
    closingDate.setHours(0, 0, 0, 0)
    const diffTime = closingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const handleNext = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    // Validate required fields before moving to review
    if (
      !formData.customerName ||
      !formData.releaseTime ||
      !formData.productsRequired ||
      !formData.numberOfLicenses ||
      !formData.tier ||
      !formData.suggestedRetailPrice ||
      !formData.suggestedBulkPrice
    ) {
      showCustomToast(
        'Error',
        'Please fill in all required fields',
        'error',
        5000
      )
      return
    }

    setCurrentStep('review')
  }

  // Handle form submission - create deal, then show conflict check
  const handleSubmit = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent default form submission if any
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    // Validate required fields
    if (
      !formData.customerName ||
      !formData.releaseTime ||
      !formData.productsRequired ||
      !formData.numberOfLicenses ||
      !formData.tier ||
      !formData.suggestedRetailPrice ||
      !formData.suggestedBulkPrice
    ) {
      showCustomToast(
        'Error',
        'Please fill in all required fields',
        'error',
        5000
      )
      return
    }

    // Get the selected partner's orgId
    const selectedPartner = partners.find(
      (partner) => partner.name === formData.customerName
    )

    if (!selectedPartner) {
      showCustomToast('Error', 'Please select a valid partner', 'error', 5000)
      return
    }

    try {
      setIsSubmitting(true)

      // Prepare the request body
      const requestBody = {
        vendorOrgId: selectedPartner.orgId,
        expectedReleaseTime: formData.releaseTime,
        expectedReleaseDate: formData.expectedClosingDate.toISOString(),
        resellerMode: 'RESELL',
        productPlanRequired: formData.productsRequired,
        numberOfLicences: parseInt(formData.numberOfLicenses) || 0,
        calculatedPartnerTier: formData.tier,
        billingModel: formData.billingModel,
        actualPrice: extractPriceNumber(formData.suggestedRetailPrice),
        buyPrice: extractPriceNumber(formData.suggestedBulkPrice)
      }

      const response = await fetch('/api/reseller/deals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        )
      }

      const result = await response.json()

      // Extract deal ID from the response
      let dealId: number | null = null
      if (result.success && result.data && result.data.id) {
        dealId = result.data.id
        setCreatedDealId(result.data.id)
      } else if (result.data && result.data.id) {
        // Handle case where success flag might not be present
        dealId = result.data.id
        setCreatedDealId(result.data.id)
      } else {
        throw new Error('Deal ID not found in API response')
      }

      // After successful API call, directly navigate to deal detail page
      if (dealId) {
        // Create deal data object
        const dealData = {
          dealId: dealId.toString(),
          dealCode: dealId.toString(),
          customerAccountName: formData.customerName,
          releaseTime: formData.releaseTime,
          resellerPartner: formData.resellerPartner,
          expectedClosingDate: format(
            formData.expectedClosingDate,
            'dd MMM yyyy'
          ),
          productsRequired: formData.productsRequired,
          numberOfLicenses: formData.numberOfLicenses,
          tier: formData.tier,
          billingModel: formData.billingModel,
          suggestedRetailPrice: formData.suggestedRetailPrice,
          suggestedBulkPrice: formData.suggestedBulkPrice,
          competitorInfo: formData.competitorInfo,
          dealStage: 'WAITING_FOR_APPROVAL',
          source: 'PORTAL',
          isApproved: false,
          dealProtectionPeriod: 90
        }

        // Store in localStorage (matching existing pattern)
        localStorage.setItem('selectedDeal', JSON.stringify(dealData))

        // Navigate directly to resell deal details page
        router.push(`/deal-pipeline/resell/${dealId}`)
      }
    } catch (error: any) {
      console.error('Error creating reseller deal:', error)
      showCustomToast(
        'Error',
        error.message || 'Failed to create deal. Please try again.',
        'error',
        5000
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // After loading conflicts, show conflict check screen
  useEffect(() => {
    if (currentStep === 'loading-conflicts') {
      const timer = setTimeout(() => {
        setCurrentStep('conflict-check')
      }, 3000) // 3 seconds
      return () => {
        clearTimeout(timer)
      }
    }
  }, [currentStep])

  // Handle conflict dismissal
  const handleDismissConflict = (conflictId: string) => {
    setConflicts((prev) =>
      prev.map((conflict) =>
        conflict.id === conflictId
          ? { ...conflict, isExpanded: false }
          : conflict
      )
    )
  }

  // Handle submit anyway - show loading, then navigate to deal details
  const handleSubmitAnyway = () => {
    setCurrentStep('loading-submission')
  }

  // After loading submission, navigate to deal details
  useEffect(() => {
    if (currentStep === 'loading-submission' && createdDealId) {
      const timer = setTimeout(() => {
        // Use the deal ID from API response
        const dealId = createdDealId.toString()

        // Create deal data object
        const dealData = {
          dealId: dealId,
          dealCode: dealId,
          customerAccountName: formData.customerName,
          releaseTime: formData.releaseTime,
          resellerPartner: formData.resellerPartner,
          expectedClosingDate: format(
            formData.expectedClosingDate,
            'dd MMM yyyy'
          ),
          productsRequired: formData.productsRequired,
          numberOfLicenses: formData.numberOfLicenses,
          tier: formData.tier,
          billingModel: formData.billingModel,
          suggestedRetailPrice: formData.suggestedRetailPrice,
          suggestedBulkPrice: formData.suggestedBulkPrice,
          competitorInfo: formData.competitorInfo,
          dealStage: 'WAITING_FOR_APPROVAL',
          source: 'PORTAL',
          isApproved: false,
          dealProtectionPeriod: 90
        }

        // Store in localStorage (matching existing pattern)
        localStorage.setItem('selectedDeal', JSON.stringify(dealData))

        // Navigate to resell deal details page
        router.push(`/deal-pipeline/resell/${dealId}`)
      }, 3000) // 3 seconds
      return () => clearTimeout(timer)
    }
  }, [currentStep, createdDealId, formData, router])

  const handleDiscard = () => {
    router.push('/deal-pipeline/resell')
  }

  // Render based on current step
  const renderContent = () => {
    switch (currentStep) {
      case 'loading-conflicts':
        return <ConflictCheckLoading />
      case 'conflict-check':
        return (
          <ConflictCheckScreen
            conflicts={conflicts}
            onDismiss={handleDismissConflict}
            onSubmitAnyway={handleSubmitAnyway}
            onDiscard={handleDiscard}
          />
        )
      case 'loading-submission':
        return <SubmissionLoading />
      case 'review':
        return renderReview()
      case 'form':
      default:
        return renderForm()
    }
  }

  const renderReview = () => (
    <>
      <div className='min-w-[340px] flex-1'>
        <div className='mb-6 rounded-2xl border bg-white p-8'>
          <div className='mb-6 flex items-center gap-2'>
            <FileCheck size={20} className='text-gray-800' />
            <span className='text-lg font-semibold text-[#1A202C]'>
              Review Deal Details
            </span>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Partner Name
              </label>
              <div className='flex h-10 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                {formData.customerName || '—'}
              </div>
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Release time(expected)
              </label>
              <div className='flex h-10 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                {formData.releaseTime || '—'}
              </div>
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Reseller Mode
              </label>
              <div className='flex h-10 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#6B7280]'>
                {formData.resellerPartner}
              </div>
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Expected Closing Date
              </label>
              <div className='flex h-10 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                {formData.expectedClosingDate
                  ? format(formData.expectedClosingDate, 'dd MMM yyyy')
                  : '—'}
              </div>
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Products/Plan Required
              </label>
              <div className='flex h-10 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                {formData.productsRequired || '—'}
              </div>
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Number of Licenses
              </label>
              <div className='flex h-10 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                {formData.numberOfLicenses || '—'}
              </div>
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Calculated Partner Tier
              </label>
              <div className='flex h-10 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                {formData.tier || '—'}
              </div>
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Billing Model
              </label>
              <div className='flex h-10 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                {formData.billingModel === 'prepaid-bulk'
                  ? 'Prepaid bulk'
                  : formData.billingModel}
              </div>
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Actual price
              </label>
              <div className='flex h-10 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                {formData.suggestedRetailPrice || '—'}
              </div>
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Buy Price (After discount)
              </label>
              <div className='flex h-10 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#1A202C]'>
                {formData.suggestedBulkPrice || '—'}
              </div>
            </div>
          </div>

          <div className='mt-8 flex gap-4'>
            <Button
              type='button'
              variant='outline'
              className='flex-1 rounded-lg border-gray-300 text-gray-700'
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentStep('form')
              }}
            >
              Back
            </Button>
            <Button
              type='button'
              variant={isSubmitting ? 'disable' : 'primary'}
              className={cn(
                'flex-1 rounded-lg font-semibold',
                isSubmitting &&
                  'disabled:pointer-events-auto disabled:cursor-not-allowed'
              )}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleSubmit(e)
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Deal...' : 'Confirm & Create'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )

  const renderForm = () => (
    <>
      <div className='min-w-[340px] flex-1'>
        <div className='mb-6 rounded-2xl border bg-white p-8'>
          <div className='mb-6 flex items-center gap-2'>
            <FileText size={20} className='text-gray-800' />
            <span className='text-lg font-semibold text-[#1A202C]'>
              Reseller Opportunity Details
            </span>
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {/* Basic Section */}
            <div className='md:col-span-2'>
              <h3 className='mb-4 text-sm font-semibold text-[#1A202C]'>
                Basic
              </h3>
            </div>

            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Partner Name<span className='text-red-500'>*</span>
              </label>
              <Select
                value={formData.customerName}
                onValueChange={handlePartnerSelect}
                open={isPartnerOpen}
                onOpenChange={setIsPartnerOpen}
                disabled={partnersLoading}
              >
                <SelectTrigger className='w-full rounded-lg'>
                  <SelectValue
                    placeholder={
                      partnersLoading ? 'Loading partners...' : 'Select Partner'
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
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Release time(expected)<span className='text-red-500'>*</span>
              </label>
              <Input
                placeholder='eg. 48 hours'
                className='rounded-lg text-black placeholder:text-[#6B7280]'
                value={formData.releaseTime}
                onChange={(e) =>
                  handleInputChange('releaseTime', e.target.value)
                }
              />
            </div>

            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Reseller Mode
              </label>
              <div className='flex h-10 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-black'>
                {formData.resellerPartner}
              </div>
            </div>

            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Expected Closing Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='h-10 w-full justify-start rounded-lg text-left font-normal'
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {formData.expectedClosingDate
                      ? format(formData.expectedClosingDate, 'dd MMMM yyyy')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={formData.expectedClosingDate}
                    onSelect={(date) => {
                      if (date) {
                        handleInputChange('expectedClosingDate', date)
                      }
                    }}
                    initialFocus
                    fromDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Licensing & Billing Section */}
            <div className='md:col-span-2'>
              <h3 className='mb-4 mt-6 text-sm font-semibold text-[#1A202C]'>
                Licensing & Billing
              </h3>
            </div>

            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Products/Plan Required<span className='text-red-500'>*</span>
              </label>
              <Select
                value={formData.productsRequired || undefined}
                onValueChange={(value) =>
                  handleInputChange('productsRequired', value)
                }
              >
                <SelectTrigger className={`w-full rounded-lg`}>
                  <SelectValue placeholder='Select Product/Plan' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Enterprise Resource Planning (ERP)'>
                    Enterprise Resource Planning (ERP)
                  </SelectItem>
                  <SelectItem value='Customer Relationship Management (CRM)'>
                    Customer Relationship Management (CRM)
                  </SelectItem>
                  <SelectItem value='Project Management'>
                    Project Management
                  </SelectItem>
                  <SelectItem value='Other'>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Number of Licenses<span className='text-red-500'>*</span>
                {isCalculatingTier && (
                  <span className='ml-2 text-xs text-gray-500'>
                    (Calculating tier...)
                  </span>
                )}
              </label>
              <Input
                placeholder='Eg: 123'
                className='rounded-lg text-black placeholder:text-[#6B7280]'
                type='number'
                min='0'
                value={formData.numberOfLicenses}
                onChange={(e) => {
                  const value = e.target.value
                  // Prevent negative values
                  if (
                    value === '' ||
                    (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))
                  ) {
                    handleInputChange('numberOfLicenses', value)
                  }
                }}
              />
            </div>

            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Calculated Partner Tier
              </label>
              <div className='flex h-10 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#6B7280]'>
                {isCalculatingTier ? 'Calculating...' : formData.tier}
              </div>
              <Link
                href='#'
                className='mt-1 text-xs text-primary-blue hover:underline'
              >
                View how this is calculated in sharkdom
              </Link>
            </div>

            <div className='md:col-span-2'>
              <label className='mb-2 block text-xs font-medium text-[#6B7280]'>
                Billing Model
              </label>
              <RadioGroup
                value={formData.billingModel}
                onValueChange={(value) =>
                  handleInputChange('billingModel', value)
                }
                className='flex gap-6'
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='prepaid-bulk' id='prepaid-bulk' />
                  <Label
                    htmlFor='prepaid-bulk'
                    className='cursor-pointer text-sm font-normal'
                  >
                    Prepaid bulk
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Pricing Section */}
            <div className='md:col-span-2'>
              <h3 className='mb-4 mt-6 text-sm font-semibold text-[#1A202C]'>
                Pricing
              </h3>
            </div>

            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Actual price
              </label>
              <div className='flex h-10 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#6B7280]'>
                {formData.suggestedRetailPrice || '-'}
              </div>
            </div>

            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Buy Price (After discount)
              </label>
              <div className='flex h-10 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-[#6B7280]'>
                {formData.suggestedBulkPrice || '-'}
              </div>
            </div>

            <div className='md:col-span-2'>
              <Link
                href='#'
                className='text-sm font-medium text-primary-blue hover:underline'
              >
                View Pricing Catalog
              </Link>
            </div>

            {/* <div className='flex items-center space-x-2 md:col-span-2'>
              <Checkbox
                id='special-pricing'
                checked={formData.requestSpecialPricing}
                onCheckedChange={(checked) =>
                  handleInputChange('requestSpecialPricing', checked as boolean)
                }
              />
              <Label
                htmlFor='special-pricing'
                className='cursor-pointer text-sm font-normal text-[#6B7280]'
              >
                Request Permission for Special Pricing
              </Label>
            </div> */}
          </div>

          <div className='mt-8 flex gap-4'>
            <Button
              type='button'
              variant='outline'
              className='flex-1 rounded-lg border-gray-300 text-gray-700'
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleDiscard()
              }}
            >
              Discard
            </Button>
            <Button
              type='button'
              variant={isSubmitting ? 'disable' : 'primary'}
              className={cn(
                'flex-1 rounded-lg font-semibold',
                isSubmitting &&
                  'disabled:pointer-events-auto disabled:cursor-not-allowed'
              )}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleNext(e)
              }}
              disabled={isSubmitting}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  )

  const renderSidebar = () => (
    <div className='mt-8 flex w-full flex-col gap-6 md:mt-0 md:max-w-xs'>
      {/* Process Overview */}
      <div className='rounded-2xl border bg-white p-6'>
        <div className='mb-4 text-lg font-semibold text-[#1A202C]'>
          Process Overview
        </div>
        <div className='space-y-4'>
          <div className='flex items-center gap-3'>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                currentStep === 'form' || currentStep === 'review'
                  ? 'bg-[#3E50F7] text-white'
                  : 'border-2 border-gray-200 bg-white'
              }`}
            >
              {currentStep === 'form' || currentStep === 'review' ? (
                <CheckCircle2 size={16} />
              ) : (
                <CheckCircle2 size={16} className='text-gray-400' />
              )}
            </div>
            <span
              className={`text-sm font-medium ${
                currentStep === 'form' || currentStep === 'review'
                  ? 'text-[#1A202C]'
                  : 'text-gray-600'
              }`}
            >
              License Quota
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full 
                ${
                  // currentStep === 'review'
                  // ? 'bg-[#3E50F7] text-white'
                  // :
                  'border-2 border-gray-200 bg-white'
                }`}
            >
              <FileCheck
                size={16}
                className={
                  // currentStep === 'review' ?
                  //  'text-white'
                  // :
                  'text-gray-400'
                }
              />
            </div>
            <span
              className={`text-sm font-medium ${
                currentStep === 'review' ? 'text-[#1A202C]' : 'text-gray-600'
              }`}
            >
              Review
            </span>
          </div>
        </div>
      </div>

      {/* Connect Your CRM */}
      {/* <div className='rounded-2xl border bg-white p-6'>
        <div className='mb-4 text-lg font-semibold text-[#1A202C]'>
          Connect Your CRM
        </div>
        <div className='mb-4 flex items-center justify-center rounded-lg bg-gray-50 p-8'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-200'>
              <FileText size={24} className='text-gray-400' />
            </div>
          </div>
        </div>
        <p className='mb-4 text-sm text-[#6B7280]'>
          To see the lapse of the opportunities or account or customers and fast
          track your process.{' '}
          <Link href='#' className='text-primary-blue hover:underline'>
            Learn more
          </Link>
          .
        </p>
        <Button
          className='w-full rounded-lg bg-primary-blue font-semibold text-white hover:bg-blue-700'
          onClick={() => router.push('/integrations')}
        >
          Connect CRM
        </Button>
      </div> */}
    </div>
  )

  return (
    <div className='relative min-h-screen bg-[#FAFBFC]'>
      <div className='flex w-full flex-col items-center'>
        <div className='flex w-full flex-col gap-0 px-[5%] pb-12 pt-8 md:px-[10%]'>
          <Link
            href='/deal-pipeline/resell'
            className='mb-4 flex items-center gap-2 text-sm font-medium text-primary-blue hover:underline'
          >
            <ArrowLeft size={18} /> Back to Resell Deal Pipeline
          </Link>
          <div className='mb-2 text-2xl font-bold text-[#1A202C]'>
            Request license
          </div>
          <div className='mb-6 text-base text-[#6B7280]'>
            Register a new partner opportunity
          </div>

          <div className='flex w-full flex-col items-start gap-8 md:flex-row'>
            {/* Main Content Area */}
            {renderContent()}

            {/* Right Sidebar - Only show for form and conflict check steps */}
            {(currentStep === 'form' ||
              currentStep === 'review' ||
              currentStep === 'conflict-check') &&
              renderSidebar()}
          </div>
        </div>
      </div>
    </div>
  )
}
