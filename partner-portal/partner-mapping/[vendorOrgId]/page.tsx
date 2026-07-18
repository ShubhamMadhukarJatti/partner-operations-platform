'use client'

import React, { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  useOverlapMyRecordsByUserId,
  useReportHistoryByUserId
} from '@/http-hooks/partner-mapping'
import { useGetPersona, useGetPersonaPreview } from '@/http-hooks/partner-match'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ChevronDown, LogOut } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { stopTokenRefreshOnLogout } from '@/lib/auth/token-refresh'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { showCustomToast } from '@/components/custom-toast'
import { FullLogo } from '@/components/icons/logo'
import AccountMappingEmptyState from '@/app/partner-portal/_components/AccountMappingEmptyState'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const formSchema = z.object({
  name: z.string().min(1, 'Enter name for your import')
})

const sharkdomPropertyLabels: Record<string, string> = {
  domain: 'Website',
  name: 'Name',
  companyName: 'Company Name',
  contactEmail: 'Email Address',
  dealStage: 'Deal Stage',
  creationDate: 'Creation Date',
  closeDate: 'Close Date',
  subscribed: 'Subscribed',
  ticketSize: 'Ticket Size'
}

const frequencies = ['1 Week', '15 days', '30 days', '90 days']

const frequencyMapping: Record<
  string,
  'WEEKLY' | 'FIFTEEN_DAYS' | 'THIRTY_DAYS' | 'NINETY_DAYS'
> = {
  '1 Week': 'WEEKLY',
  '15 days': 'FIFTEEN_DAYS',
  '30 days': 'THIRTY_DAYS',
  '90 days': 'NINETY_DAYS'
}

function transformCsvData(
  csvData: any[] | null | undefined,
  csvHeaders: string[],
  selectedMapping: Record<string, string>
): Record<string, string>[] {
  if (!csvData || !Array.isArray(csvData) || csvData.length === 0) return []
  const headers = Array.isArray(csvData[0])
    ? (csvData[0] as string[])
    : csvHeaders?.length
      ? csvHeaders
      : Object.keys(csvData[0]?.properties || csvData[0] || {})
  const dataRows = csvData.slice(1)
  const columnIndices: Record<string, number> = {}
  Object.entries(selectedMapping).forEach(([sharkdomProperty, fileColumn]) => {
    if (fileColumn && fileColumn !== 'dont_import') {
      const index = headers.indexOf(fileColumn)
      if (index !== -1) columnIndices[sharkdomProperty] = index
    }
  })
  return dataRows.map((row) => {
    const obj: Record<string, string> = {}
    Object.entries(columnIndices).forEach(([sharkdomProperty, index]) => {
      const fileColumn = selectedMapping[sharkdomProperty]
      let value: any
      if (Array.isArray(row)) value = row[index] ?? ''
      else value = row?.[fileColumn] ?? row?.properties?.[fileColumn] ?? ''
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        sharkdomProperty === 'contactEmail'
      ) {
        const primary = value.find((e: any) => e.primary) || value[0]
        value = primary?.value ?? ''
      }
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        sharkdomProperty === 'companyName'
      ) {
        value = (value as any).name ?? ''
      }
      obj[sharkdomProperty] = value != null ? String(value) : ''
    })
    return obj
  })
}

function getSimpleCount(
  dataSource: string,
  fileColumn: string,
  csvHeaders: string[],
  csvData: any[] | undefined
): string | number {
  if (!fileColumn || fileColumn === 'dont_import') return '0'
  if (!csvData || !Array.isArray(csvData) || csvData.length === 0) return '0'
  const headers = Array.isArray(csvData[0]) ? csvData[0] : csvHeaders
  const columnIndex = headers.indexOf(fileColumn)
  if (columnIndex === -1) return '0'
  const dataRows = csvData.slice(1)
  const values = dataRows
    .map((row: any) =>
      Array.isArray(row) ? row[columnIndex] : row?.[fileColumn]
    )
    .filter((v: any) => v != null && String(v).trim() !== '')
  return values.length
}

export default function PartnerPortalPartnerMappingWithOrgPage() {
  const router = useRouter()
  const params = useParams()
  const vendorOrgId = params?.vendorOrgId as string | undefined
  const PARTNER_MAPPING_BASE = vendorOrgId
    ? `/partner-portal/partner-mapping/${vendorOrgId}`
    : ''

  const [showDataPreview, setShowDataPreview] = useState(false)
  const [fieldMappingData, setFieldMappingData] = useState<any>(null)
  const [frequency, setFrequency] = useState('1 Week')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successDataSource, setSuccessDataSource] = useState<string>('')
  const [activeSubTab, setActiveSubTab] = useState('overview')
  const [userId, setUserId] = useState<string | null>(null)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [currentOrg, setCurrentOrg] = useState<{
    id: number
    name: string
    code?: string
  } | null>(null)
  const [currentOrgLoaded, setCurrentOrgLoaded] = useState(false)
  const [userData, setUserData] = useState<{
    name: string | null
    email: string | null
  } | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  const [accountPopoverOpen, setAccountPopoverOpen] = useState(false)

  const queryClient = useQueryClient()

  const handleLogout = useCallback(async () => {
    setAccountPopoverOpen(false)
    stopTokenRefreshOnLogout()
    queryClient.clear()
    await fetch('/api/logout', { method: 'GET' })
    localStorage.removeItem('dialogShown')
    localStorage.removeItem('FormShown')
    localStorage.removeItem('email')
    window.location.href = '/partner-portal/login'
  }, [queryClient])

  useEffect(() => {
    async function fetchUserData() {
      try {
        setUserLoading(true)
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            try {
              const userProfileResponse = await fetch(
                `/api/user/${data.user.uid}`,
                {
                  method: 'GET',
                  headers: { 'Content-Type': 'application/json' }
                }
              )
              if (userProfileResponse.ok) {
                const userProfile = await userProfileResponse.json()
                setUserData({
                  name:
                    userProfile.name ||
                    userProfile.username ||
                    data.user.displayName ||
                    null,
                  email: userProfile.email || data.user.email || null
                })
              } else {
                setUserData({
                  name: data.user.displayName || null,
                  email: data.user.email || null
                })
              }
            } catch {
              setUserData({
                name: data.user.displayName || null,
                email: data.user.email || null
              })
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err)
      } finally {
        setUserLoading(false)
      }
    }
    fetchUserData()
  }, [])

  const { isLoading: personaLoading } = useGetPersona()
  const { isLoading: previewLoading } = useGetPersonaPreview()
  const { data: overlapData, isFetched: overlapFetched } =
    useOverlapMyRecordsByUserId(userId)
  const { data: reportHistoryData } = useReportHistoryByUserId(userId)

  const overlapRecordsArray = Array.isArray(overlapData) ? overlapData : []
  const hasOverlapRecords = overlapRecordsArray.length > 0

  useEffect(() => {
    if (!vendorOrgId) {
      router.replace('/partner-portal/login')
      return
    }
    setOrgId(vendorOrgId)
  }, [vendorOrgId, router])

  useEffect(() => {
    let cancelled = false
    const loadUserId = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        const data = await res.json().catch(() => ({}))
        const uid = data?.user?.uid
        if (!cancelled && uid) setUserId(uid)
      } catch {
        if (!cancelled) setUserId(null)
      }
    }
    loadUserId()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!vendorOrgId) return
    let cancelled = false
    setCurrentOrgLoaded(false)
    fetch(`/api/organization/id?id=${encodeURIComponent(vendorOrgId)}`, {
      credentials: 'include'
    })
      .then((res) => {
        if (cancelled) return res
        if (!res.ok) {
          if (!cancelled) setCurrentOrgLoaded(true)
          return null
        }
        return res.json()
      })
      .then((org) => {
        if (cancelled) return
        setCurrentOrgLoaded(true)
        if (org) {
          setCurrentOrg({
            id: org.id,
            name: org.name ?? '',
            code: org.code
          })
        } else setCurrentOrg(null)
      })
      .catch(() => {
        if (!cancelled) {
          setCurrentOrgLoaded(true)
          setCurrentOrg(null)
        }
      })
    return () => {
      cancelled = true
    }
  }, [vendorOrgId])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: 'Partner Mapping Import' }
  })

  useEffect(() => {
    const storedData = sessionStorage.getItem('fieldMappingData')
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setFieldMappingData(parsedData)
        setShowDataPreview(true)
        form.setValue(
          'name',
          `${parsedData.dataSource}-${new Date().toISOString().split('T')[0]}`
        )
      } catch {
        sessionStorage.removeItem('fieldMappingData')
      }
    }
  }, [form])

  const handleBackToPartnerMapping = () => {
    sessionStorage.removeItem('fieldMappingData')
    sessionStorage.removeItem('csvData')
    sessionStorage.removeItem('csvFileName')
    sessionStorage.removeItem('returnToPartnerPortal')
    setShowDataPreview(false)
    setFieldMappingData(null)
    if (PARTNER_MAPPING_BASE) router.push(PARTNER_MAPPING_BASE)
  }

  const handleConfirmImport = async (data: z.infer<typeof formSchema>) => {
    if (!fieldMappingData) {
      showCustomToast('Error', 'No field mapping data found', 'error', 5000)
      return
    }
    if (!(data.name && data.name.trim())) {
      showCustomToast(
        'Error',
        'Enter a valid name for your import',
        'error',
        5000
      )
      return
    }
    setIsSubmitting(true)
    try {
      const meRes = await fetch('/api/auth/me', { credentials: 'include' })
      const meData = await meRes.json().catch(() => ({}))
      const uid = meData?.user?.uid
      if (!uid) {
        showCustomToast('Error', 'User session not found', 'error', 5000)
        setIsSubmitting(false)
        return
      }
      const {
        selectedMapping,
        csvHeaders = [],
        dataSource,
        csvData,
        sheetUrl
      } = fieldMappingData
      const filteredFieldToColumnMapping = Object.entries(
        selectedMapping || {}
      ).reduce(
        (acc, [key, value]) => {
          if (
            typeof value === 'string' &&
            value !== '' &&
            value !== 'dont_import'
          )
            acc[key] = value
          return acc
        },
        {} as Record<string, string>
      )
      const fields = transformCsvData(
        csvData,
        csvHeaders,
        filteredFieldToColumnMapping
      )
      const mappedFrequency = frequencyMapping[frequency] || ('WEEKLY' as const)
      const effectiveOrgId =
        vendorOrgId ??
        orgId ??
        (currentOrg?.id != null ? String(currentOrg.id) : null)
      const payload = {
        userId: uid,
        organizationId: effectiveOrgId,
        frequency: mappedFrequency,
        personaName: data.name.trim(),
        source: [
          'CSV',
          'HUBSPOT',
          'GOOGLE_SHEET',
          'ZOHO',
          'PIPEDRIVE',
          'SALESFORCE'
        ].includes(dataSource)
          ? dataSource
          : 'CSV',
        recordType: 'CUSTOMER' as const,
        fields,
        fieldToColumnMapping: filteredFieldToColumnMapping,
        ...(dataSource === 'GOOGLE_SHEET' && sheetUrl
          ? { googleSheetLink: sheetUrl }
          : {})
      }
      const res = await fetch('/api/no/auth/save/overlap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      const resData = await res.json().catch(() => ({}))
      if (!res.ok) {
        showCustomToast(
          'Error',
          resData?.message ?? 'Failed to save overlap',
          'error',
          5000
        )
        setIsSubmitting(false)
        return
      }
      setSuccessDataSource(fieldMappingData.dataSource || '')
      sessionStorage.removeItem('fieldMappingData')
      sessionStorage.removeItem('csvData')
      sessionStorage.removeItem('csvFileName')
      sessionStorage.removeItem('recordType')
      sessionStorage.removeItem('returnToPartnerPortal')
      setShowSuccess(true)
      setShowDataPreview(false)
      setFieldMappingData(null)
      showCustomToast(
        'Success',
        'Mapping confirmed. Data has been saved for partner mapping.',
        'success',
        5000
      )
      setTimeout(() => {
        if (PARTNER_MAPPING_BASE) window.location.href = PARTNER_MAPPING_BASE
      }, 3000)
    } catch (error) {
      console.error('Error confirming import:', error)
      showCustomToast(
        'Error',
        'Failed to confirm partner mapping',
        'error',
        5000
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    const successMessage =
      successDataSource === 'CSV'
        ? 'CSV successfully uploaded'
        : successDataSource
          ? `${successDataSource} mapping confirmed`
          : 'Partner mapping confirmed'
    return (
      <div className='flex h-[calc(100vh-50px)] flex-col'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='text-center'>
            <div className='mx-auto h-64 w-64'>
              <Lottie
                animationData={require('@/lib/lottie-json/verified.json')}
                loop={true}
              />
            </div>
            <div className='mt-6'>
              <h1 className='text-xl font-semibold text-gray-700'>
                {successMessage}
              </h1>
              <p className='mt-2 text-sm text-gray-500'>
                Redirecting to Partner Mapping...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showDataPreview && fieldMappingData) {
    const { selectedMapping, csvHeaders, dataSource, csvData } =
      fieldMappingData
    return (
      <div className='flex h-[calc(100vh-50px)] flex-col'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-9/12 max-w-4xl'>
            <Button
              variant='ghost'
              onClick={handleBackToPartnerMapping}
              className='mb-6 flex items-center gap-2 px-0 text-sm font-semibold text-[#3E50F7]'
            >
              <ArrowLeft size={16} />
              Back to Partner Mapping
            </Button>
            <div className='mb-6'>
              <h1 className='text-xl font-semibold text-gray-700'>
                Marketing data preview
              </h1>
              <p className='text-sm text-gray-500'>
                Details from the connected source (no persona will be created)
              </p>
            </div>
            <hr className='mb-6 border-gray-200' />
            <div className='mb-6 grid grid-cols-3 gap-0 rounded-lg border border-gray-200 bg-gray-50'>
              {Object.entries(selectedMapping).map(
                ([sharkdomProperty, fileColumn], index) => (
                  <div
                    key={sharkdomProperty}
                    className={`flex flex-col gap-1 p-4 ${index % 3 !== 2 ? 'border-r' : ''} ${index < 3 ? 'border-b' : ''} border-gray-200`}
                  >
                    <span className='text-xl font-bold leading-6 text-gray-900'>
                      {getSimpleCount(
                        dataSource,
                        fileColumn as string,
                        csvHeaders || [],
                        csvData
                      )}
                    </span>
                    <span className='text-sm leading-4 text-gray-600'>
                      {sharkdomPropertyLabels[sharkdomProperty] ||
                        sharkdomProperty}
                    </span>
                  </div>
                )
              )}
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleConfirmImport)}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <label className='mb-2 block text-sm font-medium text-gray-700'>
                        Name your import
                      </label>
                      <FormControl>
                        <Input
                          placeholder='Partner Mapping - Aug 20XX'
                          className='h-12 w-full'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />
                {dataSource !== 'CSV' && (
                  <div className='rounded-lg bg-gray-100 p-4'>
                    <div className='space-y-4'>
                      <h3 className='text-sm font-medium text-gray-900'>
                        How frequently do you want your data to be refreshed?
                      </h3>
                      <ToggleGroup
                        type='single'
                        value={frequency}
                        onValueChange={(v) => v && setFrequency(v)}
                        className='grid grid-cols-4 gap-2 bg-white'
                      >
                        {frequencies.map((option) => (
                          <ToggleGroupItem
                            key={option}
                            value={option}
                            className='h-10 rounded-md data-[state=on]:border data-[state=on]:border-gray-300 data-[state=on]:bg-white data-[state=on]:shadow-sm'
                          >
                            {option}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>
                  </div>
                )}
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-[218px] rounded-md bg-[#3E50F7] py-2 text-base font-bold text-white transition-colors hover:bg-[#2d3bb3] disabled:opacity-50'
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm & Import'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    )
  }

  const navTabs = [
    { name: 'Overview', value: 'overview' },
    { name: 'Matrix Comparison', value: 'matrix' },
    { name: 'Reports History', value: 'history' }
  ]

  if (personaLoading || previewLoading || !vendorOrgId) {
    return (
      <div className='flex h-[50vh] items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='border-b border-gray-200 bg-white shadow-sm'>
        <div className='w-full px-0 py-3'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
            {/* Logo - left aligned */}
            <div className='flex min-w-0 flex-shrink-0 items-center justify-start gap-2'>
              <FullLogo className='h-8 w-40 flex-shrink-0 sm:h-9' />
              <span className='hidden truncate text-base font-medium text-gray-600 sm:inline sm:text-lg'>
                Deals Portal
              </span>
            </div>
            {/* Encrypted link banner - centered on desktop */}
            <div className='order-3 min-w-0 flex-1 sm:order-2 sm:flex sm:justify-center sm:px-4'>
              <div className='flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 sm:gap-2.5 sm:px-4 sm:py-2.5'>
                <div className='flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-green-500 sm:h-5 sm:w-5'>
                  <svg
                    className='h-2.5 w-2.5 text-white sm:h-3 sm:w-3'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <span className='truncate text-xs font-medium text-green-800 sm:text-sm'>
                  <span className='hidden sm:inline'>
                    This is an encrypted link, visible only to verified
                    recipients
                  </span>
                  <span className='sm:hidden'>Encrypted link</span>
                </span>
              </div>
            </div>
            {/* User account - right aligned */}
            <div className='order-2 ml-auto flex flex-shrink-0 items-center sm:order-3'>
              <Popover
                open={accountPopoverOpen}
                onOpenChange={setAccountPopoverOpen}
              >
                <PopoverTrigger asChild className='cursor-pointer'>
                  <div className='flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-gray-100 sm:gap-2 sm:px-3 sm:py-2'>
                    <div className='flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white sm:h-8 sm:w-8 sm:text-sm'>
                      {userLoading ? (
                        <Skeleton className='h-full w-full rounded-full' />
                      ) : (
                        (userData?.name || userData?.email || 'U')
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </div>
                    <div className='flex hidden flex-col sm:flex'>
                      {userLoading ? (
                        <>
                          <Skeleton className='mb-1 h-4 w-20' />
                          <Skeleton className='h-3 w-32' />
                        </>
                      ) : (
                        <>
                          <span className='text-sm font-medium text-gray-900'>
                            {userData?.name || 'User'}
                          </span>
                          <span className='text-xs text-gray-500'>
                            {userData?.email || 'user@example.com'}
                          </span>
                        </>
                      )}
                    </div>
                    <ChevronDown className='h-3 w-3 text-gray-500 sm:h-4 sm:w-4' />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  align='end'
                  sideOffset={2}
                  className='w-[294px] rounded-xl border border-border p-0 shadow-lg'
                >
                  <div className='px-4 py-3'>
                    <p className='text-base font-semibold text-text-100'>
                      My Account
                    </p>
                  </div>
                  <div className='h-px bg-border' />
                  <div
                    onClick={handleLogout}
                    className='cursor-pointer rounded-b-xl px-4 py-3 text-sm font-medium hover:bg-muted'
                  >
                    <div className='flex items-center gap-2'>
                      <LogOut
                        className='h-5 w-5 text-text-100'
                        strokeWidth={2.5}
                      />
                      <span>Log out</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </header>
      <div className='mx-auto max-w-6xl space-y-4 p-4'>
        <Link
          href={`/partner-portal/dashboard/${vendorOrgId}`}
          className='inline-flex items-center gap-2 text-sm font-medium text-[#3E50F7] hover:underline'
        >
          <ArrowLeft size={16} />
          Back to Partner Portal
        </Link>
        <p className='text-sm text-gray-500'>
          Submit and measure deals at one place
        </p>
        <div className='w-full'>
          <Tabs
            value={activeSubTab}
            onValueChange={setActiveSubTab}
            className='w-full'
          >
            <TabsList className='flex w-full justify-start rounded-none border-b border-gray-200 bg-white'>
              {navTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className='rounded-lg px-4 text-sm font-semibold text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-[#3E50F7] data-[state=active]:text-[#3E50F7]'
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className='w-full pt-4'>
              <TabsContent value='overview' className='mt-0'>
                <div className='rounded-xl border border-gray-200 bg-white p-6'>
                  {!currentOrgLoaded ? (
                    <p className='text-sm text-gray-500'>
                      Loading organization details...
                    </p>
                  ) : userId && overlapFetched && !hasOverlapRecords ? (
                    <AccountMappingEmptyState
                      onCreateDataSource={() =>
                        router.push(`${PARTNER_MAPPING_BASE}/connect-crm`)
                      }
                    />
                  ) : currentOrg ? (
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                      <div>
                        <h3 className='text-sm font-medium text-gray-500'>
                          Organization details
                        </h3>
                        <p className='mt-1 text-base font-semibold text-gray-900'>
                          {currentOrg.name}
                        </p>
                        <p className='mt-0.5 text-sm text-gray-500'>
                          {/* ID: {currentOrg.id} */}
                          {/* {currentOrg.code ? ` · ${currentOrg.code}` : ''} */}
                        </p>
                      </div>
                      <Button
                        variant='default'
                        className='shrink-0 bg-[#3E50F7] hover:bg-[#2d3bb3]'
                        onClick={() =>
                          router.push(`${PARTNER_MAPPING_BASE}/compare`)
                        }
                      >
                        Compare
                      </Button>
                    </div>
                  ) : (
                    <p className='text-sm text-gray-500'>
                      Organization not found. Please use a valid partner link
                      with organization ID.
                    </p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value='matrix' className='mt-0'>
                <div className='rounded-xl border border-gray-200 bg-white p-6'>
                  <p className='text-sm text-gray-500'>
                    Matrix comparison will be available after connecting your
                    data source.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value='history' className='mt-0'>
                <div className='rounded-xl border border-gray-200 bg-white p-6'>
                  <p className='mb-4 text-sm font-medium text-gray-700'>
                    Reports history
                  </p>
                  {reportHistoryData?.data?.length ? (
                    <ul className='space-y-2'>
                      {reportHistoryData.data.map((item: any) => (
                        <li
                          key={item.id}
                          className='flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm'
                        >
                          <span>
                            {item.partnerOrganization?.partnerName ?? 'Partner'}{' '}
                            – Overlap: {item.overlapCount ?? 0}, Reports:{' '}
                            {item.reportCount ?? 0}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className='text-sm text-gray-500'>
                      No report history yet. Connect your data source to
                      generate reports.
                    </p>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
