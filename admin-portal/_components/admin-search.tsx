'use client'

import React, { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Filter, Search, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { showCustomToast } from '@/components/custom-toast'

type PaginationInfo = {
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

type Filters = {
  status: string[]
  verified: string | null
  subscribed: string | null
  externalPartnerImported: string | null
  emailOutreachConsentGranted: string | null
  dealCreatedOrAssigned: string | null
  anyIntegrationAdded: string | null
  freeDealPlan: string | null
  freePartnerMappingPlan: string | null
}

type Props = {}

const AdminSearch = (props: Props) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [organizations, setOrganizations] = useState<any[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [openSections, setOpenSections] = useState({
    status: true,
    verified: true,
    subscribed: true,
    additional: false
  })

  const [filters, setFilters] = useState<Filters>({
    status: [],
    verified: null,
    subscribed: null,
    externalPartnerImported: null,
    emailOutreachConsentGranted: null,
    dealCreatedOrAssigned: null,
    anyIntegrationAdded: null,
    freeDealPlan: null,
    freePartnerMappingPlan: null
  })

  const [expandedSectionsMap, setExpandedSectionsMap] = useState<
    Record<number, Record<string, boolean>>
  >({})

  const statusOptions = ['ACTIVE', 'INACTIVE', 'DELETED', 'PENDING']
  const booleanOptions = [
    { label: 'All', value: null },
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' }
  ]

  const fetchOrganizations = async (page: number = 0) => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `/api/admin-portal-search?searchQuery=${searchQuery}&page=${page}&size=20`,
        {
          headers: {
            Authorization: `Bearer ${'token'}`
          }
        }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch organizations')
      }

      const data = await response.json()
      const searchResponse = data?.searchResponse || data

      // Handle the new paginated response structure
      if (searchResponse?.content) {
        setOrganizations(searchResponse.content)
        setPagination({
          totalElements: searchResponse.totalElements || 0,
          totalPages: searchResponse.totalPages || 0,
          number: searchResponse.number || 0,
          size: searchResponse.size || 20,
          first: searchResponse.first || false,
          last: searchResponse.last || false
        })
        setCurrentPage(searchResponse.number || 0)
      } else {
        // Fallback for non-paginated responses
        setOrganizations(Array.isArray(searchResponse) ? searchResponse : [])
        setPagination(null)
      }
    } catch (error: any) {
      showCustomToast(
        'Error',
        error?.message || 'Something went wrong, please try again.',
        'error',
        5000
      )
      setOrganizations([])
      setPagination(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchSubmit = async () => {
    setCurrentPage(0)
    await fetchOrganizations(0)
  }

  const handlePageChange = async (newPage: number) => {
    await fetchOrganizations(newPage)
  }

  // Filter organizations based on active filters
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(org.status)) {
        return false
      }

      // Boolean filters
      const booleanFilterFields = [
        'verified',
        'subscribed',
        'externalPartnerImported',
        'emailOutreachConsentGranted',
        'dealCreatedOrAssigned',
        'anyIntegrationAdded',
        'freeDealPlan',
        'freePartnerMappingPlan'
      ] as const

      for (const field of booleanFilterFields) {
        if (filters[field] !== null) {
          const orgValue = org[field]?.toString() || 'false'
          if (orgValue !== filters[field]) {
            return false
          }
        }
      }

      return true
    })
  }, [organizations, filters])

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status]
    }))
  }

  const handleBooleanFilter = (field: keyof Filters, value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      [field]: prev[field] === value ? null : value
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      status: [],
      verified: null,
      subscribed: null,
      externalPartnerImported: null,
      emailOutreachConsentGranted: null,
      dealCreatedOrAssigned: null,
      anyIntegrationAdded: null,
      freeDealPlan: null,
      freePartnerMappingPlan: null
    })
  }

  const activeFiltersCount = useMemo(() => {
    let count = filters.status.length
    const booleanFields: (keyof Filters)[] = [
      'verified',
      'subscribed',
      'externalPartnerImported',
      'emailOutreachConsentGranted',
      'dealCreatedOrAssigned',
      'anyIntegrationAdded',
      'freeDealPlan',
      'freePartnerMappingPlan'
    ]
    booleanFields.forEach((field) => {
      if (filters[field] !== null) count++
    })
    return count
  }, [filters])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default'
      case 'DELETED':
        return 'destructive'
      case 'PENDING':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getExpandedSections = (orgId: number) => {
    return (
      expandedSectionsMap[orgId] || {
        basic: true,
        contact: false,
        location: false,
        company: false,
        partnership: false,
        verification: false,
        credits: false,
        schedules: false,
        flags: false,
        metadata: false,
        allFields: false,
        rawJson: false
      }
    )
  }

  const toggleSection = (orgId: number, section: string) => {
    setExpandedSectionsMap((prev) => ({
      ...prev,
      [orgId]: {
        ...getExpandedSections(orgId),
        [section]: !getExpandedSections(orgId)[section]
      }
    }))
  }

  // Helper function to format field names (convert camelCase to Title Case)
  const formatFieldName = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  // Helper function to format value for display
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.length > 0 ? `[${value.length} items]` : '[]'
      }
      return JSON.stringify(value, null, 2)
    }
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      // Try to format as date
      try {
        return new Date(value).toLocaleString()
      } catch {
        return value
      }
    }
    return String(value)
  }

  // Helper function to check if a value should be displayed
  const shouldDisplayValue = (value: any): boolean => {
    if (value === null || value === undefined) return false
    if (typeof value === 'string' && value.trim() === '') return false
    if (Array.isArray(value) && value.length === 0) return false
    if (typeof value === 'object' && Object.keys(value).length === 0)
      return false
    return true
  }

  // Get all keys from the organization object, excluding already displayed sections
  const getAllFields = (org: any) => {
    const excludedKeys = [
      'id',
      'name',
      'code',
      'status',
      'about',
      'briefDescription',
      'inceptionYear',
      'registrationType',
      'sector',
      'sectorType',
      'stage',
      'companyType',
      'legalName',
      'cin',
      'currency',
      'rating',
      'roleSpecs',
      'primaryEmail',
      'primaryEmailVerified',
      'contactNumber',
      'website',
      'domain',
      'domainVerified',
      'logoUrl',
      'socialMedias',
      'address',
      'city',
      'state',
      'country',
      'pincode',
      'dateOfIncorporation',
      'incorporationDate',
      'targetMarket',
      'funding',
      'customerBase',
      'additionalDetails',
      'services',
      'openForPartnership',
      'isInHousePartnership',
      'partnershipTeamSize',
      'partnershipRestrictions',
      'activePartnerships',
      'pipelinePartnerships',
      'meetingSuccessRate',
      'acknowledgmentTime',
      'preferredPartnershipTypes',
      'preferredSectors',
      'preferredSubSectors',
      'verified',
      'verifiedBy',
      'verifiedOn',
      'verificationApplicationStatus',
      'verificationResponse',
      'credits',
      'schedules',
      'subscribed',
      'emailUnsubscribed',
      'externalPartnerImported',
      'emailOutreachConsentGranted',
      'dealCreatedOrAssigned',
      'anyIntegrationAdded',
      'freeDealPlan',
      'freePartnerMappingPlan',
      'freePartnerMappingPlanClaimedUserName',
      'referralProgram',
      'brandResources',
      'openPilotProgram',
      'subSector',
      'companySixMonthOperation',
      'companyFundRaising',
      'selectedForExternalPartnerships',
      'shortlisted',
      'unverifiedDeal',
      'isClaimed',
      'filtersAdded',
      'isApplied',
      'internalFormActive',
      'googleFormActive',
      'sendProposalCount',
      'isFreePlanClaimedUserName',
      'referralCode',
      'planCode',
      'creationTimestamp',
      'lastUpdatedTimestamp',
      'lastActivityAtTimestamp',
      'source',
      'signUpSource',
      'onboardedPartners',
      'poc',
      'documentPath',
      'signatories'
    ]

    const allFields: Array<{ key: string; value: any }> = []

    Object.keys(org).forEach((key) => {
      if (!excludedKeys.includes(key) && shouldDisplayValue(org[key])) {
        allFields.push({ key, value: org[key] })
      }
    })

    return allFields.sort((a, b) => a.key.localeCompare(b.key))
  }

  return (
    <div className='min-h-screen bg-background p-4 md:p-6 lg:p-8'>
      <div className='mx-auto max-w-7xl'>
        {/* Header Section */}
        <div className='mb-6'>
          <h1 className='mb-2 text-3xl font-bold tracking-tight'>
            Organization Search
          </h1>
          <p className='text-muted-foreground'>
            Search and filter organizations in the system
          </p>
        </div>

        {/* Search and Filter Bar */}
        <Card className='mb-6'>
          <CardContent className='pt-6'>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col gap-4 sm:flex-row'>
                <div className='relative flex-1'>
                  <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
                  <Input
                    className='pl-10'
                    placeholder='Search by Organization Name or Code...'
                    value={searchQuery}
                    type='text'
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchSubmit()
                      }
                    }}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={handleSearchSubmit}
                  disabled={isLoading}
                  className='sm:w-auto'
                  size='lg'
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setShowFilters(!showFilters)}
                  className='sm:w-auto'
                  size='lg'
                >
                  <Filter className='mr-2 h-4 w-4' />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant='secondary' className='ml-2'>
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className='flex flex-wrap items-center gap-2 border-t pt-2'>
                  <span className='text-sm text-muted-foreground'>
                    Active filters:
                  </span>
                  {filters.status.map((status) => (
                    <Badge key={status} variant='secondary' className='gap-1'>
                      Status: {status}
                      <X
                        className='h-3 w-3 cursor-pointer'
                        onClick={() => handleStatusFilter(status)}
                      />
                    </Badge>
                  ))}
                  {Object.entries(filters)
                    .filter(
                      ([key, value]) => key !== 'status' && value !== null
                    )
                    .map(([key, value]) => {
                      const filterKey = key as keyof Filters
                      const filterValue = value as string
                      return (
                        <Badge key={key} variant='secondary' className='gap-1'>
                          {key.replace(/([A-Z])/g, ' $1').trim()}:{' '}
                          {filterValue === 'true' ? 'Yes' : 'No'}
                          <X
                            className='h-3 w-3 cursor-pointer'
                            onClick={() => handleBooleanFilter(filterKey, null)}
                          />
                        </Badge>
                      )
                    })}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={clearAllFilters}
                    className='h-6 text-xs'
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className='flex flex-col gap-6 lg:flex-row'>
          {/* Filters Sidebar */}
          {showFilters && (
            <div className='flex-shrink-0 lg:w-80'>
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-lg'>Filters</CardTitle>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={clearAllFilters}
                        className='h-8 text-xs'
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {/* Status Filter */}
                  <Collapsible
                    open={openSections.status}
                    onOpenChange={(open) =>
                      setOpenSections((prev) => ({ ...prev, status: open }))
                    }
                  >
                    <CollapsibleTrigger className='flex w-full items-center justify-between text-sm font-medium'>
                      <span>Status</span>
                      {openSections.status ? (
                        <ChevronDown className='h-4 w-4' />
                      ) : (
                        <ChevronUp className='h-4 w-4' />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className='mt-2 space-y-2'>
                      {statusOptions.map((status) => (
                        <div
                          key={status}
                          className='flex items-center space-x-2'
                        >
                          <Checkbox
                            id={`status-${status}`}
                            checked={filters.status.includes(status)}
                            onCheckedChange={() => handleStatusFilter(status)}
                          />
                          <label
                            htmlFor={`status-${status}`}
                            className='flex-1 cursor-pointer text-sm font-normal'
                          >
                            {status}
                          </label>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* Verified Filter */}
                  <Collapsible
                    open={openSections.verified}
                    onOpenChange={(open) =>
                      setOpenSections((prev) => ({ ...prev, verified: open }))
                    }
                  >
                    <CollapsibleTrigger className='flex w-full items-center justify-between text-sm font-medium'>
                      <span>Verified</span>
                      {openSections.verified ? (
                        <ChevronDown className='h-4 w-4' />
                      ) : (
                        <ChevronUp className='h-4 w-4' />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className='mt-2 space-y-2'>
                      {booleanOptions.map((option) => (
                        <div
                          key={option.value || 'all'}
                          className='flex items-center space-x-2'
                        >
                          <Input
                            type='radio'
                            id={`verified-${option.value || 'all'}`}
                            name='verified'
                            checked={filters.verified === option.value}
                            onChange={() =>
                              handleBooleanFilter('verified', option.value)
                            }
                            className='h-4 w-4'
                          />
                          <label
                            htmlFor={`verified-${option.value || 'all'}`}
                            className='flex-1 cursor-pointer text-sm font-normal'
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* Subscribed Filter */}
                  <Collapsible
                    open={openSections.subscribed}
                    onOpenChange={(open) =>
                      setOpenSections((prev) => ({ ...prev, subscribed: open }))
                    }
                  >
                    <CollapsibleTrigger className='flex w-full items-center justify-between text-sm font-medium'>
                      <span>Subscribed</span>
                      {openSections.subscribed ? (
                        <ChevronDown className='h-4 w-4' />
                      ) : (
                        <ChevronUp className='h-4 w-4' />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className='mt-2 space-y-2'>
                      {booleanOptions.map((option) => (
                        <div
                          key={option.value || 'all'}
                          className='flex items-center space-x-2'
                        >
                          <Input
                            type='radio'
                            id={`subscribed-${option.value || 'all'}`}
                            name='subscribed'
                            checked={filters.subscribed === option.value}
                            onChange={() =>
                              handleBooleanFilter('subscribed', option.value)
                            }
                            className='h-4 w-4'
                          />
                          <label
                            htmlFor={`subscribed-${option.value || 'all'}`}
                            className='flex-1 cursor-pointer text-sm font-normal'
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* Additional Filters */}
                  <Collapsible
                    open={openSections.additional}
                    onOpenChange={(open) =>
                      setOpenSections((prev) => ({ ...prev, additional: open }))
                    }
                  >
                    <CollapsibleTrigger className='flex w-full items-center justify-between text-sm font-medium'>
                      <span>Additional Filters</span>
                      {openSections.additional ? (
                        <ChevronDown className='h-4 w-4' />
                      ) : (
                        <ChevronUp className='h-4 w-4' />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className='mt-2 space-y-4'>
                      {/* External Partner Imported */}
                      <div>
                        <label className='mb-2 block text-xs font-medium text-muted-foreground'>
                          External Partner Imported
                        </label>
                        <div className='space-y-2'>
                          {booleanOptions.map((option) => (
                            <div
                              key={option.value || 'all'}
                              className='flex items-center space-x-2'
                            >
                              <Input
                                type='radio'
                                id={`external-${option.value || 'all'}`}
                                name='externalPartnerImported'
                                checked={
                                  filters.externalPartnerImported ===
                                  option.value
                                }
                                onChange={() =>
                                  handleBooleanFilter(
                                    'externalPartnerImported',
                                    option.value
                                  )
                                }
                                className='h-4 w-4'
                              />
                              <label
                                htmlFor={`external-${option.value || 'all'}`}
                                className='flex-1 cursor-pointer text-sm font-normal'
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Email Outreach Consent */}
                      <div>
                        <label className='mb-2 block text-xs font-medium text-muted-foreground'>
                          Email Outreach Consent
                        </label>
                        <div className='space-y-2'>
                          {booleanOptions.map((option) => (
                            <div
                              key={option.value || 'all'}
                              className='flex items-center space-x-2'
                            >
                              <Input
                                type='radio'
                                id={`email-${option.value || 'all'}`}
                                name='emailOutreachConsentGranted'
                                checked={
                                  filters.emailOutreachConsentGranted ===
                                  option.value
                                }
                                onChange={() =>
                                  handleBooleanFilter(
                                    'emailOutreachConsentGranted',
                                    option.value
                                  )
                                }
                                className='h-4 w-4'
                              />
                              <label
                                htmlFor={`email-${option.value || 'all'}`}
                                className='flex-1 cursor-pointer text-sm font-normal'
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Deal Created Or Assigned */}
                      <div>
                        <label className='mb-2 block text-xs font-medium text-muted-foreground'>
                          Deal Created/Assigned
                        </label>
                        <div className='space-y-2'>
                          {booleanOptions.map((option) => (
                            <div
                              key={option.value || 'all'}
                              className='flex items-center space-x-2'
                            >
                              <Input
                                type='radio'
                                id={`deal-${option.value || 'all'}`}
                                name='dealCreatedOrAssigned'
                                checked={
                                  filters.dealCreatedOrAssigned === option.value
                                }
                                onChange={() =>
                                  handleBooleanFilter(
                                    'dealCreatedOrAssigned',
                                    option.value
                                  )
                                }
                                className='h-4 w-4'
                              />
                              <label
                                htmlFor={`deal-${option.value || 'all'}`}
                                className='flex-1 cursor-pointer text-sm font-normal'
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Any Integration Added */}
                      <div>
                        <label className='mb-2 block text-xs font-medium text-muted-foreground'>
                          Integration Added
                        </label>
                        <div className='space-y-2'>
                          {booleanOptions.map((option) => (
                            <div
                              key={option.value || 'all'}
                              className='flex items-center space-x-2'
                            >
                              <Input
                                type='radio'
                                id={`integration-${option.value || 'all'}`}
                                name='anyIntegrationAdded'
                                checked={
                                  filters.anyIntegrationAdded === option.value
                                }
                                onChange={() =>
                                  handleBooleanFilter(
                                    'anyIntegrationAdded',
                                    option.value
                                  )
                                }
                                className='h-4 w-4'
                              />
                              <label
                                htmlFor={`integration-${option.value || 'all'}`}
                                className='flex-1 cursor-pointer text-sm font-normal'
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results Section */}
          <div className='flex-1'>
            {/* Results Header */}
            {pagination && (
              <div className='mb-4 flex items-center justify-between'>
                <div className='text-sm text-muted-foreground'>
                  Showing <strong>{filteredOrganizations.length}</strong> of{' '}
                  <strong>{pagination.totalElements}</strong> organizations
                  {pagination.totalPages > 1 &&
                    ` (Page ${pagination.number + 1} of ${pagination.totalPages})`}
                </div>
                {filteredOrganizations.length !== organizations.length && (
                  <Badge variant='secondary'>
                    {organizations.length - filteredOrganizations.length} hidden
                    by filters
                  </Badge>
                )}
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className='flex h-64 items-center justify-center'>
                <div className='text-center'>
                  <div className='mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
                  <p className='text-sm text-muted-foreground'>
                    Loading organizations...
                  </p>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && (
              <>
                {filteredOrganizations.length > 0 ? (
                  <div className='grid grid-cols-1 gap-4'>
                    {filteredOrganizations.map((org: any) => {
                      const expandedSections = getExpandedSections(org.id)

                      return (
                        <Card
                          key={org.id}
                          className='transition-shadow hover:shadow-lg'
                        >
                          <CardHeader className='pb-3'>
                            <div className='flex items-start justify-between'>
                              <div className='min-w-0 flex-1'>
                                <CardTitle className='mb-1 text-lg'>
                                  {org.name || 'N/A'}
                                </CardTitle>
                                <p className='font-mono text-sm text-muted-foreground'>
                                  Code: {org.code || 'N/A'} | ID:{' '}
                                  {org.id || 'N/A'}
                                </p>
                              </div>
                              {org.status && (
                                <Badge
                                  variant={getStatusBadgeVariant(org.status)}
                                >
                                  {org.status}
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className='space-y-4'>
                            {/* Basic Information */}
                            <Collapsible
                              open={expandedSections.basic}
                              onOpenChange={() =>
                                toggleSection(org.id, 'basic')
                              }
                            >
                              <CollapsibleTrigger className='mb-2 flex w-full items-center justify-between text-sm font-semibold'>
                                <span>Basic Information</span>
                                {expandedSections.basic ? (
                                  <ChevronUp className='h-4 w-4' />
                                ) : (
                                  <ChevronDown className='h-4 w-4' />
                                )}
                              </CollapsibleTrigger>
                              <CollapsibleContent className='space-y-2 text-sm'>
                                <div className='grid grid-cols-2 gap-2'>
                                  {org.about && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        About:{' '}
                                      </span>
                                      <span>{org.about}</span>
                                    </div>
                                  )}
                                  {org.briefDescription && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Brief Description:{' '}
                                      </span>
                                      <span>{org.briefDescription}</span>
                                    </div>
                                  )}
                                  {org.inceptionYear && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Inception Year:{' '}
                                      </span>
                                      <span>{org.inceptionYear}</span>
                                    </div>
                                  )}
                                  {org.registrationType && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Registration Type:{' '}
                                      </span>
                                      <span>{org.registrationType}</span>
                                    </div>
                                  )}
                                  {org.sector && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Sector:{' '}
                                      </span>
                                      <span>{org.sector}</span>
                                    </div>
                                  )}
                                  {org.sectorType && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Sector Type:{' '}
                                      </span>
                                      <span>{org.sectorType}</span>
                                    </div>
                                  )}
                                  {org.stage && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Stage:{' '}
                                      </span>
                                      <span>{org.stage}</span>
                                    </div>
                                  )}
                                  {org.companyType && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Company Type:{' '}
                                      </span>
                                      <span>{org.companyType}</span>
                                    </div>
                                  )}
                                  {org.legalName && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Legal Name:{' '}
                                      </span>
                                      <span>{org.legalName}</span>
                                    </div>
                                  )}
                                  {org.cin && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        CIN:{' '}
                                      </span>
                                      <span>{org.cin}</span>
                                    </div>
                                  )}
                                  {org.currency && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Currency:{' '}
                                      </span>
                                      <span>{org.currency}</span>
                                    </div>
                                  )}
                                  {org.rating && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Rating:{' '}
                                      </span>
                                      <span>{org.rating}</span>
                                    </div>
                                  )}
                                  {org.roleSpecs && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Role Specs:{' '}
                                      </span>
                                      <span>{org.roleSpecs}</span>
                                    </div>
                                  )}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>

                            <Separator />

                            {/* Contact Information */}
                            <Collapsible
                              open={expandedSections.contact}
                              onOpenChange={() =>
                                toggleSection(org.id, 'contact')
                              }
                            >
                              <CollapsibleTrigger className='mb-2 flex w-full items-center justify-between text-sm font-semibold'>
                                <span>Contact Information</span>
                                {expandedSections.contact ? (
                                  <ChevronUp className='h-4 w-4' />
                                ) : (
                                  <ChevronDown className='h-4 w-4' />
                                )}
                              </CollapsibleTrigger>
                              <CollapsibleContent className='space-y-2 text-sm'>
                                <div className='grid grid-cols-2 gap-2'>
                                  {org.primaryEmail && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Email:{' '}
                                      </span>
                                      <span className='break-all'>
                                        {org.primaryEmail}
                                      </span>
                                    </div>
                                  )}
                                  {org.primaryEmailVerified && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Email Verified:{' '}
                                      </span>
                                      <span>{org.primaryEmailVerified}</span>
                                    </div>
                                  )}
                                  {org.contactNumber && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Contact:{' '}
                                      </span>
                                      <span>{org.contactNumber}</span>
                                    </div>
                                  )}
                                  {org.website && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Website:{' '}
                                      </span>
                                      <span className='break-all'>
                                        {org.website}
                                      </span>
                                    </div>
                                  )}
                                  {org.domain && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Domain:{' '}
                                      </span>
                                      <span>{org.domain}</span>
                                    </div>
                                  )}
                                  {org.domainVerified && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Domain Verified:{' '}
                                      </span>
                                      <span>{org.domainVerified}</span>
                                    </div>
                                  )}
                                  {org.logoUrl && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Logo URL:{' '}
                                      </span>
                                      <span className='break-all text-xs'>
                                        {org.logoUrl}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {org.socialMedias &&
                                  org.socialMedias.length > 0 && (
                                    <div className='mt-2'>
                                      <span className='font-medium text-muted-foreground'>
                                        Social Media:{' '}
                                      </span>
                                      <div className='mt-1 space-y-1'>
                                        {org.socialMedias.map(
                                          (sm: any, idx: number) => (
                                            <div
                                              key={idx}
                                              className='pl-2 text-xs'
                                            >
                                              {sm.name}: {sm.url}{' '}
                                              {sm.showOnUi
                                                ? '(Show on UI)'
                                                : ''}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </CollapsibleContent>
                            </Collapsible>

                            <Separator />

                            {/* Location Information */}
                            <Collapsible
                              open={expandedSections.location}
                              onOpenChange={() =>
                                toggleSection(org.id, 'location')
                              }
                            >
                              <CollapsibleTrigger className='mb-2 flex w-full items-center justify-between text-sm font-semibold'>
                                <span>Location</span>
                                {expandedSections.location ? (
                                  <ChevronUp className='h-4 w-4' />
                                ) : (
                                  <ChevronDown className='h-4 w-4' />
                                )}
                              </CollapsibleTrigger>
                              <CollapsibleContent className='space-y-2 text-sm'>
                                <div className='grid grid-cols-2 gap-2'>
                                  {org.address && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Address:{' '}
                                      </span>
                                      <span>{org.address}</span>
                                    </div>
                                  )}
                                  {org.city && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        City:{' '}
                                      </span>
                                      <span>{org.city}</span>
                                    </div>
                                  )}
                                  {org.state && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        State:{' '}
                                      </span>
                                      <span>{org.state}</span>
                                    </div>
                                  )}
                                  {org.country && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Country:{' '}
                                      </span>
                                      <span>{org.country}</span>
                                    </div>
                                  )}
                                  {org.pincode && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Pincode:{' '}
                                      </span>
                                      <span>{org.pincode}</span>
                                    </div>
                                  )}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>

                            <Separator />

                            {/* Company Details */}
                            <Collapsible
                              open={expandedSections.company}
                              onOpenChange={() =>
                                toggleSection(org.id, 'company')
                              }
                            >
                              <CollapsibleTrigger className='mb-2 flex w-full items-center justify-between text-sm font-semibold'>
                                <span>Company Details</span>
                                {expandedSections.company ? (
                                  <ChevronUp className='h-4 w-4' />
                                ) : (
                                  <ChevronDown className='h-4 w-4' />
                                )}
                              </CollapsibleTrigger>
                              <CollapsibleContent className='space-y-2 text-sm'>
                                <div className='grid grid-cols-2 gap-2'>
                                  {org.dateOfIncorporation && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Date of Incorporation:{' '}
                                      </span>
                                      <span>{org.dateOfIncorporation}</span>
                                    </div>
                                  )}
                                  {org.incorporationDate && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Incorporation Date:{' '}
                                      </span>
                                      <span>
                                        {new Date(
                                          org.incorporationDate
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                  {org.targetMarket && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Target Market:{' '}
                                      </span>
                                      <span>{org.targetMarket}</span>
                                    </div>
                                  )}
                                  {org.funding && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Funding:{' '}
                                      </span>
                                      <span>{org.funding}</span>
                                    </div>
                                  )}
                                  {org.customerBase && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Customer Base:{' '}
                                      </span>
                                      <span>{org.customerBase}</span>
                                    </div>
                                  )}
                                  {org.additionalDetails && (
                                    <div className='col-span-2'>
                                      <span className='font-medium text-muted-foreground'>
                                        Additional Details:{' '}
                                      </span>
                                      <span>{org.additionalDetails}</span>
                                    </div>
                                  )}
                                </div>
                                {org.services && org.services.length > 0 && (
                                  <div className='mt-2'>
                                    <span className='font-medium text-muted-foreground'>
                                      Services:{' '}
                                    </span>
                                    <div className='mt-1 flex flex-wrap gap-1'>
                                      {org.services.map(
                                        (s: any, idx: number) => (
                                          <Badge
                                            key={idx}
                                            variant='outline'
                                            className='text-xs'
                                          >
                                            {s.service}
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </CollapsibleContent>
                            </Collapsible>

                            <Separator />

                            {/* Partnership Information */}
                            <Collapsible
                              open={expandedSections.partnership}
                              onOpenChange={() =>
                                toggleSection(org.id, 'partnership')
                              }
                            >
                              <CollapsibleTrigger className='mb-2 flex w-full items-center justify-between text-sm font-semibold'>
                                <span>Partnership Information</span>
                                {expandedSections.partnership ? (
                                  <ChevronUp className='h-4 w-4' />
                                ) : (
                                  <ChevronDown className='h-4 w-4' />
                                )}
                              </CollapsibleTrigger>
                              <CollapsibleContent className='space-y-2 text-sm'>
                                <div className='grid grid-cols-2 gap-2'>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Open for Partnership:{' '}
                                    </span>
                                    <span>
                                      {org.openForPartnership ? 'Yes' : 'No'}
                                    </span>
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      In-House Partnership:{' '}
                                    </span>
                                    <span>
                                      {org.isInHousePartnership ? 'Yes' : 'No'}
                                    </span>
                                  </div>
                                  {org.partnershipTeamSize !== null && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Partnership Team Size:{' '}
                                      </span>
                                      <span>{org.partnershipTeamSize}</span>
                                    </div>
                                  )}
                                  {org.partnershipRestrictions && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Partnership Restrictions:{' '}
                                      </span>
                                      <span>{org.partnershipRestrictions}</span>
                                    </div>
                                  )}
                                  {org.activePartnerships !== null && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Active Partnerships:{' '}
                                      </span>
                                      <span>{org.activePartnerships}</span>
                                    </div>
                                  )}
                                  {org.pipelinePartnerships !== null && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Pipeline Partnerships:{' '}
                                      </span>
                                      <span>{org.pipelinePartnerships}</span>
                                    </div>
                                  )}
                                  {org.meetingSuccessRate !== null && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Meeting Success Rate:{' '}
                                      </span>
                                      <span>{org.meetingSuccessRate}%</span>
                                    </div>
                                  )}
                                  {org.acknowledgmentTime !== null && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Acknowledgment Time:{' '}
                                      </span>
                                      <span>{org.acknowledgmentTime}</span>
                                    </div>
                                  )}
                                </div>
                                {org.preferredPartnershipTypes &&
                                  org.preferredPartnershipTypes.length > 0 && (
                                    <div className='mt-2'>
                                      <span className='font-medium text-muted-foreground'>
                                        Preferred Partnership Types:{' '}
                                      </span>
                                      <div className='mt-1 flex flex-wrap gap-1'>
                                        {org.preferredPartnershipTypes.map(
                                          (pt: any, idx: number) => (
                                            <Badge
                                              key={idx}
                                              variant='outline'
                                              className='text-xs'
                                            >
                                              {pt.area}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                {org.preferredSectors &&
                                  org.preferredSectors.length > 0 && (
                                    <div className='mt-2'>
                                      <span className='font-medium text-muted-foreground'>
                                        Preferred Sectors:{' '}
                                      </span>
                                      <div className='mt-1 flex flex-wrap gap-1'>
                                        {org.preferredSectors.map(
                                          (ps: any, idx: number) => (
                                            <Badge
                                              key={idx}
                                              variant='outline'
                                              className='text-xs'
                                            >
                                              {ps.area}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                {org.preferredSubSectors &&
                                  org.preferredSubSectors.length > 0 && (
                                    <div className='mt-2'>
                                      <span className='font-medium text-muted-foreground'>
                                        Preferred Sub-Sectors:{' '}
                                      </span>
                                      <div className='mt-1 flex flex-wrap gap-1'>
                                        {org.preferredSubSectors.map(
                                          (pss: any, idx: number) => (
                                            <Badge
                                              key={idx}
                                              variant='outline'
                                              className='text-xs'
                                            >
                                              {pss.area}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </CollapsibleContent>
                            </Collapsible>

                            <Separator />

                            {/* Verification & Status */}
                            <Collapsible
                              open={expandedSections.verification}
                              onOpenChange={() =>
                                toggleSection(org.id, 'verification')
                              }
                            >
                              <CollapsibleTrigger className='mb-2 flex w-full items-center justify-between text-sm font-semibold'>
                                <span>Verification & Status</span>
                                {expandedSections.verification ? (
                                  <ChevronUp className='h-4 w-4' />
                                ) : (
                                  <ChevronDown className='h-4 w-4' />
                                )}
                              </CollapsibleTrigger>
                              <CollapsibleContent className='space-y-2 text-sm'>
                                <div className='grid grid-cols-2 gap-2'>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Verified:{' '}
                                    </span>
                                    <span>{org.verified ? 'Yes' : 'No'}</span>
                                  </div>
                                  {org.verifiedBy && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Verified By:{' '}
                                      </span>
                                      <span>{org.verifiedBy}</span>
                                    </div>
                                  )}
                                  {org.verifiedOn && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Verified On:{' '}
                                      </span>
                                      <span>
                                        {new Date(
                                          org.verifiedOn
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                  {org.verificationApplicationStatus && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Verification Status:{' '}
                                      </span>
                                      <span>
                                        {org.verificationApplicationStatus}
                                      </span>
                                    </div>
                                  )}
                                  {org.verificationResponse && (
                                    <div className='col-span-2'>
                                      <span className='font-medium text-muted-foreground'>
                                        Verification Response:{' '}
                                      </span>
                                      <span>{org.verificationResponse}</span>
                                    </div>
                                  )}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>

                            <Separator />

                            {/* Credits */}
                            {org.credits && (
                              <>
                                <Collapsible
                                  open={expandedSections.credits}
                                  onOpenChange={() =>
                                    toggleSection(org.id, 'credits')
                                  }
                                >
                                  <CollapsibleTrigger className='mb-2 flex w-full items-center justify-between text-sm font-semibold'>
                                    <span>Credits</span>
                                    {expandedSections.credits ? (
                                      <ChevronUp className='h-4 w-4' />
                                    ) : (
                                      <ChevronDown className='h-4 w-4' />
                                    )}
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className='space-y-2 text-sm'>
                                    <div className='grid grid-cols-2 gap-2'>
                                      <div>
                                        <span className='font-medium text-muted-foreground'>
                                          Playground:{' '}
                                        </span>
                                        <span>
                                          {org.credits.playgroundLeft}/
                                          {org.credits.playgroundAllocated}
                                        </span>
                                      </div>
                                      <div>
                                        <span className='font-medium text-muted-foreground'>
                                          AI Proposal:{' '}
                                        </span>
                                        <span>
                                          {org.credits.aiProposalLeft}/
                                          {org.credits.aiProposalAllocated}
                                        </span>
                                      </div>
                                      <div>
                                        <span className='font-medium text-muted-foreground'>
                                          Collaborations:{' '}
                                        </span>
                                        <span>
                                          {org.credits.collaborationsLeft}/
                                          {org.credits.collaborationsAllocated}
                                        </span>
                                      </div>
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                                <Separator />
                              </>
                            )}

                            {/* Schedules */}
                            {org.schedules && org.schedules.length > 0 && (
                              <>
                                <Collapsible
                                  open={expandedSections.schedules}
                                  onOpenChange={() =>
                                    toggleSection(org.id, 'schedules')
                                  }
                                >
                                  <CollapsibleTrigger className='mb-2 flex w-full items-center justify-between text-sm font-semibold'>
                                    <span>
                                      Schedules ({org.schedules.length})
                                    </span>
                                    {expandedSections.schedules ? (
                                      <ChevronUp className='h-4 w-4' />
                                    ) : (
                                      <ChevronDown className='h-4 w-4' />
                                    )}
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className='space-y-2 text-sm'>
                                    {org.schedules.map(
                                      (schedule: any, idx: number) => (
                                        <div
                                          key={idx}
                                          className='space-y-1 rounded border p-2'
                                        >
                                          <div>
                                            <span className='font-medium'>
                                              Title:{' '}
                                            </span>
                                            {schedule.title || 'N/A'}
                                          </div>
                                          <div>
                                            <span className='font-medium'>
                                              Time:{' '}
                                            </span>
                                            {new Date(
                                              schedule.time
                                            ).toLocaleString()}
                                          </div>
                                          <div>
                                            <span className='font-medium'>
                                              Status:{' '}
                                            </span>
                                            {schedule.status || 'N/A'}
                                          </div>
                                          {schedule.description && (
                                            <div>
                                              <span className='font-medium'>
                                                Description:{' '}
                                              </span>
                                              {schedule.description}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </CollapsibleContent>
                                </Collapsible>
                                <Separator />
                              </>
                            )}

                            {/* Boolean Flags */}
                            <Collapsible
                              open={expandedSections.flags}
                              onOpenChange={() =>
                                toggleSection(org.id, 'flags')
                              }
                            >
                              <CollapsibleTrigger className='mb-2 flex w-full items-center justify-between text-sm font-semibold'>
                                <span>Flags & Settings</span>
                                {expandedSections.flags ? (
                                  <ChevronUp className='h-4 w-4' />
                                ) : (
                                  <ChevronDown className='h-4 w-4' />
                                )}
                              </CollapsibleTrigger>
                              <CollapsibleContent className='space-y-2 text-sm'>
                                <div className='grid grid-cols-3 gap-2'>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Subscribed:{' '}
                                    </span>
                                    {org.subscribed ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Email Unsubscribed:{' '}
                                    </span>
                                    {org.emailUnsubscribed ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      External Partner Imported:{' '}
                                    </span>
                                    {org.externalPartnerImported ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Email Outreach Consent:{' '}
                                    </span>
                                    {org.emailOutreachConsentGranted
                                      ? 'Yes'
                                      : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Deal Created/Assigned:{' '}
                                    </span>
                                    {org.dealCreatedOrAssigned ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Any Integration Added:{' '}
                                    </span>
                                    {org.anyIntegrationAdded ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Free Deal Plan:{' '}
                                    </span>
                                    {org.freeDealPlan ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Free Partner Mapping Plan:{' '}
                                    </span>
                                    {org.freePartnerMappingPlan ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Free Partner Mapping Plan Claimed:{' '}
                                    </span>
                                    {org.freePartnerMappingPlanClaimedUserName
                                      ? 'Yes'
                                      : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Referral Program:{' '}
                                    </span>
                                    {org.referralProgram ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Brand Resources:{' '}
                                    </span>
                                    {org.brandResources ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Open Pilot Program:{' '}
                                    </span>
                                    {org.openPilotProgram ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Sub Sector:{' '}
                                    </span>
                                    {org.subSector ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Company 6 Month Operation:{' '}
                                    </span>
                                    {org.companySixMonthOperation
                                      ? 'Yes'
                                      : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Company Fund Raising:{' '}
                                    </span>
                                    {org.companyFundRaising ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Selected for External Partnerships:{' '}
                                    </span>
                                    {org.selectedForExternalPartnerships
                                      ? 'Yes'
                                      : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Shortlisted:{' '}
                                    </span>
                                    {org.shortlisted ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Unverified Deal:{' '}
                                    </span>
                                    {org.unverifiedDeal ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Is Claimed:{' '}
                                    </span>
                                    {org.isClaimed ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Filters Added:{' '}
                                    </span>
                                    {org.filtersAdded ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Is Applied:{' '}
                                    </span>
                                    {org.isApplied ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Internal Form Active:{' '}
                                    </span>
                                    {org.internalFormActive ? 'Yes' : 'No'}
                                  </div>
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Google Form Active:{' '}
                                    </span>
                                    {org.googleFormActive ? 'Yes' : 'No'}
                                  </div>
                                </div>
                                {org.sendProposalCount !== null &&
                                  org.sendProposalCount !== undefined && (
                                    <div className='mt-2'>
                                      <span className='font-medium text-muted-foreground'>
                                        Send Proposal Count:{' '}
                                      </span>
                                      <span>{org.sendProposalCount}</span>
                                    </div>
                                  )}
                                {org.isFreePlanClaimedUserName && (
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Free Plan Claimed User Name:{' '}
                                    </span>
                                    <span>{org.isFreePlanClaimedUserName}</span>
                                  </div>
                                )}
                                {org.referralCode && (
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Referral Code:{' '}
                                    </span>
                                    <span>{org.referralCode}</span>
                                  </div>
                                )}
                                {org.planCode && (
                                  <div>
                                    <span className='font-medium text-muted-foreground'>
                                      Plan Code:{' '}
                                    </span>
                                    <span>{org.planCode}</span>
                                  </div>
                                )}
                              </CollapsibleContent>
                            </Collapsible>

                            <Separator />

                            {/* Metadata */}
                            <Collapsible
                              open={expandedSections.metadata}
                              onOpenChange={() =>
                                toggleSection(org.id, 'metadata')
                              }
                            >
                              <CollapsibleTrigger className='mb-2 flex w-full items-center justify-between text-sm font-semibold'>
                                <span>Metadata</span>
                                {expandedSections.metadata ? (
                                  <ChevronUp className='h-4 w-4' />
                                ) : (
                                  <ChevronDown className='h-4 w-4' />
                                )}
                              </CollapsibleTrigger>
                              <CollapsibleContent className='space-y-2 text-sm'>
                                <div className='grid grid-cols-2 gap-2'>
                                  {org.creationTimestamp && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Created:{' '}
                                      </span>
                                      <span>
                                        {new Date(
                                          org.creationTimestamp
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                  )}
                                  {org.lastUpdatedTimestamp && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Last Updated:{' '}
                                      </span>
                                      <span>
                                        {new Date(
                                          org.lastUpdatedTimestamp
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                  )}
                                  {org.lastActivityAtTimestamp && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Last Activity:{' '}
                                      </span>
                                      <span>
                                        {new Date(
                                          org.lastActivityAtTimestamp
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                  )}
                                  {org.source && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Source:{' '}
                                      </span>
                                      <span>{org.source}</span>
                                    </div>
                                  )}
                                  {org.signUpSource && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Sign Up Source:{' '}
                                      </span>
                                      <span>{org.signUpSource}</span>
                                    </div>
                                  )}
                                  {org.onboardedPartners && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Onboarded Partners:{' '}
                                      </span>
                                      <span>{org.onboardedPartners}</span>
                                    </div>
                                  )}
                                  {org.poc && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        POC:{' '}
                                      </span>
                                      <span>{org.poc}</span>
                                    </div>
                                  )}
                                  {org.documentPath && (
                                    <div>
                                      <span className='font-medium text-muted-foreground'>
                                        Document Path:{' '}
                                      </span>
                                      <span className='break-all text-xs'>
                                        {org.documentPath}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {org.signatories &&
                                  org.signatories.length > 0 && (
                                    <div className='mt-2'>
                                      <span className='font-medium text-muted-foreground'>
                                        Signatories:{' '}
                                      </span>
                                      <div className='mt-1 space-y-1'>
                                        {org.signatories.map(
                                          (sig: any, idx: number) => (
                                            <div
                                              key={idx}
                                              className='border-l-2 pl-2 text-xs'
                                            >
                                              {sig.name} ({sig.signatory}) -
                                              DIN/PAN:{' '}
                                              {sig.dinOrPanNumber || 'N/A'}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </CollapsibleContent>
                            </Collapsible>

                            <Separator />

                            {/* All Fields - Dynamic mapping of all API keys */}
                            {getAllFields(org).length > 0 && (
                              <React.Fragment>
                                <Collapsible
                                  open={expandedSections.allFields}
                                  onOpenChange={() =>
                                    toggleSection(org.id, 'allFields')
                                  }
                                >
                                  <CollapsibleTrigger className='mb-2 flex w-full items-center justify-between text-sm font-semibold'>
                                    <span>
                                      All Fields ({getAllFields(org).length})
                                    </span>
                                    {expandedSections.allFields ? (
                                      <ChevronUp className='h-4 w-4' />
                                    ) : (
                                      <ChevronDown className='h-4 w-4' />
                                    )}
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className='space-y-2 text-sm'>
                                    <div className='grid grid-cols-1 gap-2'>
                                      {getAllFields(org).map((field) => (
                                        <div
                                          key={field.key}
                                          className='rounded border p-2'
                                        >
                                          <div className='mb-1 font-medium text-muted-foreground'>
                                            {formatFieldName(field.key)}:
                                          </div>
                                          <div className='pl-2'>
                                            {Array.isArray(field.value) ? (
                                              <div className='space-y-1'>
                                                {field.value.map(
                                                  (item: any, idx: number) => (
                                                    <div
                                                      key={idx}
                                                      className='border-l-2 pl-2 text-xs'
                                                    >
                                                      {typeof item ===
                                                      'object' ? (
                                                        <pre className='overflow-x-auto text-xs'>
                                                          {JSON.stringify(
                                                            item,
                                                            null,
                                                            2
                                                          )}
                                                        </pre>
                                                      ) : (
                                                        formatValue(item)
                                                      )}
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            ) : typeof field.value ===
                                                'object' &&
                                              field.value !== null ? (
                                              <pre className='overflow-x-auto rounded bg-muted p-2 text-xs'>
                                                {JSON.stringify(
                                                  field.value,
                                                  null,
                                                  2
                                                )}
                                              </pre>
                                            ) : (
                                              <span className='break-words'>
                                                {formatValue(field.value)}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                                <Separator />
                              </React.Fragment>
                            )}

                            {/* Raw JSON - Complete API response */}
                            <Collapsible
                              open={expandedSections.rawJson}
                              onOpenChange={() =>
                                toggleSection(org.id, 'rawJson')
                              }
                            >
                              <CollapsibleTrigger className='mb-2 flex w-full items-center justify-between text-sm font-semibold'>
                                <span>Raw JSON (Complete API Response)</span>
                                {expandedSections.rawJson ? (
                                  <ChevronUp className='h-4 w-4' />
                                ) : (
                                  <ChevronDown className='h-4 w-4' />
                                )}
                              </CollapsibleTrigger>
                              <CollapsibleContent className='space-y-2 text-sm'>
                                <div className='rounded border bg-muted/50 p-2'>
                                  <pre className='max-h-96 overflow-x-auto overflow-y-auto text-xs'>
                                    {JSON.stringify(org, null, 2)}
                                  </pre>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <Card>
                    <CardContent className='flex h-64 flex-col items-center justify-center'>
                      <p className='mb-2 text-lg font-medium'>
                        No organizations found
                      </p>
                      <p className='text-center text-sm text-muted-foreground'>
                        {organizations.length > 0
                          ? 'Try adjusting your filters to see more results'
                          : 'Start by searching for an organization'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Pagination Controls */}
            {!isLoading && pagination && pagination.totalPages > 1 && (
              <div className='mt-8 flex items-center justify-center gap-4'>
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={pagination.first || isLoading}
                  variant='outline'
                >
                  Previous
                </Button>
                <span className='text-sm text-muted-foreground'>
                  Page {currentPage + 1} of {pagination.totalPages}
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={pagination.last || isLoading}
                  variant='outline'
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSearch
